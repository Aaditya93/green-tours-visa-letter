import { getCompleteApplications } from "@/actions/application/application";
import Dashboard from "@/components/dashboard/dashboard";
import { extractUniqueCreators } from "@/lib/application/utils";
import { notFound } from "next/navigation";

const DashboardPage = async () => {
  // Fetch completed applications (includes admin check for role-based scoping)
  const response = await getCompleteApplications();

  if (!response.success) {
    console.error("Failed to fetch dashboard applications:", response.error);
    notFound();
  }

  // Serialize data for Client Components (handles ObjectId and Date serialization)
  const applications = response.data || [];

  // Extract unique creators for sidebar filters
  const creators = extractUniqueCreators(applications);

  return <Dashboard users={creators} data={applications} />;
};

export default DashboardPage;

export const dynamic = "force-dynamic";
