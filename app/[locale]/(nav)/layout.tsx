import "../globals.css";

import SiteFooter from "@/components/navigation-bar/site-footer";
import SiteHeader from "@/components/navigation-bar/site-header";
import ContactUsButton from "@/components/contact-us/contact-us-button";
import { Toaster } from "sonner";
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div suppressHydrationWarning>
      <div data-wrapper="" className="border-border/40 dark:border-border">
        <div className="mx-auto w-full border-border/40 dark:border-border min-[1800px]:max-w-[1536px] min-[1800px]:border-x">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <Toaster />
          {/* <SiteFooter /> */}
        </div>
      </div>

      <button
        className="fixed bottom-4 right-4   p-4 rounded-full shadow-lg bg-background focus:outline-none "
        aria-label="Contact Us"
      >
        <ContactUsButton />
      </button>
      <SiteFooter />
    </div>
  );
}
