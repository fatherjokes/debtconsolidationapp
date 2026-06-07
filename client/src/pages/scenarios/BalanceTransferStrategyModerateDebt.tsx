import ScenarioPage from "@/components/ScenarioPage";
import { ALL_SCENARIOS } from "@/data/scenarios";

const scenario = ALL_SCENARIOS.find((s) => s.slug === "balance-transfer-strategy-moderate-debt")!;

export default function BalanceTransferStrategyModerateDebt() {
  return <ScenarioPage scenario={scenario} />;
}
