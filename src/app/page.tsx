import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Trophy } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-8 selection:bg-primary/40 selection:text-white">
      <header className="text-center mb-12">
        <Trophy className="mx-auto h-16 w-16 text-primary mb-6 text-glow-primary" />
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-glow-primary">
          District Baramulla Taekwondo Championship 2025
        </h1>
        <div className="space-y-4 text-lg md:text-xl text-neutral-300 max-w-xl mx-auto">
          <p className="font-semibold">Organised by: District Baramulla Taekwondo Championship 2025</p>
          <p>Affiliated to: Taekwondo Association of Jammu and Kashmir</p>
          <p>Recognized by: Ministry of Youth Affairs and Sports, Government of India</p>
        </div>
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
            aria-label="Register for Taekwondo Championship"
          >
            Register Now
            <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </Link>
      </main>
    </div>
  );
}
