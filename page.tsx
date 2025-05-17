import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-8 selection:bg-primary/40 selection:text-white">
      <header className="text-center mb-12">
        <Sparkles className="mx-auto h-16 w-16 text-primary mb-6 text-glow-primary" />
        <h1 className="text-5xl md:text-7xl font-bold mb-4 text-glow-primary">
          Join Our Wellness Project!
        </h1>
        <p className="text-lg md:text-xl text-neutral-300 max-w-xl mx-auto">
          Earn ₹15,000 - ₹30,000 part-time with flexible online/offline work options, without disturbing your regular schedule or studies.
          Ready to make an impact and grow?
        </p>
      </header>
      
      <main className="mb-12">
        <Link href="/contact">
          <Button
            size="lg"
            variant="default"
            className="bg-primary text-primary-foreground hover:bg-primary/90 
                       shadow-glow-primary hover:shadow-glow-accent
                       focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background
                       transition-all duration-300 ease-in-out transform hover:scale-105 group px-8 py-3 text-lg"
            aria-label="Apply for the Wellness Project"
          >
            Apply Now
            <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </Link>
      </main>

      <footer className="text-center text-neutral-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Wellness Project. All opportunities reserved.</p>
        <p>Make a difference, part-time.</p>
      </footer>
    </div>
  );
}
