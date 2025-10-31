import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/layout/AppLayout";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
<<<<<<< HEAD
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { saveTokens } = useAuth();

  async function doLogin(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ email, password })});
      const data = await res.json();

      if(res.ok) {
        saveTokens(data.access, data.refresh, data.user);
        window.location.href = (data.user.role==='doctor'?'/doctor/dashboard':'/patient/dashboard');
      } else {
        setError(data.error || 'Login failed. Please check your email and password.');
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError(`Error: ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
=======
  const { saveTokens } = useAuth();

  async function doLogin(e:any){
    e.preventDefault();
    const res = await fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ email, password })});
    if(res.ok){ const j=await res.json(); saveTokens(j.access, j.refresh, j.user); alert('Logged in'); window.location.href = (j.user.role==='doctor'?'/doctor/dashboard':'/patient/dashboard'); }
    else { const j=await res.json(); alert(j.error || 'Login failed'); }
>>>>>>> origin/main
  }

  return (
    <AppLayout>
      <section className="container py-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto max-w-md rounded-xl border bg-card p-6 shadow-sm"
        >
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Namaste — please sign in to continue.
          </p>
<<<<<<< HEAD
          <form className="mt-6 space-y-4" onSubmit={doLogin}>
            {error && (
              <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                className="w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                className="w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <div className="rounded-md bg-secondary/50 border border-secondary p-3 text-xs text-secondary-foreground">
              <p><strong>💡 Note:</strong> Make sure your email is verified. Check your email for the verification code from signup.</p>
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="text-sm flex gap-2">
                <Link to="/auth/signup" className="text-primary hover:underline">Create account</Link>
                <span className="text-muted-foreground">|</span>
                <Link to="/auth/forgot" className="text-primary hover:underline">Forgot password?</Link>
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
=======
          <form
            className="mt-6 space-y-4"
            onSubmit={doLogin}
          >
            <label className="block text-sm font-medium">Email</label>
            <input
              className="w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
            <label className="block text-sm font-medium mt-2">Password</label>
            <input
              className="w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <div className="flex items-center justify-between pt-2">
              <div className="text-sm">
                <Link to="/auth/signup" className="text-primary hover:underline">Create account</Link>
                <span className="mx-2 text-muted-foreground">|</span>
                <Link to="/auth/forgot" className="text-primary hover:underline">Forgot password?</Link>
              </div>
              <Button type="submit">Sign in</Button>
>>>>>>> origin/main
            </div>
          </form>
        </motion.div>
      </section>
    </AppLayout>
  );
}
