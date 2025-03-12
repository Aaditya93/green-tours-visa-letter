"use client";
import React from "react";
import {
  Mail,
  Phone,
  Clock,
  MapPin,
  PhoneCall,
  User,
  AtSign,
} from "lucide-react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { CardContent, CardHeader, CardTitle, Card } from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { FaWhatsapp } from "react-icons/fa6";
import { useState } from "react";
import { useTransition } from "react";

import { contactUs } from "@/actions/contact-us/contact-us";

import { FormError } from "../auth/form-error";
import { FormSuccess } from "../auth/form-success";
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  mobile: z
    .string()
    .min(10, { message: "Please enter a valid mobile number." }),
});
export const CallbackForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const onSubmit = (values: z.infer<typeof contactFormSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      contactUs(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
      });
    });
  };

  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
    },
  });

  return (
    <Card className="relative shadow-md border-[hsl(var(--border))] overflow-hidden">
      <CardHeader className="space-y-4 px-6 py-6 bg-gradient-to-br from-primary/30 via-primary/15 to-accent/10 text-foreground border-b border-primary/10 relative before:absolute before:inset-0 before:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIgMCAyLjEuOSAyLjEgMi4xdjE5LjhjMCAxLjItLjkgMi4xLTIuMSAyLjFIMjRjLTEuMiAwLTIuMS0uOS0yLjEtMi4xVjIwLjFjMC0xLjIuOS0yLjEgMi4xLTIuMWgxMnpNMTggMzZjMS4yIDAgMi4xLjkgMi4xIDIuMXYxOS44YzAgMS4yLS45IDIuMS0yLjEgMi4xSDZjLTEuMiAwLTIuMS0uOS0yLjEtMi4xVjM4LjFjMC0xLjIuOS0yLjEgMi4xLTIuMWgxMnptMzYtMThjMS4yIDAgMi4xLjkgMi4xIDIuMXYxOS44YzAgMS4yLS45IDIuMS0yLjEgMi4xSDQyYy0xLjIgMC0yLjEtLjktMi4xLTIuMVYyMC4xYzAtMS4yLjktMi4xIDIuMS0yLjFoMTJ6IiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLW9wYWNpdHk9Ii4xNSIvPjwvZz48L3N2Zz4=')] before:opacity-10 before:pointer-events-none">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center shadow-md ring-2 ring-primary/10">
            <PhoneCall className="h-7 w-7 text-primary" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold text-card-foreground">
              Need Help With Your Vietnam Visa Letter?
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Get expert assistance within 2 minutes
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 mt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Form Fields with Enhanced Styling */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    Full Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your name"
                      className="h-11 bg-[hsl(var(--accent)/0.5)] border-[hsl(var(--accent-foreground)/0.2)] focus:border-[hsl(var(--primary))]"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-left flex items-center gap-2">
                    <AtSign className="h-4 w-4 text-primary" />
                    Email ID
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email ID"
                      type="text"
                      className="h-11 bg-[hsl(var(--accent)/0.5)] border-[hsl(var(--accent-foreground)/0.2)] focus:border-[hsl(var(--primary))]"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-left flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    Mobile Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Mobile Number"
                      type="tel"
                      className="h-11 bg-[hsl(var(--accent)/0.5)] border-[hsl(var(--accent-foreground)/0.2)] focus:border-[hsl(var(--primary))]"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Contact Info Card */}
            <div className="bg-card border border-border/50 rounded-lg p-4 space-y-3 shadow-sm">
              <h4 className="font-medium text-card-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Contact Us Directly
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground hover:text-primary/80 transition-colors">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>support@SwiftVisa.com</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground hover:text-primary/80 transition-colors">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>1800-547-5030</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground md:col-span-2 hover:text-primary/80 transition-colors">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>Operating Hours: 10:00 AM - 7:00 PM (Mon-Sat)</span>
                </div>
              </div>
            </div>

            <FormSuccess message={success} />
            <FormError message={error} />

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <Button
                type="submit"
                className="w-full h-11 text-base font-medium bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.9)] shadow-sm transition-all hover:shadow-md"
                disabled={isPending}
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span> Processing...
                  </span>
                ) : (
                  "Get Expert Callback"
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full h-11 text-base font-medium border-2 border-[hsl(var(--primary)/0.2)] hover:border-[hsl(var(--primary)/0.3)] hover:bg-[hsl(var(--primary)/0.05)] transition-all"
              >
                <FaWhatsapp className="h-5 w-5 mr-2 text-green-500" />
                <a
                  href="https://api.whatsapp.com/send/?phone=918103690599"
                  className="text-foreground"
                >
                  Chat on WhatsApp
                </a>
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CallbackForm;
