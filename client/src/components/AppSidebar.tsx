import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  FileText,
  Users,
  Briefcase,
  MessageSquare,
  Settings,
  Building2,
  Star,
  BarChart3,
  Shield,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AvailabilityToggle } from "./AvailabilityToggle";

const tendererMenuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "My Tenders", url: "/tenders", icon: FileText },
  { title: "Find Contractors", url: "/contractors", icon: Users },
  { title: "Bids", url: "/bids", icon: Briefcase },
  { title: "Messages", url: "/messages", icon: MessageSquare },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
];

const contractorMenuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Find Tenders", url: "/tenders", icon: FileText },
  { title: "My Bids", url: "/my-bids", icon: Briefcase },
  { title: "My Crew", url: "/crew", icon: Users },
  { title: "Compliance", url: "/compliance", icon: Shield },
  { title: "Messages", url: "/messages", icon: MessageSquare },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
];

const adminMenuItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Organizations", url: "/admin/orgs", icon: Building2 },
  { title: "Tenders", url: "/admin/tenders", icon: FileText },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Reports", url: "/admin/reports", icon: BarChart3 },
  { title: "Moderation", url: "/admin/moderation", icon: Shield },
];

interface AppSidebarProps {
  userType?: "tenderer" | "contractor" | "admin";
}

export function AppSidebar({ userType = "tenderer" }: AppSidebarProps) {
  const [location] = useLocation();

  const menuItems =
    userType === "admin"
      ? adminMenuItems
      : userType === "contractor"
      ? contractorMenuItems
      : tendererMenuItems;

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg">Tender</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    data-testid={`nav-${item.title.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild data-testid="nav-settings">
                  <Link href="/settings">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="" alt="User" />
            <AvatarFallback>AC</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">ABC Corporation</p>
            <p className="text-xs text-muted-foreground truncate">
              {userType === "admin" ? "Admin" : userType === "contractor" ? "Contractor" : "Tenderer"}
            </p>
          </div>
        </div>
        {userType === "contractor" && <AvailabilityToggle />}
      </SidebarFooter>
    </Sidebar>
  );
}
