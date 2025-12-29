#!/bin/bash
BASE="https://predixen-nikita.replit.app"
JAR="./predixen.cookies.txt"
rm -f "$JAR"

# Demo login
curl -sS -c "$JAR" -b "$JAR" -X POST "$BASE/api/demo-login" -H "Content-Type: application/json" -d '{}' | tee /tmp/demo-login.json

# Confirm session
curl -sS -c "$JAR" -b "$JAR" "$BASE/api/auth/me" | tee /tmp/me.json

# Get current active company
curl -sS -c "$JAR" -b "$JAR" "$BASE/api/company/current" | tee /tmp/company-current.json

# List companies
curl -sS -c "$JAR" -b "$JAR" "$BASE/api/companies" | tee /tmp/companies.json

# Create new company
curl -sS -c "$JAR" -b "$JAR" -X POST "$BASE/api/company" -H "Content-Type: application/json" -d '{
  "name":"SmokeTest Co",
  "stage":"Seed",
  "sector":"Technology",
  "currentCash": 1000000,
  "monthlyBurn": 50000,
  "currentARR": 250000,
  "grossMarginPct": 70,
  "cac": 2000,
  "ltv": 12000,
  "hqLocation":"Dubai",
  "businessDescription":"Smoke suite test company",
  "onboardingCompleted": 1
}' | tee /tmp/company-created.json

COMPANY_ID=$(jq -r '.id' /tmp/company-created.json)

# Activate company
curl -sS -c "$JAR" -b "$JAR" -X PUT "$BASE/api/companies/$COMPANY_ID/activate" -H "Content-Type: application/json" -d '{}' | tee /tmp/company-activate.json

# Delete company
curl -sS -c "$JAR" -b "$JAR" -X DELETE "$BASE/api/companies/$COMPANY_ID" | tee /tmp/company-delete.json

# Create scenario
curl -sS -c "$JAR" -b "$JAR" -X POST "$BASE/api/scenarios" -H "Content-Type: application/json" -d '{
  "name":"Smoke Scenario",
  "description":"Created by curl smoke suite",
  "timeHorizonMonths": 24,
  "baselineStartCash": 2000000,
  "baselineMonthlyBurn": 120000,
  "baselineGrowthMinPct": 3,
  "baselineGrowthMaxPct": 8,
  "baselineGMMinPct": 60,
  "baselineGMMaxPct": 75
}' | tee /tmp/scenario.json

SCENARIO_ID=$(jq -r '.id' /tmp/scenario.json)

# Add initiative
curl -sS -c "$JAR" -b "$JAR" -X POST "$BASE/api/scenarios/$SCENARIO_ID/initiatives" -H "Content-Type: application/json" -d '{
  "name":"Improve Paid Acquisition",
  "initiativeType":"growth",
  "investmentType":"opex",
  "investmentAmount": 150000,
  "startMonthOffset": 1,
  "durationMonths": 6,
  "revGrowthMinPct": 2,
  "revGrowthMaxPct": 6,
  "cacChangeMinPct": -5,
  "cacChangeMaxPct": -15,
  "gmChangeMinPct": 0,
  "gmChangeMaxPct": 2
}' | tee /tmp/initiative.json

# Run simulation
curl -sS -c "$JAR" -b "$JAR" -X POST "$BASE/api/scenarios/$SCENARIO_ID/simulate" -H "Content-Type: application/json" -d '{}' | tee /tmp/simulate.json

# Fetch recent simulation runs
curl -sS -c "$JAR" -b "$JAR" "$BASE/api/simulation-runs/recent" | tee /tmp/sim-recent.json

# CFO analyses
curl -sS -c "$JAR" -b "$JAR" -X POST "$BASE/api/cfo/analyze/budget-variance" -H "Content-Type: application/json" -d '{}' | tee /tmp/cfo-budget.json
curl -sS -c "$JAR" -b "$JAR" -X POST "$BASE/api/cfo/analyze/working-capital" -H "Content-Type: application/json" -d '{}' | tee /tmp/cfo-wc.json
curl -sS -c "$JAR" -b "$JAR" -X POST "$BASE/api/cfo/analyze/gross-margin" -H "Content-Type: application/json" -d '{}' | tee /tmp/cfo-gm.json
curl -sS -c "$JAR" -b "$JAR" -X POST "$BASE/api/cfo/playbook/roic" -H "Content-Type: application/json" -d '{}' | tee /tmp/cfo-roic.json
curl -sS -c "$JAR" -b "$JAR" -X POST "$BASE/api/cfo/stress/liquidity" -H "Content-Type: application/json" -d '{}' | tee /tmp/cfo-liquidity.json
curl -sS -c "$JAR" -b "$JAR" -X POST "$BASE/api/cfo/forecast/cashflow" -H "Content-Type: application/json" -d '{}' | tee /tmp/cfo-cashflow.json

# Logout
curl -sS -c "$JAR" -b "$JAR" -X POST "$BASE/api/logout" -d '{}' | tee /tmp/logout.json
