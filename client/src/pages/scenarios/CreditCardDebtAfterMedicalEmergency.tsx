import ScenarioPage from "@/components/ScenarioPage";
import { ALL_SCENARIOS } from "@/data/scenarios";

const scenario = ALL_SCENARIOS.find(s => s.slug === "credit-card-debt-after-medical-emergency")!;

export default function CreditCardDebtAfterMedicalEmergency() {
  return <ScenarioPage scenario={scenario} />;
}
