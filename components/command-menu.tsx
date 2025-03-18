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
} from "./ui/command";

import { SerializabledApplication } from "@/config/serialize";

interface CommandMenuProps extends DialogProps {
  pendingApplications?: SerializabledApplication[];
}

const CommandMenu = ({
  pendingApplications = [],
  ...props
}: CommandMenuProps) => {
  const t = useTranslations("travelAgentApplicationStatus.commandMenu");
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
        <span className="hidden lg:inline-flex">{t("searchApplication")}</span>
        <span className="inline-flex lg:hidden">{t("search")}</span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder={t("searchPlaceholder")} />
        <CommandList className="min-h-[400px]">
          <CommandEmpty>{t("noResultsFound")}</CommandEmpty>
          <CommandGroup heading={t("applications")}>
            {pendingApplications.map((application) => (
              <CommandItem
                key={application._id as string}
                value={application.passportDetails[0].fullName}
                onSelect={() => {
                  runCommand(() =>
                    router.push(`/application/visa/${application._id}`)
                  );
                }}
              >
                <div className="flex flex-col flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium">
                      {application.passportDetails[0].fullName}
                    </span>

                    <span className="text-sm text-muted-foreground">
                      {application.passportDetails[0].nationalityCurrent}
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
