"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { type DialogProps } from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { ICompany } from "@/db/models/company";

interface CommandMenuProps extends DialogProps {
  companies?: ICompany[];
}

const CommandMenu = ({ companies = [], ...props }: CommandMenuProps) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return;
        }

        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);
  const t = useTranslations("visaLetterPrices");

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          "relative h-8 w-full justify-start rounded-[0.5rem] bg-muted/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-80 lg:w-[32rem] xl:w-[38rem]"
        )}
        onClick={() => setOpen(true)}
        {...props}
      >
        <span className="hidden lg:inline-flex">{t("search1")}</span>
        <span className="inline-flex lg:hidden">{t("search")}</span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder={t("search2")} />
        <CommandList className="min-h-[400px]">
          <CommandEmpty>{t("result")}</CommandEmpty>
          <CommandGroup>
            {companies.map((company) => (
              <CommandItem
                key={company._id as string}
                value={company.name}
                onSelect={() => {
                  runCommand(() =>
                    router.push(
                      `/agent-platform/visa-letter-price/company/${company._id}`
                    )
                  );
                }}
              >
                <div className="flex flex-col flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium">
                      {company.name}
                    </span>

                    <span className="text-sm text-muted-foreground">
                      {company.country}
                    </span>
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};
export default CommandMenu;
