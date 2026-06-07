import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Assessment from "./pages/Assessment";
import Results from "./pages/Results";
import Share from "./pages/Share";
import Scenarios from "./pages/Scenarios";

// Scenario pages
import CreditCardDebtGoodCredit from "./pages/scenarios/CreditCardDebtGoodCredit";
import CreditCardDebtFairCredit from "./pages/scenarios/CreditCardDebtFairCredit";
import MedicalDebtCrisis from "./pages/scenarios/MedicalDebtCrisis";
import FirstTimeHomebuyerWithDebt from "./pages/scenarios/FirstTimeHomebuyerWithDebt";
import BalanceTransferStrategyModerateDebt from "./pages/scenarios/BalanceTransferStrategyModerateDebt";
import OverwhelmedMultipleCreditors from "./pages/scenarios/OverwhelmedMultipleCreditors";
import HighIncomeHighDebt from "./pages/scenarios/HighIncomeHighDebt";
import DebtSettlementCandidate from "./pages/scenarios/DebtSettlementCandidate";
import BankruptcyLastResort from "./pages/scenarios/BankruptcyLastResort";
import RebuildingCreditAfterHardship from "./pages/scenarios/RebuildingCreditAfterHardship";
import StudentLoanPlusCreditCardDebt from "./pages/scenarios/StudentLoanPlusCreditCardDebt";
import GigWorkerIrregularIncome from "./pages/scenarios/GigWorkerIrregularIncome";
import RecentDivorceDebtDivision from "./pages/scenarios/RecentDivorceDebtDivision";
import RetireeFixedIncomeDebt from "./pages/scenarios/RetireeFixedIncomeDebt";
import SmallBusinessOwnerPersonalDebt from "./pages/scenarios/SmallBusinessOwnerPersonalDebt";
import PaydayLoanTrap from "./pages/scenarios/PaydayLoanTrap";
import RecentJobLossDebtEmergency from "./pages/scenarios/RecentJobLossDebtEmergency";
import YoungProfessionalEarlyDebt from "./pages/scenarios/YoungProfessionalEarlyDebt";
import HighDebtToIncomeRatio from "./pages/scenarios/HighDebtToIncomeRatio";
import DebtFreeInTwoYears from "./pages/scenarios/DebtFreeInTwoYears";
import DeniedConsolidationLoanSettlementOption from "./pages/scenarios/DeniedConsolidationLoanSettlementOption";
import SingleParentPaycheckToPaycheckDebt from "./pages/scenarios/SingleParentPaycheckToPaycheckDebt";
import MinimumPaymentTrapHighInterestDebt from "./pages/scenarios/MinimumPaymentTrapHighInterestDebt";
import TwoIncomeHouseholdDrowningInDebt from "./pages/scenarios/TwoIncomeHouseholdDrowningInDebt";
import CreditCardDebtAfterMedicalEmergency from "./pages/scenarios/CreditCardDebtAfterMedicalEmergency";
import MaxedOutCardsNoSavingsSettlement from "./pages/scenarios/MaxedOutCardsNoSavingsSettlement";
import HighInterestStoreCardsPersonalLoansSettlement from "./pages/scenarios/HighInterestStoreCardsPersonalLoansSettlement";
import LayoffAccumulatedDebtSettlement from "./pages/scenarios/LayoffAccumulatedDebtSettlement";
import OverspendingLifestyleDebtSettlement from "./pages/scenarios/OverspendingLifestyleDebtSettlement";
import SelfEmployedIrregularIncomeHighDebt from "./pages/scenarios/SelfEmployedIrregularIncomeHighDebt";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/assessment" component={Assessment} />
      <Route path="/results/:id" component={Results} />
      <Route path="/share/:token" component={Share} />
      <Route path="/scenarios" component={Scenarios} />

      {/* Individual scenario routes */}
      <Route path="/scenarios/credit-card-debt-good-credit" component={CreditCardDebtGoodCredit} />
      <Route path="/scenarios/credit-card-debt-fair-credit" component={CreditCardDebtFairCredit} />
      <Route path="/scenarios/medical-debt-crisis" component={MedicalDebtCrisis} />
      <Route path="/scenarios/first-time-homebuyer-with-debt" component={FirstTimeHomebuyerWithDebt} />
      <Route path="/scenarios/balance-transfer-strategy-moderate-debt" component={BalanceTransferStrategyModerateDebt} />
      <Route path="/scenarios/overwhelmed-multiple-creditors" component={OverwhelmedMultipleCreditors} />
      <Route path="/scenarios/high-income-high-debt" component={HighIncomeHighDebt} />
      <Route path="/scenarios/debt-settlement-candidate" component={DebtSettlementCandidate} />
      <Route path="/scenarios/bankruptcy-last-resort" component={BankruptcyLastResort} />
      <Route path="/scenarios/rebuilding-credit-after-hardship" component={RebuildingCreditAfterHardship} />
      <Route path="/scenarios/student-loan-plus-credit-card-debt" component={StudentLoanPlusCreditCardDebt} />
      <Route path="/scenarios/gig-worker-irregular-income" component={GigWorkerIrregularIncome} />
      <Route path="/scenarios/recent-divorce-debt-division" component={RecentDivorceDebtDivision} />
      <Route path="/scenarios/retiree-fixed-income-debt" component={RetireeFixedIncomeDebt} />
      <Route path="/scenarios/small-business-owner-personal-debt" component={SmallBusinessOwnerPersonalDebt} />
      <Route path="/scenarios/payday-loan-trap" component={PaydayLoanTrap} />
      <Route path="/scenarios/recent-job-loss-debt-emergency" component={RecentJobLossDebtEmergency} />
      <Route path="/scenarios/young-professional-early-debt" component={YoungProfessionalEarlyDebt} />
      <Route path="/scenarios/high-debt-to-income-ratio" component={HighDebtToIncomeRatio} />
      <Route path="/scenarios/debt-free-in-two-years" component={DebtFreeInTwoYears} />

      {/* Settlement-focused scenarios */}
      <Route path="/scenarios/denied-consolidation-loan-settlement-option" component={DeniedConsolidationLoanSettlementOption} />
      <Route path="/scenarios/single-parent-paycheck-to-paycheck-debt" component={SingleParentPaycheckToPaycheckDebt} />
      <Route path="/scenarios/minimum-payment-trap-high-interest-debt" component={MinimumPaymentTrapHighInterestDebt} />
      <Route path="/scenarios/two-income-household-drowning-in-debt" component={TwoIncomeHouseholdDrowningInDebt} />
      <Route path="/scenarios/credit-card-debt-after-medical-emergency" component={CreditCardDebtAfterMedicalEmergency} />
      <Route path="/scenarios/maxed-out-cards-no-savings-settlement" component={MaxedOutCardsNoSavingsSettlement} />
      <Route path="/scenarios/high-interest-store-cards-personal-loans-settlement" component={HighInterestStoreCardsPersonalLoansSettlement} />
      <Route path="/scenarios/layoff-accumulated-debt-settlement" component={LayoffAccumulatedDebtSettlement} />
      <Route path="/scenarios/overspending-lifestyle-debt-settlement" component={OverspendingLifestyleDebtSettlement} />
      <Route path="/scenarios/self-employed-irregular-income-high-debt" component={SelfEmployedIrregularIncomeHighDebt} />

      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
