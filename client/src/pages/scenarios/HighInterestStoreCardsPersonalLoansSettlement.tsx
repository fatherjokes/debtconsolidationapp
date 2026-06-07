import ScenarioPage from "@/components/ScenarioPage";
import { ALL_SCENARIOS } from "@/data/scenarios";

const scenario = ALL_SCENARIOS.find(s => s.slug === "high-interest-store-cards-personal-loans-settlement")!;

export default function HighInterestStoreCardsPersonalLoansSettlement() {
  return <ScenarioPage scenario={scenario} />;
}
