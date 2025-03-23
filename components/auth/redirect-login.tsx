import React from "react";
import { Button } from "@/components/ui/button";
import { CiLogin } from "react-icons/ci";
import Link from "next/link";

const RedirectLogin = () => {
  return (
    <div className="absolute top-4 right-4">
      <Button asChild variant="outline" className="text-primary">
        <Link href="/auth/login" className="flex items-center gap-2">
          {" "}
          <CiLogin /> <span>Login</span>
        </Link>
      </Button>
    </div>
  );
};

export default RedirectLogin;
