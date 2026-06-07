#!/usr/bin/env python3
"""Inject calculatorDefaults and comparisonHighlight into the 9 remaining settlement scenarios."""

with open('/home/ubuntu/debtconsolidationapp/client/src/data/scenarios.ts', 'r') as f:
    content = f.read()

# Each tuple: (unique_trailing_text_before_close, debt, apr, pct, highlight)
patches = [
    # single-parent
    (
        '      { slug: "recent-job-loss-debt-emergency", title: "After Job Loss" },\n    ],\n  },',
        '      { slug: "recent-job-loss-debt-emergency", title: "After Job Loss" },\n    ],\n    calculatorDefaults: { debt: 31000, apr: 26, settlementPct: 50 },\n    comparisonHighlight: "settlement",\n  },',
    ),
    # minimum-payment-trap
    (
        '      { slug: "high-debt-to-income-ratio", title: "High Debt-to-Income Ratio" },\n    ],\n  },',
        '      { slug: "high-debt-to-income-ratio", title: "High Debt-to-Income Ratio" },\n    ],\n    calculatorDefaults: { debt: 42000, apr: 24, settlementPct: 48 },\n    comparisonHighlight: "settlement",\n  },',
    ),
    # two-income-household
    (
        '      { slug: "debt-settlement-candidate", title: "When Debt Settlement Makes Sense" },\n    ],\n  },\n\n  // \u2500\u2500\u2500 24',
        '      { slug: "debt-settlement-candidate", title: "When Debt Settlement Makes Sense" },\n    ],\n    calculatorDefaults: { debt: 67000, apr: 22, settlementPct: 50 },\n    comparisonHighlight: "settlement",\n  },\n\n  // \u2500\u2500\u2500 24',
    ),
    # credit-card-debt-after-medical-emergency
    (
        '      { slug: "debt-settlement-candidate", title: "When Debt Settlement Makes Sense" },\n    ],\n  },\n\n  // \u2500\u2500\u2500 25',
        '      { slug: "debt-settlement-candidate", title: "When Debt Settlement Makes Sense" },\n    ],\n    calculatorDefaults: { debt: 47000, apr: 23, settlementPct: 50 },\n    comparisonHighlight: "settlement",\n  },\n\n  // \u2500\u2500\u2500 25',
    ),
    # maxed-out-cards
    (
        '      { slug: "denied-consolidation-loan-settlement-option", title: "Denied for a Consolidation Loan" },\n    ],\n  },\n\n  // \u2500\u2500\u2500 26',
        '      { slug: "denied-consolidation-loan-settlement-option", title: "Denied for a Consolidation Loan" },\n    ],\n    calculatorDefaults: { debt: 45000, apr: 25, settlementPct: 50 },\n    comparisonHighlight: "settlement",\n  },\n\n  // \u2500\u2500\u2500 26',
    ),
    # high-interest-store-cards
    (
        '      { slug: "debt-settlement-candidate", title: "When Debt Settlement Makes Sense" },\n    ],\n  },\n\n  // \u2500\u2500\u2500 27',
        '      { slug: "debt-settlement-candidate", title: "When Debt Settlement Makes Sense" },\n    ],\n    calculatorDefaults: { debt: 29000, apr: 28, settlementPct: 45 },\n    comparisonHighlight: "settlement",\n  },\n\n  // \u2500\u2500\u2500 27',
    ),
    # layoff-accumulated
    (
        '      { slug: "debt-settlement-candidate", title: "When Debt Settlement Makes Sense" },\n    ],\n  },\n\n  // \u2500\u2500\u2500 28',
        '      { slug: "debt-settlement-candidate", title: "When Debt Settlement Makes Sense" },\n    ],\n    calculatorDefaults: { debt: 52000, apr: 23, settlementPct: 50 },\n    comparisonHighlight: "settlement",\n  },\n\n  // \u2500\u2500\u2500 28',
    ),
    # overspending-lifestyle
    (
        '      { slug: "two-income-household-drowning-in-debt", title: "Two-Income Household Drowning in Debt" },\n    ],\n  },\n\n  // \u2500\u2500\u2500 29',
        '      { slug: "two-income-household-drowning-in-debt", title: "Two-Income Household Drowning in Debt" },\n    ],\n    calculatorDefaults: { debt: 50000, apr: 24, settlementPct: 50 },\n    comparisonHighlight: "settlement",\n  },\n\n  // \u2500\u2500\u2500 29',
    ),
    # self-employed-irregular
    (
        '      { slug: "debt-settlement-candidate", title: "When Debt Settlement Makes Sense" },\n    ],\n  },\n];\n\nexport const SCENARIO_CATEGORIES',
        '      { slug: "debt-settlement-candidate", title: "When Debt Settlement Makes Sense" },\n    ],\n    calculatorDefaults: { debt: 44000, apr: 24, settlementPct: 50 },\n    comparisonHighlight: "settlement",\n  },\n];\n\nexport const SCENARIO_CATEGORIES',
    ),
]

for old, new in patches:
    if old in content:
        content = content.replace(old, new, 1)
        print(f'Patched: {old[:60].strip()}...')
    else:
        print(f'NOT FOUND: {old[:60].strip()}...')

with open('/home/ubuntu/debtconsolidationapp/client/src/data/scenarios.ts', 'w') as f:
    f.write(content)

print('\nDone.')
