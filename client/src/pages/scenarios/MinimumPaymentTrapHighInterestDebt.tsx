import ScenarioPage from "@/components/ScenarioPage";
import { ALL_SCENARIOS } from "@/data/scenarios";

const scenario = ALL_SCENARIOS.find(s => s.slug === "minimum-payment-trap-high-interest-debt")!;

export default function MinimumPaymentTrapHighInterestDebt() {
  return <ScenarioPage scenario={scenario} />;
}
