"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building } from "lucide-react";

interface Company {
  name: string;
  id: string;
}

interface SelectCompanyProps {
  companies: Company[];
  defaultCompanyId?: string;
  visaRequestCount?: number;
}

const SelectCompany = ({
  companies,
  defaultCompanyId,
  visaRequestCount = 10,
}: SelectCompanyProps) => {
  const router = useRouter();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(
    companies.length > 0 ? companies[0].id : ""
  );

  // Navigate to the company visa letter page when selection changes
  const handleCompanyChange = (value: string) => {
    setSelectedCompanyId(value);
    router.push(
      `/agent-platform/company-visa-letter/${value}/${visaRequestCount}`
    );
  };

  // If we only have one company, auto-select it
  useEffect(() => {
    if (companies.length === 1 && !defaultCompanyId) {
      setSelectedCompanyId(companies[0].id);
    }
  }, [companies, defaultCompanyId]);

  if (companies.length === 0) {
    return null;
  }

  return (
    <div className="ml-4 inline-flex items-center">
      <div className=" pl-4 ml-2">
        <Select value={selectedCompanyId} onValueChange={handleCompanyChange}>
          <SelectTrigger className="w-[150px] h-7  items-center border-0 text-primary bg-background text-sm font-normal">
            <SelectValue placeholder="Select company" />
          </SelectTrigger>
          <SelectContent>
            {companies.map((company) => (
              <SelectItem key={company.id} value={company.id}>
                {company.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SelectCompany;
