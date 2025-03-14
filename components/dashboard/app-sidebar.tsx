"use client";

import { CiFilter } from "react-icons/ci";
import { CiCalendar } from "react-icons/ci";
import * as React from "react";
import { CiViewTable } from "react-icons/ci";
import { CiSearch } from "react-icons/ci";
import Image from "next/image";
import { NavProjects } from "@/components/nav-projects";
import NavUser from "@/components/nav-user";
import { ColumnFiltersState } from "@tanstack/react-table";
import { Dispatch, SetStateAction } from "react";
import { BsFiletypePdf } from "react-icons/bs";
import { GrAnalytics } from "react-icons/gr";
import { SquareTerminal } from "lucide-react";
import { NavMain } from "../nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import NavDashboard from "@/components/nav-dashboard";
const today = new Date();
const thirtyDaysAgo = new Date(today);
const sevendaysAgo = new Date(today);
thirtyDaysAgo.setDate(today.getDate() - 30);
sevendaysAgo.setDate(today.getDate() - 7);

const seven = sevendaysAgo.toISOString().split("T")[0];
const to = today.toISOString().split("T")[0];

const getData = (Users: { username: string }[]) => ({
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Agent Platform",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Admin Panel",
          url: "/agent-platform/admin-panel",
        },
        {
          title: "Visa Letter Prices",
          url: "/agent-platform/visa-letter-price/10",
        },
        {
          title: "Immgration Prices",
          url: `/agent-platform/immigration-price/10`,
        },
        {
          title: "A-Payment",
          url: `/agent-platform/payment/6777bb039da64c84fb251323/from=${seven}&to=${to}`,
        },
        {
          title: "I-Payment",
          url: `/agent-platform/payment/immigration/Hanoi/from=${seven}&to=${to}`,
        },
        {
          title: "Billing",
          url: `agent-platform/billing/677b88cc3c6259f5025f6645/from=${seven}&to=${to}`,
        },
      ],
    },
  ],
  NavDashboard: [
    {
      title: "Search",

      icon: CiSearch,
      isActive: true,
      items: [
        {
          title: "Full Name",
          key: "fullName",
          items: [],
        },

        {
          title: "Passport Number",
          key: "passportNumber",
          items: [],
        },
        {
          title: "Country",
          key: "nationalityCurrent",
          items: [],
        },
        {
          title: "Code",
          key: "code",
          items: [],
        },
      ],
    },
    {
      title: "Filter",

      icon: CiFilter,
      items: [
        {
          title: "Airport",
          key: "placeOfIssue",

          items: [
            { title: "Noi Bai Airport" },
            { title: "Phu Bai Airport" },
            { title: "Phu Quoc Airport" },
            { title: "Tan Son Nhat Airport" },
            {
              title: "Cam Ranh Airport",
            },
            { title: "Da Nang Airport" },
            { title: "Lien Khuong Airport" },
            { title: "Cat Bi Airport" },
            { title: "Cau Treo Frontier" },
            { title: "Cha Lo Frontier" },
            { title: "Ha Tien Frontier" },
            { title: "Huu Nghi Frontier" },
            { title: "Lao Bao Frontier" },
            { title: "Lao Cai Frontier" },
            { title: "Moc Bai Frontier" },
            { title: "Mong Cai Frontier" },
            { title: "Na Meo Frontier" },
            { title: "Tay Trang Frontier" },
            { title: "Thanh Thuy Frontier" },
            { title: "Xa Mat Frontier" },
          ],
        },
        {
          title: "embassy",
          key: "placeOfIssue",

          items: [
            {
              title: "China - Kunming",
            },
            {
              title: "USA -  Houston",
            },
            {
              title: "China - Nanning",
            },
            {
              title: "China - Guangzhou",
            },
            {
              title: "Cambodia - Sihanouk Ville",
            },
            {
              title: "Australia - Sydney",
            },
            {
              title: "China - Shanghai",
            },
            {
              title: "Taiwan - Taipei",
            },
            {
              title: "Bangladesh",
            },
            {
              title: "Australia - Canberra",
            },
            {
              title: "Japan",
            },
          ],
        },
        {
          title: "Creator",
          key: "creator",
          items: Users.map((user) => ({
            title: user.username,
          })) || [
            {
              title: "Aaditya",
            },
          ],
        },
        {
          title: "Handled By",
          key: "handleBy",

          items: [
            {
              title: "MR.Xia",
            },
            {
              title: "MR.SAMI",
            },
            {
              title: "JESSY",
            },
            {
              title: "TONY",
            },
            {
              title: "MR.SUMMER",
            },
            {
              title: "C.HUONG",
            },
            {
              title: "ANH THANG",
            },
            {
              title: "C.YEN",
            },
            {
              title: "YUEHUA",
            },
            {
              title: "TOP",
            },
            {
              title: "YES",
            },
            {
              title: "STT",
            },
            {
              title: "YUN YANG",
            },
            {
              title: "DAI NAM",
            },
            {
              title: "BOB",
            },
          ],
        },
        {
          title: "Speed",
          key: "speed",

          items: [
            {
              title: "1H",
            },
            {
              title: "2H",
            },
            {
              title: "4H",
            },
            {
              title: "8H",
            },
            {
              title: "1D",
            },
            {
              title: "2D",
            },
            {
              title: "3D",
            },
            {
              title: "4D",
            },
            {
              title: "Normal",
            },
          ],
        },

        {
          title: "Duration",
          key: "duration",

          items: [
            {
              title: "Single Entry",
            },
            {
              title: "Multiple Entry",
            },
          ],
        },
      ],
    },
    {
      title: "Date",

      icon: CiCalendar,
      items: [
        {
          title: "Created Date",
          key: "createdDate",
          items: [],
        },
        {
          title: "From Date",
          key: "fromDate",
          items: [],
        },
        {
          title: "To Date",
          key: "toDate",
          items: [],
        },
      ],
    },
  ],

  Upload: [
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: CiViewTable,
    },
    {
      name: "Search",
      url: `/search/from=${to}&to=${to}`,
      icon: CiSearch,
    },
    {
      name: "PDF",
      url: "/pdf",
      icon: BsFiletypePdf,
    },
    {
      name: "Report",
      url: `/report/from=${seven}&to=${to}`,
      icon: GrAnalytics,
    },
  ],
});

interface AppSidebarProps {
  searchSelections: string;
  setSearchSelections: Dispatch<SetStateAction<string>>;
  columnFilters: ColumnFiltersState;
  setColumnFilters: Dispatch<SetStateAction<ColumnFiltersState>>;
  Users: { username: string }[];
}

const AppSidebar = ({
  Users,
  searchSelections,
  setSearchSelections,
  columnFilters,
  setColumnFilters,
  ...props
}: AppSidebarProps) => {
  const data = getData(Users);
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center  justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Image
                    src="/tours.png"
                    alt=""
                    className="rounded-xl"
                    width={50}
                    height={50}
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">VISACAR</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.Upload} />
        <NavMain items={data.navMain} />
        <NavDashboard
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
          searchSelections={searchSelections}
          setSearchSelections={setSearchSelections}
          items={data.NavDashboard}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
