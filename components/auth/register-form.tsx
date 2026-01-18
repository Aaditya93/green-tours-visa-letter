"use client";
import { Input } from "@/components/ui/input";
import { RegisterButton } from "@/components/auth/register-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { register } from "@/actions/auth/register";
import { useTransition, useState } from "react";
import { FormError } from "./form-error";
import { FormSuccess } from "./form-success";
import { useTranslations } from "next-intl";

export const RegisterForm = () => {
  const t = useTranslations("registerPage");
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const RegisterSchema = z.object({
    name: z.string().min(3, {
      message: t("error1"),
    }),
    email: z.string().email({
      message: t("error2"),
    }),
    password: z.string().min(8, {
      message: t("error3"),
    }),
  });
  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      register(values).then((data) => {
        if (data.success) {
          setSuccess(data.message);
        } else {
          setError(data.error);
        }
      });
    });
  };

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <FormField
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("name")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="name"
                      placeholder="John Doe"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("email")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="email"
                      type="text"
                      placeholder="name@example.com"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("password")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="password"
                      type="password"
                      placeholder="********"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormSuccess message={success} />
            <FormError message={error} />

            <RegisterButton />
          </div>
        </form>
      </Form>
    </div>
  );
};
