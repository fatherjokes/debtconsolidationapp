import ScenarioPage from "@/components/ScenarioPage";
import { ALL_SCENARIOS } from "@/data/scenarios";

const scenario = ALL_SCENARIOS.find((s) => s.slug === "recent-job-loss-debt-emergency")!;

export default function RecentJobLossDebtEmergency() {
  return <ScenarioPage scenario={scenario} />;
}
