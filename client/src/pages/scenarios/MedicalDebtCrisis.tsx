import ScenarioPage from "@/components/ScenarioPage";
import { ALL_SCENARIOS } from "@/data/scenarios";

const scenario = ALL_SCENARIOS.find((s) => s.slug === "medical-debt-crisis")!;

export default function MedicalDebtCrisis() {
  return <ScenarioPage scenario={scenario} />;
}
