import ScenarioPage from "@/components/ScenarioPage";
import { ALL_SCENARIOS } from "@/data/scenarios";

const scenario = ALL_SCENARIOS.find(s => s.slug === "self-employed-irregular-income-high-debt")!;

export default function SelfEmployedIrregularIncomeHighDebt() {
  return <ScenarioPage scenario={scenario} />;
}
