import SiteFooter from "@/components/navigation-bar/site-footer";
import SiteHeader from "@/components/navigation-bar/site-header";
import ContactUsButton from "@/components/contact-us/contact-us-button";

interface NavLayoutProps {
  children: React.ReactNode;
}

export default async function NavLayout({ children }: NavLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div data-wrapper="" className="border-border/40 dark:border-border">
        <div className=" w-full border-border/40 dark:border-border ">
          <SiteHeader />
          <main className="flex-1">{children}</main>
        </div>
      </div>

      <div className="fixed bottom-4 right-4 z-50">
        <div
          className="p-4 rounded-full shadow-lg bg-background hover:bg-accent transition-colors border focus-within:outline-none focus-within:ring-2 focus-within:ring-ring"
          aria-label="Contact Us"
        >
          <ContactUsButton />
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
