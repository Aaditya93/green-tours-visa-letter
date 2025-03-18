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
    <div className="container mx-auto px-4 py-8">
      <Card className="shadow-lg border-primary/10">
        <CardHeader className="text-center border-b bg-gradient-to-r from-primary/5 to-primary/10">
          <CardTitle className="text-3xl font-bold text-primary">
            {t("pricingTable.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow className="border-b-2 border-secondary">
                <TableHead className="w-1/3 text-lg font-semibold text-foreground">
                  {t("pricingTable.tableHead")}
                </TableHead>
                <TableHead className="text-right text-lg font-semibold text-foreground">
                  {t("pricingTable.tableHead2")}
                </TableHead>
                <TableHead className="text-right text-lg font-semibold text-foreground">
                  {t("pricingTable.tableHead3")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prices.singleEntry.map((item, index) => {
                const multipleEntryPrice = prices.multipleEntry[index].price;
                const isPopular = index === 4;

                return (
                  <TableRow
                    key={item.speed}
                    className={`
                      border-b transition-colors hover:bg-muted/30
                      ${isPopular ? "bg-primary/5" : ""}
                    `}
                  >
                    <TableCell className="font-medium py-4">
                      <div className="flex items-center space-x-3">
                        {getProcessingIcon(item.speed)}
                        <span>{formatSpeed(item.speed)}</span>
                        {isPopular && (
                          <Badge
                            variant="secondary"
                            className="ml-2 bg-primary/10 text-primary font-medium"
                          >
                            {t("pricingTable.cta")}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end">
                        <span className="font-semibold text-lg whitespace-nowrap">
                          {`${currency} ${item.price.toLocaleString()}`}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end">
                        <span className="font-semibold text-lg whitespace-nowrap">
                          {`${currency} ${multipleEntryPrice.toLocaleString()}`}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingTable;
