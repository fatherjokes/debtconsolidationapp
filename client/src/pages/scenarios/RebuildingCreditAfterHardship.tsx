import ScenarioPage from "@/components/ScenarioPage";
import { ALL_SCENARIOS } from "@/data/scenarios";

const scenario = ALL_SCENARIOS.find((s) => s.slug === "rebuilding-credit-after-hardship")!;

export default function RebuildingCreditAfterHardship() {
  return <ScenarioPage scenario={scenario} />;
}
