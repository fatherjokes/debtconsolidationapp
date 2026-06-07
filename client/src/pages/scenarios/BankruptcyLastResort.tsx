import ScenarioPage from "@/components/ScenarioPage";
import { ALL_SCENARIOS } from "@/data/scenarios";

const scenario = ALL_SCENARIOS.find((s) => s.slug === "bankruptcy-last-resort")!;

export default function BankruptcyLastResort() {
  return <ScenarioPage scenario={scenario} />;
}
