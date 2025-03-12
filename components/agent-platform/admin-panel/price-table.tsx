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
  const formatSpeed = (speed: string) => {
    if (speed === "NO") return "Standard";
    if (speed.includes("D")) return `${speed.replace("D", " Days")}`;
    return `${speed.replace("H", " Hours")}`;
  };

  const getProcessingIcon = (speed: string) => {
    if (speed === "NO") {
      return <Clock className="h-4 w-4 text-gray-500" />;
    }
    return <Zap className="h-4 w-4 text-blue-500" />;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="shadow-lg">
        <CardHeader className="text-center border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Visa Letter Processing Options
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/3 text-lg font-semibold ">
                  Processing Time
                </TableHead>
                <TableHead className="text-right text-lg font-semibold ">
                  15 Days
                </TableHead>
                <TableHead className="text-right text-lg font-semibold ">
                  30 Days
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
                      border-b transition-colors
                    
                    `}
                  >
                    <TableCell className="font-medium py-4">
                      <div className="flex items-center space-x-3">
                        {getProcessingIcon(item.speed)}
                        <span>{formatSpeed(item.speed)}</span>
                        {isPopular && (
                          <Badge
                            variant="secondary"
                            className="ml-2 bg-blue-100 text-blue-700"
                          >
                            Popular Choice
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
