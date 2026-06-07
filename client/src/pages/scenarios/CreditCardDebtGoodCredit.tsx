import ScenarioPage from "@/components/ScenarioPage";
import { ALL_SCENARIOS } from "@/data/scenarios";

const scenario = ALL_SCENARIOS.find((s) => s.slug === "credit-card-debt-good-credit")!;

export default function CreditCardDebtGoodCredit() {
  return <ScenarioPage scenario={scenario} />;
}
