import ScenarioPage from "@/components/ScenarioPage";
import { ALL_SCENARIOS } from "@/data/scenarios";

const scenario = ALL_SCENARIOS.find((s) => s.slug === "high-debt-to-income-ratio")!;

export default function HighDebtToIncomeRatio() {
  return <ScenarioPage scenario={scenario} />;
}
