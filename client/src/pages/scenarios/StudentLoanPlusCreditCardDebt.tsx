import ScenarioPage from "@/components/ScenarioPage";
import { ALL_SCENARIOS } from "@/data/scenarios";

const scenario = ALL_SCENARIOS.find((s) => s.slug === "student-loan-plus-credit-card-debt")!;

export default function StudentLoanPlusCreditCardDebt() {
  return <ScenarioPage scenario={scenario} />;
}
