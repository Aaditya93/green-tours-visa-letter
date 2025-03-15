import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Image from "next/image";
import { RegisterForm } from "@/components/agent-platform/auth/register-form";
import RedirectLogin from "@/components/auth/redirect-login";

const SignUpPage = () => {
  return (
    <div className="grid lg:grid-cols-2 min-h-screen">
      <div className="relative h-[300px] lg:h-full">
        <Image
          src="/travel-agent.jpg"
          alt="register"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r " />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-primary-foreground z-10 p-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Join Our Travel Agent Network
          </h1>
          <p className="text-xl text-white/90 text-center max-w-md">
            Connect with travelers worldwide and grow your business with our
            cutting-edge platform.
          </p>
        </div>
      </div>
      <div className="bg-gradient-to-b from-background to-secondary">
        <RedirectLogin />
        <div className="flex min-h-screen items-center justify-center py-12 px-6">
          <Card className="w-full max-w-md shadow-lg border-0">
            <CardHeader className="space-y-2 pb-2">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-primary-foreground"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <CardTitle className="text-2xl font-bold">
                  Travel Agent Account
                </CardTitle>
              </div>
              <CardDescription className="text-base">
                Join our network of professional travel agents and start booking
                immediately
              </CardDescription>
            </CardHeader>
            <CardContent className="w-full pt-4">
              <RegisterForm />
              <div className="mt-6 text-center text-sm text-muted-foreground">
                By registering, you agree to our{" "}
                <a
                  href="#"
                  className="font-medium text-primary hover:text-primary/80"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="font-medium text-primary hover:text-primary/80"
                >
                  Privacy Policy
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
