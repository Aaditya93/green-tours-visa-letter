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
import { useTranslations } from "next-intl";

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
];

const VisaSearch = ({ Users, data, companies }: SearchProps) => {
  const initialData = data;
  const t = useTranslations("searchPage");

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
    t("select"),
    t("no"),
    t("fullName"),
    t("nationality"),
    t("passportNumber"),
    t("iref"),
    t("creator"),
    t("airport"),
    t("embassy"),
    t("createdDate"),
    t("stage"),
    t("fromDate"),
    t("toDate"),
    t("speed"),
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
              {t("advancedSearch")}
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
                    {t(dateField)}
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
                        {t("clear")}
                      </Label>
                    )}
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left bg-secondary-background ",
                        !searchFilters[dateField] && ""
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {searchFilters[dateField] ||
                        t("pickDate", { field: t(dateField) })}
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
            {["name", "code", "passport"].map((field) => (
              <div key={field} className="space-y-2">
                <label className="text-sm font-medium capitalize">
                  {field === "name" ? t("fullName") : t(field)}
                </label>
                <Input
                  placeholder={t("searchBy", {
                    field: field === "name" ? t("fullName") : t(field),
                  })}
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
                name: "nationality",
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
                name: "stage",
                options: [
                  { value: "Submitted", label: t("submitted") },
                  { value: "Processing", label: t("processing") },
                  { value: "Delivered", label: t("delivered") },
                  { value: "Blacklist", label: t("blacklist") },
                  { value: "Overstayed", label: t("overstayed") },
                ],
              },
              {
                name: "airport",
                options: airportOptions.map((option) => ({
                  value: option,
                  label: option,
                })),
              },
              {
                name: "embassy",
                options: embassyOptions.map((option) => ({
                  value: option,
                  label: option,
                })),
              },
              {
                name: "speed",
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
                name: "typeOfVisa",
                options: [
                  { value: "Single Entry", label: t("singleEntry") },
                  { value: "Multiple Entry", label: t("multipleEntry") },
                ],
              },
              {
                name: "creator",
                options: Users.map((user) => ({
                  value: user.username,
                  label: user.username,
                })),
              },
              {
                name: "company",
                key: "companyId",
                options: companies.map((company) => ({
                  value: company.id,
                  label: company.name,
                })),
              },
              {
                name: "immigration",
                key: "immigration",
                options: [
                  { value: "Hanoi", label: "Hanoi" },
                  { value: "Ho Chi Minh", label: "Ho Chi Minh" },
                ],
              },
            ].map(({ name, options }) => (
              <div key={name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium capitalize">
                    {t(name)}
                  </label>
                  {searchFilters[name] && (
                    <Label
                      onClick={() =>
                        setSearchFilters((prev) => ({ ...prev, [name]: "" }))
                      }
                      className=" px-2 text-red-600 hover:text-red-800"
                      aria-label={`Clear ${name} filter`}
                    >
                      {t("clear")}
                    </Label>
                  )}
                </div>
                <Select
                  value={searchFilters[name]}
                  onValueChange={(value) =>
                    setSearchFilters((prev) => ({ ...prev, [name]: value }))
                  }
                >
                  <SelectTrigger className="focus:border-primary focus:ring focus:ring-primary/30">
                    <SelectValue
                      placeholder={t("select", { field: t(name) })}
                    />
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
                  <SelectValue placeholder={`${t("selectImmigration")}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ho Chi Minh">Ho Chi Minh</SelectItem>
                  <SelectItem value="Hanoi">Hanoi</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder={`${t("entire")} IREF`}
                value={iref}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setIref(e.target.value)
                }
                className="w-[150px]"
              />
              <Select value={stage} onValueChange={setStage}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder={t("selectStage")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Processing">{t("processing")}</SelectItem>
                  <SelectItem value="Delivered">{t("delivered")}</SelectItem>
                  <SelectItem value="Blacklist">{t("blacklist")}</SelectItem>
                  <SelectItem value="Overstayed">{t("overstayed")}</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="secondary" onClick={handleSave}>
                {t("save")}
              </Button>
              <Button
                onClick={handleSearch}
                className="flex items-center space-x-2 bg-primary text-background"
                variant="outline"
              >
                <span>{t("totalApplication")} :</span>
                <span>{selectedApplications.length}</span>
              </Button>
            </div>

            <Button onClick={handleSearch} className="flex items-center">
              <SearchIcon className="mr-2 h-4 w-4" /> {t("search")}
            </Button>
            <Button
              variant="secondary"
              onClick={handleReset}
              className="flex items-center"
            >
              <RefreshCwIcon className="mr-2 h-4 w-4" /> {t("reset")}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-secondary-background">
                  <span className="sr-only">Open menu</span>
                  <DownloadIcon />
                  {t("download")}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    downloadFile("xlsx", selectedApplications);
                  }}
                >
                  {t("download")} .xlsx
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    downloadFile("pdf", selectedApplications);
                  }}
                >
                  {t("download")} Pdf
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    downloadFile("csv", selectedApplications);
                  }}
                >
                  {t("download")} .csv
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
      item.stage === "Submitted"
        ? "bg-yellow-100 text-yellow-800"
        : item.stage === "Processing"
        ? "bg-gray-100 text-gray-800"
        : item.stage === "Delivered"
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
