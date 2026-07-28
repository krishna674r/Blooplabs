import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "./ThemeProvider";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/Button";
import { Moon, Sun, FlaskConical, Menu, X, User, Home, LayoutDashboard, Rocket, Settings as SettingsIcon } from "lucide-react";
import { Dock } from "./ui/Dock";

export function Layout() {
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const dockItems = isAuthenticated ? [
    { icon: <Home size={18} className="text-white" />, label: 'Home', onClick: () => navigate('/') },
    { icon: <LayoutDashboard size={18} className="text-white" />, label: 'Dashboard', onClick: () => navigate('/dashboard') },
    { icon: <Rocket size={18} className="text-white" />, label: 'Mentor', onClick: () => navigate('/mentor') },
    { icon: <SettingsIcon size={18} className="text-white" />, label: 'Settings', onClick: () => navigate('/settings') },
  ] : [
    { icon: <Home size={18} className="text-white" />, label: 'Home', onClick: () => navigate('/') },
    { icon: <User size={18} className="text-white" />, label: 'Sign In', onClick: () => navigate('/auth') },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary relative overflow-x-hidden">
      {/* Global Liquid Background Blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-indigo-500/10 to-blue-500/10 dark:from-indigo-500/30 dark:to-blue-500/30 blur-[100px] blob-1 pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tl from-purple-500/10 to-pink-500/10 dark:from-purple-500/30 dark:to-pink-500/30 blur-[120px] blob-2 pointer-events-none z-0"></div>
      
      {location.pathname !== '/onboarding' && (
        <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
          <header className="w-full max-w-5xl rounded-[40px] border border-foreground/10 dark:border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_0_rgba(31,38,135,0.2),inset_0_1px_1px_rgba(255,255,255,0.4)] bg-surface/50 dark:bg-black/20 backdrop-blur-xl pointer-events-auto relative">
            <div className="px-6 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80">
              <div className="w-10 h-10 rounded-xl bg-transparent flex items-center justify-center overflow-hidden">
                <img src="/logo.png" alt="BloopLabs" className="w-full h-full object-contain drop-shadow-md" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground drop-shadow-sm">BloopLabs</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
              <Link to="/" className={`text-sm font-medium transition-all hover:text-primary hover:drop-shadow-sm ${location.pathname === '/' ? 'text-primary drop-shadow-sm' : 'text-foreground/80'}`}>
                Home
              </Link>
              {!isAuthenticated ? (
                <>
                  <Link to="/#features" className={`text-sm font-medium transition-all hover:text-primary hover:drop-shadow-sm text-foreground/80`}>
                    Features
                  </Link>
                  <Link to="/#about" className={`text-sm font-medium transition-all hover:text-primary hover:drop-shadow-sm text-foreground/80`}>
                    About
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className={`text-sm font-medium transition-all hover:text-primary hover:drop-shadow-sm ${location.pathname.startsWith('/dashboard') ? 'text-primary drop-shadow-sm' : 'text-foreground/80'}`}>
                    Dashboard
                  </Link>
                  <Link to="/mentor" className={`text-sm font-medium transition-all hover:text-primary hover:drop-shadow-sm ${location.pathname.startsWith('/mentor') ? 'text-primary drop-shadow-sm' : 'text-foreground/80'}`}>
                    AI Mentor
                  </Link>
                </>
              )}
            </nav>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="hidden md:flex w-10 h-10 items-center justify-center rounded-full bg-foreground/10 hover:bg-foreground/20 transition-all text-foreground hover:scale-105 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] backdrop-blur-md"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <div className="hidden sm:flex items-center">
                {!isAuthenticated ? (
                  <>
                    <Link to="/auth">
                      <button className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors drop-shadow-sm text-foreground/80">Sign In</button>
                    </Link>
                    <Link to="/auth?tab=signup">
                      <button className="glass-button px-5 py-2 rounded-full text-sm font-medium shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] ml-2">Create Account</button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/settings" className="mr-2">
                      <button className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 hover:bg-primary/20 transition-all text-primary" aria-label="Profile">
                        <User size={18} />
                      </button>
                    </Link>
                    <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium hover:text-destructive transition-colors text-foreground/80">
                      Logout
                    </button>
                    <Link to="/new">
                      <button className="glass-button px-5 py-2 rounded-full text-sm font-medium shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] ml-2">New Project</button>
                    </Link>
                  </>
                )}
              </div>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-foreground/10 hover:bg-foreground/20 transition-all text-foreground hover:scale-105 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] backdrop-blur-md"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute top-20 left-0 right-0 bg-background/80 backdrop-blur-xl border border-surface-border rounded-3xl p-4 shadow-xl flex flex-col space-y-4 mx-0 animate-in fade-in slide-in-from-top-4">
              <Link to="/" className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${location.pathname === '/' ? 'bg-foreground/10 text-foreground' : 'text-foreground/80 hover:bg-foreground/5 hover:text-foreground'}`}>
                Home
              </Link>
              {!isAuthenticated ? (
                <>
                  <Link to="/#features" className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors text-foreground/80 hover:bg-foreground/5 hover:text-foreground`}>
                    Features
                  </Link>
                  <div className="border-t border-surface-border pt-4 mt-2 flex flex-col gap-3">
                    <Link to="/auth" className="w-full">
                      <button className="w-full px-4 py-2 text-sm font-medium hover:text-primary transition-colors text-foreground/80 text-center">Sign In</button>
                    </Link>
                    <Link to="/auth?tab=signup" className="w-full">
                      <button className="glass-button w-full px-5 py-3 rounded-xl text-sm font-medium shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]">Create Account</button>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${location.pathname.startsWith('/dashboard') ? 'bg-foreground/10 text-foreground' : 'text-foreground/80 hover:bg-foreground/5 hover:text-foreground'}`}>
                    Dashboard
                  </Link>
                  <Link to="/mentor" className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${location.pathname.startsWith('/mentor') ? 'bg-foreground/10 text-foreground' : 'text-foreground/80 hover:bg-foreground/5 hover:text-foreground'}`}>
                    AI Mentor
                  </Link>
                  <Link to="/settings" className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${location.pathname.startsWith('/settings') ? 'bg-foreground/10 text-foreground' : 'text-foreground/80 hover:bg-foreground/5 hover:text-foreground'}`}>
                    Settings
                  </Link>
                  <div className="border-t border-surface-border pt-4 mt-2 flex flex-col gap-3">
                    <button onClick={handleLogout} className="w-full px-4 py-2 text-sm font-medium hover:text-destructive transition-colors text-foreground/80 text-center">Logout</button>
                    <Link to="/new" className="w-full">
                      <button className="glass-button w-full px-5 py-3 rounded-xl text-sm font-medium shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]">New Project</button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          )}
        </header>
      </div>
      )}

      <main className={`flex-1 flex flex-col z-10 relative ${location.pathname !== '/onboarding' ? 'pt-24' : ''}`}>
        <Outlet />
      </main>

      {location.pathname !== '/onboarding' && (
      <footer className="border-t border-surface-border bg-surface mt-auto py-12 pb-24 md:pb-12">
        <div className="container mx-auto px-4 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2">
            <FlaskConical size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground font-medium">BloopLabs &copy; {new Date().getFullYear()}</span>
          </div>
          <div className="flex space-x-6">
            <Link to="/legal#privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
            <Link to="/legal#terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
            <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
      )}

      {location.pathname !== '/onboarding' && (
        <div className="md:hidden fixed bottom-0 left-0 w-full h-0 z-50 pointer-events-none">
          <div className="pointer-events-auto">
            <Dock 
              items={dockItems}
              panelHeight={60}
              baseItemSize={40}
              magnification={60}
              className="!fixed !bottom-6"
            />
          </div>
        </div>
      )}
    </div>
  );
}
