import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const newSlugs = [
  "denied-consolidation-loan-settlement-option",
  "single-parent-paycheck-to-paycheck-debt",
  "minimum-payment-trap-high-interest-debt",
  "two-income-household-drowning-in-debt",
  "credit-card-debt-after-medical-emergency",
  "maxed-out-cards-no-savings-settlement",
  "high-interest-store-cards-personal-loans-settlement",
  "layoff-accumulated-debt-settlement",
  "overspending-lifestyle-debt-settlement",
  "self-employed-irregular-income-high-debt",
];

const dir = '/home/ubuntu/debtconsolidationapp/client/src/pages/scenarios';
mkdirSync(dir, { recursive: true });

for (const slug of newSlugs) {
  const componentName = slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');

  const content = `import ScenarioPage from "@/components/ScenarioPage";
import { ALL_SCENARIOS } from "@/data/scenarios";

const scenario = ALL_SCENARIOS.find(s => s.slug === "${slug}")!;

export default function ${componentName}() {
  return <ScenarioPage scenario={scenario} />;
}
`;
  writeFileSync(join(dir, `${componentName}.tsx`), content);
  console.log(`Generated: ${componentName}.tsx`);
}

console.log(`\nDone — ${newSlugs.length} new scenario pages generated.`);
