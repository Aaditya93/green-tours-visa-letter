import ModeSwitcher from "../theme/theme-button";
import { Button } from "../ui/button";
import { MainNav } from "./main-nav";

import Link from "next/link";
import MonbileNav from "./mobile-nav";
import ProfileButton from "./profile-button";

import { auth } from "../../auth";
import LanguageSwitcher from "./language-switcher";
import { getTranslations } from "next-intl/server";

export const SiteHeader = async () => {
  const session = await auth();
  const t = await getTranslations("navbar");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-border">
      <div className="flex h-14 items-center px-4">
        <MainNav />
        <MonbileNav />

        {/* Wrapper for right-side items */}
        <div className="ml-auto flex items-center space-x-2 w-full md:w-auto">
          {/* Search bar wrapper with responsive width */}
          <div className="w-full md:w-auto"></div>

          {/* Group ModeSwitcher and auth buttons */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <LanguageSwitcher />
            <ModeSwitcher />

            {session && <ProfileButton />}
            {!session && (
              <Button asChild variant="ghost">
                <Link href="/auth/login">{t("login")}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;
