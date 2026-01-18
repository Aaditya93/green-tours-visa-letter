import CallbackForm from "@/components/contact-us/contact-form";
import { Card, CardContent } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";

export default async function ContactPage() {
  const t = await getTranslations("contactUs");

  return (
    <div className="flex-1 min-h-[calc(100vh-64px)] flex flex-col justify-center">
      <div className="container mx-auto py-16 px-4">
        {/* Header Section */}
        <header className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-6">
            {t("title")}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            {t("subtitle")}
          </p>
        </header>

        {/* Contact Form Section */}
        <div className="max-w-2xl mx-auto">
          <Card className="border-border/50 shadow-2xl bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <CallbackForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
