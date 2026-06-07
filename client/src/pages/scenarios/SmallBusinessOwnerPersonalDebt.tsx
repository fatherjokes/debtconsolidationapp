import ScenarioPage from "@/components/ScenarioPage";
import { ALL_SCENARIOS } from "@/data/scenarios";

const scenario = ALL_SCENARIOS.find((s) => s.slug === "small-business-owner-personal-debt")!;

export default function SmallBusinessOwnerPersonalDebt() {
  return <ScenarioPage scenario={scenario} />;
}
