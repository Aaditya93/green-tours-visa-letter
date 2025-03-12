"use client";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { downloadFile } from "@/lib/data-client";
import { Checkbox } from "../ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CalendarIcon,
  FilterIcon,
  SearchIcon,
  RefreshCwIcon,
  DownloadIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Application } from "@/app/schemas/types";
import { Label } from "../ui/label";
import {
  updateApplicationImmigration,
  updateApplicationStagesIref,
} from "@/actions/application/application";
import DateRangePicker from "./date-range";
import { toast } from "sonner";
import { SimplifiedCompany } from "@/actions/agent-platform/visa-letter";

interface SearchProps {
  data: Application[];
  Users: { username: string }[];
  companies: SimplifiedCompany[];
}

interface SearchFilters {
  name: string;
  code: string;
  passport: string;
  nationality: string;
  companyId: string;
  creator: string;
  handleBy: string;
  airport: string;
  embassy: string;
  speed: string;
  duration: string;
  fromDate: string;
  toDate: string;
  createdDate: string;
  stage: string;
  iref: string;
  immigration: string;
  [key: string]: string;
}

const embassyOptions = [
  "China - Kunming",

  "USA -  Houston",

  "China - Nanning",

  "China - Guangzhou",

  "Cambodia - Sihanouk Ville",

  "Australia - Sydney",

  "China - Shanghai",

  "Taiwan - Taipei",

  "Bangladesh",

  "Australia - Canberra",

  "Japan",
];

const airportOptions = [
  "Noi Bai Airport",
  "Phu Bai Airport",
  "Phu Quoc Airport",
  "Tan Son Nhat Airport",

  "Cam Ranh Airport",

  "Da Nang Airport",
  "Lien Khuong Airport",
  "Cat Bi Airport",
  "Cau Treo Frontier",
  "Cha Lo Frontier",
  "Ha Tien Frontier",
  "Huu Nghi Frontier",
  "Lao Bao Frontier",
  "Lao Cai Frontier",
  "Moc Bai Frontier",
  "Mong Cai Frontier",
  "Na Meo Frontier",
  "Tay Trang Frontier",
  "Thanh Thuy Frontier",
  "Xa Mat Frontier",
];

const VisaSearch = ({ Users, data, companies }: SearchProps) => {
  const initialData = data;

  const [filteredData, setFilteredData] = useState<Application[]>(initialData);
  const [selectedApplications, setSelectedApplications] = useState<
    Application[]
  >([]);

  const [iref, setIref] = useState("");
  const [stage, setStage] = useState("");
  const [Immigration, setImmigration] = useState("");

  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    name: "",
    code: "",
    passport: "",
    nationality: "",
    creator: "",
    companyId: "",
    handleBy: "",
    airport: "",
    embassy: "",
    speed: "",
    duration: "",
    fromDate: "",
    toDate: "",
    createdDate: "",
    stage: "",
    iref: "",
    immigration: "",
  });

  const handleSearch = () => {
    const filtered = initialData.filter((item) => {
      return (
        (!searchFilters.name ||
          item.fullName
            .toLowerCase()
            .includes(searchFilters.name.toLowerCase())) &&
        (!searchFilters.code || String(item.code) === searchFilters.code) &&
        (!searchFilters.iref || item.iref === searchFilters.iref) &&
        (!searchFilters.companyId ||
          item.companyId === searchFilters.companyId) &&
        (!searchFilters.passport ||
          item.passportNumber === searchFilters.passport) &&
        (!searchFilters.nationality ||
          item.nationalityCurrent === searchFilters.nationality) &&
        (!searchFilters.creator || item.creator === searchFilters.creator) &&
        (!searchFilters.handleBy || item.handleBy === searchFilters.handleBy) &&
        (!searchFilters.airport ||
          item.placeOfIssue === searchFilters.airport) &&
        (!searchFilters.embassy ||
          item.placeOfIssue === searchFilters.embassy) &&
        (!searchFilters.immigration ||
          item.immigration === searchFilters.immigration) &&
        (!searchFilters.speed || item.speed === searchFilters.speed) &&
        (!searchFilters.duration || item.duration === searchFilters.duration) &&
        (!searchFilters.fromDate || item.fromDate === searchFilters.fromDate) &&
        (!searchFilters.toDate || item.toDate === searchFilters.toDate) &&
        (!searchFilters.createdDate ||
          item.createdDate === searchFilters.createdDate) &&
        (!searchFilters.stage || item.stage === searchFilters.stage)
      );
    });

    setFilteredData(filtered);
  };
  const hasImmigration = (selectedApplications: Application[]): boolean => {
    if (!selectedApplications || selectedApplications.length === 0) {
      return false;
    }
    if (
      selectedApplications[0]?.role === "Admin" ||
      selectedApplications[0]?.role === "Employee"
    ) {
      return false;
    }

    const hasRole = selectedApplications[0]?.role === "TravelAgent";

    const hasIref = selectedApplications.some((app) => app.iref !== "");
    const isProcessing = selectedApplications.some(
      (app) => app.stage === "Processing"
    );

    return hasRole && hasIref && isProcessing;
  };
  const handleSave = async () => {
    try {
      if (iref != "" || stage != "") {
        await updateApplicationStagesIref(selectedApplications, stage, iref);
        setStage("");
        setIref("");
        setSelectedApplications([]);
        window.location.reload();
        return;
      }
      const isImmigrationPresent = hasImmigration(selectedApplications);
      if (isImmigrationPresent) {
        await updateApplicationImmigration(selectedApplications, Immigration);
        setStage("");
        setIref("");
        setImmigration("");
        window.location.reload();
        return;
      } else {
        toast.error("Please Add Iref and Make Stage Processing");
        return;
      }
    } catch (error) {
      console.error("Error updating applications:", error);
    } finally {
    }
  };

  const handleDateSelect = (
    date: Date | undefined,
    dateType: "fromDate" | "toDate" | "createdDate"
  ) => {
    if (date) {
      const formattedDate = format(date, "dd/MM/yyyy");
      setSearchFilters((prev) => ({
        ...prev,
        [dateType]: formattedDate,
      }));
    }
  };

  const handleReset = () => {
    setSearchFilters({
      name: "",
      code: "",
      passport: "",
      nationality: "",
      companyId: "",
      creator: "",
      handleBy: "",
      airport: "",
      embassy: "",
      speed: "",
      duration: "",
      fromDate: "",
      toDate: "",
      createdDate: "",
      stage: "",
      iref: "",
      immigration: "",
    });
    setFilteredData(initialData);
  };
  const handleClearDate = (
    dateField: "fromDate" | "toDate" | "createdDate"
  ) => {
    setSearchFilters((prev) => ({
      ...prev,
      [dateField]: "",
    }));
  };

  const headers = [
    "Select",
    "No",
    "Full Name",
    "Nationality",
    "Passport Number",
    "Iref",
    "Immigration",
    "Creator",
    "Airport",
    "Embassy",
    "Created Date",
    "Stage",
    "From Date",
    "To Date",
    "Speed",
  ];

  const handleRowSelect = (application: Application) => {
    const isSelected = selectedApplications.some(
      (app) => app.passportId === application.passportId
    );

    if (isSelected) {
      setSelectedApplications((prev) =>
        prev.filter((app) => app.passportId !== application.passportId)
      );
    } else {
      setSelectedApplications((prev) => [...prev, application]);
    }
  };

  const handleSelectAll = () => {
    if (selectedApplications.length === filteredData.length) {
      setSelectedApplications([]);
    } else {
      setSelectedApplications([...filteredData]);
    }
  };

  return (
    <div className="container mx-auto  ">
      <Card className="w-full">
        <CardHeader className="bg-primary rounded-t-lg mb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
            <CardTitle className="flex items-center text-xl font-bold text-center sm:text-left text-primary-foreground">
              <FilterIcon className="mr-2 w-8 h-8 text-primary-foreground" />
              Advanced Search
            </CardTitle>
            <DateRangePicker />
          </div>
        </CardHeader>
        <CardContent>
          {/* Search Filters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* Date Filters */}
            {["createdDate", "fromDate", "toDate"].map((dateField) => (
              <div key={dateField} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium capitalize">
                    {dateField.replace(/([A-Z])/g, " $1").trim()}
                  </label>
                  {searchFilters[dateField] &&
                    searchFilters[dateField] !== `Pick ${dateField}` && (
                      <Label
                        onClick={() =>
                          handleClearDate(
                            dateField as "fromDate" | "toDate" | "createdDate"
                          )
                        }
                        className=" px-2 text-red-600 hover:text-red-800"
                        aria-label={`Clear ${dateField} filter`}
                      >
                        Clear
                      </Label>
                    )}
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left",
                        !searchFilters[dateField] && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {searchFilters[dateField] || `Pick ${dateField}`}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      onSelect={(date) =>
                        handleDateSelect(
                          date,
                          dateField as "fromDate" | "toDate" | "createdDate"
                        )
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            ))}

            {/* Input Fields */}
            {["name", "code", "passport", "iref"].map((field) => (
              <div key={field} className="space-y-2">
                <label className="text-sm font-medium capitalize">
                  {field === "name" ? "Full Name" : field}
                </label>
                <Input
                  placeholder={`Search by ${field}`}
                  value={searchFilters[field]}
                  onChange={(e) =>
                    setSearchFilters((prev) => ({
                      ...prev,
                      [field]: e.target.value,
                    }))
                  }
                  className=" focus:border-primary focus:ring focus:ring-primary/30"
                />
              </div>
            ))}

            {/* Select Dropdowns */}
            {[
              {
                name: "Country",
                key: "nationality",
                options: [
                  { value: "Australia", label: "Australia" },
                  { value: "Bangladesh", label: "Bangladesh" },
                  { value: "Canada", label: "Canada" },
                  { value: "China", label: "China" },
                  { value: "China (Taiwan)", label: "China (Taiwan)" },
                  { value: "India", label: "India" },
                  { value: "Netherland", label: "Netherland" },
                  { value: "Nepal", label: "Nepal" },
                  { value: "Egypt", label: "Egypt" },
                  { value: "New Zealand", label: "New Zealand" },
                  { value: "Pakistan", label: "Pakistan" },
                  {
                    value: "Saint Kitts and Nevis",
                    label: "Saint Kitts and Nevis",
                  },
                  { value: "South Africa", label: "South Africa" },
                  { value: "Sri Lanka", label: "Sri Lanka" },
                  { value: "Turkey", label: "Turkey" },
                  { value: "Turkmenistan", label: "Turkmenistan" },
                  { value: "United States", label: "United States" },
                  {
                    value: "United Kingdom (British Citizen)",
                    label: "United Kingdom (British Citizen)",
                  },
                  { value: "Uzbekistan", label: "Uzbekistan" },
                  { value: "Vanuatu", label: "Vanuatu" },
                ],
              },

              {
                name: "Stage",
                key: "stage",
                options: [
                  { value: "Not Processed", label: "Not Processed" },
                  { value: "Processing", label: "Processing" },
                  { value: "Processed", label: "Processed" },
                  { value: "Blacklist", label: "Blacklist" },
                  { value: "Overstayed", label: "Overstayed" },
                ],
              },

              {
                key: "handleBy",
                name: "Handle By",
                options: [
                  { value: "MR.Xia", label: "MR.Xia" },
                  { value: "MR.SAMI", label: "MR.SAMI" },
                  { value: "JESSY", label: "JESSY" },
                  { value: "TONY", label: "TONY" },
                  { value: "MR.SUMMER", label: "MR.SUMMER" },
                  { value: "ANH THANG", label: "ANH THANG" },
                  { value: "C.YEN", label: "C.YEN" },
                  { value: "C.HUONG", label: "C.HUONG" },
                  { value: "YUEHUA", label: "YUEHUA" },
                  { value: "KHACH LE", label: "KHACH LE" },
                  { value: "TOP", label: "TOP" },
                  { value: "YES", label: "YES" },
                  { value: "STT", label: "STT" },
                  { value: "YUN YANG", label: "YUN YANG" },
                  {
                    value: "DAI NAM",
                    label: "DAI NAM",
                  },
                  {
                    value: "BOB",
                    label: "BOB",
                  },
                ],
              },

              {
                name: "Airport",
                key: "airport",
                options: [
                  { value: "Noi Bai Airport", label: "Noi Bai Airport" },
                  { value: "Phu Bai Airport", label: "Phu Bai Airport" },
                  { value: "Phu Quoc Airport", label: "Phu Quoc Airport" },
                  {
                    value: "Tan Son Nhat Airport",
                    label: "Tan Son Nhat Airport",
                  },
                  { value: "Cam Ranh Airport", label: "Cam Ranh Airport" },
                  { value: "Da Nang Airport", label: "Da Nang Airport" },
                  {
                    value: "Lien Khuong Airport",
                    label: "Lien Khuong Airport",
                  },
                  { value: "Cat Bi Airport", label: "Cat Bi Airport" },
                  { value: "Cau Treo Frontier", label: "Cau Treo Frontier" },
                  { value: "Cha Lo Frontier", label: "Cha Lo Frontier" },
                  { value: "Ha Tien Frontier", label: "Ha Tien Frontier" },
                  { value: "Huu Nghi Frontier", label: "Huu Nghi Frontier" },
                  { value: "Lao Bao Frontier", label: "Lao Bao Frontier" },
                  { value: "Lao Cai Frontier", label: "Lao Cai Frontier" },
                  { value: "Moc Bai Frontier", label: "Moc Bai Frontier" },
                  { value: "Mong Cai Frontier", label: "Mong Cai Frontier" },
                  { value: "Na Meo Frontier", label: "Na Meo Frontier" },
                  { value: "Tay Trang Frontier", label: "Tay Trang Frontier" },
                  {
                    value: "Thanh Thuy Frontier",
                    label: "Thanh Thuy Frontier",
                  },
                  { value: "Xa Mat Frontier", label: "Xa Mat Frontier" },
                ],
              },
              {
                name: "Embassy",
                key: "embassy",
                options: [
                  {
                    value: "China - Kunming",
                    label: "China - Kunming",
                  },
                  {
                    value: "USA -  Houston",
                    label: "USA -  Houston",
                  },
                  {
                    value: "China - Nanning",
                    label: "China - Nanning",
                  },
                  {
                    value: "China - Guangzhou",
                    label: "China - Guangzhou",
                  },
                  {
                    value: "Cambodia - Sihanouk Ville",
                    label: "Cambodia - Sihanouk Ville",
                  },
                  {
                    value: "Australia - Sydney",
                    label: "Australia - Sydney",
                  },
                  {
                    value: "China - Shanghai",
                    label: "China - Shanghai",
                  },
                  {
                    value: "Taiwan - Taipei",
                    label: "Taiwan - Taipei",
                  },
                  {
                    value: "Bangladesh",
                    label: "Bangladesh",
                  },
                  {
                    value: "Australia - Canberra",
                    label: "Australia - Canberra",
                  },
                  {
                    value: "Japan",
                    label: "Japan",
                  },
                ],
              },
              {
                name: "Speed",
                key: "speed",
                options: [
                  { value: "1H", label: "1H" },
                  { value: "2H", label: "2H" },
                  { value: "4H", label: "4H" },
                  { value: "8H", label: "8H" },
                  { value: "1D", label: "1D" },
                  { value: "2D", label: "2D" },
                  { value: "3D", label: "3D" },
                  { value: "4D", label: "4D" },
                  { value: "NO", label: "NO" },
                ],
              },
              {
                name: "Duration",
                key: "duration",
                options: [
                  { value: "Single Entry", label: "Single Entry" },
                  { value: "Multiple Entry", label: "Multiple Entry" },
                ],
              },
              {
                name: "Creator",
                key: "creator",
                options: Users.map((user) => ({
                  value: user.username,
                  label: user.username,
                })),
              },
              {
                name: "Travel Agent",
                key: "companyId",
                options: companies.map((company) => ({
                  value: company.id,
                  label: company.name,
                })),
              },
              {
                name: "Immigration",
                key: "immigration",
                options: [
                  { value: "Hanoi", label: "Hanoi" },
                  { value: "Ho Chi Minh", label: "Ho Chi Minh" },
                ],
              },
            ].map(({ name, key, options }) => (
              <div key={name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium capitalize">
                    {name}
                  </label>
                  {searchFilters[key] && (
                    <Label
                      onClick={() =>
                        setSearchFilters((prev) => ({ ...prev, [key]: "" }))
                      }
                      className=" px-2 text-red-600 hover:text-red-800"
                      aria-label={`Clear ${key} filter`}
                    >
                      Clear
                    </Label>
                  )}
                </div>
                <Select
                  value={searchFilters[key]}
                  onValueChange={(value) =>
                    setSearchFilters((prev) => ({ ...prev, [key]: value }))
                  }
                >
                  <SelectTrigger className="focus:border-primary focus:ring focus:ring-primary/30">
                    <SelectValue placeholder={`Select ${name}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-end space-x-2 mb-6">
            <div className="flex justify-start ml-4 gap-2">
              <Select value={Immigration} onValueChange={setImmigration}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Select Immigration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ho Chi Minh">Ho Chi Minh</SelectItem>
                  <SelectItem value="Hanoi">Hanoi</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Enter IREF"
                value={iref}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setIref(e.target.value)
                }
                className="w-[150px]"
              />
              <Select value={stage} onValueChange={setStage}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Select Stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Not Processed">Not Processed</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Processed">Processed</SelectItem>
                  <SelectItem value="Blacklist">Blacklist</SelectItem>
                  <SelectItem value="Overstayed">Overstayed</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="secondary" onClick={handleSave}>
                Save
              </Button>
              <Button
                onClick={handleSearch}
                className="flex items-center space-x-2 bg-primary text-background"
                variant="outline"
              >
                <span>Total Application :</span>
                <span>{selectedApplications.length}</span>
              </Button>
            </div>

            <Button onClick={handleSearch} className="flex items-center">
              <SearchIcon className="mr-2 h-4 w-4" /> Search
            </Button>
            <Button
              variant="secondary"
              onClick={handleReset}
              className="flex items-center"
            >
              <RefreshCwIcon className="mr-2 h-4 w-4" /> Reset
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <span className="sr-only">Open menu</span>
                  <DownloadIcon />
                  Download
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    downloadFile("xlsx", selectedApplications);
                  }}
                >
                  Download .xlsx
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    downloadFile("pdf", selectedApplications);
                  }}
                >
                  Download Pdf
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    downloadFile("csv", selectedApplications);
                  }}
                >
                  Download .csv
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Responsive Table */}
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader className="bg-foreground ">
                <TableRow>
                  {headers.map((header) => (
                    <TableHead
                      key={header}
                      className="whitespace-nowrap bg-primary text-background font-bold "
                    >
                      {header === "Select" ? (
                        <Checkbox
                          checked={
                            selectedApplications.length === filteredData.length
                          }
                          onCheckedChange={handleSelectAll}
                          className="border-background"
                        />
                      ) : (
                        header
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.passportId} className="transition-colors">
                    <TableCell>
                      <Checkbox
                        checked={selectedApplications.some(
                          (app) => app.passportId === item.passportId
                        )}
                        onCheckedChange={() => handleRowSelect(item)}
                      />
                    </TableCell>
                    <TableCell>{item.code}</TableCell>
                    <TableCell>{item.fullName}</TableCell>
                    <TableCell>{item.nationalityCurrent}</TableCell>
                    <TableCell className="max-w-[100px] truncate">
                      {item.passportNumber}
                    </TableCell>
                    <TableCell>{item.iref}</TableCell>
                    <TableCell>{item.immigration} </TableCell>

                    <TableCell>{item.creator}</TableCell>
                    <TableCell>
                      {airportOptions.includes(item.placeOfIssue)
                        ? item.placeOfIssue
                        : ""}
                    </TableCell>
                    <TableCell>
                      {embassyOptions.includes(item.placeOfIssue)
                        ? item.placeOfIssue
                        : ""}
                    </TableCell>
                    <TableCell>{item.createdDate}</TableCell>
                    <TableCell>
                      {item.stage ? (
                        <span
                          className={`
    px-2 py-1 rounded-full text-xs font-semibold
    ${
      item.stage === "Not Processed"
        ? "bg-yellow-100 text-yellow-800"
        : item.stage === "Processing"
        ? "bg-gray-100 text-gray-800"
        : item.stage === "Processed"
        ? "bg-green-100 text-green-800"
        : item.stage === "Blacklist"
        ? "bg-red-100 text-red-800"
        : item.stage === "Overstayed"
        ? "bg-blue-100 text-blue-500"
        : ""
    }
  `}
                        >
                          {item.stage}
                        </span>
                      ) : null}
                    </TableCell>
                    <TableCell>{item.fromDate}</TableCell>
                    <TableCell>{item.toDate}</TableCell>
                    <TableCell>{item.speed}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default VisaSearch;
