import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/layout/AppLayout";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", role: "patient" });

  const [stage, setStage] = useState<'form'|'verify'>('form');
  const [userEmail, setUserEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch('/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});
      const data = await res.json();

      if(res.ok){
        setUserEmail(form.email);
        setStage('verify');
      } else {
        setError(data.error?.email ? 'Email already in use' : data.error || 'Registration failed');
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError(`Error: ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
  }

  const { saveTokens } = useAuth();
  async function verify(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch('/api/auth/verify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ email: userEmail, code })});
      const data = await res.json();

      if(res.ok){
        saveTokens(data.access, data.refresh, data.user);
        window.location.href = (data.user.role==='doctor'?'/doctor/dashboard':'/patient/dashboard');
      } else {
        setError(data.error || 'Invalid or expired code');
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError(`Error: ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
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
          <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Join and book smarter consultations.
          </p>
          {stage === 'form' ? (
          <form className="mt-6 space-y-3" onSubmit={submit}>
            {error && (
              <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">Full name</label>
              <input
                className="w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Aarav Kumar"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                className="w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                className="w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91-98XXXXXXXX"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <select
                className="w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password (minimum 6 characters)</label>
              <input
                className="w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                required
              />
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="text-sm">
                <Link to="/auth/login" className="text-primary hover:underline">
                  Already have an account?
                </Link>
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create account"}
              </Button>
            </div>
          </form>
          ) : (
            <form onSubmit={verify} className="mt-6 space-y-3">
              {error && (
                <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}
              <p className="text-sm text-muted-foreground">Enter the 6-digit code we sent to <strong>{userEmail}</strong></p>
              <div className="rounded-md bg-secondary/50 p-3 border border-secondary text-sm text-secondary-foreground">
                <p><strong>📧 Email received?</strong> Check your email (including spam folder) for the verification code. Code expires in 15 minutes.</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Verification Code</label>
                <input
                  className="w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring text-center text-lg tracking-widest"
                  value={code}
                  onChange={e=>setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => { setStage('form'); setError(""); }}>Back</Button>
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? "Verifying..." : "Verify"}
                </Button>
              </div>
            </form>
          )}
        </motion.div>
      </section>
    </AppLayout>
  );
}
