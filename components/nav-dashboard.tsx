"use client";
import { startOfDay } from "date-fns";
import React, { useState, Dispatch, SetStateAction } from "react";
import { ChevronRight, type LucideIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ColumnFiltersState } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

interface FilterItem {
  title: string;
  key: string;
  items?: { title: string }[];
}
interface NavMainProps {
  items: {
    title: string;
    icon: LucideIcon | React.ComponentType;
    isActive?: boolean;
    items?: {
      title: string;
      key: string;
      items: { title: string }[];
    }[];
  }[];
  searchSelections: string;
  setSearchSelections: Dispatch<SetStateAction<string>>;
  columnFilters: ColumnFiltersState;
  setColumnFilters: Dispatch<SetStateAction<ColumnFiltersState>>;
}

const NavDashboard = ({
  items,
  searchSelections,
  setSearchSelections,
  columnFilters,
  setColumnFilters,
}: NavMainProps) => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const renderSearchSection = (items: { title: string; key: string }[]) => {
    return (
      <div className="space-y-2 p-2">
        {items.map((item) => (
          <div
            key={item.key || item.title}
            className="flex items-center space-x-2"
          >
            <Checkbox
              id={item.title}
              checked={searchSelections === item.key} // Changed from includes
              onCheckedChange={(checked) => {
                if (checked) {
                  setSearchSelections(item.key);
                } else {
                  setSearchSelections("fullName");
                }
              }}
            />
            <label
              htmlFor={item.title}
              className="text-sm font-medium leading-none"
            >
              {item.title}
            </label>
          </div>
        ))}
      </div>
    );
  };
  // Types for filter items

  const renderFilterSection = (items: FilterItem[]) => (
    <div className="space-y-2 p-2">
      {items.map((filterItem) => (
        <div key={filterItem.title} className="space-y-1 relative">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium mb-1">
              {filterItem.title}
            </label>
            {columnFilters.some((filter) => filter.id === filterItem.key) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setColumnFilters(
                    columnFilters.filter(
                      (filter) => filter.id !== filterItem.key
                    )
                  );
                  if (activeFilter === filterItem.key) {
                    setActiveFilter(null);
                  }
                }}
                className="text-destructive hover:text-destructive/80 text-xs p-0 h-auto"
              >
                clear
              </Button>
            )}
          </div>
          <Select
            value={
              (columnFilters.find((filter) => filter.id === filterItem.key)
                ?.value as string) || ""
            }
            onValueChange={(value) => {
              setActiveFilter(filterItem.key);
              setColumnFilters(() => {
                if (value) {
                  return [{ id: filterItem.key, value }];
                }
                return [];
              });
            }}
            disabled={activeFilter !== null && activeFilter !== filterItem.key}
          >
            <SelectTrigger
              onDoubleClick={(e) => {
                e.preventDefault();
                setActiveFilter(null);
                setColumnFilters([]);
              }}
              className={
                activeFilter === filterItem.key ? "border-primary" : ""
              }
            >
              <SelectValue placeholder={`Select ${filterItem.title}`} />
            </SelectTrigger>
            <SelectContent>
              {filterItem.items?.map((subItem) => (
                <SelectItem key={subItem.title} value={subItem.title}>
                  {subItem.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );

  const renderDateSection = (items: { title: string; key: string }[]) => {
    // Check if any filter is active besides current one
    const hasActiveFilter = columnFilters.length > 0;

    return (
      <div className="space-y-2 p-2">
        {items.map((dateItem) => {
          const currentFilter = columnFilters.find(
            (filter) => filter.id === dateItem.key
          );
          const isDisabled = hasActiveFilter && !currentFilter;

          return (
            <div key={dateItem.title} className="space-y-1 relative">
              <div className="flex justify-between items-center">
                <label
                  className={cn(
                    "block text-sm font-medium mb-1",
                    isDisabled && "text-muted-foreground"
                  )}
                >
                  {dateItem.title}
                </label>
                {currentFilter && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setColumnFilters([]);
                      setActiveFilter(null);
                    }}
                    className="text-destructive hover:text-destructive/80 text-xs p-0 h-auto"
                  >
                    Clear
                  </Button>
                )}
              </div>
              <Popover
                open={activeFilter === dateItem.key}
                onOpenChange={(open) => {
                  if (!isDisabled && open) {
                    setActiveFilter(dateItem.key);
                  } else if (!currentFilter) {
                    setActiveFilter(null);
                  }
                }}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start font-normal whitespace-normal overflow-visible",
                      !currentFilter && "text-muted-foreground",
                      activeFilter === dateItem.key && "border-primary"
                    )}
                    disabled={isDisabled}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {currentFilter ? (
                      (currentFilter.value as string)
                    ) : (
                      <span>{dateItem.title}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={
                      currentFilter
                        ? startOfDay(new Date(currentFilter.value as string))
                        : undefined
                    }
                    onSelect={(date) => {
                      if (date) {
                        const formattedDate = format(
                          startOfDay(date),
                          "dd/MM/yyyy"
                        );
                        setColumnFilters([
                          { id: dateItem.key, value: formattedDate },
                        ]);
                        setActiveFilter(null);
                      }
                    }}
                    fromYear={new Date().getFullYear() - 10}
                    toYear={new Date().getFullYear() + 10}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          );
        })}
      </div>
    );
  };
  const t = useTranslations("traveldashboardsidebar");
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t("visa")}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={item.title}>
                <a>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
              {item.items?.length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction className="data-[state=open]:rotate-90">
                      <ChevronRight />
                      <span className="sr-only">Toggle</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.title === t("search.title") &&
                        renderSearchSection(item.items)}
                      {item.title === t("filter.title") &&
                        renderFilterSection(item.items)}
                      {item.title === t("date.title") &&
                        renderDateSection(item.items)}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default NavDashboard;
