import ScenarioPage from "@/components/ScenarioPage";
import { ALL_SCENARIOS } from "@/data/scenarios";

const scenario = ALL_SCENARIOS.find((s) => s.slug === "retiree-fixed-income-debt")!;

export default function RetireeFixedIncomeDebt() {
  return <ScenarioPage scenario={scenario} />;
}
