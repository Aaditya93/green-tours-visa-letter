import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Application {
  id: string;
  fullName: string;
  passportNumber: string;
  travelDuration: number;
  duration: string;
  fromDate: string;
  toDate: string;
  speed: string;
  cost: number;
  currency: string;
}

interface VisaLetterApplicationsTableProps {
  applications: Application[];
  totalCost: number;
  currency: string;
  translations: {
    application: string;
    name: string;
    passportNumber: string;
    duration: string;
    speed: string;
    cost: string;
    days: string;
    total: string;
  };
}

/**
 * Server Component that displays a table of visa applications.
 */
export const VisaLetterApplicationsTable = ({
  applications,
  totalCost,
  currency,
  translations,
}: VisaLetterApplicationsTableProps) => {
  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row justify-between items-center bg-primary text-background rounded-t-lg">
        <CardTitle>{translations.application}</CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {applications.length} {translations.application}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{translations.name}</TableHead>
              <TableHead>{translations.passportNumber}</TableHead>
              <TableHead>{translations.duration}</TableHead>
              <TableHead>{translations.speed}</TableHead>
              <TableHead className="text-right">{translations.cost}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app) => (
              <TableRow key={app.id}>
                <TableCell className="font-medium">
                  {app.fullName}
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {app.passportNumber}
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm font-medium">
                      {app.travelDuration} {translations.days}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {app.duration}
                    </div>
                    <div className="text-xs text-muted-foreground italic">
                      {app.fromDate} - {app.toDate}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-normal">
                    {app.speed}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {app.cost.toLocaleString()} {app.currency}
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-muted/50 font-bold hover:bg-muted/50">
              <TableCell colSpan={4} className="text-right">
                {translations.total}
              </TableCell>
              <TableCell className="text-right text-primary">
                {totalCost.toLocaleString()} {currency}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
