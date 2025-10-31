export function Footer() {
  return (
    <footer className="border-t mt-16">
      <div className="container py-8 text-sm text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-4">
        <p>
          © {new Date().getFullYear()} Hospital Appointment Optimizer. Built for India.
        </p>
        <div className="flex items-center gap-4">
          <a className="hover:text-foreground" href="#privacy">Privacy</a>
          <a className="hover:text-foreground" href="#terms">Terms</a>
          <a className="hover:text-foreground" href="#contact">Contact</a>
        </div>
      </div>
    </footer>
  );
}
