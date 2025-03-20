"use client";

import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
export const RegisterButton = () => {
  const t = useTranslations("registerPage");
  return (
    <Button className="w-full" variant="default">
      {t("action2")}
    </Button>
  );
};
