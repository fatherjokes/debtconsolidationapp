import ScenarioPage from "@/components/ScenarioPage";
import { ALL_SCENARIOS } from "@/data/scenarios";

const scenario = ALL_SCENARIOS.find((s) => s.slug === "debt-free-in-two-years")!;

export default function DebtFreeInTwoYears() {
  return <ScenarioPage scenario={scenario} />;
}
