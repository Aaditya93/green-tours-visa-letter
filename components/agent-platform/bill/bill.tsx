"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, Check, UserCheck, Printer } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { Avatar } from "@/components/ui/avatar";
import { markBillAsPaid } from "@/actions/bill/create-bill";

interface BillDetailProps {
  billId: string;
  bill: {
    _id: string;
    companyId: string;
    companyName: string;
    applicationIds: string[];
    amount: number;
    currency: string;
    payment: boolean;
    paymentDate?: Date;
    createdDate: Date;
    companyAddress: string;
    companyEmail: string;
  };
  applications: any[];
}

export default function BillDetail({
  billId,
  bill,
  applications,
}: BillDetailProps) {
  const [isPaid, setIsPaid] = useState(bill.payment);
  const [isLoading, setIsLoading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const router = useRouter();

  const handleMarkAsPaid = async () => {
    setIsLoading(true);
    try {
      await markBillAsPaid(bill._id);

      setIsPaid(true);
      toast.success("Bill marked as paid successfully");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to mark bill as paid");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 300);
  };

  const formattedDate = format(new Date(bill.createdDate), "MMMM d, yyyy");
  const invoiceNumber = `INV-${billId.substring(0, 8).toUpperCase()}`;

  return (
    <div className="container mx-auto  print:py-2 max-w-6xl">
      <div className="flex flex-col gap-6 print:gap-4 border border-border rounded-lg p-6 shadow-sm">
        {/* Header with invoice info */}
        <div className="text-bg-primary p-6 rounded-lg print:bg-none print:border">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold">Invoice</h1>
              <p className="text-sm mt-1 text-bg-primary">{invoiceNumber}</p>
            </div>
            <div className="text-right">
              <Badge
                variant={isPaid ? "secondary" : "destructive"}
                className=" py-1 px-3 text-xl"
              >
                {isPaid ? "PAID" : "UNPAID"}
              </Badge>
              <p className="text-sm mt-2 text-bg-primary">
                Date: {formattedDate}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium uppercase mb-1 text-bg-primary">
                From
              </p>
              <h3 className="font-bold">VISACAR Visa Letter Services</h3>
              <p className="text-sm">123 Visa Street, Suite 101</p>
              <p className="text-sm">New York, NY 10001</p>
              <p className="text-sm">billing@greentours.com</p>
            </div>
            <div>
              <p className="text-sm font-medium uppercase mb-1 text-bg-primary">
                To
              </p>
              <h3 className="font-bold">{bill.companyName}</h3>
              <p className="text-sm text-bg-primary">{bill.companyId}</p>
              <p className="text-sm text-bg-primary">{bill.companyAddress}</p>
              <p className="text-sm text-bg-primary">{bill.companyEmail}</p>
            </div>
          </div>
        </div>

        {/* Action buttons - hidden when printing */}
        <div className="flex flex-wrap gap-3 justify-end print:hidden">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1.5"
            onClick={handlePrint}
            disabled={isPrinting}
          >
            <Printer className="h-4 w-4" />
            {isPrinting ? "Preparing..." : "Print Invoice"}
          </Button>
        </div>

        <Table className="rounded-lg overflow-hidden print:table-auto w-full p-8">
          <TableHeader className="bg-primary">
            <TableRow>
              <TableHead className="text-primary-foreground">
                Application ID
              </TableHead>
              <TableHead className="text-primary-foreground">Name</TableHead>
              <TableHead className="text-primary-foreground">
                Passport Number
              </TableHead>
              <TableHead className="text-primary-foreground">
                Duration
              </TableHead>
              <TableHead className="text-primary-foreground">Speed</TableHead>
              <TableHead className="text-primary-foreground text-right">
                Cost
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app) => (
              <TableRow key={app._id}>
                <TableCell className="font-medium">{app.code}</TableCell>
                <TableCell>
                  {app.passportDetails.map((passport: any, index: number) => (
                    <div key={index} className="mb-1 flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <UserCheck className="h-3 w-3" />
                      </Avatar>
                      {passport.fullName}
                    </div>
                  ))}
                </TableCell>
                <TableCell>
                  {" "}
                  {app.passportDetails.map((passport: any, index: number) => (
                    <div key={index} className="mb-1">
                      {passport.passportNumber}
                    </div>
                  ))}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-normal">
                    {app.duration == "Single Entry" ? "15 Days" : "30 Days"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-normal">
                    {app.processingInfo.speed}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {app.cost} {app.currency}
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-muted/50 font-bold">
              <TableCell colSpan={5} className="text-right">
                Total
              </TableCell>
              <TableCell className="text-right">
                {bill.amount} {bill.currency}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Card className="border border-primary/20 bg-primary/5 print:border print:bg-white">
          <CardHeader className="pb-2 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-md p-3">
                <p className="text-sm font-medium mb-2 text-primary">
                  Payment Options
                </p>
                <ul className="text-sm space-y-1">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    Bank Transfer
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    PayPal
                  </li>
                </ul>
              </div>
              <div className="border rounded-md p-3">
                <p className="text-sm font-medium mb-2 text-primary">
                  Bank Details
                </p>
                <p className="text-sm">Bank: Global Bank</p>
                <p className="text-sm">Account: 123456789</p>
                <p className="text-sm">SWIFT: GLBLUS123</p>
              </div>
            </div>
            <Alert className="bg-background border-primary/30">
              <AlertDescription>
                Please include the invoice number{" "}
                <span className="font-bold">{invoiceNumber}</span> in your
                payment reference.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="border-t p-4 print:hidden">
            {!isPaid && (
              <Button
                onClick={handleMarkAsPaid}
                disabled={isLoading}
                className="w-full md:w-auto flex items-center gap-2"
              >
                <Check className="h-4 w-4" />
                {isLoading ? "Processing..." : "Mark as Paid"}
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Footer notes - print friendly */}
        <div className="text-sm text-muted-foreground mt-4 p-4 border-t">
          <p>
            Thank you for your business. If you have any questions, please
            contact billing@greentours.com
          </p>
        </div>
      </div>
    </div>
  );
}
