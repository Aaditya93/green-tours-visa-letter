"use client";
import React, { useState } from "react";
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

const formSchema = z.object({
  groupSize: z
    .number()
    .min(2, "Group size must be at least 2")
    .max(20, "Group size cannot exceed 20"),
});

type FormData = z.infer<typeof formSchema>;

const ApplyNow = ({ currency, initialPriceData }: ApplyNowProps) => {
  const [entryType, setEntryType] = useState<keyof PriceData>("singleEntry");
  const [selectedSpeed, setSelectedSpeed] = useState("NO");
  const [travelType, setTravelType] = useState("individual");
  const [upload, setUpload] = useState(false);

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

  const speedLabels = {
    NO: "Normal",
    "4D": "4 Days",
    "3D": "3 Days",
    "2D": "2 Days",
    "1D": "1 Day",
    "8H": "8 Hours",
    "4H": "4 Hours",
    "2H": "2 Hours",
    "1H": "1 Hour",
  };

  const handleApply = () => {
    if (travelType === "group") {
      form.trigger("groupSize");
      if (!form.formState.isValid) return;
    }
    setUpload(true);
  };

  return (
    <div className="flex container mx-auto px-4 items-center justify-center">
      {!upload && (
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="bg-primary p-4 rounded-t-lg mb-4">
            <CardTitle className="text-xl font-bold text-primary-foreground">
              Visa Letter
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Travel Type</Label>
              <RadioGroup
                value={travelType}
                onValueChange={setTravelType}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="individual" id="individual" />
                  <Label htmlFor="individual">Individual</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="group" id="group" />
                  <Label htmlFor="group">Group</Label>
                </div>
              </RadioGroup>
            </div>

            {travelType === "group" && (
              <Form {...form}>
                <FormField
                  control={form.control}
                  name="groupSize"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Number of People</Label>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || null;
                            field.onChange(value);
                          }}
                          max="20"
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Form>
            )}

            <div className="space-y-2">
              <Label>Duration</Label>
              <RadioGroup
                value={entryType}
                onValueChange={(value) =>
                  setEntryType(value as keyof PriceData)
                }
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="singleEntry" id="single" />
                  <Label htmlFor="single"> 15 Days</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="multipleEntry" id="multiple" />
                  <Label htmlFor="multiple">30 Days</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Processing Speed</Label>
              <Select value={selectedSpeed} onValueChange={setSelectedSpeed}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(speedLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4 border-t">
              <div className="text-lg font-semibold mb-4">
                Total Price: {currency} {getCurrentPrice()}
              </div>
              <Button onClick={handleApply} className="w-full">
                Apply Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      {upload && (
        <FileUpload
          entryType={entryType}
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
