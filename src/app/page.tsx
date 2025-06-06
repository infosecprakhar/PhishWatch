import { Shield } from "lucide-react";
import UrlAnalyzer from "@/components/phishwatch/UrlAnalyzer";

export default function PhishWatchPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl space-y-8">
        <header className="text-center">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
            <Shield className="h-10 w-10 text-primary" />
          </div>
          <h1 className="font-headline text-4xl sm:text-5xl font-bold text-primary">
            PhishWatch
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Your vigilant shield against phishing threats.
          </p>
        </header>

        <UrlAnalyzer />

        <footer className="text-center text-sm text-muted-foreground pt-8">
          <p>&copy; {new Date().getFullYear()} PhishWatch. Stay Secure.</p>
        </footer>
      </div>
    </div>
  );
}
