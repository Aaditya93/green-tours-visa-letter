import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { IoEnterOutline } from "react-icons/io5";
import { FaLeaf, FaRegCompass } from "react-icons/fa";
import { LoginForm } from "@/components/auth/login-form";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const LoginPage = () => {
  return (
    <div className="grid lg:grid-cols-2 min-h-screen">
      <div className="relative h-[300px] lg:h-full overflow-hidden">
        <Image
          src="/login.jpg"
          alt="login"
          fill
          className="object-cover scale-105 hover:scale-100 transition-transform duration-700"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br  to-transparent" />
        <div className="absolute inset-0  flex-col justify-end p-8 text-primary-foreground hidden lg:flex">
          <div className="backdrop-blur-sm bg-black/20 p-6 rounded-xl max-w-md border border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <FaLeaf className="text-primary-foreground text-2xl" />
              <h2 className="text-3xl font-bold drop-shadow-md">GreenTours</h2>
            </div>
            <p className="text-lg mt-2 opacity-90 leading-relaxed">
              Your gateway to sustainable travel experiences around the world
            </p>
            <div className="flex items-center gap-2 mt-4 text-sm">
              <FaRegCompass className="text-primary-foreground" />
              <span>Explore eco-friendly destinations with confidence</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center p-4 lg:py-12 lg:px-8 bg-gradient-to-br from-background via-background to-secondary/50 relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl"></div>

        <Button
          asChild
          variant="outline"
          className="absolute top-4 right-4  transition-all "
        >
          <Link
            href="/auth/travel-agent/register"
            className="flex items-center gap-2"
          >
            <IoEnterOutline className="text-primary" />
            <span className="font-medium">Travel Agent Portal</span>
          </Link>
        </Button>

        <div className="flex items-center mb-8 lg:hidden">
          <FaLeaf className="text-primary text-2xl mr-2" />
          <h1 className="text-2xl font-bold text-primary">GreenTours</h1>
        </div>

        <Card className="w-full max-w-md mx-auto border-primary/10 shadow-xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="space-y-2 p-6 pb-4 border-b border-primary/10">
            <CardTitle className="text-2xl font-bold text-primary">
              Welcome back
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-8">
            <LoginForm />
          </CardContent>
          <CardFooter className="flex flex-col items-center p-6 pt-2 text-sm text-muted-foreground">
            <p>
              New to GreenTours?{" "}
              <Link
                href="/auth/register"
                className="text-primary hover:underline font-medium transition-colors"
              >
                Create an account
              </Link>
            </p>
            <p className="mt-3">
              Need help?{" "}
              <Link
                href="/support"
                className="text-primary hover:underline transition-colors"
              >
                Contact support
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
