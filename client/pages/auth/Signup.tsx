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

  async function submit(e:any){
    e.preventDefault();
    const res = await fetch('/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});
    if(res.ok){
      setUserEmail(form.email);
      setStage('verify');
    } else { const j=await res.json(); alert(j.error || 'Failed'); }
  }

  const { saveTokens } = useAuth();
  async function verify(e:any){
    e.preventDefault();
    const res = await fetch('/api/auth/verify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ email: userEmail, code })});
    if(res.ok){ const j=await res.json(); saveTokens(j.access, j.refresh, j.user); alert('Verified and logged in'); window.location.href = (j.user.role==='doctor'?'/doctor/dashboard':'/patient/dashboard'); }
    else { const j=await res.json(); alert(j.error || 'Invalid code'); }
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
          <form
            className="mt-6 space-y-3"
            onSubmit={submit}
          >
            <label className="block text-sm font-medium">Full name</label>
            <input
              className="w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Aarav Kumar"
              required
            />
            <label className="block text-sm font-medium">Email</label>
            <input
              className="w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              required
            />
            <label className="block text-sm font-medium">Phone</label>
            <input
              className="w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+91-98XXXXXXXX"
            />
            <label className="block text-sm font-medium">Role</label>
            <select
              className="w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
            <label className="block text-sm font-medium">Password</label>
            <input
              className="w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              required
            />
            <div className="flex items-center justify-between pt-2">
              <div className="text-sm">
                <Link to="/auth/login" className="text-primary hover:underline">
                  Already have an account?
                </Link>
              </div>
              <Button type="submit">Create account</Button>
            </div>
          </form>
          ) : (
            <form onSubmit={verify} className="mt-6 space-y-3">
              <p className="text-sm text-muted-foreground">Enter the 6-digit code we sent to <strong>{userEmail}</strong></p>
              <label className="block text-sm font-medium">Code</label>
              <input className="w-full rounded-md border bg-background px-3 py-2" value={code} onChange={e=>setCode(e.target.value)} required />
              <div className="flex justify-end"><Button type="submit">Verify</Button></div>
            </form>
          )}
        </motion.div>
      </section>
    </AppLayout>
  );
}
