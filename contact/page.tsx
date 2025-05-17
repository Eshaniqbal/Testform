import { ContactForm } from '@/components/contact-form';
import { Briefcase } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 selection:bg-primary/40 selection:text-white">
      <div className="w-full max-w-2xl">
        <header className="text-center mb-8 md:mb-12">
          <Briefcase className="mx-auto h-12 w-12 text-primary mb-4 text-glow-primary" />
          <h1 className="text-4xl sm:text-5xl font-bold text-glow-primary">Apply For An Opportunity</h1>
          <p className="mt-3 text-base sm:text-lg text-neutral-300">
            Interested in a flexible part-time opportunity (₹15k-₹30k, online/offline)? 
            Fill out the form below to express your interest. We'll contact you with more details!
          </p>
        </header>
        <ContactForm />
      </div>
      <footer className="mt-12 text-center text-neutral-500 text-sm">
      </footer>
    </div>
  );
}
