import { useState } from "react";
import { Switch, Route } from "wouter";
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
import NotFound from "@/pages/not-found";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function Router() {
  const [userType, setUserType] = useState<"tenderer" | "contractor">("tenderer");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border">
        <span className="text-sm font-medium">Demo Mode - Switch View:</span>
        <div className="flex gap-2">
          <Button
            variant={userType === "tenderer" ? "default" : "outline"}
            size="sm"
            onClick={() => setUserType("tenderer")}
            data-testid="button-switch-tenderer"
          >
            Tenderer View
          </Button>
          <Button
            variant={userType === "contractor" ? "default" : "outline"}
            size="sm"
            onClick={() => setUserType("contractor")}
            data-testid="button-switch-contractor"
          >
            Contractor View
          </Button>
        </div>
        <Badge variant="secondary" className="ml-auto">
          {userType === "tenderer" ? "Awarding Jobs" : "Bidding on Jobs"}
        </Badge>
      </div>
      
      <Switch>
        <Route path="/">
          {userType === "tenderer" ? <TendererDashboard /> : <ContractorDashboard />}
        </Route>
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

export default function App() {
  const [userType, setUserType] = useState<"tenderer" | "contractor">("tenderer");

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
                  {userType === "tenderer" ? <TendererDashboard /> : <ContractorDashboard />}
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
