import ScenarioPage from "@/components/ScenarioPage";
import { ALL_SCENARIOS } from "@/data/scenarios";

const scenario = ALL_SCENARIOS.find(s => s.slug === "single-parent-paycheck-to-paycheck-debt")!;

export default function SingleParentPaycheckToPaycheckDebt() {
  return <ScenarioPage scenario={scenario} />;
}
