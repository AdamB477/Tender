import { useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AppSidebar } from "@/components/AppSidebar";
import TendererDashboard from "@/pages/TendererDashboard";
import ContractorDashboard from "@/pages/ContractorDashboard";
import MyTenders from "@/pages/MyTenders";
import FindContractors from "@/pages/FindContractors";
import FindTenders from "@/pages/FindTenders";
import MyBids from "@/pages/MyBids";
import MyCrewPage from "@/pages/MyCrewPage";
import CompliancePage from "@/pages/CompliancePage";
import NotFound from "@/pages/not-found";
import { Button } from "@/components/ui/button";

function Router({ userType }: { userType: "tenderer" | "contractor" }) {
  return (
    <Switch>
      <Route path="/">
        {userType === "tenderer" ? <TendererDashboard /> : <ContractorDashboard />}
      </Route>
      
      {/* Tenderer routes */}
      {userType === "tenderer" && (
        <>
          <Route path="/tenders" component={MyTenders} />
          <Route path="/contractors" component={FindContractors} />
        </>
      )}
      
      {/* Contractor routes */}
      {userType === "contractor" && (
        <>
          <Route path="/tenders" component={FindTenders} />
          <Route path="/my-bids" component={MyBids} />
          <Route path="/crew" component={MyCrewPage} />
          <Route path="/compliance" component={CompliancePage} />
        </>
      )}
      
      {/* Common routes - placeholder for now */}
      <Route path="/bids">
        <div className="p-6">
          <h1 className="text-2xl font-semibold mb-4">Bids</h1>
          <p className="text-muted-foreground">Bids page coming soon...</p>
        </div>
      </Route>
      <Route path="/messages">
        <div className="p-6">
          <h1 className="text-2xl font-semibold mb-4">Messages</h1>
          <p className="text-muted-foreground">Messages page coming soon...</p>
        </div>
      </Route>
      <Route path="/analytics">
        <div className="p-6">
          <h1 className="text-2xl font-semibold mb-4">Analytics</h1>
          <p className="text-muted-foreground">Analytics page coming soon...</p>
        </div>
      </Route>
      <Route path="/settings">
        <div className="p-6">
          <h1 className="text-2xl font-semibold mb-4">Settings</h1>
          <p className="text-muted-foreground">Settings page coming soon...</p>
        </div>
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  const [userType, setUserType] = useState<"tenderer" | "contractor">("tenderer");
  const [location, setLocation] = useLocation();
  const [previousUserType, setPreviousUserType] = useState<"tenderer" | "contractor">("tenderer");

  // Navigate to home when user type changes to avoid 404s
  useEffect(() => {
    if (userType !== previousUserType) {
      setLocation("/");
      setPreviousUserType(userType);
    }
  }, [userType, previousUserType, setLocation]);

  const sidebarStyle = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <SidebarProvider style={sidebarStyle as React.CSSProperties}>
            <div className="flex h-screen w-full">
              <AppSidebar userType={userType} />
              <div className="flex flex-col flex-1 overflow-hidden">
                <header className="flex items-center justify-between px-6 py-3 border-b bg-background sticky top-0 z-10">
                  <div className="flex items-center gap-3">
                    <SidebarTrigger data-testid="button-sidebar-toggle" />
                    <div className="flex items-center gap-2 ml-4">
                      <span className="text-sm text-muted-foreground">View as:</span>
                      <Button
                        variant={userType === "tenderer" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setUserType("tenderer")}
                        data-testid="button-switch-tenderer-header"
                      >
                        Tenderer
                      </Button>
                      <Button
                        variant={userType === "contractor" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setUserType("contractor")}
                        data-testid="button-switch-contractor-header"
                      >
                        Contractor
                      </Button>
                    </div>
                  </div>
                  <ThemeToggle />
                </header>
                <main className="flex-1 overflow-auto p-6">
                  <Router userType={userType} />
                </main>
              </div>
            </div>
          </SidebarProvider>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
