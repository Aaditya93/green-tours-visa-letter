import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Zap } from "lucide-react";
import { useTranslations } from "next-intl";

interface PriceEntry {
  speed: string;
  price: number;
}

interface PriceData {
  singleEntry: PriceEntry[];
  multipleEntry: PriceEntry[];
}

const PricingTable = ({
  prices,
  currency,
}: {
  prices: PriceData;
  currency: string;
}) => {
  const t = useTranslations("visa-letter");

  const formatSpeed = (speed: string) => {
    if (speed === "NO") return t("pricingTable.standard");
    if (speed.includes("D"))
      return `${speed.replace("D", t("pricingTable.days"))}`;
    return `${speed.replace("H", t("pricingTable.hour"))}`;
  };

  const getProcessingIcon = (speed: string) => {
    if (speed === "NO") {
      return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
    return <Zap className="h-4 w-4 text-primary" />;
  };

  return (
    <div className="w-full py-4 overflow-x-auto">
      <Card className="shadow-lg border-primary/10 overflow-hidden">
        <CardHeader className="text-center border-b bg-gradient-to-r from-primary/5 to-primary/10">
          <CardTitle className="text-2xl md:text-3xl font-bold text-primary">
            {t("pricingTable.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6 overflow-x-auto">
          <div className="min-w-[600px] sm:min-w-0">
            <Table>
              <TableHeader>
                <TableRow className="border-b-2 border-secondary hover:bg-transparent">
                  <TableHead className="w-1/3 text-base md:text-lg font-semibold text-foreground px-4 md:px-6">
                    {t("pricingTable.tableHead")}
                  </TableHead>
                  <TableHead className="text-right text-base md:text-lg font-semibold text-foreground px-4 md:px-6">
                    {t("pricingTable.tableHead2")}
                  </TableHead>
                  <TableHead className="text-right text-base md:text-lg font-semibold text-foreground px-4 md:px-6">
                    {t("pricingTable.tableHead3")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prices.singleEntry.map((item, index) => {
                  const multipleEntryPrice = prices.multipleEntry[index]?.price;
                  const isPopular = index === 4;

                  return (
                    <TableRow
                      key={item.speed}
                      className={`
                        border-b transition-colors hover:bg-muted/30
                        ${isPopular ? "bg-primary/5" : ""}
                      `}
                    >
                      <TableCell className="font-medium py-3 md:py-4 px-4 md:px-6 text-sm md:text-base">
                        <div className="flex items-center space-x-2 md:space-x-3">
                          {getProcessingIcon(item.speed)}
                          <span>{formatSpeed(item.speed)}</span>
                          {isPopular && (
                            <Badge
                              variant="secondary"
                              className="ml-2 bg-primary/10 text-primary font-medium text-[10px] md:text-xs"
                            >
                              {t("pricingTable.cta")}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right px-4 md:px-6">
                        <span className="font-semibold text-base md:text-lg whitespace-nowrap">
                          {`${currency} ${item.price.toLocaleString()}`}
                        </span>
                      </TableCell>
                      <TableCell className="text-right px-4 md:px-6">
                        <span className="font-semibold text-base md:text-lg whitespace-nowrap">
                          {multipleEntryPrice !== undefined
                            ? `${currency} ${multipleEntryPrice.toLocaleString()}`
                            : "-"}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingTable;
