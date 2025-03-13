"use client";

import * as React from "react";
import {
  BookOpen,
  Bot,
  LifeBuoy,
  Send,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { RiVisaLine } from "react-icons/ri";
import { IoDocumentTextOutline } from "react-icons/io5";
import { TbReportMoney } from "react-icons/tb";
import { BsPassport } from "react-icons/bs";
import Image from "next/image";
import { NavProjects } from "@/components/nav-projects";
import NavUser from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { CiSearch, CiViewTable } from "react-icons/ci";
import { GrAnalytics } from "react-icons/gr";

const today = new Date();
const thirtyDaysAgo = new Date(today);
const sevendaysAgo = new Date(today);
thirtyDaysAgo.setDate(today.getDate() - 30);
sevendaysAgo.setDate(today.getDate() - 7);

const seven = sevendaysAgo.toISOString().split("T")[0];
const to = today.toISOString().split("T")[0];
const data = {
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  Upload: [
    {
      name: "Apply Visa",
      url: "/travel-agent/apply-visa",
      icon: IoDocumentTextOutline,
    },
    {
      name: "Application Status",
      url: "/travel-agent/application-status/Incomplete/10",
      icon: BsPassport,
    },
    {
      name: "Dashboard",
      url: "/travel-agent/dashboard",
      icon: CiViewTable,
    },
    {
      name: "Search",
      url: `/travel-agent/search/from=${to}&to=${to}`,
      icon: CiSearch,
    },
    {
      name: "Report",
      url: `/travel-agent/report/from=${seven}&to=${to}`,
      icon: GrAnalytics,
    },
    {
      name: "Billing",
      url: `/travel-agent/billing/from=${seven}&to=${to}`,
      icon: TbReportMoney,
    },
    {
      name: "Visa Letter",
      url: "/travel-agent/visa-letter",
      icon: RiVisaLine,
    },
  ],
};

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center  justify-center rounded-lg ">
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
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
};
export default AppSidebar;
