"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export const LanguageSwitcher = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="  items-start justify-start pl-0 pt-2 pb-0"
        >
          <Image
            src="/US.svg"
            alt="US Flag"
            width={18}
            height={18}
            className="rounded-full"
            style={{ aspectRatio: "24/24", objectFit: "cover" }}
          />
          <span className="font-medium">{selectedLanguage}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>Select Language</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => setSelectedLanguage("English")}>
            <div className="flex items-center gap-2">
              <Image
                src="/US.svg"
                alt="US Flag"
                width={18}
                height={18}
                className="rounded-full"
                style={{ aspectRatio: "24/24", objectFit: "cover" }}
              />
              <span>English</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSelectedLanguage("\u4E2D\u6587")}>
            <div className="flex items-center gap-2">
              <Image
                src="/CN.svg"
                alt="Chinese Flag"
                width={18}
                height={18}
                className="rounded-full"
                style={{ aspectRatio: "24/24", objectFit: "cover" }}
              />
              <span>中文</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default LanguageSwitcher;
