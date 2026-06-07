import ScenarioPage from "@/components/ScenarioPage";
import { ALL_SCENARIOS } from "@/data/scenarios";

const scenario = ALL_SCENARIOS.find((s) => s.slug === "payday-loan-trap")!;

export default function PaydayLoanTrap() {
  return <ScenarioPage scenario={scenario} />;
}
