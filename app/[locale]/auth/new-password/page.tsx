import React from "react";
import { Lock } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import PasswordResetForm from "@/components/auth/password-reset-form";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function PasswordResetPage({ params }: PageProps) {
  await params;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md mx-4 shadow-lg border-primary/5">
        <CardHeader className="space-y-1 text-center pb-6">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full animate-in zoom-in duration-500">
              <Lock className="w-6 h-6 text-primary" />
            </div>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            Create New Password
          </h2>
          <p className="text-sm text-muted-foreground px-4">
            Please choose a strong password to protect your account
          </p>
        </CardHeader>
        <CardContent className="pb-4">
          <PasswordResetForm />
        </CardContent>
        <CardFooter className="flex justify-center pb-6">
          <Button
            asChild
            variant="link"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <Link href="/auth/login">Back to Login</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
export default PasswordResetPage;
