import VerificationForm from "@/components/auth/new-verfication-form";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function NewVerificationPage({ params }: PageProps) {
  // Awaiting params for Next.js 16 compatibility
  await params;

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-muted/30">
      <VerificationForm />
    </div>
  );
}
