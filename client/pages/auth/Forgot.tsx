import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";

export default function Forgot() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"request" | "reset">("request");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  async function requestReset(e: any) {
    e.preventDefault();
    await fetch('/api/auth/forgot', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email }) });
    setStep('reset');
  }

  async function doReset(e: any) {
    e.preventDefault();
    const res = await fetch('/api/auth/reset', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email, code, newPassword }) });
    if(res.ok) alert('Password reset. Please login');
    else { const j=await res.json(); alert(j.error || 'Failed'); }
  }

  return (
    <AppLayout>
      <section className="container py-16">
        <div className="mx-auto max-w-md rounded-xl border bg-card p-6 shadow-sm">
          <h1 className="text-2xl font-bold">Forgot password</h1>
          <p className="text-sm text-muted-foreground mt-2">Enter your account email to receive a reset code.</p>
          {step === 'request' ? (
            <form onSubmit={requestReset} className="mt-6 space-y-4">
              <label className="block text-sm font-medium">Email</label>
              <input className="w-full rounded-md border bg-background px-3 py-2" value={email} onChange={e=>setEmail(e.target.value)} required />
              <div className="flex justify-end"><Button type="submit">Send code</Button></div>
            </form>
          ) : (
            <form onSubmit={doReset} className="mt-6 space-y-4">
              <label className="block text-sm font-medium">Code</label>
              <input className="w-full rounded-md border bg-background px-3 py-2" value={code} onChange={e=>setCode(e.target.value)} required />
              <label className="block text-sm font-medium">New password</label>
              <input type="password" className="w-full rounded-md border bg-background px-3 py-2" value={newPassword} onChange={e=>setNewPassword(e.target.value)} required />
              <div className="flex justify-end"><Button type="submit">Reset password</Button></div>
            </form>
          )}
        </div>
      </section>
    </AppLayout>
  );
}
