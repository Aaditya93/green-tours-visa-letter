import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { useTranslations } from "next-intl";

function Testimonials() {
  const t = useTranslations("home.testimonials");

  const testimonials = [
    {
      quote: t("quotes.sarah"),
      name: t("names.sarah"),
      designation: t("designations.business_traveler", {
        country: t("countries.usa"),
      }),
      src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote: t("quotes.michael"),
      name: t("names.michael"),
      designation: t("designations.family_traveler", {
        country: t("countries.canada"),
      }),
      src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote: t("quotes.jia"),
      name: t("names.jia"),
      designation: t("designations.corporate_executive", {
        country: t("countries.australia"),
      }),
      src: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=3871&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote: t("quotes.james"),
      name: t("names.james"),
      designation: t("designations.entrepreneur", {
        country: t("countries.singapore"),
      }),
      src: "https://images.unsplash.com/photo-1636041293178-808a6762ab39?q=80&w=3464&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote: t("quotes.lisa"),
      name: t("names.lisa"),
      designation: t("designations.tour_coordinator", {
        country: t("countries.uk"),
      }),
      src: "https://images.unsplash.com/photo-1624561172888-ac93c696e10c?q=80&w=2592&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  return (
    <div className="py-4">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-primary mb-4">
        {t("section_title")}
      </h2>
      <AnimatedTestimonials testimonials={testimonials} />
    </div>
  );
}

export { Testimonials };
