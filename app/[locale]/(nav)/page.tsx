import ThreeDPhotoCarousel from "@/components/home/3d-carousel";
import LandingHero from "@/components/home/landing-hero";
import { Testimonials } from "@/components/home/testimonials";
import { getTranslations } from "next-intl/server";

export default async function HomePage() {
  const t = await getTranslations("home");

  return (
    <div className="flex flex-col gap-0 pb-10">
      <LandingHero />

      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center border border-dashed rounded-xl py-8 px-6 bg-muted/30">
          <header className="text-center mb-12 max-w-4xl">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-primary mb-4">
              {t("title")}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              {t("welcome")}
            </p>
          </header>

          <div className="w-full space-y-8 md:space-y-16">
            <div className="relative min-h-[300px] md:min-h-[500px] flex items-center justify-center overflow-hidden">
              <ThreeDPhotoCarousel />
            </div>

            <div className="border border-dashed rounded-lg p-4 bg-background">
              <Testimonials />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
