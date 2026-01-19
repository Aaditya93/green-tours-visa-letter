"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { FormSuccess } from "@/components/auth/form-success";
import { FormError } from "@/components/auth/form-error";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { resetPassword } from "@/actions/auth/reset-password";
import { useTranslations } from "next-intl";

const ForgotPasswordCard = () => {
  const t = useTranslations("forgotPasswordPage");
  const [status, setStatus] = React.useState<{
    type: "error" | "success" | "";
    message: string;
  }>({ type: "", message: "" });

  const ResetSchema = z.object({
    email: z
      .string()
      .min(1, { message: t("error1") })
      .email({ message: t("error2") }),
  });

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof ResetSchema>) {
    try {
      const response = await resetPassword(values);

      if (response.success) {
        setStatus({
          type: "success",
          message: response.data,
        });
        form.reset();
      }

      if (response.success === false) {
        setStatus({
          type: "error",
          message: response.error,
        });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: t("errorMessage"),
      });
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("emailLabel")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("emailPlaceholder")}
                  type="text"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {status.type === "success" && <FormSuccess message={status.message} />}
        {status.type === "error" && <FormError message={status.message} />}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? t("sendingButton") : t("sendButton")}
        </Button>
      </form>
    </Form>
  );
};
export default ForgotPasswordCard;
