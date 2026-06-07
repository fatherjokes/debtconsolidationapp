import ScenarioPage from "@/components/ScenarioPage";
import { ALL_SCENARIOS } from "@/data/scenarios";

const scenario = ALL_SCENARIOS.find(s => s.slug === "overspending-lifestyle-debt-settlement")!;

export default function OverspendingLifestyleDebtSettlement() {
  return <ScenarioPage scenario={scenario} />;
}
