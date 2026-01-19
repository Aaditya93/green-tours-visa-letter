"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Globe,
  Shield,
  Sparkles,
  Timer,
  Zap,
  LucideIcon,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import PricingTable from "@/components/agent-platform/admin-panel/price-table";

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
  initialPriceData: PriceData;
}

/**
 * Shared StatCard component for hero metrics
 */
const StatCard = ({
  value,
  label,
  icon: Icon,
}: {
  value: string;
  label: string;
  icon: LucideIcon;
}) => (
  <Card className="text-center group hover:border-primary/50 transition-all shadow-sm bg-card/50 backdrop-blur-sm border-primary/5">
    <CardContent className="pt-6">
      <div className="mb-4 inline-flex p-3 rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
        <Icon className="h-6 w-6" strokeWidth={2.5} />
      </div>
      <h3 className="text-2xl md:text-3xl font-bold mb-1 tracking-tight">
        {value}
      </h3>
      <p className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-widest">
        {label}
      </p>
    </CardContent>
  </Card>
);

/**
 * Shared Feature component for key benefits
 */
const Feature = ({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) => (
  <div className="flex items-start space-x-4 p-6 rounded-2xl bg-card/50 border border-primary/5 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 backdrop-blur-sm">
    <div className="flex-shrink-0">
      <div className="p-3 rounded-xl bg-primary/10 text-primary">
        <Icon className="h-6 w-6" />
      </div>
    </div>
    <div className="space-y-1.5 text-left">
      <h3 className="font-bold text-lg leading-tight">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
    </div>
  </div>
);

const PricingPage = ({ currency, initialPriceData }: PricingPageProps) => {
  const t = useTranslations("visa-letter");

  return (
    <div className="w-full max-w-full overflow-hidden bg-transparent">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 space-y-24 max-w-7xl">
        {/* Hero Section */}
        <section className="text-center space-y-8 max-w-4xl mx-auto flex flex-col items-center">
          <Badge
            className="px-4 py-1.5 text-sm font-medium bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors w-fit"
            variant="outline"
          >
            <Sparkles className="w-4 h-4 mr-2 inline text-primary shrink-0" />
            {t("limitedTimeOffer")}
          </Badge>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 pb-2">
            {t("heroTitle")}
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            {t("heroDescription")}
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 pt-8 w-full">
            <StatCard
              value={t("stats.processedValue")}
              label={t("stats.processedLabel")}
              icon={Globe}
            />
            <StatCard
              value={t("stats.successValue")}
              label={t("stats.successLabel")}
              icon={CheckCircle2}
            />
            <StatCard
              value={t("stats.supportValue")}
              label={t("stats.supportLabel")}
              icon={Clock}
            />
            <StatCard
              value={t("stats.fastestValue")}
              label={t("stats.fastestLabel")}
              icon={Timer}
            />
          </div>
        </section>

        {/* Features Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <Feature
            icon={Zap}
            title={t("features.express.title")}
            description={t("features.express.description")}
          />
          <Feature
            icon={Shield}
            title={t("features.secure.title")}
            description={t("features.secure.description")}
          />
          <Feature
            icon={Clock}
            title={t("features.support.title")}
            description={t("features.support.description")}
          />
        </section>

        {/* Pricing Table Section */}
        <section className="relative w-full">
          <div className="absolute inset-0 bg-primary/5 rounded-[3rem] -rotate-1 scale-100 md:scale-105 -z-10 blur-3xl opacity-30 pointer-events-none" />
          <div className="w-full">
            <PricingTable prices={initialPriceData} currency={currency} />
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="text-center bg-primary text-primary-foreground rounded-[2rem] p-8 md:p-16 space-y-8 shadow-xl relative overflow-hidden group w-full">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-32 -mb-32 blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              {t("cta.title")}
            </h2>
            <p className="text-primary-foreground/90 text-lg max-w-xl mx-auto leading-relaxed">
              {t("cta.description")}
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="mt-4 font-bold shadow-lg h-14 px-10 text-lg hover:scale-105 transition-all w-full sm:w-auto"
              asChild
            >
              <Link href="/travel-agent/apply-visa">
                {t("cta.buttonText")}{" "}
                <ArrowRight className="ml-2 w-5 h-5 shrink-0" />
              </Link>
            </Button>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-4xl mx-auto w-full space-y-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center md:text-left tracking-tight">
            {t("faq.title")}
          </h2>
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem
              value="item-1"
              className="border rounded-2xl px-6 bg-card/50 transition-all data-[state=open]:border-primary/50 backdrop-blur-sm shadow-sm"
            >
              <AccordionTrigger className="text-lg font-semibold hover:no-underline py-6 text-left">
                {t("faq.questions.processingTime")}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
                {t("faq.answers.processingTime")}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value="item-2"
              className="border rounded-2xl px-6 bg-card/50 transition-all data-[state=open]:border-primary/50 backdrop-blur-sm shadow-sm"
            >
              <AccordionTrigger className="text-lg font-semibold hover:no-underline py-6 text-left">
                {t("faq.questions.entryDifference")}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
                {t("faq.answers.entryDifference")}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value="item-3"
              className="border rounded-2xl px-6 bg-card/50 transition-all data-[state=open]:border-primary/50 backdrop-blur-sm shadow-sm"
            >
              <AccordionTrigger className="text-lg font-semibold hover:no-underline py-6 text-left">
                {t("faq.questions.security")}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
                {t("faq.answers.security")}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* News Section */}
        <section className="bg-muted/30 p-8 md:p-12 rounded-[2rem] space-y-8 w-full">
          <h2 className="text-2xl font-bold tracking-tight">
            {t("news.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <Card className="border-none shadow-none bg-background/60 backdrop-blur-sm hover:bg-background/80 transition-colors">
              <CardContent className="pt-6">
                <h3 className="font-bold text-lg mb-2">
                  {t("news.items.express.title")}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {t("news.items.express.content")}
                </p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-none bg-background/60 backdrop-blur-sm hover:bg-background/80 transition-colors">
              <CardContent className="pt-6">
                <h3 className="font-bold text-lg mb-2">
                  {t("news.items.holiday.title")}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {t("news.items.holiday.content")}
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PricingPage;
