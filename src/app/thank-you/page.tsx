import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Home, Trophy } from 'lucide-react';

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center p-4 selection:bg-primary/40 selection:text-white">
      <Trophy className="h-20 w-20 text-primary mb-6 shadow-glow-primary" />
      <CheckCircle2 className="h-16 w-16 text-green-400 mb-6 shadow-glow-primary animate-pulse" />
      <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-glow-primary">Registration Successful!</h1>
      <div className="space-y-4 text-lg sm:text-xl text-neutral-300 mb-8 max-w-md">
        <p>Thank you for registering for the District Baramulla Taekwondo Championship 2025!</p>
        <p>We have received your registration details and will contact you shortly with more information about the championship schedule and requirements.</p>
      </div>
      <Link href="/">
        <Button
          size="lg"
          variant="outline"
          className="border-primary text-primary hover:bg-primary/10 hover:text-accent
                     shadow-glow-primary hover:shadow-glow-accent
                     focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background
                     transition-all duration-300 ease-in-out transform hover:scale-105 group px-8 py-3 text-lg"
          aria-label="Go back to Homepage"
        >
          <Home className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:rotate-[360deg]" />
          Back to Home
        </Button>
      </Link>
      <footer className="absolute bottom-8 text-center text-neutral-500 text-sm">
        <p>&copy; {new Date().getFullYear()} District Baramulla Taekwondo. All rights reserved.</p>
      </footer>
    </div>
  );
}
