import { AppLayout } from "@/components/layout/AppLayout";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface OpenAPISpec {
  info?: { title?: string; description?: string; version?: string };
  servers?: Array<{ url: string; description?: string }>;
  paths?: Record<string, any>;
}

export default function ApiDocs() {
  const [spec, setSpec] = useState<OpenAPISpec | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedPath, setExpandedPath] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/docs")
      .then((res) => res.json())
      .then((data) => {
        setSpec(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load API documentation");
        setLoading(false);
        console.error(err);
      });
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <div className="container py-20 text-center">
          <p className="text-muted-foreground">Loading API documentation...</p>
        </div>
      </AppLayout>
    );
  }

  if (error || !spec) {
    return (
      <AppLayout>
        <div className="container py-20 text-center">
          <p className="text-destructive">{error || "No API documentation available"}</p>
        </div>
      </AppLayout>
    );
  }

  const paths = Object.entries(spec.paths || {});

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
          >
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              {spec.info?.title || "API Documentation"}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
              {spec.info?.description || "Complete API reference for the Hospital Appointment Optimizer"}
            </p>
            {spec.info?.version && (
              <p className="mt-2 text-sm text-muted-foreground">Version: {spec.info.version}</p>
            )}
          </motion.div>

          {spec.servers && spec.servers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-8 rounded-lg border bg-card p-4"
            >
              <h2 className="text-sm font-semibold mb-3">Base URLs</h2>
              <div className="space-y-2">
                {spec.servers.map((server, idx) => (
                  <div key={idx} className="text-sm">
                    <code className="bg-muted px-2 py-1 rounded text-primary">{server.url}</code>
                    {server.description && (
                      <p className="text-xs text-muted-foreground mt-1">{server.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12 space-y-4"
          >
            <h2 className="text-2xl font-bold">Endpoints</h2>
            {paths.length === 0 ? (
              <p className="text-muted-foreground">No endpoints defined</p>
            ) : (
              paths.map(([path, methods]) => (
                <div key={path} className="border rounded-lg overflow-hidden">
                  <button
                    onClick={() =>
                      setExpandedPath(expandedPath === path ? null : path)
                    }
                    className="w-full p-4 hover:bg-muted/50 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <code className="text-primary font-semibold text-sm">{path}</code>
                      <div className="flex gap-1 flex-wrap">
                        {Object.keys(methods).map((method) => (
                          <span
                            key={method}
                            className={`text-xs font-bold px-2 py-1 rounded ${
                              method === "get"
                                ? "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100"
                                : method === "post"
                                  ? "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100"
                                  : method === "patch"
                                    ? "bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100"
                                    : method === "delete"
                                      ? "bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100"
                                      : "bg-muted text-foreground"
                            }`}
                          >
                            {method.toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </div>
                    <svg
                      className={`w-5 h-5 transition-transform ${
                        expandedPath === path ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  </button>

                  {expandedPath === path && (
                    <div className="border-t bg-muted/30 p-4">
                      <pre className="text-xs overflow-x-auto">
                        <code>{JSON.stringify(methods, null, 2)}</code>
                      </pre>
                    </div>
                  )}
                </div>
              ))
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 p-6 rounded-lg border bg-muted/30"
          >
            <h3 className="font-semibold mb-2">Raw OpenAPI Specification</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Access the complete OpenAPI specification as JSON:
            </p>
            <a
              href="/api/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline text-sm font-medium"
            >
              /api/docs →
            </a>
          </motion.div>
        </div>
      </section>
    </AppLayout>
  );
}
