"use client";
import { Card, CardContent } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Globe,
  Shield,
  Sparkles,
  Timer,
  Zap,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import PricingTable from "../../admin-panel/price-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const StatCard = ({
  value,
  label,
  icon: Icon,
}: {
  value: string;
  label: string;
  icon: LucideIcon;
}) => (
  <Card className="text-center">
    <CardContent className="pt-6">
      <div className="mb-4 inline-flex p-3 rounded-full bg-blue-100">
        <Icon className="h-6 w-6 text-blue-600" />
      </div>
      <h3 className="text-3xl font-bold mb-2">{value}</h3>
      <p className="">{label}</p>
    </CardContent>
  </Card>
);

const Feature = ({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) => (
  <div className="flex items-start space-x-4 p-6 rounded-xl  shadow-lg hover:shadow-md transition-all duration-200">
    <div className="flex-shrink-0">
      <div className="p-3 rounded-xl bg-blue-50">
        <Icon className="h-6 w-6 text-blue-600" />
      </div>
    </div>
    <div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="">{description}</p>
    </div>
  </div>
);
interface PriceEntry {
  speed: string;
  price: number;
}

interface PriceData {
  singleEntry: PriceEntry[];
  multipleEntry: PriceEntry[];
}

interface PricingPageProps {
  currency: string;
  initialPriceData?: PriceData;
}

const PricingPage = ({ currency, initialPriceData }: PricingPageProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b ">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <Badge className="mb-4" variant="secondary">
            <Sparkles className="w-4 h-4 mr-1 inline" />
            Limited Time Offer
          </Badge>
          <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600">
            Streamline Your Visa Process
          </h1>
          <p className="text-xl  max-w-3xl mx-auto mb-12">
            Fast, secure, and reliable visa letter processing tailored to your
            timeline. Get started in minutes with our simple application
            process.
          </p>

          {/* Stats Section */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            <StatCard value="50k+" label="Letters Processed" icon={Globe} />
            <StatCard value="99%" label="Success Rate" icon={CheckCircle2} />
            <StatCard value="24/7" label="Support Available" icon={Clock} />
            <StatCard value="1 Hour" label="Fastest Processing" icon={Timer} />
          </div>
        </div>

        {/* Main Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <Feature
            icon={Zap}
            title="Express Processing"
            description="Get your visa letter in as fast as 1 hour with our premium processing options."
          />
          <Feature
            icon={Shield}
            title="Secure & Reliable"
            description="Bank-level encryption and secure processing for your peace of mind."
          />
          <Feature
            icon={Clock}
            title="Round-the-Clock Support"
            description="Our dedicated team is available 24/7 to assist you with any queries."
          />
        </div>

        <PricingTable prices={initialPriceData} currency={currency} />

        <div className="text-center bg-gradient-to-r from-blue-300 to-blue-600 rounded-2xl p-12 ">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="mb-8 text-lg">
            Join thousands of satisfied customers who trust us with their visa
            letters.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/travel-agent/apply-visa">
              Start Your Application Now <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </div>
        {/* FAQ Section */}
        <div className="w-full  mx-auto mb-20 mt-8">
          <h2 className="text-3xl font-bold text-start mb-8">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1 ">
              <AccordionTrigger>
                How fast can I get my visa letter?
              </AccordionTrigger>
              <AccordionContent>
                Our fastest processing time is 1 hour with our premium service.
                We also offer various other processing speeds to match your
                needs and budget.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                What&apos;s the difference between single and multiple entry?
              </AccordionTrigger>
              <AccordionContent>
                Single entry allows you to enter the country once, while
                multiple entry permits multiple entries during the visa validity
                period.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Is my information secure?</AccordionTrigger>
              <AccordionContent>
                Yes, we use bank-level encryption and secure processing systems
                to protect your personal information and documents.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* News */}
        <div className="mt-12 bg-secondary p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Latest News</h2>
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">
                  New Express Processing Options Available
                </h3>
                <p className="text-gray-600">
                  We&apos;ve added more express processing options to better
                  serve your urgent visa letter needs.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">
                  Holiday Season Processing Times
                </h3>
                <p className="text-gray-600">
                  Please note that processing times may be slightly longer
                  during holiday periods.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
