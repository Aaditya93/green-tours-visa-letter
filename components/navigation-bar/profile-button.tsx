import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { LogOut, FileText } from "lucide-react";

import { signOut } from "../../auth";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { currentUser } from "../../lib/auth";
import { FaUser } from "react-icons/fa";
import Link from "next/link";

export const ProfileButton = async () => {
  const user = await currentUser();
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar>
            <AvatarImage src={user?.image || ""} alt="@shadcn" />
            <AvatarFallback>
              <FaUser />
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={"/dashboard"}>
              <FileText className="w-4 h-4 mr-2" />
              <span>Applications</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={async () => {
              "use server";
              await signOut();
            }}
            className="text-red-600"
          >
            <LogOut className="w-4 h-4 mr-2" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ProfileButton;
