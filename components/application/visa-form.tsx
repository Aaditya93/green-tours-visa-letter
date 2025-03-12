"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { AspectRatio } from "../ui/aspect-ratio";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { Dialog, DialogTrigger, DialogContent } from "../ui/dialog";

export const formSchema = z
  .object({
    full_name: z.string().min(2, "Name must be at least 2 characters"),
    birthday: z.date(),
    sex: z.enum(["Nam", "Nữ"]).refine((val) => val !== undefined, {
      message: "Please select a gender",
    }),
    passport_type: z.string().min(2, "Passport type is required"),
    current_nationality: z.string().min(2, "Current nationality required"),
    original_nationality: z.string().optional(),
    passport_number: z.string().min(2, "Passport number is required"),
    from_date: z.date(),
    to_date: z.date(),
    duration: z.enum(["Một lần", "Nhiều lần"]),
    airport: z
      .enum([
        "Hanoi Airport",
        "Ho Chi Minh Airport",
        "Da Nang Airport",
        "Phuquoc Airport",
      ])
      .optional(),
    embassy: z
      .enum([
        "Vietnam embassy in Mumbai",
        "Vietnam embassy in Delhi",
        "Vietnam embassy in Shanghai",
        "Vietnam embassy in Beijing",
        "Vietnam embassy in Guangzhou",
        "Vietnam embassy in Taiwan",
      ])
      .optional(),
    place_to_get_visa: z.string().min(2, "Place to get visa is required"),
    handled_by: z.string().min(2, "Handle by is required"),
    speed: z
      .enum(["4H", "8H", "1D", "2D", "3D", "NO"])
      .refine((val) => val !== undefined, {
        message: "Please select speed",
      }),
    status: z.enum(["Successful", "Cancelled"]),
    note: z.string().optional(),
  })
  .refine((data) => data.airport || data.embassy, {
    message: "Either airport or embassy must be selected",
  })
  .refine((data) => !(data.airport && data.embassy), {
    message: "You can only select either airport or embassy, not both",
  });
const VisaApplicationForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      birthday: undefined,
      sex: undefined,
      current_nationality: "",
      original_nationality: "",
      passport_type: "",
      passport_number: "",
      from_date: undefined,
      to_date: undefined,
      place_to_get_visa: "",
      handled_by: "",
      speed: undefined,
      status: undefined,
      note: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader className=" border-b p-4 sm:p-3 mb-4">
            <CardTitle className="text-lg  ">
              Passport Details
            </CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Dialog>
                <DialogTrigger asChild>

                    
                      <Image
                        src="/passport-data-page-large copy 22.jpg"
                        width={400}
                        height={400}
                        className="mt-10 rounded-md border border-gray-200"
                        alt="Passport Data Page"
                      />



                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <AspectRatio ratio={16/9}>
                    <Image
                      src="/passport-data-page-large copy 22.jpg"
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
                        <SelectItem value="Nam">Nam</SelectItem>
                        <SelectItem value="Nữ">Nữ</SelectItem>
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
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className=" border-b p-4 sm:p-3 mb-4">
            <CardTitle className="text-lg">Manual Information</CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col space-y-2">
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
                        <SelectItem value="Mr Sami">Mr Sami</SelectItem>
                        <SelectItem value="Mr Xiaa">Mr Xiaa</SelectItem>
                        <SelectItem value="Mr Seba">Mr Seba</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="airport"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Airport</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Airport" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Hanoi Airport">
                          Hanoi Airport
                        </SelectItem>
                        <SelectItem value="Ho Chi Minh Airport">
                          Ho Chi Minh Airport
                        </SelectItem>
                        <SelectItem value="Da Nang Airport">
                          Da Nang Airport
                        </SelectItem>
                        <SelectItem value="Phuquoc Airport">
                          Phuquoc Airport
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="embassy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Embassy</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Embassy" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Vietnam embassy in Mumbai">
                          Vietnam embassy in Mumbai
                        </SelectItem>
                        <SelectItem value="Vietnam embassy in Delhi">
                          Vietnam embassy in Delhi
                        </SelectItem>
                        <SelectItem value="Vietnam embassy in Shanghai">
                          Vietnam embassy in Shanghai
                        </SelectItem>
                        <SelectItem value="Vietnam embassy in Beijing">
                          Vietnam embassy in Beijing
                        </SelectItem>
                        <SelectItem value="Vietnam embassy in Guangzhou">
                          Vietnam embassy in Guangzhou
                        </SelectItem>
                        <SelectItem value="Vietnam embassy in Taiwan">
                          Vietnam embassy in Taiwan
                        </SelectItem>
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
                        <SelectItem value="4H">4H</SelectItem>
                        <SelectItem value="8H">8H</SelectItem>
                        <SelectItem value="1D">1D</SelectItem>
                        <SelectItem value="2D">2D</SelectItem>
                        <SelectItem value="3D">3D</SelectItem>
                        <SelectItem value="NO">NO</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Duration" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Một lần">Một lần</SelectItem>
                        <SelectItem value="Nhiều lần">Nhiều lần</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Successful">Successful</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
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
                name="from_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From Date</FormLabel>
                    <Popover>
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
                          onSelect={field.onChange}
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
                name="to_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To Date</FormLabel>
                    <Popover>
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
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

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
          <Button type="submit" variant="outline">
            Save Application
          </Button>
          <Button type="submit">Download Excel</Button>
        </div>
      </form>
    </Form>
  );
};

export default VisaApplicationForm;
