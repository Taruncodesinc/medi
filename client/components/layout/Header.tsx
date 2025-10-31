import { Link, useLocation, useNavigate } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

function BrandMark() {
  return (
    <div className="flex items-center gap-2">
      <svg width="28" height="28" viewBox="0 0 48 48" className="text-primary">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--accent-foreground))" />
          </linearGradient>
        </defs>
        <circle cx="24" cy="24" r="22" fill="url(#grad)" opacity="0.15" />
        <path d="M24 9c-1.1 0-2 .9-2 2v9h-9c-1.1 0-2 .9-2 2s.9 2 2 2h9v9c0 1.1.9 2 2 2s2-.9 2-2v-9h9c1.1 0 2-.9 2-2s-.9-2-2-2h-9v-9c0-1.1-.9-2-2-2z" fill="hsl(var(--primary))" />
      </svg>
      <div className="leading-tight">
        <span className="font-extrabold tracking-tight text-lg">Hospital Appointment Optimizer</span>
        <div className="text-xs text-muted-foreground -mt-0.5">Optimizing doctor availability with AI</div>
      </div>
    </div>
  );
}

const navLink = ({ isActive }: { isActive: boolean }) =>
  cn(
    "px-3 py-2 text-sm font-medium rounded-md",
    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
  );

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  function goToSection(id: string) {
    // If already on home page, just scroll
    if (location.pathname === "/") {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.replaceState(null, "", `#${id}`);
        return;
      }
    }
    // Otherwise navigate to home with hash
    // Using full navigation so browser will land on the anchor
    window.location.href = `/#${id}`;
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link to="/" className="shrink-0"><BrandMark /></Link>
        <nav className="hidden md:flex items-center gap-1">
          <button onClick={() => goToSection("features")} className={cn("px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground")}>Features</button>
          <button onClick={() => goToSection("patients")} className={cn("px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground")}>For Patients</button>
          <button onClick={() => goToSection("doctors")} className={cn("px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground")}>For Doctors</button>
<<<<<<< HEAD
          <Link to="/pricing" className={navLink({ isActive: location.pathname === "/pricing" })}>Pricing</Link>
=======
          <button onClick={() => goToSection("pricing")} className={cn("px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground")}>Pricing</button>
>>>>>>> origin/main
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <>
              <span className="hidden sm:inline text-sm text-muted-foreground">Namaste, {user.name}</span>
              <Button variant="ghost" onClick={() => navigate(user.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard')}>Dashboard</Button>
              <Button onClick={logout} variant="outline">Logout</Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" className="hidden sm:inline-flex"><Link to="/auth/login">Login</Link></Button>
              <Button asChild className=""><Link to="/auth/signup">Get started</Link></Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
