import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import Image from "next/image";
import { RegisterForm } from "@/components/agent-platform/auth/register-form";
import RedirectLogin from "@/components/auth/redirect-login";
import { ArrowRight, Briefcase } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

const SignUpPage = () => {
  const t = useTranslations("registerTravelAgent");

  return (
    <div className="grid lg:grid-cols-2 min-h-screen">
      <div className="relative hidden lg:block">
        <Image
          src="/travel-agent.jpg"
          alt="Travel agent working"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
        <div className="absolute inset-0 flex flex-col items-start justify-center text-primary-foreground z-10 p-12">
          <div className="max-w-md space-y-6">
            <h1 className="text-5xl font-bold text-white">{t("title")}</h1>
            <p className="text-lg text-white/80">{t("subtitle")}</p>
            <div className="pt-2">
              <div className="flex items-center gap-2 mt-4">
                <ArrowRight className="h-5 w-5 text-primary" />
                <p className="text-white/90"> {t("marketing1")}</p>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <ArrowRight className="h-5 w-5 text-primary" />
                <p className="text-white/90">{t("marketing2")}</p>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <ArrowRight className="h-5 w-5 text-primary" />
                <p className="text-white/90">{t("marketing3")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-b from-background to-secondary/20">
        <RedirectLogin />
        <div className="flex min-h-screen items-center justify-center py-12 px-6 lg:px-10">
          <Card className="w-full max-w-md shadow-xl border-0 overflow-hidden">
            <CardHeader className="space-y-3 pb-4 pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl font-bold text-primary">
                  {t("title1")}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="w-full pt-2">
              <RegisterForm />
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pb-6 pt-2">
              <div className="text-center text-sm text-muted-foreground">
                {t("subtitle1")}{" "}
                <Link
                  href="#"
                  className="font-medium text-primary hover:text-primary/80 underline-offset-4 hover:underline"
                >
                  {t("subtitle2")}
                </Link>{" "}
                {t("subtitle3")}{" "}
                <Link
                  href="#"
                  className="font-medium text-primary hover:text-primary/80 underline-offset-4 hover:underline"
                >
                  {t("subtitle4")}
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
