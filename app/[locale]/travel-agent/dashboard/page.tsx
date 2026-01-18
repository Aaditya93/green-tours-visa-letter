import { getCompleteApplicationsTravelAgent } from "@/actions/application/application";
import { Application } from "@/app/schemas/types";
import Dashboard from "@/components/travel-agent/dashboard/dashboard";
import { serializedApplications } from "@/config/serialize";
import { extractUniqueCreators } from "@/lib/application/utils";

const TravelAgentDashboardPage = async () => {
  // Fetch completed applications for the agent's company
  const response = await getCompleteApplicationsTravelAgent();

  if (!response.success) {
    return (
      <div className="flex flex-1 items-center justify-center p-6 text-muted-foreground">
        Unable to load dashboard data. Please check your connection.
      </div>
    );
  }

  // Serialize data for Client Components
  const applications = (response.data as Application[]) || [];
  const serializedData = serializedApplications(applications) as Application[];

  // Extract unique creators for sidebar filters
  const creators = extractUniqueCreators(serializedData);

  return <Dashboard users={creators} data={serializedData} />;
};

export default TravelAgentDashboardPage;

export const dynamic = "force-dynamic";
