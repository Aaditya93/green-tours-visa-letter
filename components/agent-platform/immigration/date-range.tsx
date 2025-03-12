import React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter, usePathname, useParams } from "next/navigation";

interface DatePickerProps {
  className?: string;
  onDateChange?: (fromDate: Date | undefined, toDate: Date | undefined) => void;
}

const DatePickers = ({ className, onDateChange }: DatePickerProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const location = params.location as string;
  const [openFromDatePicker, setOpenFromDatePicker] = React.useState(false);
  const [openToDatePicker, setOpenToDatePicker] = React.useState(false);

  const [fromDate, setFromDate] = React.useState<Date | undefined>(
    new Date(2024, 0, 20)
  );
  const [toDate, setToDate] = React.useState<Date | undefined>(
    new Date(2024, 1, 9)
  );

  const handleFromDateChange = (date: Date | undefined) => {
    setFromDate(date);
    if (date && toDate) {
      updateURL(date, toDate);
    }
    onDateChange?.(date, toDate);
    setOpenFromDatePicker(false);
  };

  const handleToDateChange = (date: Date | undefined) => {
    setToDate(date);
    if (fromDate && date) {
      updateURL(fromDate, date);
    }
    onDateChange?.(fromDate, date);
    setOpenToDatePicker(false);
  };

  const updateURL = (from: Date, to: Date) => {
    const fromStr = format(from, "yyyy-MM-dd");
    const toStr = format(to, "yyyy-MM-dd");
    const newUrl = `/agent-platform/payment/immigration/${location}/from=${fromStr}&to=${toStr}`;
    router.push(newUrl);
  };

  // Load initial dates from pathname
  React.useEffect(() => {
    if (pathname) {
      const matches = pathname.match(/from=([^&]+)&to=([^&]+)/);
      if (matches && matches[1] && matches[2]) {
        setFromDate(new Date(matches[1]));
        setToDate(new Date(matches[2]));
      }
    }
  }, [pathname]);

  return (
    <div className={cn("flex gap-4 bg-primary", className)}>
      {/* From Date Picker */}
      <div className="flex flex-col">
        <Popover
          open={openFromDatePicker}
          onOpenChange={() => setOpenFromDatePicker(true)}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[200px] justify-start text-left font-normal",
                !fromDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {fromDate ? (
                format(fromDate, "LLL dd, y")
              ) : (
                <span>Start date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={fromDate}
              onSelect={handleFromDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* To Date Picker */}
      <div>
        <Popover
          open={openToDatePicker}
          onOpenChange={() => setOpenToDatePicker(true)}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[200px] justify-start text-left font-normal",
                !toDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {toDate ? format(toDate, "LLL dd, y") : <span>End date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={toDate}
              onSelect={handleToDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default DatePickers;
