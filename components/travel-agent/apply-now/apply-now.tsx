"use client";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import FileUpload from "./upload-passport";

interface PriceEntry {
  speed: string;
  price: number;
}

interface PriceData {
  singleEntry: PriceEntry[];
  multipleEntry: PriceEntry[];
}

interface ApplyNowProps {
  currency: string;
  initialPriceData?: PriceData;
}

const ApplyNow = ({ currency, initialPriceData }: ApplyNowProps) => {
  // Get translations
  const t = useTranslations("applyVisa");

  const [entryType, setEntryType] = useState<keyof PriceData>("singleEntry");
  const [selectedSpeed, setSelectedSpeed] = useState("NO");
  const [travelType, setTravelType] = useState("individual");
  const [upload, setUpload] = useState(false);

  // Create schema with translated validation messages
  const formSchema = z.object({
    groupSize: z
      .number()
      .min(2, t("groupSize.validation.min"))
      .max(20, t("groupSize.validation.max")),
  });

  type FormData = z.infer<typeof formSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      groupSize: 0,
    },
  });

  const groupSize = form.watch("groupSize") || 0;

  const getCurrentPrice = () => {
    if (!initialPriceData) return 0;

    const selectedData = initialPriceData[entryType];
    if (!Array.isArray(selectedData)) return 0;

    const price = selectedData.find((item) => item.speed === selectedSpeed);
    const basePrice = price ? price.price : 0;

    return travelType === "individual" ? basePrice : basePrice * groupSize;
  };

  // Get localized speed labels
  const getSpeedLabel = (speed: string) => {
    return t(`processingSpeed.speeds.${speed}`);
  };

  const handleApply = () => {
    if (travelType === "group") {
      form.trigger("groupSize");
      if (!form.formState.isValid) return;
    }
    setUpload(true);
  };

  return (
    <div className="flex container mx-auto py-8 px-4 items-center justify-center">
      {!upload && (
        <Card className="w-full max-w-md mx-auto shadow-lg border-2 border-primary/10 overflow-hidden">
          <CardHeader className="bg-primary p-6 mb-0">
            <CardTitle className="text-2xl font-bold text-primary-foreground flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              {t("title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="space-y-3">
              <Label className="text-base font-medium">
                {t("travelType.label")}
              </Label>
              <RadioGroup
                value={travelType}
                onValueChange={setTravelType}
                className="flex flex-col sm:flex-row gap-3"
              >
                <div
                  className={`flex items-center border rounded-lg p-3 cursor-pointer transition-all ${
                    travelType === "individual"
                      ? "bg-primary/10 border-primary"
                      : "border-gray-200 hover:border-primary/30"
                  }`}
                >
                  <RadioGroupItem
                    value="individual"
                    id="individual"
                    className="mr-2"
                  />
                  <Label htmlFor="individual" className="cursor-pointer">
                    {t("travelType.individual")}
                  </Label>
                </div>
                <div
                  className={`flex items-center border rounded-lg p-3 cursor-pointer transition-all ${
                    travelType === "group"
                      ? "bg-primary/10 border-primary"
                      : "border-gray-200 hover:border-primary/30"
                  }`}
                >
                  <RadioGroupItem value="group" id="group" className="mr-2" />
                  <Label htmlFor="group" className="cursor-pointer">
                    {t("travelType.group")}
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {travelType === "group" && (
              <Form {...form}>
                <FormField
                  control={form.control}
                  name="groupSize"
                  render={({ field }) => (
                    <FormItem className="animate-fadeIn">
                      <Label className="text-base font-medium">
                        {t("groupSize.label")}
                      </Label>
                      <FormControl>
                        <div className="flex items-center">
                          <Input
                            {...field}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || null;
                              field.onChange(value);
                            }}
                            max="20"
                            min="2"
                            type="number"
                            placeholder={t("groupSize.placeholder")}
                            className="w-full focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Form>
            )}

            <div className="space-y-3">
              <Label className="text-base font-medium">
                {t("visaDuration.label")}
              </Label>
              <RadioGroup
                value={entryType}
                onValueChange={(value) =>
                  setEntryType(value as keyof PriceData)
                }
                className="flex flex-col sm:flex-row gap-3"
              >
                <div
                  className={`flex items-center border rounded-lg p-3 cursor-pointer transition-all ${
                    entryType === "singleEntry"
                      ? "bg-primary/10 border-primary"
                      : "border-gray-200 hover:border-primary/30"
                  }`}
                >
                  <RadioGroupItem
                    value="singleEntry"
                    id="single"
                    className="mr-2"
                  />
                  <Label
                    htmlFor="single"
                    className="cursor-pointer flex flex-col"
                  >
                    <span className="font-medium">
                      {t("visaDuration.singleEntry")}
                    </span>
                  </Label>
                </div>
                <div
                  className={`flex items-center border rounded-lg p-3 cursor-pointer transition-all ${
                    entryType === "multipleEntry"
                      ? "bg-primary/10 border-primary"
                      : "border-gray-200 hover:border-primary/30"
                  }`}
                >
                  <RadioGroupItem
                    value="multipleEntry"
                    id="multiple"
                    className="mr-2"
                  />
                  <Label
                    htmlFor="multiple"
                    className="cursor-pointer flex flex-col"
                  >
                    <span className="font-medium">
                      {t("visaDuration.multipleEntry")}
                    </span>
                    <span className="text-sm text-gray-500"></span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-medium">
                {t("processingSpeed.label")}
              </Label>
              <Select value={selectedSpeed} onValueChange={setSelectedSpeed}>
                <SelectTrigger className="w-full focus:ring-2 focus:ring-primary/20 border-gray-200 h-12">
                  <SelectValue placeholder="Select processing time" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(t.raw("processingSpeed.speeds")).map((speed) => (
                    <SelectItem key={speed} value={speed} className="py-2">
                      {getSpeedLabel(speed)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="pt-6 border-t mt-4">
              <div className="bg-primary/5 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-600 mb-1">
                  {t("payment.totalAmount")}
                </p>
                <div className="text-2xl font-bold text-primary flex items-center">
                  {currency} {getCurrentPrice().toLocaleString()}
                  {travelType === "group" && groupSize > 1 && (
                    <span className="text-sm text-gray-500 ml-2 font-normal">
                      ({currency} {(getCurrentPrice() / groupSize).toFixed(2)}{" "}
                      {t("payment.perPerson")})
                    </span>
                  )}
                </div>
              </div>
              <Button
                onClick={handleApply}
                className="w-full h-12 text-base font-medium transition-all hover:shadow-md"
                disabled={
                  travelType === "group" &&
                  (groupSize < 2 || !form.formState.isValid)
                }
              >
                {t("action.continue")}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      {upload && (
        <FileUpload
          entryType={entryType}
          duration={
            entryType === "singleEntry"
              ? t("visaDuration.singleEntry")
              : t("visaDuration.multipleEntry")
          }
          speed={selectedSpeed}
          currency={currency}
          isGroup={groupSize > 1}
          cost={getCurrentPrice()}
          groupSize={groupSize}
        />
      )}
    </div>
  );
};

export default ApplyNow;
