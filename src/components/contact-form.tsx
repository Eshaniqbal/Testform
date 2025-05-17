
"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { User, Mail, Phone, MessageCircle, Send, AlertTriangle, Briefcase } from "lucide-react"; // Changed icon for message
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { submitContactForm } from "@/app/contact/actions";
import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation"; 

const formSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  phone: z.string().optional(),
  contactMethod: z.enum(["Email", "Phone", "WhatsApp"], {
    required_error: "Please select a preferred contact method.",
  }),
  message: z.string().min(10, "Your interest/qualifications must be at least 10 characters long."), // Keep validation, user can still write more
});

type FormSchemaType = z.infer<typeof formSchema>;

const inputClass = "bg-neutral-800/40 backdrop-blur-sm border-primary/50 focus:border-accent text-neutral-100 placeholder:text-neutral-400 rounded-lg transition-all duration-300 shadow-sm focus:shadow-glow-accent hover:border-primary/70";
const iconClass = "h-5 w-5 text-primary/80 mr-2 group-focus-within:text-accent transition-colors duration-300";

export function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [formStatus, setFormStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const router = useRouter(); 

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      contactMethod: undefined,
      message: "",
    },
  });

  function onSubmit(values: FormSchemaType) {
    setFormStatus(null);
    startTransition(async () => {
      const result = await submitContactForm(values);
      if (result.success) {
        router.push('/thank-you'); 
      } else {
        setFormStatus({ type: 'error', message: result.error || 'An unexpected error occurred. Please try again.' });
      }
    });
  }

  return (
    <div className="p-6 sm:p-8 md:p-10 bg-neutral-900/50 border border-primary/30 rounded-xl shadow-2xl shadow-primary/20 backdrop-blur-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem className="group">
                <FormLabel className="flex items-center text-neutral-300 text-sm font-medium mb-1">
                  <User className={iconClass} /> Full Name
                </FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Alex Ryder" {...field} className={inputClass} />
                </FormControl>
                <FormMessage className="text-destructive/80" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="group">
                <FormLabel className="flex items-center text-neutral-300 text-sm font-medium mb-1">
                  <Mail className={iconClass} /> Email Address
                </FormLabel>
                <FormControl>
                  <Input type="email" placeholder="e.g. user@example.com" {...field} className={inputClass} />
                </FormControl>
                <FormMessage className="text-destructive/80" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="group">
                <FormLabel className="flex items-center text-neutral-300 text-sm font-medium mb-1">
                  <Phone className={iconClass} /> Phone Number (Optional)
                </FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="e.g. +91 9876543210" {...field} className={inputClass} />
                </FormControl>
                <FormMessage className="text-destructive/80" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="contactMethod"
            render={({ field }) => (
              <FormItem className="group">
                <FormLabel className="flex items-center text-neutral-300 text-sm font-medium mb-1">
                  <MessageCircle className={iconClass} /> Preferred Contact Method
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className={cn(inputClass, "text-neutral-100")}>
                      <SelectValue placeholder="Select a method" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-neutral-800 border-primary/50 text-neutral-100 backdrop-blur-md">
                    {["Email", "Phone", "WhatsApp"].map((method) => (
                      <SelectItem
                        key={method}
                        value={method}
                        className="hover:bg-primary/30 focus:bg-primary/40 transition-colors duration-200"
                      >
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-destructive/80" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="group">
                <FormLabel className="flex items-center text-neutral-300 text-sm font-medium mb-1">
                  <Briefcase className={iconClass} /> {/* Changed icon */}
                   Your Interest / Qualifications
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Briefly state your interest/qualifications..." 
                    {...field}
                    className={cn(inputClass)} // Removed textarea specific classes
                  />
                </FormControl>
                <FormMessage className="text-destructive/80" />
              </FormItem>
            )}
          />

          {formStatus && formStatus.type === 'error' && ( 
            <div
              className={cn(
                "flex items-center p-3 rounded-md text-sm",
                "bg-red-500/20 text-red-300 border border-red-500/30"
              )}
            >
              <AlertTriangle className="h-5 w-5 mr-2" />
              {formStatus.message}
            </div>
          )}

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 
                       shadow-glow-primary hover:shadow-glow-accent
                       focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background
                       transition-all duration-300 ease-in-out transform hover:scale-105 group text-base py-3"
            aria-label="Submit Application"
          >
            {isPending ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <Send className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            )}
            {isPending ? "Submitting..." : "Submit Application"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
