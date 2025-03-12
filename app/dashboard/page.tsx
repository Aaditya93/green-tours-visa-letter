import { getCompleteApplications } from "@/actions/application/application";
import Dashboard from "@/components/dashboard/dashboard";
import { serializedApplications } from "@/config/serialize";

import { Application } from "../schemas/types";

function extractUniqueUsernames(data: Application[]) {
  // Get unique creator names
  const uniqueCreators = [...new Set(data.map((item) => item.creator))];

  // Transform into required format
  return uniqueCreators.map((username) => ({ username }));
}

const DashboardPage = async () => {
  const applications = await getCompleteApplications();
  const planObject = serializedApplications(applications ?? []);
  const Users = extractUniqueUsernames(planObject);
  return <Dashboard Users={Users} data={planObject} />;
};

export default DashboardPage;

export const dynamic = "force-dynamic";
