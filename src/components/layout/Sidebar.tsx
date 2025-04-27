import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  Book,
  User,
  ClipboardList,
  Clock,
  Bell,
  Settings,
  HelpCircle,
  ChevronRight,
  LayoutDashboard,
  Users,
  BookOpen,
  LogOut,
  CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { UserRole } from "@/lib/types";

type SidebarLinkProps = {
  to: string;
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
  count?: number;
};

const SidebarLink = ({ to, icon: Icon, label, isActive, count }: SidebarLinkProps) => {
  return (
    <Link 
      to={to} 
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg group transition-all duration-200",
        isActive 
          ? "bg-primary text-primary-foreground" 
          : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      )}
    >
      <Icon className={cn("h-5 w-5 flex-shrink-0", isActive ? "text-white" : "text-white/70 group-hover:text-white")} />
      <span className="flex-grow">{label}</span>
      {count !== undefined && (
        <span 
          className={cn(
            "rounded-full px-2 py-0.5 text-xs font-medium",
            isActive ? "bg-white text-primary" : "bg-white/20 text-white"
          )}
        >
          {count}
        </span>
      )}
    </Link>
  );
};

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  if (!user) return null;

  return (
    <div 
      className={cn(
        "fixed left-0 top-0 h-screen bg-sidebar transition-all duration-300 border-r border-sidebar-border z-30 pt-16",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex-grow overflow-y-auto py-6 scrollbar-thin scrollbar-thumb-sidebar-accent scrollbar-track-transparent">
          <div className="px-4 mb-6">
            <div className="flex items-center">
              <Avatar className={cn("h-10 w-10 border-2 border-white/20", !isCollapsed && "mr-3")}>
                <AvatarFallback className="bg-accent text-white">
                  {user.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              {!isCollapsed && (
                <div className="overflow-hidden">
                  <p className="font-medium text-white truncate">{user.name}</p>
                  <p className="text-xs text-white/60 truncate capitalize">
                    {user.membershipType || 'standard'} member
                  </p>
                </div>
              )}
            </div>
          </div>

          <nav className="space-y-1 px-3">
            <SidebarLink 
              to="/dashboard" 
              icon={LayoutDashboard} 
              label="Dashboard" 
              isActive={isActive("/dashboard")} 
            />
            
            <SidebarLink 
              to="/books" 
              icon={Book} 
              label="Browse Books" 
              isActive={isActive("/books")} 
            />
            
            <SidebarLink 
              to="/dashboard/loans" 
              icon={ClipboardList} 
              label="My Loans" 
              isActive={isActive("/dashboard/loans")} 
              count={2}
            />
            
            <SidebarLink 
              to="/payments" 
              icon={CreditCard} 
              label="Membership" 
              isActive={isActive("/payments")} 
            />
            
            <SidebarLink 
              to="/dashboard/history" 
              icon={Clock} 
              label="History" 
              isActive={isActive("/dashboard/history")} 
            />
            
            <SidebarLink 
              to="/dashboard/notifications" 
              icon={Bell} 
              label="Notifications" 
              isActive={isActive("/dashboard/notifications")} 
              count={3}
            />

            {(user.role === UserRole.ADMIN || user.role === UserRole.STAFF) && (
              <>
                <Separator className="my-4 bg-sidebar-border" />
                
                {user.role === UserRole.ADMIN && (
                  <SidebarLink 
                    to="/admin" 
                    icon={Settings} 
                    label="Admin Panel" 
                    isActive={isActive("/admin")} 
                  />
                )}
                
                <SidebarLink 
                  to="/manage/loans" 
                  icon={BookOpen} 
                  label={user.role === UserRole.ADMIN ? "Manage Books" : "Loan Management"} 
                  isActive={isActive("/manage/loans")} 
                />
                
                {user.role === UserRole.ADMIN && (
                  <SidebarLink 
                    to="/manage/members" 
                    icon={Users} 
                    label="Manage Users" 
                    isActive={isActive("/manage/members")} 
                  />
                )}
              </>
            )}
          </nav>
        </div>
        
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex flex-col space-y-2">
            <SidebarLink 
              to="/help" 
              icon={HelpCircle} 
              label="Help & Support" 
              isActive={isActive("/help")} 
            />
            
            <Button
              variant="ghost"
              className="flex items-center justify-start gap-3 w-full text-white/80 hover:bg-sidebar-accent hover:text-white px-4 py-3 h-auto"
              onClick={logout}
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              <span className={cn(isCollapsed && "hidden")}>Log Out</span>
            </Button>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-4 top-24 h-8 w-8 rounded-full bg-primary text-white shadow-md hover:bg-accent border border-white"
          onClick={toggleSidebar}
        >
          <ChevronRight
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              isCollapsed ? "rotate-0" : "rotate-180"
            )} 
          />
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
