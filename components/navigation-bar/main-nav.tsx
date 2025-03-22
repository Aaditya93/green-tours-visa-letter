"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../../lib/utils";
import Image from "next/image";
import { useSession } from "next-auth/react";
export const MainNav = () => {
  const pathname = usePathname();
  const session = useSession();
  return (
    <div className="mr-4 hidden md:flex">
      <div className="relative w-12 h-12 bg-background pl-2">
        <Image
          src="/tours.png"
          alt="VISACAR Logo"
          fill
          className="object-contain p-1"
          priority
        />
      </div>
      <Link href="/home" className="mr-4 flex items-center gap-2 lg:mr-6">
        <span className="hidden font-bold lg:inline-block text-foreground">
          VISACAR
        </span>
      </Link>
      <nav className="flex items-center gap-4 text-sm xl:gap-6">
        <Link
          href={
            session.data?.user.role == "Admin"
              ? "/dashboard"
              : "/travel-agent/dashboard"
          }
          className={cn(
            "transition-colors hover:text-primary",
            pathname === "/visa"
              ? "text-primary font-medium"
              : "text-muted-foreground"
          )}
        >
          Visa
        </Link>
        <Link
          href="/contact-us"
          className={cn(
            "transition-colors hover:text-primary",
            pathname?.startsWith("/contact-us")
              ? "text-primary font-medium"
              : "text-muted-foreground"
          )}
        >
          Contact Us
        </Link>

        <Link
          href="/auth/travel-agent/register"
          className={cn(
            "transition-colors hover:text-primary",
            pathname?.startsWith("/charts")
              ? "text-primary font-medium"
              : "text-muted-foreground"
          )}
        >
          Travel Agent
        </Link>
      </nav>
    </div>
  );
};

export default MainNav;
