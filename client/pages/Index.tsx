import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <AppLayout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10" aria-hidden>
          <div className="pointer-events-none absolute inset-x-0 top-[-4rem] -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden>
            <div
              className="relative left-1/2 aspect-[1155/678] w-[36rem] -translate-x-1/2 bg-gradient-to-tr from-primary/30 to-accent/40 opacity-30 sm:w-[72rem]"
              style={{ clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" }}
            />
          </div>
        </div>
        <div className="container py-20 md:py-28">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl md:text-5xl font-extrabold tracking-tight"
              >
                Hospital Appointment Optimizer
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className="mt-4 text-lg text-muted-foreground"
              >
                Optimizing doctor availability and appointment allocation using digital tech & AI. Namaste — ready to book your consultation?
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mt-8 flex flex-wrap items-center gap-3"
              >
                <Button asChild className="">
                  <Link to="/auth/signup">Get started — it's free</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="#features">Explore features</Link>
                </Button>
              </motion.div>
              <ul className="mt-8 grid grid-cols-1 gap-3 text-sm text-muted-foreground md:max-w-lg" id="features">
                <li className="flex items-center gap-2"><span className="size-2 rounded-full bg-primary" /> AI-assisted scheduling with urgent case priority</li>
                <li className="flex items-center gap-2"><span className="size-2 rounded-full bg-primary" /> Separate experiences for patients and doctors</li>
                <li className="flex items-center gap-2"><span className="size-2 rounded-full bg-primary" /> Real-time slot availability and notifications</li>
                <li className="flex items-center gap-2"><span className="size-2 rounded-full bg-primary" /> Admin dashboard with audit logs</li>
              </ul>
            </div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
              <div className="relative mx-auto max-w-md rounded-2xl border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">Next available</div>
                    <div className="text-xl font-semibold">Dr. Asha Verma</div>
                    <div className="text-sm text-muted-foreground">Cardiology • CityCare Hospital</div>
                  </div>
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">Mon, 10 Nov • 11:00</span>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[
                    "10:30",
                    "11:00",
                    "11:30",
                    "12:00",
                    "12:30",
                    "13:00",
                  ].map((t) => (
                    <button key={t} className="rounded-md border px-3 py-2 text-sm hover:bg-accent" aria-label={`Book ${t}`}>
                      {t}
                    </button>
                  ))}
                </div>
                <div className="mt-4 flex justify-end">
                  <Button asChild><Link to="/auth/signup">Book now</Link></Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Patients section */}
      <section id="patients" className="container py-16 md:py-20">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border bg-card p-6">
            <h2 className="text-2xl font-bold">For Patients</h2>
            <p className="text-muted-foreground mt-2">Search by specialization, location, rating, and real-time availability. Get reminders and manage your medical notes.</p>
            <ul className="mt-4 grid gap-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-primary" /> "Namaste, Aarav — ready to book your consultation?"</li>
              <li className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-primary" /> Cancel/reschedule with policy-aware rules</li>
              <li className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-primary" /> In-app notifications and reminders</li>
            </ul>
            <div className="mt-6">
              <Button asChild variant="secondary"><Link to="/auth/signup">Create patient account</Link></Button>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-6" id="doctors">
            <h2 className="text-2xl font-bold">For Doctors</h2>
            <p className="text-muted-foreground mt-2">Bulk upload recurring slots, block off times, drag-to-reschedule, and configure auto-accept rules.</p>
            <ul className="mt-4 grid gap-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-primary" /> Analytics: appointments/day, no-shows, avg. time</li>
              <li className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-primary" /> Daily limits and appointment-type durations</li>
              <li className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-primary" /> Audit logs for automated reassignments</li>
            </ul>
            <div className="mt-6">
              <Button asChild><Link to="/auth/signup">Join as a doctor</Link></Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-24">
        <div className="rounded-2xl border bg-gradient-to-br from-primary/10 to-accent/20 p-8 text-center">
          <h3 className="text-xl md:text-2xl font-semibold">Smarter schedules. Happier patients. Lower no-shows.</h3>
          <p className="text-muted-foreground mt-2">LLM-ready optimizer with rule-based fallback — deploy anywhere, MongoDB-backed.</p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <Button asChild><Link to="/auth/signup">Get started</Link></Button>
            <Button asChild variant="outline"><a href="#">View API docs</a></Button>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
