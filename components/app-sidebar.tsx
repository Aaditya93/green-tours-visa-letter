"use client";

import * as React from "react";
import { SquareTerminal } from "lucide-react";
import { NavMain } from "./nav-main";
import { GrAnalytics } from "react-icons/gr";
import { BsFiletypePdf } from "react-icons/bs";
import { CiViewTable } from "react-icons/ci";
import { CiSearch } from "react-icons/ci";
import { useTranslations } from "next-intl";
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
const today = new Date();
const thirtyDaysAgo = new Date(today);
thirtyDaysAgo.setDate(today.getDate() - 30);
const sevendaysAgo = new Date(today);
sevendaysAgo.setDate(today.getDate() - 7);

const seven = sevendaysAgo.toISOString().split("T")[0];

const to = today.toISOString().split("T")[0];

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const t = useTranslations("appSidebar");
  const data = {
    navMain: [
      {
        title: t("menu.agentPlatform"),
        url: "#",
        icon: SquareTerminal,
        isActive: true,
        items: [
          {
            title: t("menu.adminPanel"),
            url: "/agent-platform/admin-panel",
          },
          {
            title: t("menu.visaLetterPrice"),
            url: "/agent-platform/visa-letter-price/10",
          },
          {
            title: t("menu.immgrationPrice"),
            url: `/agent-platform/immigration-price/10`,
          },
          {
            title: t("menu.aPayment"),
            url: `/agent-platform/payment/6777bb039da64c84fb251323/from=${seven}&to=${to}`,
          },
          {
            title: t("menu.iPayment"),
            url: `/agent-platform/payment/immigration/Hanoi/from=${seven}&to=${to}`,
          },
          // {
          //   title: t("menu.billing"),
          //   url: `/agent-platform/billing/677b88cc3c6259f5025f6645/from=${seven}&to=${to}`,
          // },
          {
            title: "Create Bill",
            url: `/agent-platform/create-bill`,
          },
          {
            title: "Send Visa Letter",
            url: `/agent-platform/send-visa-letter`,
          },
          {
            title: "Visa Letter",
            url: `/agent-platform/company-visa-letter/67d11373b89197434cbe8c3f/10`,
          },
        ],
      },
    ],

    Upload: [
      {
        name: t("menu.dashboard"),
        url: "/dashboard",
        icon: CiViewTable,
      },
      {
        name: t("menu.search"),
        url: `/search/from=${to}&to=${to}`,
        icon: CiSearch,
      },
      {
        name: t("menu.pdf"),
        url: "/pdf",
        icon: BsFiletypePdf,
      },
      {
        name: t("menu.report"),
        url: `/report/from=${seven}&to=${to}`,
        icon: GrAnalytics,
      },
    ],
  };
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center  justify-center rounded-lg  text-sidebar-primary-foreground">
                  <Image
                    src="/tours.png"
                    alt=""
                    className="rounded-xl"
                    width={50}
                    height={50}
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {t("branding.name")}
                  </span>
                  <span className="truncate text-xs">{t("branding.tier")}</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.Upload} />
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
};
export default AppSidebar;
