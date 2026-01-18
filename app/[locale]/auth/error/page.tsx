import { ErrorCard } from "@/components/auth/error-card";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function AuthErrorPage({ params }: PageProps) {
  // Awaiting params for Next.js 16 compatibility
  await params;

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-muted/30">
      <ErrorCard />
    </div>
  );
}
