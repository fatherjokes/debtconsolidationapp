import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const slugs = [
  "credit-card-debt-good-credit",
  "credit-card-debt-fair-credit",
  "medical-debt-crisis",
  "first-time-homebuyer-with-debt",
  "balance-transfer-strategy-moderate-debt",
  "overwhelmed-multiple-creditors",
  "high-income-high-debt",
  "debt-settlement-candidate",
  "bankruptcy-last-resort",
  "rebuilding-credit-after-hardship",
  "student-loan-plus-credit-card-debt",
  "gig-worker-irregular-income",
  "recent-divorce-debt-division",
  "retiree-fixed-income-debt",
  "small-business-owner-personal-debt",
  "payday-loan-trap",
  "recent-job-loss-debt-emergency",
  "young-professional-early-debt",
  "high-debt-to-income-ratio",
  "debt-free-in-two-years",
];

const dir = "client/src/pages/scenarios";
mkdirSync(dir, { recursive: true });

for (const slug of slugs) {
  const componentName = slug
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join("");

  const content = `import ScenarioPage from "@/components/ScenarioPage";
import { ALL_SCENARIOS } from "@/data/scenarios";

const scenario = ALL_SCENARIOS.find((s) => s.slug === "${slug}")!;

export default function ${componentName}() {
  return <ScenarioPage scenario={scenario} />;
}
`;
  writeFileSync(join(dir, `${componentName}.tsx`), content);
  console.log("Created", componentName);
}

console.log("Done — 20 scenario pages created.");
