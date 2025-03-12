import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Image from "next/image";
import { RegisterForm } from "@/components/auth/register-form";
import RedirectLogin from "@/components/auth/redirect-login";

const SignUpPage = () => {
  return (
    <div className="grid lg:grid-cols-2 min-h-screen">
      <div className="relative h-[300px] lg:h-full">
        <Image
          src="/login.webp"
          alt="register"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-primary-foreground z-10 p-8">
          <h1 className="text-5xl font-bold mb-6 text-white">
            Welcome to GreenTours
          </h1>
          <p className="text-xl text-center max-w-md mb-8 text-white">
            Join our community of eco-conscious travelers and explore the world
            sustainably.
          </p>
          <div className="mt-4 p-6 bg-background/10 backdrop-blur-sm rounded-[var(--radius)] border border-border/20">
            <h3 className="text-xl font-semibold mb-4 text-white">
              Member Benefits
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <span className="bg-primary rounded-full p-1 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary-foreground"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
                <span>Exclusive eco-friendly destinations</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="bg-primary rounded-full p-1 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary-foreground"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
                <span>Special member discounts</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="bg-primary rounded-full p-1 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary-foreground"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
                <span>Carbon-offset travel options</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-background">
        <RedirectLogin />
        <div className="flex min-h-screen items-center justify-center py-12 px-6">
          <Card className="w-full max-w-md border-border shadow-lg">
            <CardHeader className="space-y-2">
              <CardTitle className="text-3xl font-bold text-primary text-center">
                Create an account
              </CardTitle>
              <CardDescription className="text-center text-lg text-muted-foreground">
                Enter your details below to start your sustainable journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RegisterForm />
              <div className="mt-8 pt-4 border-t border-border">
                <p className="text-sm text-center text-muted-foreground">
                  By registering, you agree to our{" "}
                  <a href="#" className="text-primary hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-primary hover:underline">
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
