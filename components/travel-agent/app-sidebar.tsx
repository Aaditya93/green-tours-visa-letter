"use client";

import * as React from "react";
import { RiVisaLine } from "react-icons/ri";
import { IoDocumentTextOutline } from "react-icons/io5";
import { TbReportMoney } from "react-icons/tb";
import { BsPassport } from "react-icons/bs";
import Image from "next/image";
import { NavProjects } from "@/components/nav-projects";
import NavUser from "@/components/nav-user";
import { IoPricetagOutline } from "react-icons/io5";
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
import { useTranslations } from "next-intl";

const today = new Date();
const thirtyDaysAgo = new Date(today);
const sevendaysAgo = new Date(today);
thirtyDaysAgo.setDate(today.getDate() - 30);
sevendaysAgo.setDate(today.getDate() - 7);

const seven = sevendaysAgo.toISOString().split("T")[0];
const to = today.toISOString().split("T")[0];

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const t = useTranslations("travelsidebar");

  const data = {
    Upload: [
      {
        name: t("menu.applyVisa"),
        url: "/travel-agent/apply-visa",
        icon: IoDocumentTextOutline,
      },
      {
        name: t("menu.applicationStatus"),
        url: "/travel-agent/application-status/Incomplete/10",
        icon: BsPassport,
      },
      {
        name: t("menu.dashboard"),
        url: "/travel-agent/dashboard",
        icon: CiViewTable,
      },
      {
        name: t("menu.search"),
        url: `/travel-agent/search/from=${to}&to=${to}`,
        icon: CiSearch,
      },
      {
        name: t("menu.report"),
        url: `/travel-agent/report/from=${seven}&to=${to}`,
        icon: GrAnalytics,
      },
      {
        name: t("menu.billing"),
        url: `/travel-agent/billing/from=${seven}&to=${to}`,
        icon: TbReportMoney,
      },
      {
        name: t("menu.visaLetterPrices"),
        url: "/travel-agent/visa-letter",
        icon: IoPricetagOutline,
      },
      {
        name: t("menu.visaLetter"),
        url: "/travel-agent/company-visa-letter/10",
        icon: RiVisaLine,
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
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg  text-sidebar-primary-foreground">
                  <Image
                    src="/tours.png"
                    alt={t("branding.logoAlt")}
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
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
