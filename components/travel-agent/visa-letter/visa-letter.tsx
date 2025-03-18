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
      <div className="mb-4 inline-flex p-3 rounded-full bg-primary/10">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-3xl font-bold mb-2">{value}</h3>
      <p className="text-muted-foreground">{label}</p>
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
  <div className="flex items-start space-x-4 p-6 rounded-xl bg-card shadow-lg hover:shadow-md transition-all duration-200">
    <div className="flex-shrink-0">
      <div className="p-3 rounded-xl">
        <Icon className="h-6 w-6 text-primary" />
      </div>
    </div>
    <div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
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
  const t = useTranslations("visa-letter");

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <Badge className="mb-4" variant="secondary">
            <Sparkles className="w-4 h-4 mr-1 inline" />
            {t("limitedTimeOffer")}
          </Badge>
          <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            {t("heroTitle")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
            {t("heroDescription")}
          </p>

          {/* Stats Section */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
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
        </div>

        {/* Main Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
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
        </div>

        <PricingTable prices={initialPriceData} currency={currency} />

        <div className="text-center bg-gradient-to-r from-primary/30 to-primary rounded-2xl p-12 text-primary-foreground">
          <h2 className="text-3xl font-bold mb-4">{t("cta.title")}</h2>
          <p className="mb-8 text-lg">{t("cta.description")}</p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/travel-agent/apply-visa">
              {t("cta.buttonText")} <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </div>

        {/* FAQ Section */}
        <div className="w-full mx-auto mb-20 mt-8">
          <h2 className="text-3xl font-bold text-start mb-8">
            {t("faq.title")}
          </h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1 ">
              <AccordionTrigger>
                {t("faq.questions.processingTime")}
              </AccordionTrigger>
              <AccordionContent>
                {t("faq.answers.processingTime")}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                {t("faq.questions.entryDifference")}
              </AccordionTrigger>
              <AccordionContent>
                {t("faq.answers.entryDifference")}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>{t("faq.questions.security")}</AccordionTrigger>
              <AccordionContent>{t("faq.answers.security")}</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* News */}
        <div className="mt-12 bg-secondary p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">{t("news.title")}</h2>
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">
                  {t("news.items.express.title")}
                </h3>
                <p className="text-muted-foreground">
                  {t("news.items.express.content")}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">
                  {t("news.items.holiday.title")}
                </h3>
                <p className="text-muted-foreground">
                  {t("news.items.holiday.content")}
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
