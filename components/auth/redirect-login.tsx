import React from "react";
import { Button } from "@/components/ui/button";
import { CiLogin } from "react-icons/ci";
import Link from "next/link";
import { useTranslations } from "next-intl";
const RedirectLogin = () => {
  const t = useTranslations("registerPage");
  return (
    <div className="absolute top-4 right-4">
      <Button asChild variant="outline" className="text-primary">
        <Link href="/auth/login" className="flex items-center gap-2">
          {" "}
          <CiLogin /> {t("action")}
        </Link>
      </Button>
    </div>
  );
};

export default RedirectLogin;
