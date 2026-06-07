import ScenarioPage from "@/components/ScenarioPage";
import { ALL_SCENARIOS } from "@/data/scenarios";

const scenario = ALL_SCENARIOS.find((s) => s.slug === "overwhelmed-multiple-creditors")!;

export default function OverwhelmedMultipleCreditors() {
  return <ScenarioPage scenario={scenario} />;
}
