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
import { updateVisaPrices } from "@/actions/agent-platform/visa-letter";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";

interface PriceData {
  _id: string;
  name: string;
  visaLetterPrices: Array<{
    currency: string;
    prices: {
      singleEntry: Array<{ speed: string; price: number }>;
      multipleEntry: Array<{ speed: string; price: number }>;
    };
  }>;
}

interface PriceFormProps {
  priceData: PriceData & { id?: string };
}

type FormData = z.infer<typeof formSchema>;

const priceSchema = z.object({
  speed: z.string(),
  price: z.number(),
});

const formSchema = z.object({
  Prices: z.object({
    singleEntry: z.array(priceSchema),
    multipleEntry: z.array(priceSchema),
  }),
  currency: z.string(),
});

const COUNTRY_CURRENCY = {
  Australia: "AUD",
  Bangladesh: "BDT",
  Canada: "CAD",
  China: "CNY",
  Vietnam: "VND",
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
  "United States": "USD",
  "United Kingdom (British Citizen)": "GBP",
  Uzbekistan: "UZS",
  Vanuatu: "VUV",
};

const PriceForm = ({ priceData }: PriceFormProps) => {
  const speeds = ["NO", "4D", "3D", "2D", "1D", "8H", "4H", "2H", "1H"];
  const defaultPrices = priceData.visaLetterPrices?.[0] || {};
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Prices: {
        singleEntry:
          defaultPrices.prices?.singleEntry ||
          speeds.map((speed) => ({ speed, price: 0 })),
        multipleEntry:
          defaultPrices.prices?.multipleEntry ||
          speeds.map((speed) => ({ speed, price: 0 })),
      },
      currency: defaultPrices.currency || "USD",
    },
  });

  const handleSubmit = async (formData: FormData) => {
    try {
      const result = await updateVisaPrices({
        _id: priceData._id,
        ...formData,
      });
      toast.success("Prices updated successfully");
      if (result) {
        router.push("/agent-platform/visa-letter-price/10");
      } else {
        toast.error("Failed to update prices");
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };
  const renderPriceInputs = (entryType: "singleEntry" | "multipleEntry") => (
    <div className="space-y-4">
      {speeds.map((speed, index) => (
        <FormField
          key={`Prices.${entryType}.${index}`}
          control={form.control}
          name={`Prices.${entryType}.${index}.price`}
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
      <Toaster
        toastOptions={{
          duration: 2000,
          className: "my-toast",
        }}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between border-b mb-2 py-3 bg-primary rounded-t-lg">
              <CardTitle className="text-md text-primary-foreground">
                Visa Letter Prices - {priceData.name}
              </CardTitle>
              <div className="rounded-lg">
                <Select
                  defaultValue={defaultPrices.currency || "USD"}
                  onValueChange={(value) => form.setValue("currency", value)}
                >
                  <SelectTrigger className="w-[180px] bg-primary-foreground rounded-lg">
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
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Label className="text-lg font-semibold block pb-2 border-b">
                    15 Days
                  </Label>
                  {renderPriceInputs("singleEntry")}
                </div>
                <div className="space-y-4">
                  <Label className="text-lg font-semibold block pb-2 border-b">
                    30 Days
                  </Label>
                  {renderPriceInputs("multipleEntry")}
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

export default PriceForm;
