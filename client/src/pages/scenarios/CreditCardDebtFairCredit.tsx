import ScenarioPage from "@/components/ScenarioPage";
import { ALL_SCENARIOS } from "@/data/scenarios";

const scenario = ALL_SCENARIOS.find((s) => s.slug === "credit-card-debt-fair-credit")!;

export default function CreditCardDebtFairCredit() {
  return <ScenarioPage scenario={scenario} />;
}
