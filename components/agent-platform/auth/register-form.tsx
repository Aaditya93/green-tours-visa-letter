"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { registerTravelAgent } from "@/actions/agent-platform/auth/register-travel-agent";
import { useTransition, useState } from "react";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";
import { useTranslations } from "next-intl";

export const RegisterForm = () => {
  const t = useTranslations("registerTravelAgent");
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const TravelAgentRegisterSchema = z.object({
    name: z.string().min(3, {
      message: t("error1"),
    }),
    company: z.string().min(3, {
      message: t("error2"),
    }),
    address: z.string().min(3, {
      message: t("error3"),
    }),
    phoneNumber: z.string().min(6, {
      message: t("error7"),
    }),
    country: z.string().min(3, {
      message: t("error4"),
    }),
    email: z.string().email({
      message: t("error5"),
    }),
    password: z.string().min(8, {
      message: t("error6"),
    }),
  });

  const onSubmit = async (
    values: z.infer<typeof TravelAgentRegisterSchema>,
  ) => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      try {
        const result = await registerTravelAgent(values);

        if (result.success === false) {
          setError(result.error);
          return;
        }

        setSuccess(result.data);
        form.reset();
      } catch (error) {
        console.error(error);
        setError("Something went wrong!");
      }
    });
  };

  const form = useForm<z.infer<typeof TravelAgentRegisterSchema>>({
    resolver: zodResolver(TravelAgentRegisterSchema),
    defaultValues: {
      name: "",
      company: "",
      address: "",
      phoneNumber: "",
      country: "",
      email: "",
      password: "",
    },
  });

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information Section */}
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-4 ">
              <FormField
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("name")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="name"
                        placeholder="Nora"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("phoneNumber")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="phoneNumer"
                        placeholder="+911234567890"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Company Information Section */}
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-4 mb-2">
              <FormField
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("company")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="company"
                        placeholder="GreenToursVietnam"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="country"
                control={form.control} // Add missing control prop
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("country")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="country"
                        type="text"
                        placeholder="Vietnam"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("address")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="address"
                      type="text"
                      placeholder="7th floor, Viet A Building, so 09 Duy Tan, Cau Giay, Hanoi"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Account Information Section */}
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-4">
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
            </div>
          </div>

          <FormSuccess message={success} />
          <FormError message={error} />

          <Button className="w-full" variant="default" type="submit">
            {t("action1")}
          </Button>
        </form>
      </Form>
    </div>
  );
};
