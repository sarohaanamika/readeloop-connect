
import { ReactNode } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";
import { useAuth } from "@/hooks/useAuth";

interface AppLayoutProps {
  children: ReactNode;
  hideSidebar?: boolean;
}

const AppLayout = ({ children, hideSidebar = false }: AppLayoutProps) => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow flex">
        {isAuthenticated && !hideSidebar && (
          <aside className="hidden lg:block">
            <Sidebar />
          </aside>
        )}
        
        <main className={`flex-grow ${isAuthenticated && !hideSidebar ? 'lg:ml-64' : ''} pt-16`}>
          {children}
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default AppLayout;
