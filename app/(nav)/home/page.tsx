import Image from "next/image";
import { Button } from "@/components/ui/button";
import React from "react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const userImages = [
  "https://swiftvisa1.s3.ap-south-1.amazonaws.com/profilepics/Priya+Sharma.jpg",
  "https://swiftvisa1.s3.ap-south-1.amazonaws.com/profilepics/Amit+Patel.jpg",
  "https://swiftvisa1.s3.ap-south-1.amazonaws.com/profilepics/Deepika+Reddy.jpg",
];

export const HomePage = async () => {
  return (
    <div className="min-h-screen  bg-background">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 min-h-screen py-12">
          {/* Content Section */}
          <div className="flex flex-col items-start justify-center space-y-6 px-4 md:px-8 lg:px-12">
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              <span className="text-primary font-semibold">
                99.7% Success Rate
              </span>
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
              Fast & Reliable{" "}
              <span className="text-primary">Visa Processing</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
              Join thousands of satisfied customers worldwide who trust us to
              handle their visa applications with speed and precision.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90"
                asChild
              >
                <Link href="/visa">Start Your Application</Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 border-primary text-primary hover:bg-primary/10"
              >
                Learn More
              </Button>
            </div>

            <div className="flex items-center gap-4 pt-8">
              <div className="flex -space-x-4">
                {userImages.map((image, i) => (
                  <div
                    key={i}
                    className="w-12 h-12 rounded-full border-2 border-background ring-2 ring-primary/20 overflow-hidden"
                  >
                    <Image
                      src={image}
                      alt={`User ${i + 1}`}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <p className="text-muted-foreground">
                <span className="font-bold text-foreground">10,000+</span>{" "}
                successful applications
              </p>
            </div>
          </div>

          {/* Image Section */}
          <div className="relative h-[400px] md:h-[600px] w-full rounded-[var(--radius)] overflow-hidden">
            <div className="absolute inset-0 rounded-[var(--radius)] ring-1 ring-primary/10 bg-primary/5" />
            <Image
              src="https://swiftvisa1.s3.ap-south-1.amazonaws.com/homepage/homepage-2.webp"
              alt="Visa Processing Service"
              fill
              className="object-cover transition-transform hover:scale-105 duration-700"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />

            {/* Decorative elements */}
            <div className="absolute -inset-1 rounded-[var(--radius)] bg-gradient-to-r from-primary/20 to-transparent opacity-30 blur-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
