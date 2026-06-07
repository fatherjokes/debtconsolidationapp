import ScenarioPage from "@/components/ScenarioPage";
import { ALL_SCENARIOS } from "@/data/scenarios";

const scenario = ALL_SCENARIOS.find((s) => s.slug === "gig-worker-irregular-income")!;

export default function GigWorkerIrregularIncome() {
  return <ScenarioPage scenario={scenario} />;
}
