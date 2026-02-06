import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

const WEBHOOK_SECRET = process.env.WEBHOOK_SHARED_SECRET || '';
const TIMESTAMP_TOLERANCE_MS = 300_000; // 5 minutes

export interface SignedRequest extends Request {
  verified?: boolean;
  signatureTimestamp?: number;
}

/**
 * Generate HMAC SHA256 signature for outbound webhooks.
 * Use this when Replit calls n8n or vice versa.
 */
export function generateSignature(payload: string, timestamp: number, secret?: string): string {
  const signingSecret = secret || WEBHOOK_SECRET;
  const message = `${timestamp}.${payload}`;
  return crypto
    .createHmac('sha256', signingSecret)
    .update(message)
    .digest('hex');
}

/**
 * Build headers for a signed webhook request.
 */
export function buildSignedHeaders(payload: string, secret?: string): Record<string, string> {
  const timestamp = Date.now();
  const signature = generateSignature(payload, timestamp, secret);
  return {
    'Content-Type': 'application/json',
    'X-Predixen-Timestamp': String(timestamp),
    'X-Predixen-Signature': signature,
  };
}

/**
 * Express middleware to verify incoming signed webhooks.
 * Rejects requests with invalid or expired signatures.
 */
export function verifyWebhookSignature(req: SignedRequest, res: Response, next: NextFunction): void {
  const timestamp = req.headers['x-predixen-timestamp'] as string;
  const signature = req.headers['x-predixen-signature'] as string;

  if (!timestamp || !signature) {
    res.status(401).json({ error: 'Missing signature headers' });
    return;
  }

  const ts = parseInt(timestamp, 10);
  const now = Date.now();

  // Replay protection
  if (Math.abs(now - ts) > TIMESTAMP_TOLERANCE_MS) {
    res.status(401).json({ error: 'Request timestamp too old or too far in future' });
    return;
  }

  const rawBody = JSON.stringify(req.body);
  const expectedSignature = generateSignature(rawBody, ts);

  const isValid = crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );

  if (!isValid) {
    res.status(401).json({ error: 'Invalid signature' });
    return;
  }

  req.verified = true;
  req.signatureTimestamp = ts;
  next();
}
