"use client";

import React from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { SelectTrigger } from "@radix-ui/react-select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";
import { updateImmigrationPrices } from "@/actions/agent-platform/immigration-cost";
import { Badge } from "@/components/ui/badge";
import { convertToVietnamTime } from "./immigration-card";

// Form Schema
const priceSchema = z.object({
  speed: z.string(),
  price: z.number(),
});

const formSchema = z.object({
  currency: z.string(),
  prices: z.object({
    days15: z.array(priceSchema),
    days30: z.array(priceSchema),
  }),
});

type FormData = z.infer<typeof formSchema>;

// Constants
const COUNTRY_CURRENCY = {
  "United States": "USD",
  Vietnam: "VND",
  Australia: "AUD",
  Bangladesh: "BDT",
  Canada: "CAD",
  China: "CNY",
  "China (Taiwan)": "TWD",
  India: "INR",
  Netherland: "EUR",
  Nepal: "NPR",
  Egypt: "EGP",
  "New Zealand": "NZD",
  Pakistan: "PKR",
  "Saint Kitts and Nevis": "XCD",
  "South Africa": "ZAR",
  "Sri Lanka": "LKR",
  Turkey: "TRY",
  Turkmenistan: "TMT",

  "United Kingdom (British Citizen)": "GBP",
  Uzbekistan: "UZS",
  Vanuatu: "VUV",
};

const speeds = ["NO", "4D", "3D", "2D", "1D", "8H", "4H", "2H", "1H"];

interface ImmigrationPriceFormProps {
  _id: string;
  name: string;
  visaLetterPrices?: Array<{
    currency: string;
    prices: {
      days15: Array<{ speed: string; price: number }>;
      days30: Array<{ speed: string; price: number }>;
    };
    _id: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

const ImmigrationPriceForm = ({
  _id,
  name,
  visaLetterPrices,
  updatedAt,
}: ImmigrationPriceFormProps) => {
  const router = useRouter();
  const lastPrices = visaLetterPrices?.[0];

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currency: lastPrices?.currency || "USD",
      prices: lastPrices?.prices || {
        days15: speeds.map((speed) => ({ speed, price: 0 })),
        days30: speeds.map((speed) => ({ speed, price: 0 })),
      },
    },
  });

  const handleSubmit = async (formData: FormData) => {
    try {
      const result = await updateImmigrationPrices(_id, formData);
      toast.success("Prices updated successfully");
      if (result) {
        router.push("/agent-platform/immigration-price/10");
      } else {
        toast.error("Failed to update prices");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Failed to submit form.");
    }
  };

  const renderPriceInputs = (dayType: "days15" | "days30") => (
    <div className="space-y-4">
      {speeds.map((speed, index) => (
        <FormField
          key={`${dayType}.${index}`}
          control={form.control}
          name={`prices.${dayType}.${index}.price`}
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-4">
                <FormLabel className="w-12">{speed}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || 0)
                    }
                    placeholder="Enter price"
                    className="w-full"
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
    </div>
  );

  return (
    <>
      <Toaster toastOptions={{ duration: 2000, className: "my-toast" }} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <Card className="w-full">
            <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between border-b mb-4 py-4 bg-primary rounded-t-lg space-y-4 md:space-y-0 md:space-x-6">
              <div className="flex flex-col space-y-2 ">
                <CardTitle className="text-lg font-semibold ml-4 text-primary-foreground flex items-center space-x-4">
                  <span>{name}</span>
                  <Badge variant={"secondary"} className="text-primary">
                    Last Updated: {convertToVietnamTime(updatedAt)}
                  </Badge>
                </CardTitle>
              </div>
              <Select
                defaultValue={visaLetterPrices?.[0]?.currency ?? "USD"}
                onValueChange={(value) => form.setValue("currency", value)}
              >
                <SelectTrigger className="w-[200px] bg-primary-foreground rounded-lg border border-gray-300">
                  <SelectValue placeholder="Select Currency" />
                </SelectTrigger>
                <SelectContent className="rounded-lg">
                  {Object.entries(COUNTRY_CURRENCY).map(
                    ([country, currency]) => (
                      <SelectItem key={country} value={currency}>
                        {country} ({currency})
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Label className="text-lg font-semibold block pb-2 border-b">
                    15 Days
                  </Label>
                  {renderPriceInputs("days15")}
                </div>
                <div className="space-y-4">
                  <Label className="text-lg font-semibold block pb-2 border-b">
                    30 Days
                  </Label>
                  {renderPriceInputs("days30")}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex justify-end w-full">
                <Button type="submit">Save Changes</Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </>
  );
};

export default ImmigrationPriceForm;
