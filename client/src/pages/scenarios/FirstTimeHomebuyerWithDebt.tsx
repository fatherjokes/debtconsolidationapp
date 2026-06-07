import ScenarioPage from "@/components/ScenarioPage";
import { ALL_SCENARIOS } from "@/data/scenarios";

const scenario = ALL_SCENARIOS.find((s) => s.slug === "first-time-homebuyer-with-debt")!;

export default function FirstTimeHomebuyerWithDebt() {
  return <ScenarioPage scenario={scenario} />;
}
