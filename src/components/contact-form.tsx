"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { User, Mail, Phone, MapPin, School, Scale, Award, Send, AlertTriangle } from "lucide-react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { submitContactForm } from "@/app/contact/actions";
import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  age: z.string().min(1, "Age is required."),
  belt: z.enum(["White", "Yellow", "Green", "Blue", "Red", "Black"], {
    required_error: "Please select your belt rank.",
  }),
  gender: z.enum(["Male", "Female", "Other"], {
    required_error: "Please select your gender.",
  }),
  weight: z.string().min(1, "Weight is required."),
  phone: z.string().min(10, "Phone number must be at least 10 digits."),
  address: z.string().min(10, "Address must be at least 10 characters."),
  email: z.string().email("Invalid email address."),
  schoolClub: z.string().min(2, "School/Club name must be at least 2 characters."),
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
      age: "",
      belt: undefined,
      gender: undefined,
      weight: "",
      phone: "",
      address: "",
      email: "",
      schoolClub: "",
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem className="group">
                <FormLabel className="flex items-center text-neutral-300 text-sm font-medium mb-1">
                  <User className={iconClass} /> Full Name *
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter your full name" {...field} className={inputClass} />
                </FormControl>
                <FormMessage className="text-destructive/80" />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem className="group">
                  <FormLabel className="flex items-center text-neutral-300 text-sm font-medium mb-1">
                    <User className={iconClass} /> Age *
                  </FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter your age" {...field} className={inputClass} />
                  </FormControl>
                  <FormMessage className="text-destructive/80" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="group">
                  <FormLabel className="flex items-center text-neutral-300 text-sm font-medium mb-1">
                    <User className={iconClass} /> Gender *
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      {["Male", "Female", "Other"].map((gender) => (
                        <FormItem key={gender} className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value={gender} className="text-primary" />
                          </FormControl>
                          <FormLabel className="text-neutral-300">{gender}</FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage className="text-destructive/80" />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="belt"
              render={({ field }) => (
                <FormItem className="group">
                  <FormLabel className="flex items-center text-neutral-300 text-sm font-medium mb-1">
                    <Award className={iconClass} /> Belt Rank *
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className={cn(inputClass, "text-neutral-100")}>
                        <SelectValue placeholder="Select your belt rank" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-neutral-800 border-primary/50 text-neutral-100 backdrop-blur-md">
                      {["White", "Yellow", "Green", "Blue", "Red", "Black"].map((belt) => (
                        <SelectItem
                          key={belt}
                          value={belt}
                          className="hover:bg-primary/30 focus:bg-primary/40 transition-colors duration-200"
                        >
                          {belt}
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
              name="weight"
              render={({ field }) => (
                <FormItem className="group">
                  <FormLabel className="flex items-center text-neutral-300 text-sm font-medium mb-1">
                    <Scale className={iconClass} /> Weight (kg) *
                  </FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter your weight" {...field} className={inputClass} />
                  </FormControl>
                  <FormMessage className="text-destructive/80" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="group">
                <FormLabel className="flex items-center text-neutral-300 text-sm font-medium mb-1">
                  <Phone className={iconClass} /> Phone Number *
                </FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="Enter your phone number" {...field} className={inputClass} />
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
                  <Mail className={iconClass} /> Email Address *
                </FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter your email address" {...field} className={inputClass} />
                </FormControl>
                <FormMessage className="text-destructive/80" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="group">
                <FormLabel className="flex items-center text-neutral-300 text-sm font-medium mb-1">
                  <MapPin className={iconClass} /> Address *
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter your full address" {...field} className={inputClass} />
                </FormControl>
                <FormMessage className="text-destructive/80" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="schoolClub"
            render={({ field }) => (
              <FormItem className="group">
                <FormLabel className="flex items-center text-neutral-300 text-sm font-medium mb-1">
                  <School className={iconClass} /> School/Club *
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter your school or club name" {...field} className={inputClass} />
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
            aria-label="Submit Registration"
          >
            {isPending ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <Send className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            )}
            {isPending ? "Submitting..." : "Submit Registration"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
