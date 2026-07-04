import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Suspense, lazy } from "react";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

// Home is eager — it is the LCP page, must not be lazy
import Home from "./pages/Home";

// All other routes are lazy-loaded — they are not needed for initial render
const NotFound = lazy(() => import("@/pages/NotFound"));
const Assessment = lazy(() => import("./pages/Assessment"));
const Results = lazy(() => import("./pages/Results"));
const Share = lazy(() => import("./pages/Share"));
const Scenarios = lazy(() => import("./pages/Scenarios"));
const About = lazy(() => import("./pages/About"));

// Scenario pages — each is a separate chunk, loaded only when visited
const CreditCardDebtGoodCredit = lazy(() => import("./pages/scenarios/CreditCardDebtGoodCredit"));
const CreditCardDebtFairCredit = lazy(() => import("./pages/scenarios/CreditCardDebtFairCredit"));
const MedicalDebtCrisis = lazy(() => import("./pages/scenarios/MedicalDebtCrisis"));
const FirstTimeHomebuyerWithDebt = lazy(() => import("./pages/scenarios/FirstTimeHomebuyerWithDebt"));
const BalanceTransferStrategyModerateDebt = lazy(() => import("./pages/scenarios/BalanceTransferStrategyModerateDebt"));
const OverwhelmedMultipleCreditors = lazy(() => import("./pages/scenarios/OverwhelmedMultipleCreditors"));
const HighIncomeHighDebt = lazy(() => import("./pages/scenarios/HighIncomeHighDebt"));
const DebtSettlementCandidate = lazy(() => import("./pages/scenarios/DebtSettlementCandidate"));
const BankruptcyLastResort = lazy(() => import("./pages/scenarios/BankruptcyLastResort"));
const RebuildingCreditAfterHardship = lazy(() => import("./pages/scenarios/RebuildingCreditAfterHardship"));
const StudentLoanPlusCreditCardDebt = lazy(() => import("./pages/scenarios/StudentLoanPlusCreditCardDebt"));
const GigWorkerIrregularIncome = lazy(() => import("./pages/scenarios/GigWorkerIrregularIncome"));
const RecentDivorceDebtDivision = lazy(() => import("./pages/scenarios/RecentDivorceDebtDivision"));
const RetireeFixedIncomeDebt = lazy(() => import("./pages/scenarios/RetireeFixedIncomeDebt"));
const SmallBusinessOwnerPersonalDebt = lazy(() => import("./pages/scenarios/SmallBusinessOwnerPersonalDebt"));
const PaydayLoanTrap = lazy(() => import("./pages/scenarios/PaydayLoanTrap"));
const RecentJobLossDebtEmergency = lazy(() => import("./pages/scenarios/RecentJobLossDebtEmergency"));
const YoungProfessionalEarlyDebt = lazy(() => import("./pages/scenarios/YoungProfessionalEarlyDebt"));
const HighDebtToIncomeRatio = lazy(() => import("./pages/scenarios/HighDebtToIncomeRatio"));
const DebtFreeInTwoYears = lazy(() => import("./pages/scenarios/DebtFreeInTwoYears"));
const DeniedConsolidationLoanSettlementOption = lazy(() => import("./pages/scenarios/DeniedConsolidationLoanSettlementOption"));
const SingleParentPaycheckToPaycheckDebt = lazy(() => import("./pages/scenarios/SingleParentPaycheckToPaycheckDebt"));
const MinimumPaymentTrapHighInterestDebt = lazy(() => import("./pages/scenarios/MinimumPaymentTrapHighInterestDebt"));
const TwoIncomeHouseholdDrowningInDebt = lazy(() => import("./pages/scenarios/TwoIncomeHouseholdDrowningInDebt"));
const CreditCardDebtAfterMedicalEmergency = lazy(() => import("./pages/scenarios/CreditCardDebtAfterMedicalEmergency"));
const MaxedOutCardsNoSavingsSettlement = lazy(() => import("./pages/scenarios/MaxedOutCardsNoSavingsSettlement"));
const HighInterestStoreCardsPersonalLoansSettlement = lazy(() => import("./pages/scenarios/HighInterestStoreCardsPersonalLoansSettlement"));
const LayoffAccumulatedDebtSettlement = lazy(() => import("./pages/scenarios/LayoffAccumulatedDebtSettlement"));
const OverspendingLifestyleDebtSettlement = lazy(() => import("./pages/scenarios/OverspendingLifestyleDebtSettlement"));
const SelfEmployedIrregularIncomeHighDebt = lazy(() => import("./pages/scenarios/SelfEmployedIrregularIncomeHighDebt"));

// Minimal page-level loading fallback — invisible white screen, no layout shift
function PageLoader() {
  return (
    <div className="min-h-screen bg-white" aria-hidden="true" />
  );
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/assessment" component={Assessment} />
        <Route path="/results/:id" component={Results} />
        <Route path="/share/:token" component={Share} />
        <Route path="/scenarios" component={Scenarios} />
        <Route path="/about" component={About} />

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
    </Suspense>
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
