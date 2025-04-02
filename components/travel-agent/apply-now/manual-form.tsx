"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { addDays } from "date-fns";
import { updateApplicationManualInfoTravelAgent } from "@/actions/agent-platform/apply-visa-letter";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { SerializabledApplication } from "@/config/serialize";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";

interface ManualFormProps {
  id: string;
  Application: SerializabledApplication;
}

const airports = [
  { value: "Noi Bai Airport", label: "Noi Bai Airport ( HAN - Hanoi)" },
  { value: "Phu Bai Airport", label: "Phu Bai Airport ( HUI - Hue city)" },
  {
    value: "Phu Quoc Airport",
    label: "Phu Quoc Airport (PQC - Phu Quoc city)",
  },
  {
    value: "Tan Son Nhat Airport",
    label: "Tan Son Nhat Airport (SGN - Ho Chi Minh city)",
  },
  {
    value: "Cam Ranh Airport",
    label: "Cam Ranh Airport ( CXR - Nha Trang city)",
  },
  { value: "Da Nang Airport", label: "Da Nang Airport (DAD - Da Nang city)" },
  {
    value: "Lien Khuong Airport",
    label: "Lien Khuong Airport (DLI - Da Lat city)",
  },
  { value: "Cat Bi Airport", label: "Cat Bi Airport (HPH - Hai Phong city)" },
];

const parseDate = (dateString: string | undefined): Date | undefined => {
  if (!dateString) return undefined;

  const date = new Date(dateString);

  // Check if date is valid
  if (isNaN(date.getTime())) {
    return undefined;
  }

  return date;
};

export const isAirport = (location: string): boolean => {
  return airports.some((airport) => airport.value === location);
};

const embassies = [
  {
    value: "China - Kunming",
    label: "China - Kunming",
  },
  {
    value: "USA -  Houston",
    label: "USA -  Houston",
  },
  {
    value: "China - Nanning",
    label: "China - Nanning",
  },
  {
    value: "China - Guangzhou",
    label: "China - Guangzhou",
  },
  {
    value: "Cambodia - Sihanouk Ville",
    label: "Cambodia - Sihanouk Ville",
  },
  {
    value: "Australia - Sydney",
    label: "Australia - Sydney",
  },
  {
    value: "China - Shanghai",
    label: "China - Shanghai",
  },
  {
    value: "Taiwan - Taipei",
    label: "Taiwan - Taipei",
  },
  {
    value: "Bangladesh",
    label: "Bangladesh",
  },
  {
    value: "Australia - Canberra",
    label: "Australia - Canberra",
  },
  {
    value: "Japan",
    label: "Japan",
  },
];

const ManualFormTravelAgent = ({ id, Application }: ManualFormProps) => {
  const t = useTranslations("travelAgentApplication.manualForm"); // Get translations for this namespace

  const ManualFormSchema = z
    .object({
      from_date: z.date(),
      to_date: z.date(),
      airport: z.string().optional(),
      embassy: z.string().optional(),
      days: z.number().optional(),
      duration: z.string().min(1, t("visa_type_required")),
    })
    .refine((data) => data.airport || data.embassy, {
      message: t("either_airport_embassy"),
      path: ["airport"],
    })
    .refine((data) => data.airport || data.embassy, {
      message: t("either_airport_embassy"),
      path: ["embassy"],
    })
    .refine(
      (data) => {
        if (!data.from_date || !data.to_date) return true;
        return new Date(data.to_date) >= new Date(data.from_date);
      },
      {
        message: t("to_date_after_from"),
        path: ["to_date"],
      }
    );

  // Rest of your code...
  // ... rest of your component code

  const form = useForm<z.infer<typeof ManualFormSchema>>({
    resolver: zodResolver(ManualFormSchema),
    defaultValues: {
      airport: isAirport(Application?.placeOfIssue)
        ? Application?.placeOfIssue
        : undefined,
      embassy: !isAirport(Application?.placeOfIssue)
        ? Application?.placeOfIssue
        : undefined,

      from_date: parseDate(Application?.entryDetails?.fromDate) ?? new Date(),
      to_date: parseDate(Application?.entryDetails?.toDate) ?? undefined,
    },
  });
  const router = useRouter();
  const [fromDateOpen, setFromDateOpen] = React.useState(false);
  const [toDateOpen, settoDateOpen] = React.useState(false);

  const [selectedLocation, setSelectedLocation] = useState<
    "airport" | "embassy" | null
  >(null);
  const [calltoast, setCallToast] = useState(false);
  useEffect(() => {
    if (calltoast) {
      toast.success(t("toast.success"), {});
    }
  }, [calltoast]);

  const onSubmit = async (values: z.infer<typeof ManualFormSchema>) => {
    try {
      const result = await updateApplicationManualInfoTravelAgent(id, values);
      if (result) {
        setCallToast(true);
        router.push("/travel-agent/application-status/Processing/10");
      } else {
        toast.error("Error while updating application", {});
      }
    } catch (error) {
      console.error("Submission error:", error);
    }
  };
  useEffect(() => {
    const fromDate = form.watch("from_date");
    const currentDays = form.watch("days");

    if (fromDate && typeof currentDays === "number" && currentDays > 0) {
      const newToDate = addDays(fromDate, currentDays);
      form.setValue("to_date", newToDate);
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader className="border-b p-4 sm:p-3 mb-4 bg-primary rounded-t-lg">
            <CardTitle className="text-lg font-semibold text-primary-foreground">
              {t("travel_details")}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 md:grid-cols-2 gap-4 ">
            <div className="flex flex-col space-y-2 ">
              <FormField
                control={form.control}
                name="from_date"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>{t("arrival_date")}</FormLabel>
                      <Popover
                        open={fromDateOpen}
                        onOpenChange={setFromDateOpen}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>{t("pick_date")}</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              if (!date) return;
                              // Save the date in UTC (optional)
                              const utcDate = new Date(
                                Date.UTC(
                                  date.getFullYear(),
                                  date.getMonth(),
                                  date.getDate(),
                                  0,
                                  0,
                                  0,
                                  0
                                )
                              );
                              field.onChange(utcDate);

                              setFromDateOpen(false);
                            }}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="embassy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("embassy")}
                      {field.value && (
                        <Label
                          className="ml-4 text-xs text-red-600"
                          onClick={() => {
                            field.onChange("");
                            setSelectedLocation(null);
                          }}
                        >
                          {t("clear_selection")}
                        </Label>
                      )}
                    </FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedLocation("embassy");
                      }}
                      value={field.value}
                      disabled={selectedLocation === "airport"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("select_embassy")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {embassies.map((embassy) => (
                          <SelectItem key={embassy.value} value={embassy.value}>
                            {embassy.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <FormField
                control={form.control}
                name="to_date"
                render={({ field }) => {
                  const fromDate = form.watch("from_date");

                  return (
                    <FormItem>
                      <FormLabel>{t("departure_date")}</FormLabel>
                      <div className="flex items-center space-x-2">
                        <FormField
                          control={form.control}
                          name="days"
                          render={({ field: daysField }) => (
                            <FormControl>
                              <Input
                                placeholder={t("days")}
                                type="number"
                                className="w-24"
                                {...daysField}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value);
                                  daysField.onChange(value);
                                  if (value > 0 && fromDate) {
                                    const newDate = addDays(fromDate, value);
                                    field.onChange(newDate);
                                  }
                                }}
                              />
                            </FormControl>
                          )}
                        />
                        <Popover open={toDateOpen} onOpenChange={settoDateOpen}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full  text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>{t("pick_date")}</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>

                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(date) => {
                                if (!date) return;
                                // Save the date in UTC (optional)
                                const utcDate = new Date(
                                  Date.UTC(
                                    date.getFullYear(),
                                    date.getMonth(),
                                    date.getDate(),
                                    0,
                                    0,
                                    0,
                                    0
                                  )
                                );
                                field.onChange(utcDate); // Store in UTC
                                settoDateOpen(false);
                              }}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="airport"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("airport")}
                      {field.value && (
                        <Label
                          className="ml-4 text-xs text-red-600"
                          onClick={() => {
                            field.onChange("");
                            setSelectedLocation(null);
                          }}
                        >
                          {t("clear_selection")}
                        </Label>
                      )}
                    </FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedLocation("airport");
                      }}
                      value={field.value}
                      disabled={selectedLocation === "embassy"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("select_airport")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {airports.map((airport) => (
                          <SelectItem key={airport.value} value={airport.value}>
                            {airport.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("type_of_visa")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("select_visa_type")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Single Entry">
                        {t("single_entry")}
                      </SelectItem>
                      <SelectItem value="Multiple Entry">
                        {t("multiple_entry")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="relative"></div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-4">
            <div className="flex justify-between space-x-4 gap-4">
              <Badge variant="secondary" className="text-lg font-semibold">
                {t("total_cost")}: {Application.currency} {Application.cost}
              </Badge>
              {!Application.isCompleted && (
                <Button type="submit">{t("submit_application")}</Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default ManualFormTravelAgent;
