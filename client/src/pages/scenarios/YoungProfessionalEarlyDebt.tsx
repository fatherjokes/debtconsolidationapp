import ScenarioPage from "@/components/ScenarioPage";
import { ALL_SCENARIOS } from "@/data/scenarios";

const scenario = ALL_SCENARIOS.find((s) => s.slug === "young-professional-early-debt")!;

export default function YoungProfessionalEarlyDebt() {
  return <ScenarioPage scenario={scenario} />;
}
