import ScenarioPage from "@/components/ScenarioPage";
import { ALL_SCENARIOS } from "@/data/scenarios";

const scenario = ALL_SCENARIOS.find(s => s.slug === "two-income-household-drowning-in-debt")!;

export default function TwoIncomeHouseholdDrowningInDebt() {
  return <ScenarioPage scenario={scenario} />;
}
