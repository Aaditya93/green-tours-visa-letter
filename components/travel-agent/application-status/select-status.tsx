"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const StatusSelect = () => {
  const t = useTranslations("travelAgentApplicationStatus.applicationStatus");
  const router = useRouter();
  const handleStatusChange = (value: string) => {
    router.push(`/travel-agent/application-status/${value}/10`);
  };

  return (
    <Select onValueChange={handleStatusChange}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder={t("selectStatus")} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Incomplete">{t("incomplete")}</SelectItem>
        <SelectItem value="Processing">{t("processing")}</SelectItem>
        <SelectItem value="Complete">{t("complete")}</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default StatusSelect;
