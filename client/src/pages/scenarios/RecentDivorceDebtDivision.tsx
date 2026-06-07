import ScenarioPage from "@/components/ScenarioPage";
import { ALL_SCENARIOS } from "@/data/scenarios";

const scenario = ALL_SCENARIOS.find((s) => s.slug === "recent-divorce-debt-division")!;

export default function RecentDivorceDebtDivision() {
  return <ScenarioPage scenario={scenario} />;
}
