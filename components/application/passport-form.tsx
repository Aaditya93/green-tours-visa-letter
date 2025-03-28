"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { AspectRatio } from "../ui/aspect-ratio";
import { useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { updateApplicationPassportInfo } from "@/actions/application/application";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import Image from "next/image";
import { Dialog, DialogTrigger, DialogContent } from "../ui/dialog";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PassportDetail } from "@/config/serialize";

const formatDate = (dateString: string): Date => {
  return new Date(dateString);
};

export const PassportFormSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  birthday: z.date(),
  sex: z.string().min(1, {
    message: "Please select a gender",
  }),
  passport_type: z.string().min(2, "Passport type is required"),
  current_nationality: z.string().min(2, "Current nationality required"),
  original_nationality: z.string().default(""),
  passport_number: z.string().min(2, "Passport number is required"),
  dateOfExpiry: z.date(),
});
interface PassportFormProps {
  passportId: string;
  id: string;
  index: number;
  noOfVisa: number;
  passportDetails: PassportDetail;
  key: number;
}

const PassportForm = ({
  passportId,
  id,
  index,
  noOfVisa,
  passportDetails,
}: PassportFormProps) => {
  const [isChange, setChange] = useState(false);
  const [calltoast, setCallToast] = useState(false);
  useEffect(() => {
    if (calltoast) {
      toast.success("Passport Details has been updated", {});
    }
  }, [calltoast]);
  const router = useRouter();

  const form = useForm<z.infer<typeof PassportFormSchema>>({
    resolver: zodResolver(PassportFormSchema),
    defaultValues: {
      full_name: passportDetails.fullName || "",
      sex: passportDetails.sex || "",
      birthday: formatDate(passportDetails.birthday) || "",
      current_nationality: passportDetails.nationalityCurrent || "",
      original_nationality: "",
      passport_type: "Ordinary Passport",
      passport_number: passportDetails.passportNumber || "",
      dateOfExpiry: formatDate(passportDetails.dateOfExpiry) || "",
    },
  });

  const hasFormChanged = (
    values: z.infer<typeof PassportFormSchema>,
    defaultValues: Partial<z.infer<typeof PassportFormSchema>>
  ) => {
    const fieldsToCompare = [
      "full_name",
      "sex",
      "current_nationality",
      "original_nationality",
      "passport_type",
      "passport_number",
      "birthday",
      "dateOfExpiry",
    ] as const;

    return fieldsToCompare.some((field) => {
      const currentValue = values[field]?.toString().trim() || "";
      const defaultValue = defaultValues[field]?.toString().trim() || "";

      return currentValue !== defaultValue;
    });
  };
  const change = (values: z.infer<typeof PassportFormSchema>) => {
    const isChanged = hasFormChanged(values, {
      full_name: passportDetails.fullName,
      sex: passportDetails.sex,
      birthday: formatDate(passportDetails.birthday),
      current_nationality: passportDetails.nationalityCurrent,
      original_nationality: "",
      passport_type: "Hộ chiếu phổ thông",
      passport_number: passportDetails.passportNumber,
      dateOfExpiry: formatDate(passportDetails.dateOfExpiry),
    });
    if (isChanged) {
      setChange(true);
    }
  };

  useEffect(() => {
    const subscription = form.watch((formValues) => {
      if (formValues) {
        change(formValues as z.infer<typeof PassportFormSchema>);
      }
    });

    return () => subscription.unsubscribe();
  });

  const onSubmit = async (values: z.infer<typeof PassportFormSchema>) => {
    const isChanged = hasFormChanged(values, {
      full_name: passportDetails.fullName,
      sex: passportDetails.sex,
      birthday: formatDate(passportDetails.birthday),
      current_nationality: passportDetails.nationalityCurrent,
      original_nationality: "",
      passport_type: "Hộ chiếu phổ thông",
      passport_number: passportDetails.passportNumber,
      dateOfExpiry: formatDate(passportDetails.dateOfExpiry),
    });

    if (isChanged) {
      const result = await updateApplicationPassportInfo(
        id,
        passportId,
        values
      );
      if (result) {
        setCallToast(true);
        setChange(false);
      } else {
        toast.error("Error updating passport details", {});
      }
    }
    router.refresh();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader className=" border-b p-4 sm:p-3 mb-4 bg-primary rounded-t-lg">
            <CardTitle className="text-lg text-primary-foreground ">
              Passport Details
              {noOfVisa > 1 && (
                <Badge variant="secondary" className="text-sm ml-4">
                  Person {index + 1}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Dialog>
                <FormLabel className="text-sm">Passport Photo</FormLabel>
                <DialogTrigger asChild>
                  <AspectRatio ratio={4 / 3}>
                    <Image
                      src={passportDetails.image}
                      fill
                      className="mt-2 rounded-md border border-gray-200"
                      alt="Passport Data Page"
                    />
                  </AspectRatio>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <AspectRatio ratio={16 / 9}>
                    <Image
                      src={passportDetails.image}
                      alt="Passport Enlarged"
                      fill
                      className="object-cover w-full h-full rounded-lg"
                    />
                  </AspectRatio>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex flex-col space-y-2">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="birthday"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
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
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sex"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sex</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Sex" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="current_nationality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Nationality</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter current nationality"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <FormField
                control={form.control}
                name="original_nationality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Original Nationality</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter original nationality"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {passportDetails.dateOfExpiry && (
                <FormField
                  control={form.control}
                  name="dateOfExpiry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Expiry</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
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
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="passport_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passport Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter passport number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="passport_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type of Passport</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter passport type" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isChange && (
                <div className="flex justify-end mt-6 pt-8">
                  <Button type="submit">Save Changes</Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};

export default PassportForm;
