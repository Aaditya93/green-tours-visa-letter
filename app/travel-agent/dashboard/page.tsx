import { getCompleteApplicationsTravelAgent } from "@/actions/application/application";
import { Application } from "@/app/schemas/types";
import Dashboard from "@/components/agent-platform/travel-agent/dashboard/dashboard";
import { serializedApplications } from "@/config/serialize";

function extractUniqueUsernames(data: Application[]) {
  // Get unique creator names
  const uniqueCreators = [...new Set(data.map((item) => item.creator))];

  // Transform into required format
  return uniqueCreators.map((username) => ({ username }));
}
const TravelAgentDashboardPage = async () => {
  const applications = await getCompleteApplicationsTravelAgent();
  const planObject = serializedApplications(applications ?? []);
  const Users = extractUniqueUsernames(planObject);
  return <Dashboard Users={Users} data={planObject} />;
};

export default TravelAgentDashboardPage;

export const dynamic = "force-dynamic";
