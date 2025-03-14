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

const StatusSelect = () => {
  const router = useRouter();
  const handleStatusChange = (value: string) => {
    router.push(`/travel-agent/application-status/${value}/10`);
  };

  return (
    <Select onValueChange={handleStatusChange}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Incomplete">Incomplete</SelectItem>
        <SelectItem value="Processing">Processing</SelectItem>
        <SelectItem value="Complete">Complete</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default StatusSelect;
