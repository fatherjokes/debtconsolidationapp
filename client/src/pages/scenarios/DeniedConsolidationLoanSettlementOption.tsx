import ScenarioPage from "@/components/ScenarioPage";
import { ALL_SCENARIOS } from "@/data/scenarios";

const scenario = ALL_SCENARIOS.find(s => s.slug === "denied-consolidation-loan-settlement-option")!;

export default function DeniedConsolidationLoanSettlementOption() {
  return <ScenarioPage scenario={scenario} />;
}
