import * as React from "react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import Image from "next/image";
import { useTranslations } from "next-intl";

export const SiteFooter = () => {
  const t = useTranslations("footer");
  return (
    <footer className="bg-background p-8 text-foreground">
      <div className="container mx-auto space-y-8">
        {/* Help Section */}
        <div className="flex justify-between items-center bg-card p-6 rounded-md">
          <div>
            <h2 className="text-xl font-bold text-card-foreground">
              {t("title")}
            </h2>
            <p className="text-muted-foreground mt-1">{t("title1")}</p>
          </div>
          <Button
            variant="ghost"
            className="text-primary hover:text-primary/90"
          >
            <a href="https://api.whatsapp.com/send/?phone=84915549136&text&type=phone_number&app_absent=0">
              {t("title2")}
            </a>
          </Button>
        </div>

        <Separator className="bg-border" />

        {/* Links Section */}

        {/* Contact & Social Media */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0 md:space-x-8">
          <div className="flex items-center space-x-6">
            <div className="bg-background p-2 rounded">
              <Image
                className="rounded-lg"
                width={80}
                height={80}
                src="/tours.png"
                alt="SwiftVisa"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              <p>+84775390351</p>
              <p>support@VISACAR.vn</p>
              <p>7th floor, Viet A Building, so 09 Duy Tan, Cau Giay, Hanoi</p>
            </div>
          </div>
          {/* <div className="flex space-x-4">
            <a
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <i className="fab fa-facebook-f"></i> Facebook
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <i className="fab fa-twitter"></i> X
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <i className="fab fa-instagram"></i> Instagram
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <i className="fab fa-linkedin-in"></i> LinkedIn
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <i className="fab fa-youtube"></i> Youtube
            </a>
          </div> */}
        </div>

        <Separator className="bg-border" />

        {/* Footer Bottom */}
        <div className="text-center text-sm text-muted-foreground">
          {t("title3")}
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
