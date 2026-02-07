import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Company pages
import CompanyDashboard from "./pages/company/CompanyDashboard";
import Questionnaire from "./pages/company/Questionnaire";
import CompanyScores from "./pages/company/CompanyScores";
import Predictions from "./pages/company/Predictions";

// Investor pages
import InvestorDashboard from "./pages/investor/InvestorDashboard";
import BrowseCompanies from "./pages/investor/BrowseCompanies";
import CompareCompanies from "./pages/investor/CompareCompanies";
import Watchlist from "./pages/investor/Watchlist";
import CompanyDetails from "./pages/investor/CompanyDetails";

const queryClient = new QueryClient();

function RoleBasedRedirect() {
  const { role, isLoading } = useAuth();
  
  if (isLoading) return null;
  if (role === 'company') return <Navigate to="/company/dashboard" replace />;
  if (role === 'investor') return <Navigate to="/investor/dashboard" replace />;
  return <Index />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RoleBasedRedirect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Company routes */}
            <Route path="/company/dashboard" element={
              <ProtectedRoute allowedRoles={['company']}>
                <CompanyDashboard />
              </ProtectedRoute>
            } />
            <Route path="/company/questionnaire" element={
              <ProtectedRoute allowedRoles={['company']}>
                <Questionnaire />
              </ProtectedRoute>
            } />
            <Route path="/company/scores" element={
              <ProtectedRoute allowedRoles={['company']}>
                <CompanyScores />
              </ProtectedRoute>
            } />
            <Route path="/company/predictions" element={
              <ProtectedRoute allowedRoles={['company']}>
                <Predictions />
              </ProtectedRoute>
            } />
            
            {/* Investor routes */}
            <Route path="/investor/dashboard" element={
              <ProtectedRoute allowedRoles={['investor']}>
                <InvestorDashboard />
              </ProtectedRoute>
            } />
            <Route path="/investor/browse" element={
              <ProtectedRoute allowedRoles={['investor']}>
                <BrowseCompanies />
              </ProtectedRoute>
            } />
            <Route path="/investor/compare" element={
              <ProtectedRoute allowedRoles={['investor']}>
                <CompareCompanies />
              </ProtectedRoute>
            } />
            <Route path="/investor/watchlist" element={
              <ProtectedRoute allowedRoles={['investor']}>
                <Watchlist />
              </ProtectedRoute>
            } />
            <Route path="/investor/company/:companyId" element={
              <ProtectedRoute allowedRoles={['investor']}>
                <CompanyDetails />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
