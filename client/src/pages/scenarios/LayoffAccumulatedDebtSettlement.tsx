import ScenarioPage from "@/components/ScenarioPage";
import { ALL_SCENARIOS } from "@/data/scenarios";

const scenario = ALL_SCENARIOS.find(s => s.slug === "layoff-accumulated-debt-settlement")!;

export default function LayoffAccumulatedDebtSettlement() {
  return <ScenarioPage scenario={scenario} />;
}
