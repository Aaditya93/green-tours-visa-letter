import * as React from "react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import Image from "next/image";
import Link from "next/link";

export const SiteFooter = () => {
  return (
    <footer className="bg-background p-8 text-foreground">
      <div className="container mx-auto space-y-8">
        {/* Help Section */}
        <div className="flex justify-between items-center bg-card p-6 rounded-md">
          <div>
            <h2 className="text-xl font-bold text-card-foreground">
              Need help?
            </h2>
            <p className="text-muted-foreground mt-1">
              Love travelling, and not the planning? Let SwiftVisa get you a
              visa. Let’s have a quick chat!
            </p>
          </div>
          <Button
            variant="ghost"
            className="text-primary hover:text-primary/90"
          >
            <a href="https://api.whatsapp.com/send/?phone=918103690599&text&type=phone_number&app_absent=0">
              Talk to our experts →
            </a>
          </Button>
        </div>

        <Separator className="bg-border" />

        {/* Links Section */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Explore Visas */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              EXPLORE VISAS
            </h3>
            <div className="text-muted-foreground mt-2 leading-relaxed flex flex-wrap ">
              {[
                "Vietnam",
                "Indonesia",
                "Malaysia",
                "Azerbaijan",
                "Egypt",
                "Kenya",
                "Russia",
                "Uzbekistan",
                "Kazakhstan",
                "Cambodia",
                "Mongolia",
                "Sri Lanka",
                "Tajikistan",
                "Morocco",
                "Laos",
              ].map((country, index) => (
                <Link
                  key={country}
                  href={`/visa/${country}`}
                  className="hover:text-primary transition-colors"
                >
                  {country}
                  {index !== 14 && <span className="ml-2">|</span>}
                </Link>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">PRODUCTS</h3>
            <ul className="mt-2 space-y-1 text-muted-foreground">
              <li>
                <Link href="/visa" className="hover:text-primary">
                  Visa
                </Link>
              </li>
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              USEFUL LINKS
            </h3>
            <ul className="mt-2 space-y-1 text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className=" hover:underline">
                  Blogs
                </a>
              </li>
              <li>
                <a href="#" className=" hover:underline">
                  External Policy
                </a>
              </li>
            </ul>
          </div>

          {/* For Agents */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              FOR AGENTS
            </h3>
            <ul className="mt-2 space-y-1 text-muted-foreground">
              <li>
                <a
                  href="/travel-agent"
                  className="hover:text-primary transition-colors"
                >
                  Sign Up
                </a>
              </li>
            </ul>
          </div>

          {/* Others */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">OTHERS</h3>
            <ul className="mt-2 space-y-1 text-muted-foreground">
              <li>
                <a
                  href="/privacy"
                  className="hover:text-primary transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="hover:text-primary transition-colors"
                >
                  Terms and Conditions
                </a>
              </li>
              <li>
                <a
                  href="/cancellation"
                  className="hover:text-primary transition-colors"
                >
                  Cancellation And Refund Policy
                </a>
              </li>
              {/* <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Cookies
                </a>
              </li> */}
            </ul>
          </div>
        </div>

        <Separator className="bg-border" />

        {/* Contact & Social Media */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0 md:space-x-8">
          <div className="flex items-center space-x-6">
            <div className="bg-card p-2 rounded">
              <Image
                className="rounded-lg"
                width={80}
                height={80}
                src="/favicon.ico"
                alt="SwiftVisa"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              <p>+91-81036-90599</p>
              <p>support@SwiftVisa.com</p>
              <p>
                Shop No 11,Plot No 17, Jimmy Tower, near Samudra Restaurant,
                Sector 18, Kopar Khairane, Navi Mumbai, Maharashtra 400709
              </p>
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
          © 2024 — SwiftVisa Technology Private Limited
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
