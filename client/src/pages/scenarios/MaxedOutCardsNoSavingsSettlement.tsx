import ScenarioPage from "@/components/ScenarioPage";
import { ALL_SCENARIOS } from "@/data/scenarios";

const scenario = ALL_SCENARIOS.find(s => s.slug === "maxed-out-cards-no-savings-settlement")!;

export default function MaxedOutCardsNoSavingsSettlement() {
  return <ScenarioPage scenario={scenario} />;
}
