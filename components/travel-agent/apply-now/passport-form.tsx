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
import { AspectRatio } from "@/components/ui/aspect-ratio";
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
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PassportDetail } from "@/config/serialize";
import { useTranslations } from "next-intl"; // Add this import

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

const PassportFormTravelAgent = ({
  passportId,
  id,
  index,
  noOfVisa,
  passportDetails,
}: PassportFormProps) => {
  const t = useTranslations("travelAgentApplication.passportForm"); // Add translation hook
  const [isChange, setChange] = useState(false);
  const [calltoast, setCallToast] = useState(false);
  useEffect(() => {
    if (calltoast) {
      toast.success(t("passportUpdated"), {});
    }
  }, [calltoast, t]);
  const router = useRouter();

  const form = useForm<z.infer<typeof PassportFormSchema>>({
    resolver: zodResolver(PassportFormSchema),
    defaultValues: {
      full_name: passportDetails.fullName || "",
      sex: passportDetails.sex || "",
      birthday: formatDate(passportDetails.birthday) || "",
      current_nationality: passportDetails.nationalityCurrent || "",
      original_nationality: "",
      passport_type: passportDetails.passportType || "",
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
      passport_type: "",
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
      passport_type: "Ordinary Passport",
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
        toast.error(t("errorUpdating"), {});
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
              {t("passportDetails")}
              {noOfVisa > 1 && (
                <Badge variant="secondary" className="text-sm ml-4">
                  {t("person")} {index + 1}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Dialog>
                <FormLabel className="text-sm">{t("passportPhoto")}</FormLabel>
                <DialogTrigger asChild>
                  <AspectRatio ratio={4 / 3}>
                    <Image
                      src={passportDetails.image}
                      fill
                      className="mt-2 rounded-md border border-gray-200"
                      alt={t("passportDataPage")}
                    />
                  </AspectRatio>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <AspectRatio ratio={16 / 9}>
                    <Image
                      src={passportDetails.image}
                      alt={t("passportEnlarged")}
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
                    <FormLabel>{t("fullName")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("enterFullName")} {...field} />
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
                    <FormLabel>{t("dateOfBirth")}</FormLabel>
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
                              <span>{t("pickDate")}</span>
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
                    <FormLabel>{t("sex")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("selectSex")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">{t("male")}</SelectItem>
                        <SelectItem value="Female">{t("female")}</SelectItem>
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
                    <FormLabel>{t("currentNationality")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("enterCurrentNationality")}
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
                    <FormLabel>{t("originalNationality")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("enterOriginalNationality")}
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
                      <FormLabel>{t("dateOfExpiry")}</FormLabel>
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
                                <span>{t("pickDate")}</span>
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
                    <FormLabel>{t("passportNumber")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("enterPassportNumber")}
                        {...field}
                      />
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
                    <FormLabel>{t("typeOfPassport")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("enterPassportType")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isChange && (
                <div className="flex justify-end mt-6 pt-8">
                  <Button type="submit">{t("saveChanges")}</Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};

export default PassportFormTravelAgent;
