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

import { submitContactForm } from "@/actions/contact-us/submit-contact";

import { FormError } from "../auth/form-error";
import { FormSuccess } from "../auth/form-success";
import { useTranslations } from "next-intl";
import { getContactFormSchema } from "@/actions/contact-us/schema";

export const CallbackForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("contactUs");
  const contactFormSchema = getContactFormSchema(t);

  const onSubmit = (values: z.infer<typeof contactFormSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      submitContactForm(values).then((data) => {
        if (data.success) {
          setSuccess(data.message);
        } else {
          setError(data.error);
        }
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
      <CardHeader className="space-y-4 px-6 py-6 bg-primary">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-white/15 flex items-center justify-center shadow-md ring-2 ring-white/20">
            <PhoneCall className="h-7 w-7 text-white" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold text-white">
              {t("title1")}
            </CardTitle>
            <p className="text-sm text-white/80">{t("title2")}</p>
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
                    {t("input1")}
                  </FormLabel>
                  <FormControl>
                    <Input
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
                    {t("input2")}
                  </FormLabel>
                  <FormControl>
                    <Input
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
                    {t("input3")}
                  </FormLabel>
                  <FormControl>
                    <Input
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
                {t("message")}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground hover:text-primary/80 transition-colors">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>support@VISACAR.vn</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground hover:text-primary/80 transition-colors">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>1800-547-5030</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground md:col-span-2 hover:text-primary/80 transition-colors">
                  <Clock className="h-4 w-4 text-primary" />
                  <span> {t("message1")}: 10:00 AM - 7:00 PM (Mon-Sat)</span>
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
                    <span className="animate-spin">⏳</span> {t("loading")}
                  </span>
                ) : (
                  `${t("button1")}`
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full h-11 text-base font-medium border-2 border-[hsl(var(--primary)/0.2)] hover:border-[hsl(var(--primary)/0.3)] hover:bg-[hsl(var(--primary)/0.05)] transition-all"
              >
                <FaWhatsapp className="h-5 w-5 mr-2 text-green-500" />
                <a
                  href="https://api.whatsapp.com/send/?phone=84915549136"
                  className="text-foreground"
                >
                  {t("button2")}
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
