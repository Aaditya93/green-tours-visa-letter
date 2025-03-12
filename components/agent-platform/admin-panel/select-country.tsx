"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
const countries = [
  "Australia",
  "Bangladesh",
  "Canada",
  "China",
  "China (Taiwan)",
  "India",
  "Netherland",
  "Nepal",
  "Egypt",
  "New Zealand",
  "Pakistan",
  "Saint Kitts and Nevis",
  "South Africa",
  "Sri Lanka",
  "Turkey",
  "Turkmenistan",
  "United States",
  "United Kingdom (British Citizen)",
  "Uzbekistan",
  "Vanuatu",
].sort();

const CountrySelect = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedCountry, setSelectedCountry] = useState("India");

  useEffect(() => {
    if (pathname) {
      const matches = pathname.match(/visa-letter-price\/(.+)/);
      if (matches && matches[1]) {
        setSelectedCountry(matches[1]);
      }
    }
  }, [pathname]);

  const onValueChange = (value: string) => {
    router.push(`/agent-platform/visa-letter-price/${value}`);
  };

  return (
    <div className="space-y-2 bg-primary-foreground rounded-lg">
      <Select onValueChange={onValueChange} value={selectedCountry}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a country" />
        </SelectTrigger>
        <SelectContent>
          {countries.map((country) => (
            <SelectItem key={country} value={country}>
              {country}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CountrySelect;
