"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, Printer, AlertCircle, InfoIcon } from "lucide-react";
import { format } from "date-fns";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTranslations } from "next-intl";
import Image from "next/image";
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
    onePay?: string;
    paypalLink?: string;
  };
  applications: any[];
}

export default function BillDetail({
  billId,
  bill,
  applications,
}: BillDetailProps) {
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 300);
  };
  const t = useTranslations("bill");
  const [paypalSurchargeOpen, setPaypalSurchargeOpen] = useState(false);
  const paypalSurcharge = bill.amount * 0.035; // 3.5%
  const totalWithSurcharge = bill.amount + paypalSurcharge;

  const formattedDate = format(new Date(bill.createdDate), "MMMM d, yyyy");
  const invoiceNumber = `INV-${billId.substring(0, 8).toUpperCase()}`;
  const [isPaid, setIsPaid] = useState(bill.payment);
  return (
    <div className="container mx-auto  print:py-2 max-w-6xl">
      <div className="flex flex-col gap-6 print:gap-4 border border-border rounded-lg p-6 shadow-sm">
        {/* Header with invoice info */}
        <div className="text-bg-primary p-6 rounded-lg print:bg-none print:border">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold">{t("invoice")}</h1>
              <p className="text-sm mt-1 text-bg-primary">{invoiceNumber}</p>
            </div>
            <div className="text-right">
              <Badge
                variant={bill.payment ? "secondary" : "destructive"}
                className=" py-1 px-3 text-xl"
              >
                {bill.payment ? `${t("paid")}` : `${t("unpaid")}`}
              </Badge>
              <p className="text-sm mt-2 text-bg-primary">
                {t("date")} : {formattedDate}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium uppercase mb-1 text-bg-primary">
                {t("from")}
              </p>
              <h3 className="font-bold">VISACAR Visa Letter Services</h3>
              <p className="text-sm">123 Visa Street, Suite 101</p>
              <p className="text-sm">New York, NY 10001</p>
              <p className="text-sm">billing@greentours.com</p>
            </div>
            <div>
              <p className="text-sm font-medium uppercase mb-1 text-bg-primary">
                {t("to")}
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
            {isPrinting ? `${t("table.processing")}` : `${t("table.print")}`}
          </Button>
        </div>

        <Table className="rounded-lg overflow-hidden print:table-auto w-full p-8">
          <TableHeader className="bg-primary">
            <TableRow>
              <TableHead className="text-primary-foreground">
                {t("table.applicationId")}
              </TableHead>
              <TableHead className="text-primary-foreground">
                {" "}
                {t("table.name")}
              </TableHead>
              <TableHead className="text-primary-foreground">
                {t("table.passportNumber")}
              </TableHead>
              <TableHead className="text-primary-foreground">
                {t("table.duration")}
              </TableHead>
              <TableHead className="text-primary-foreground">
                {t("table.speed")}
              </TableHead>
              <TableHead className="text-primary-foreground text-right">
                {t("table.cost")}
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
                {t("table.total")}
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
              {t("heading")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {/* Optional online payment methods */}
            {true && (
              <div className="mb-5">
                <h3 className="text-sm font-medium mb-3">{t("title1")}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {true && (
                    <div className="border  rounded-md p-4  ">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 flex items-center bg-background justify-center  rounded-md p-1">
                            <Image
                              src="/onepay.webp"
                              alt="OnePay"
                              width={32}
                              height={32}
                              className="h-8 w-8 object-contain"
                            />
                          </div>
                          <div>
                            <p className="font-medium ">OnePay</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-xs border rounded-md p-2 mb-3">
                        {t("message5")}
                      </div>
                      <Button
                        asChild
                        rel="noopener noreferrer"
                        className="inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium w-full"
                      >
                        <a
                          href={bill.onePay}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {" "}
                          {t("pay")} {bill.amount} {bill.currency} {t("with")}{" "}
                          OnePay
                        </a>
                      </Button>
                    </div>
                  )}
                  {true && (
                    <div className="border rounded-md p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 flex items-center justify-center bg-background rounded-md p-1 shadow-sm border border-primary/10">
                            <Image
                              src="/PayPal.png"
                              alt="PayPal"
                              width={32}
                              height={32}
                              className="h-8 w-8 object-contain"
                            />
                          </div>
                          <div>
                            <p className="font-medium">PayPal</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setPaypalSurchargeOpen(true)}
                          className="text-primary hover:text-primary/80 transition-colors"
                          aria-label="PayPal fee information"
                        >
                          <InfoIcon className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="text-xs rounded-md p-2 mb-3 border">
                        <div className="flex items-center gap-1">
                          <span>{t("message5")}</span>
                          <span className="text-primary font-medium">
                            +3.5% fee applies
                          </span>
                        </div>
                      </div>
                      {bill.paypalLink ? (
                        <Button
                          asChild
                          className="inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium w-full"
                        >
                          <a
                            href={bill.paypalLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setPaypalSurchargeOpen(true)}
                          >
                            {t("pay")} {bill.amount} {bill.currency} {t("with")}{" "}
                            PayPal
                          </a>
                        </Button>
                      ) : (
                        <Button className="w-full cursor-not-allowed">
                          {t("message6")}
                        </Button>
                      )}
                    </div>
                  )}

                  {/* PayPal surcharge dialog */}
                  <Dialog
                    open={paypalSurchargeOpen}
                    onOpenChange={setPaypalSurchargeOpen}
                  >
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Image
                            src="/PayPal.png"
                            alt="PayPal"
                            width={24}
                            height={24}
                            className="h-5 w-5 object-contain"
                          />
                          PayPal Payment Information
                        </DialogTitle>
                      </DialogHeader>
                      <div className="py-4">
                        <div className="rounded-md bg-amber-50 border border-amber-200 p-3 mb-4">
                          <p className="text-amber-800 font-medium text-sm">
                            A 3.5% surcharge will be added to your payment when
                            using PayPal.
                          </p>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center pb-2 border-b">
                            <span className="text-muted-foreground">
                              Original amount:
                            </span>
                            <span className="font-medium">
                              {bill.amount.toFixed(2)} {bill.currency}
                            </span>
                          </div>
                          <div className="flex justify-between items-center pb-2 border-b">
                            <span className="text-muted-foreground">
                              PayPal fee (3.5%):
                            </span>
                            <span className="text-orange-600 font-medium">
                              +{paypalSurcharge.toFixed(2)} {bill.currency}
                            </span>
                          </div>
                          <div className="flex justify-between items-center pt-1">
                            <span className="font-medium">Total to pay:</span>
                            <span className="text-primary font-bold text-lg">
                              {totalWithSurcharge.toFixed(2)} {bill.currency}
                            </span>
                          </div>
                        </div>
                      </div>
                      <DialogFooter className="sm:justify-between">
                        <Button
                          variant="outline"
                          onClick={() => setPaypalSurchargeOpen(false)}
                        >
                          Cancel
                        </Button>
                        {bill.paypalLink && (
                          <Button
                            asChild
                            className="bg-[#0070ba] hover:bg-[#005ea6]"
                          >
                            <a
                              href={bill.paypalLink}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Continue to PayPal
                            </a>
                          </Button>
                        )}
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            )}

            {/* Bank Transfer - Only Vietnam account */}
            <div className="border rounded-md p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="font-medium text-sm ">Bank Transfer (Vietnam)</p>
                <Badge variant="outline" className="text-xs ">
                  USD
                </Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="">Beneficiary</span>
                  <span className="font-medium">LÊ THỊ PHƯƠNG THẢO</span>
                </div>
                <div className="flex justify-between">
                  <span className="">Account No / USD Payment</span>
                  <span className="font-mono bg-muted/20 px-1.5 py-0.5 rounded text-xs">
                    038-01-37-900196-5
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="">Bank</span>
                  <span className="text-right">
                    Vietnam Maritime Commercial Bank
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="">SWIFT Code</span>
                  <span className="font-mono bg-muted/20 px-1.5 py-0.5 rounded text-xs">
                    MCOBVNVX
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="">Address</span>
                  <span className="text-right text-xs">
                    54 Nguyen Chi Thanh Street, Lang Thuong Ward, Dong Da
                    District, Hanoi, Vietnam
                  </span>
                </div>
              </div>
            </div>

            <Alert className="bg-accent border border-accent/20">
              <AlertCircle className="h-4 w-4 text-primary" />
              <AlertDescription>
                {t("message1")}{" "}
                <span className="font-medium">{invoiceNumber}</span>{" "}
                {t("message3")}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Footer notes - print friendly */}
        <div className="text-sm text-muted-foreground mt-4 p-4 border-t">
          <p>{t("message2")} billing@greentours.com</p>
        </div>
      </div>
    </div>
  );
}
