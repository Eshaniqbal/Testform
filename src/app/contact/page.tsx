import { ContactForm } from '@/components/contact-form';
import { Trophy } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 selection:bg-primary/40 selection:text-white">
      <div className="w-full max-w-2xl">
        <header className="text-center mb-8 md:mb-12">
          <Trophy className="mx-auto h-12 w-12 text-primary mb-4 text-glow-primary" />
          <h1 className="text-4xl sm:text-5xl font-bold text-glow-primary">District Baramulla Taekwondo Championship 2025</h1>
          <div className="mt-4 space-y-2 text-base sm:text-lg text-neutral-300">
            <p className="font-semibold">Organised by: District Baramulla Taekwondo</p>
            <p>Affiliated to: Taekwondo Association of Jammu and Kashmir</p>
            <p>Recognized by: Ministry of Youth Affairs and Sports, Government of India</p>
          </div>
          <p className="mt-6 text-base sm:text-lg text-neutral-300">
            Please fill out the form below to register for the championship.
            All fields marked with * are required.
          </p>
        </header>
        <ContactForm />
      </div>
      <footer className="mt-12 text-center text-neutral-500 text-sm">
        <p>© 2025 District Baramulla Taekwondo. All rights reserved.</p>
      </footer>
    </div>
  );
}
