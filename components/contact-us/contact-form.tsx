"use client";
import React from "react";
import { Mail, Phone, Clock, MapPin, PhoneCall } from "lucide-react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
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

    contactUs(values);

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
    <div className="relative">
      {/* Status Badge */}
      <Badge className="absolute -top-2 right-4 bg-primary/10 text-primary hover:bg-primary/20">
        <Clock className="w-3 h-3 mr-1" />
        Available Now
      </Badge>

      <CardHeader className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <PhoneCall className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-card-foreground">
              Need Help With Your Visa?
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Get expert assistance within 2 minutes
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Form Fields with Enhanced Styling */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Full Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your name"
                      className="h-11 bg-accent/50 border-accent-foreground/20 focus:border-primary"
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
                  <FormLabel className="text-left">Email ID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email ID"
                      type="text"
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
                  <FormLabel className="text-left">Mobile Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Mobile Number"
                      type="tel"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Contact Info Card */}
            <div className="bg-card border border-border/50 rounded-lg p-4 space-y-3">
              <h4 className="font-medium text-card-foreground">
                Contact Us Directly
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>support@SwiftVisa.com</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>1800-547-5030</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground md:col-span-2">
                  <MapPin className="h-4 w-4 text-primary" />
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
                className="w-full h-11 text-base font-medium bg-primary hover:bg-primary/90"
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
                className="w-full h-11 text-base font-medium border-2 border-primary/20 hover:border-primary/30 hover:bg-primary/5"
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
    </div>
  );
};

export default CallbackForm;
