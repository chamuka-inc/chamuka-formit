import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-background antialiased selection:bg-primary/10 selection:text-primary">
      <div className="rounded-3xl border border-border bg-background p-12 shadow-xl shadow-primary/5 text-center max-w-md w-full">
        <h1 className="mb-4 text-7xl font-bold tracking-tighter text-primary">404</h1>
        <h2 className="mb-6 text-xl font-bold tracking-tight text-foreground">Page Not Found</h2>
        <p className="mb-10 text-sm font-medium text-muted-foreground leading-relaxed">
          The resource you are looking for has been moved or does not exist. Please verify the URL and try again.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center rounded-xl bg-primary px-8 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover hover:scale-[1.02] active:scale-100"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
