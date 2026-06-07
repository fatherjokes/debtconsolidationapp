import ScenarioPage from "@/components/ScenarioPage";
import { ALL_SCENARIOS } from "@/data/scenarios";

const scenario = ALL_SCENARIOS.find((s) => s.slug === "debt-settlement-candidate")!;

export default function DebtSettlementCandidate() {
  return <ScenarioPage scenario={scenario} />;
}
