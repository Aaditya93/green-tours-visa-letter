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
import PricingTable from "@/components/agent-platform/admin-panel/price-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";

/**
 * StatCard component for hero section metrics.
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
  <Card className="text-center group hover:border-primary/50 transition-colors shadow-sm bg-card/50 backdrop-blur-sm">
    <CardContent className="pt-6">
      <div className="mb-4 inline-flex p-3 rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-3xl font-bold mb-1 tracking-tight">{value}</h3>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {label}
      </p>
    </CardContent>
  </Card>
);

/**
 * Feature component for selling points.
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
  <div className="flex items-start space-x-4 p-6 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-all duration-300">
    <div className="flex-shrink-0">
      <div className="p-3 rounded-xl bg-primary/5 text-primary">
        <Icon className="h-6 w-6" />
      </div>
    </div>
    <div className="space-y-1">
      <h3 className="font-bold text-lg leading-tight">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
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

/**
 * PricingPage Component (Client Component)
 * Landing page for travel agents highlighting visa letter benefits and pricing.
 */
const PricingPage = ({ currency, initialPriceData }: PricingPageProps) => {
  const t = useTranslations("visa-letter");

  return (
    <div className="min-h-screen bg-transparent">
      <div className="container mx-auto px-4 py-12 lg:py-20 space-y-24">
        {/* Hero Section */}
        <section className="text-center space-y-8 max-w-4xl mx-auto">
          <Badge
            className="px-4 py-1.5 text-sm font-medium bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors"
            variant="outline"
          >
            <Sparkles className="w-4 h-4 mr-2 inline text-primary" />
            {t("limitedTimeOffer")}
          </Badge>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 pb-2">
            {t("heroTitle")}
          </h1>

          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            {t("heroDescription")}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pt-8">
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
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
        {initialPriceData && (
          <section className="relative">
            <div className="absolute inset-0 bg-primary/5 rounded-[3rem] -rotate-1 scale-105 -z-10 blur-3xl opacity-50" />
            <PricingTable prices={initialPriceData} currency={currency} />
          </section>
        )}

        {/* Call to Action Section */}
        <section className="text-center bg-primary text-primary-foreground rounded-[2rem] p-8 md:p-16 space-y-8 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-32 -mb-32 blur-3xl" />

          <div className="relative z-10 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">{t("cta.title")}</h2>
            <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto">
              {t("cta.description")}
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="mt-4 font-bold shadow-lg h-14 px-8 text-lg hover:scale-105 transition-transform"
              asChild
            >
              <Link href="/travel-agent/apply-visa">
                {t("cta.buttonText")} <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-3xl mx-auto space-y-10">
          <h2 className="text-3xl font-extrabold text-start tracking-tight">
            {t("faq.title")}
          </h2>
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem
              value="item-1"
              className="border rounded-2xl px-6 bg-card transition-all data-[state=open]:border-primary/50"
            >
              <AccordionTrigger className="text-lg font-semibold hover:no-underline py-6">
                {t("faq.questions.processingTime")}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
                {t("faq.answers.processingTime")}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value="item-2"
              className="border rounded-2xl px-6 bg-card transition-all data-[state=open]:border-primary/50"
            >
              <AccordionTrigger className="text-lg font-semibold hover:no-underline py-6">
                {t("faq.questions.entryDifference")}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
                {t("faq.answers.entryDifference")}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value="item-3"
              className="border rounded-2xl px-6 bg-card transition-all data-[state=open]:border-primary/50"
            >
              <AccordionTrigger className="text-lg font-semibold hover:no-underline py-6">
                {t("faq.questions.security")}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
                {t("faq.answers.security")}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* News Section */}
        <section className="bg-muted/30 p-8 md:p-12 rounded-[2rem] space-y-8">
          <h2 className="text-2xl font-bold tracking-tight">
            {t("news.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-none shadow-none bg-background/60 backdrop-blur-sm">
              <CardContent className="pt-6">
                <h3 className="font-bold text-lg mb-2">
                  {t("news.items.express.title")}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {t("news.items.express.content")}
                </p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-none bg-background/60 backdrop-blur-sm">
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
