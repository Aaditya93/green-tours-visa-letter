import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Image from "next/image";
import { RegisterForm } from "@/components/auth/register-form";
import RedirectLogin from "@/components/auth/redirect-login";
import { useTranslations } from "next-intl";

const SignUpPage = () => {
  const t = useTranslations("registerPage");
  return (
    <div className="grid lg:grid-cols-2 min-h-screen">
      <div className="relative h-[300px] lg:h-full">
        <Image
          src="/register.jpg"
          alt="register"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-primary-foreground z-10 p-8">
          <h1 className="text-5xl font-bold mb-6 text-white">{t("title")}</h1>
          <p className="text-xl text-center max-w-md mb-8 text-white">
            {t("marketing1")}
          </p>
        </div>
      </div>
      <div className="bg-background">
        <RedirectLogin />
        <div className="flex min-h-screen items-center justify-center py-12 px-6">
          <Card className="w-full max-w-md border-border shadow-lg">
            <CardHeader className="space-y-2">
              <CardTitle className="text-3xl font-bold text-primary text-center">
                {t("title1")}
              </CardTitle>
              <CardDescription className="text-center text-md text-muted-foreground">
                {t("subtitle")}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <RegisterForm />
              <div className="mt-8 pt-4 border-t border-border">
                <p className="text-sm text-center text-muted-foreground">
                  {t("subtitle1")}{" "}
                  <a href="#" className="text-primary hover:underline">
                    {t("subtitle2")}
                  </a>{" "}
                  {t("subtitle3")}{" "}
                  <a href="#" className="text-primary hover:underline">
                    {t("subtitle4")}
                  </a>
                  .
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
