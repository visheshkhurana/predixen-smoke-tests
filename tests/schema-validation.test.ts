import { describe, it, expect } from '@jest/globals';

describe('Predixen Agent Schema Validation', () => {
  it('should have valid CEO_AGENT input schema', () => {
    const schema = require('../ai-org/ceo_agent/input_schema.json');
    expect(schema.type).toBe('object');
    expect(schema.required).toContain('decision_id');
    expect(schema.required).toContain('options');
    expect(schema.required).toContain('risk_assessment');
  });

  it('should have valid RISK_AGENT output schema', () => {
    const schema = require('../ai-org/risk_agent/output_schema.json');
    expect(schema.type).toBe('object');
    expect(schema.required).toContain('risk_level');
    expect(schema.required).toContain('requires_approval');
    expect(schema.properties.risk_level.enum).toContain('CRITICAL');
  });

  it('should enforce blocked files in DEV_AGENT guardrails', () => {
    const fs = require('fs');
    const guardrails = fs.readFileSync('ai-org/dev_agent/guardrails.md', 'utf8');
    expect(guardrails).toContain('.env');
    expect(guardrails).toContain('secrets');
    expect(guardrails).toContain('auth.config');
    expect(guardrails).toContain('private.key');
  });
});
