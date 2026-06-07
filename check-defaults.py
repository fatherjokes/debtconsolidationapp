#!/usr/bin/env python3
with open('/home/ubuntu/debtconsolidationapp/client/src/data/scenarios.ts') as f:
    content = f.read()

settlement_slugs = [
    ('denied-consolidation-loan-settlement-option', 38000, 24, 50),
    ('single-parent-paycheck-to-paycheck-debt', 31000, 26, 50),
    ('minimum-payment-trap-high-interest-debt', 42000, 24, 48),
    ('two-income-household-drowning-in-debt', 67000, 22, 50),
    ('credit-card-debt-after-medical-emergency', 47000, 23, 50),
    ('maxed-out-cards-no-savings-settlement', 45000, 25, 50),
    ('high-interest-store-cards-personal-loans-settlement', 29000, 28, 45),
    ('layoff-accumulated-debt-settlement', 52000, 23, 50),
    ('overspending-lifestyle-debt-settlement', 50000, 24, 50),
    ('self-employed-irregular-income-high-debt', 44000, 24, 50),
]

for slug, debt, apr, pct in settlement_slugs:
    idx = content.find(f'slug: "{slug}"')
    if idx == -1:
        print(f'NOT FOUND: {slug}')
        continue
    # Find next scenario start or end of array
    next_idx = content.find('  // \u2500\u2500\u2500', idx + 10)
    if next_idx == -1:
        next_idx = content.find('];\n\nexport const SCENARIO_CATEGORIES', idx)
    block = content[idx:next_idx] if next_idx != -1 else content[idx:idx+8000]
    has_defaults = 'calculatorDefaults' in block
    has_highlight = 'comparisonHighlight' in block
    status = 'OK' if (has_defaults and has_highlight) else 'MISSING'
    print(f'{status}: {slug} (defaults={has_defaults}, highlight={has_highlight}, block_len={len(block)})')
