"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { convertToApplicationsClient } from "@/lib/data-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { addDays, differenceInDays } from "date-fns";
import { downloadFile } from "@/lib/data-client";
import { updateApplicationManualInfo } from "@/actions/application/application";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Label } from "../ui/label";
import { format } from "date-fns";
import { Input } from "../ui/input";
import { PassportDetail, SerializabledApplication } from "@/config/serialize";

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

export const embassies = [
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
const handlers = [
  { label: "MR.Xia", value: "MR.Xia" },
  { label: "MR.SAMI ", value: "MR.SAMI" },
  { label: "JESSY", value: "JESSY" },
  { label: "TONY", value: "TONY" },
  { label: "MR.SUMMER", value: "MR.SUMMER" },
  { label: "C.HUONG", value: "C.HUONG" },
  { label: "ANH THANG", value: "ANH THANG" },
  { label: "C.YEN", value: "C.YEN" },
  { label: "YUEHUA", value: "YUEHUA" },
  { label: "KHACH LE", value: "KHACH LE" },
  { label: "TOP", value: "TOP" },
  { label: "YES", value: "YES" },
  { label: "STT", value: "STT" },
  { label: "YUN YANG", value: "YUN YANG" },
  { label: "DAI NAM", value: "DAI NAM" },
  { label: "BOB", value: "BOB" },
];
const ManualForm = ({ id, Application }: ManualFormProps) => {
  const ManualFormSchema = z
    .object({
      from_date: z.date(),
      to_date: z.date(),
      duration: z.string(),
      airport: z.string().optional(),
      embassy: z.string().optional(),
      handled_by: z.string().min(2, "Handle by is required"),
      speed: z
        .enum(["1H", "2H", "4H", "8H", "1D", "2D", "3D", "4D", "NO"])
        .refine((val) => val !== undefined, {
          message: "Please select speed",
        }),
      note: z.string().optional(),
      result: z.date(),
      days: z.number().optional(),
      day: z.number().optional(),
      stage: z.string(),
    })
    .refine((data) => data.airport || data.embassy, {
      message: "Either airport or embassy must be selected",
      path: ["airport"],
    })
    .refine((data) => data.airport || data.embassy, {
      message: "Either airport or embassy must be selected",
      path: ["embassy"],
    })
    .refine(
      (data) => {
        if (!data.from_date || !data.to_date) return true;
        return new Date(data.to_date) >= new Date(data.from_date);
      },
      {
        message: "To date must be greater than or equal to from date",
        path: ["to_date"],
      }
    )
    .refine(
      (data) => {
        if (!Application.passportDetails[0].dateOfExpiry) {
          return true;
        }
        const isPassportsValid = (
          passportDetails: PassportDetail[],
          fromDate: Date
        ): boolean => {
          return passportDetails.every((passport) => {
            if (!passport.dateOfExpiry) return false;

            const expiryDate = parseDate(passport.dateOfExpiry);
            if (!expiryDate) return false;

            const difference = differenceInDays(expiryDate, fromDate);

            return difference >= 180; // 6 months validity check
          });
        };
        const arePassportsValid = isPassportsValid(
          Application.passportDetails,
          data.from_date
        );

        return arePassportsValid;
      },
      {
        message:
          "The passport must be valid for at least 6 months from the date of entry into Vietnam",
        path: ["from_date"],
      }
    );

  const form = useForm<z.infer<typeof ManualFormSchema>>({
    resolver: zodResolver(ManualFormSchema),
    defaultValues: {
      handled_by: Application?.creator?.handleBy ?? undefined,
      airport: isAirport(Application?.placeOfIssue)
        ? Application?.placeOfIssue
        : undefined,
      embassy: !isAirport(Application?.placeOfIssue)
        ? Application?.placeOfIssue
        : undefined,
      speed:
        (Application?.processingInfo?.speed as
          | "1H"
          | "2H"
          | "4H"
          | "8H"
          | "1D"
          | "2D"
          | "3D"
          | "4D"
          | "NO") ?? "NO",
      duration: Application?.duration,

      from_date: parseDate(Application?.entryDetails?.fromDate) ?? new Date(),
      to_date: parseDate(Application?.entryDetails?.toDate) ?? undefined,
      result: parseDate(Application?.result) ?? undefined,
      note: Application?.processingInfo?.notes ?? undefined,
      stage: Application.passportDetails[0].stage ?? undefined,
    },
  });
  const router = useRouter();
  const [fromDateOpen, setFromDateOpen] = React.useState(false);
  const [toDateOpen, settoDateOpen] = React.useState(false);
  const [result, setResult] = React.useState(false);

  const [selectedLocation, setSelectedLocation] = useState<
    "airport" | "embassy" | null
  >(null);
  const [calltoast, setCallToast] = useState(false);
  useEffect(() => {
    if (calltoast) {
      toast.success("Visa Application Form is Complete", {});
    }
  }, [calltoast]);

  const onSubmit = async (values: z.infer<typeof ManualFormSchema>) => {
    try {
      const result = await updateApplicationManualInfo(id, values);
      if (result) {
        setCallToast(true);
        router.push("/dashboard");
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
    const day = form.watch("day");

    if (fromDate && typeof currentDays === "number" && currentDays > 0) {
      const newToDate = addDays(fromDate, currentDays);
      form.setValue("to_date", newToDate);
    }
    if (fromDate && typeof day === "number" && day === 0) {
      form.setValue("result", fromDate);
    }
    if (fromDate && typeof day === "number" && day > 0) {
      const newToDate = addDays(fromDate, day);
      form.setValue("result", newToDate);
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader className=" border-b p-4 sm:p-3 mb-4 bg-primary rounded-t-lg">
            <CardTitle className="text-lg text-primary-foreground">
              Manual Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col space-y-2">
              <FormField
                control={form.control}
                name="from_date"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Arrival Date</FormLabel>
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
                                <span>Pick a date</span>
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
                      Embassy
                      {field.value && (
                        <Label
                          className="ml-4 text-xs text-red-600"
                          onClick={() => {
                            field.onChange("");
                            setSelectedLocation(null);
                          }}
                        >
                          Clear Selection
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
                          <SelectValue placeholder="Select Embassy" />
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

              <FormField
                control={form.control}
                name="handled_by"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Handled By</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Handled By" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {handlers.map((handler) => (
                          <SelectItem key={handler.value} value={handler.value}>
                            {handler.label}
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
                      <FormLabel>Departure Date</FormLabel>
                      <div className="flex items-center space-x-2">
                        <FormField
                          control={form.control}
                          name="days"
                          render={({ field: daysField }) => (
                            <FormControl>
                              <Input
                                placeholder="Days"
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
                                  <span>Pick a date</span>
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
                      Airport
                      {field.value && (
                        <Label
                          className="ml-4 text-xs text-red-600"
                          onClick={() => {
                            field.onChange("");
                            setSelectedLocation(null);
                          }}
                        >
                          Clear Selection
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
                          <SelectValue placeholder="Select Airport" />
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
              <FormField
                control={form.control}
                name="result"
                render={({ field }) => {
                  const fromDate = form.watch("from_date");
                  return (
                    <FormItem>
                      <FormLabel>Result</FormLabel>
                      <div className="flex items-center space-x-2">
                        <FormField
                          control={form.control}
                          name="day"
                          render={({ field: daysField }) => (
                            <FormControl>
                              <Input
                                placeholder="Days"
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
                        <Popover open={result} onOpenChange={setResult}>
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
                                  <span>Pick a date</span>
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
                                setResult(false);
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
            </div>

            <div className="flex flex-col space-y-2">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type of Visa</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Visa Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Single Entry">
                          Single Entry
                        </SelectItem>
                        <SelectItem value="Multiple Entry">
                          Multiple Entry
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="speed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Speed</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Speed" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1H">1H</SelectItem>
                        <SelectItem value="2H">2H</SelectItem>
                        <SelectItem value="4H">4H</SelectItem>
                        <SelectItem value="8H">8H</SelectItem>
                        <SelectItem value="1D">1D</SelectItem>
                        <SelectItem value="2D">2D</SelectItem>
                        <SelectItem value="3D">3D</SelectItem>
                        <SelectItem value="4D">4D</SelectItem>
                        <SelectItem value="NO">NO</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stage</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Stage" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Not Processed">
                          Not Processed
                        </SelectItem>
                        <SelectItem value="Processing">Processing</SelectItem>
                        <SelectItem value="Processed">Processed</SelectItem>
                        <SelectItem value="Blacklist">Blacklist</SelectItem>
                        <SelectItem value="Overstayed">Overstayed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem className="col-span-3">
                  <FormLabel>Note</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter any additional notes"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <div className="flex justify-end space-x-4">
          <Button type="submit">Save Application</Button>

          {Application.isCompleted && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <span className="sr-only">Open menu</span>
                  Download
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    const data = convertToApplicationsClient([Application]);
                    downloadFile("xlsx", data);
                  }}
                >
                  Download .xlsx
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    const data = convertToApplicationsClient([Application]);
                    downloadFile("pdf", data);
                  }}
                >
                  Download Pdf
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    const data = convertToApplicationsClient([Application]);
                    downloadFile("csv", data);
                  }}
                >
                  Download .csv
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </form>
    </Form>
  );
};

export default ManualForm;
