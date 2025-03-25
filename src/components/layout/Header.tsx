
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Book, Search, User, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/books?search=${encodeURIComponent(searchQuery)}`);
    setSearchQuery("");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/80 backdrop-blur-md border-b border-gray-200 py-3" 
          : "bg-transparent py-5"
      }`}
    >
      <div className="container px-4 mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 transition-all duration-300 hover:scale-105"
        >
          <Book className="h-8 w-8 text-primary animate-fade-in" />
          <span className="text-xl font-display font-bold">Athenaeum</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            to="/" 
            className="underline-animation py-1 text-foreground/80 hover:text-foreground transition"
          >
            Home
          </Link>
          <Link 
            to="/books" 
            className="underline-animation py-1 text-foreground/80 hover:text-foreground transition"
          >
            Books
          </Link>
          {isAuthenticated && (
            <Link 
              to="/dashboard" 
              className="underline-animation py-1 text-foreground/80 hover:text-foreground transition"
            >
              Dashboard
            </Link>
          )}
          {isAuthenticated && user?.role === "admin" && (
            <Link 
              to="/admin" 
              className="underline-animation py-1 text-foreground/80 hover:text-foreground transition"
            >
              Admin
            </Link>
          )}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="search"
              placeholder="Search books..."
              className="w-40 lg:w-60 h-9 pl-8 pr-4 rounded-full bg-white/90 border-gray-200 focus:bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </form>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative rounded-full h-9 w-9 p-0 hover:bg-gray-100">
                  <Avatar className="h-8 w-8 hover:ring-2 hover:ring-primary transition-all duration-300">
                    <AvatarFallback className="bg-primary text-white">
                      {user?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-4 py-2">
                  <p className="font-medium text-sm">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="cursor-pointer">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">Profile</Link>
                </DropdownMenuItem>
                {user?.role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="cursor-pointer">Admin Panel</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-500 cursor-pointer focus:text-red-500"
                  onClick={logout}
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button variant="ghost" className="gap-2">
                <LogIn className="h-4 w-4" />
                Login
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-md"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6 animate-fade-in" />
          ) : (
            <Menu className="h-6 w-6 animate-fade-in" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-30 bg-white transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
        style={{ top: "60px" }}
      >
        <div className="flex flex-col h-full p-6 space-y-6 overflow-y-auto">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="search"
              placeholder="Search books..."
              className="w-full h-10 pl-10 pr-4 rounded-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </form>

          <nav className="flex flex-col space-y-5">
            <Link 
              to="/" 
              className="text-lg font-medium px-4 py-2 rounded-md hover:bg-gray-100 transition flex items-center"
            >
              Home
            </Link>
            <Link 
              to="/books" 
              className="text-lg font-medium px-4 py-2 rounded-md hover:bg-gray-100 transition flex items-center"
            >
              Books
            </Link>
            {isAuthenticated && (
              <Link 
                to="/dashboard" 
                className="text-lg font-medium px-4 py-2 rounded-md hover:bg-gray-100 transition flex items-center"
              >
                Dashboard
              </Link>
            )}
            {isAuthenticated && user?.role === "admin" && (
              <Link 
                to="/admin" 
                className="text-lg font-medium px-4 py-2 rounded-md hover:bg-gray-100 transition flex items-center"
              >
                Admin
              </Link>
            )}
          </nav>

          <div className="pt-6 mt-auto border-t border-gray-200">
            {isAuthenticated ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-white">
                      {user?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full justify-center" 
                  onClick={logout}
                >
                  Log out
                </Button>
              </div>
            ) : (
              <div className="flex flex-col space-y-3">
                <Link to="/login">
                  <Button className="w-full justify-center">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline" className="w-full justify-center">Register</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
