import ScenarioPage from "@/components/ScenarioPage";
import { ALL_SCENARIOS } from "@/data/scenarios";

const scenario = ALL_SCENARIOS.find((s) => s.slug === "high-income-high-debt")!;

export default function HighIncomeHighDebt() {
  return <ScenarioPage scenario={scenario} />;
}
