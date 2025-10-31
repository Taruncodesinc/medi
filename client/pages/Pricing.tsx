import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Pricing() {
  return (
    <AppLayout>
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 -z-10" aria-hidden>
          <div className="pointer-events-none absolute inset-x-0 top-[-4rem] -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden>
            <div
              className="relative left-1/2 aspect-[1155/678] w-[36rem] -translate-x-1/2 bg-gradient-to-tr from-primary/30 to-accent/40 opacity-30 sm:w-[72rem]"
              style={{ clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" }}
            />
          </div>
        </div>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Flexible Pricing Plans
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose a plan that fits your healthcare organization's needs. Custom pricing available for enterprise clients.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {[
              {
                name: "Starter",
                description: "For small clinics and practices",
                price: "Coming Soon",
                features: [
                  "Up to 5 doctors",
                  "Basic appointment scheduling",
                  "Email notifications",
                  "24/7 support",
                ],
              },
              {
                name: "Professional",
                description: "For growing healthcare providers",
                price: "Coming Soon",
                popular: true,
                features: [
                  "Up to 50 doctors",
                  "Advanced AI scheduling",
                  "Analytics & reporting",
                  "SMS notifications",
                  "API access",
                  "Priority support",
                ],
              },
              {
                name: "Enterprise",
                description: "For large hospital networks",
                price: "Custom",
                features: [
                  "Unlimited doctors",
                  "Advanced optimizer with LLM",
                  "Custom integrations",
                  "Dedicated account manager",
                  "SLA guarantee",
                  "White-label options",
                ],
              },
            ].map((plan, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + idx * 0.1 }}
                className={`relative rounded-2xl border p-8 ${
                  plan.popular
                    ? "border-primary bg-gradient-to-br from-primary/10 to-accent/10 shadow-md"
                    : "bg-card"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                <div className="mt-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.price !== "Custom" && plan.price !== "Coming Soon" && (
                    <span className="text-muted-foreground ml-2">/month</span>
                  )}
                </div>
                <Button className="w-full mt-6" variant={plan.popular ? "default" : "outline"} asChild>
                  <Link to="/auth/signup">Get Started</Link>
                </Button>
                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <span className="size-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-16 rounded-2xl border bg-gradient-to-br from-primary/10 to-accent/20 p-8 text-center"
          >
            <h3 className="text-2xl font-bold">Ready to optimize your scheduling?</h3>
            <p className="text-muted-foreground mt-2">
              Start with our free trial or contact our sales team for enterprise pricing.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Button asChild>
                <Link to="/auth/signup">Start Free Trial</Link>
              </Button>
              <Button asChild variant="outline">
                <a href="mailto:sales@hospital-optimizer.local">Contact Sales</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </AppLayout>
  );
}
