import { SimplifiedCompany } from "@/actions/agent-platform/visa-letter";
import { Application } from "@/app/schemas/types";

interface LineChartData {
  date: string;
  totalApplication: number;
}

export const DataMainLineChart = (
  applications: Application[]
): LineChartData[] => {
  // Create a map to count applications by date
  const dateCountMap = applications.reduce<Record<string, number>>(
    (acc, app) => {
      // Parse the createdDate from DD/MM/YYYY to YYYY-MM-DD format
      const [day, month, year] = app.createdDate.split("/");
      const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
        2,
        "0"
      )}`;

      // Initialize or increment the count for this date
      acc[formattedDate] = (acc[formattedDate] || 0) + 1;
      return acc;
    },
    {}
  );

  // Convert the map to the required array format
  const chartData = Object.entries(dateCountMap).map(([date, count]) => ({
    date,
    totalApplication: count,
  }));

  // Sort by date
  return chartData.sort((a, b) => a.date.localeCompare(b.date));
};

type ChartData = {
  user: string;
  totalApplication: number;
}[];

export function DataUserBarChart(data: Application[]): ChartData {
  const creatorCount: Record<string, number> = {};

  data.forEach(({ creator, role }) => {
    if (creator && (role === "Admin" || role === "Employee")) {
      creatorCount[creator] = (creatorCount[creator] || 0) + 1;
    }
  });

  return Object.entries(creatorCount).map(([user, totalApplication]) => ({
    user,
    totalApplication,
  }));
}

export const DataDurationChart = (
  data: Application[]
): { HandleBy: string; TotalApplication: number }[] => {
  const handlerCounts: { [key: string]: number } = {};

  data.forEach((entry) => {
    const { handleBy, role } = entry;
    if (handleBy && (role === "Admin" || role === "Employee")) {
      handlerCounts[handleBy] = (handlerCounts[handleBy] || 0) + 1;
    }
  });

  return Object.entries(handlerCounts)
    .filter(([handleBy]) => handleBy) // Remove empty handlers
    .map(([handleBy, count]) => ({
      HandleBy: handleBy,
      TotalApplication: count,
    }));
};

export function DataSpeedChart(
  applications: Application[]
): { speed: string; Applications: number; fill: string }[] {
  // Create a map to count applications by speed
  const speedCounts = applications.reduce<Record<string, number>>(
    (acc, application) => {
      const speed = application.speed || "NO";
      acc[speed] = (acc[speed] || 0) + 1;
      return acc;
    },
    {}
  );

  // Define the desired order of speed categories
  const speedOrder = ["4H", "8H", "1D", "3D", "NO"];

  // Define chart colors for each category
  const chartColors = {
    "4H": "hsl(var(--chart-1))",
    "8H": "hsl(var(--chart-2))",
    "1D": "hsl(var(--chart-3))",
    "3D": "hsl(var(--chart-4))",
    NO: "hsl(var(--chart-5))",
  };

  // Transform into the desired chart data format
  const chartData = speedOrder.map((speed) => ({
    speed,
    Applications: speedCounts[speed] || 0,
    fill: chartColors[speed as keyof typeof chartColors],
  }));

  return chartData;
}

export function TravelAgentChartData(
  applications: Application[],
  companies: SimplifiedCompany[]
) {
  // Create a map of company IDs to company names for easier lookup
  const companyMap = new Map(
    companies.map((company) => [company.id, company.name])
  );

  // Count applications per company
  const applicationCounts = applications.reduce<Record<string, number>>(
    (acc, application) => {
      const companyId = application.companyId;
      const companyName = companyMap.get(companyId);

      if (companyName) {
        // If company already exists in accumulator, increment count
        // Otherwise create new entry
        acc[companyName] = (acc[companyName] || 0) + 1;
      }

      return acc;
    },
    {}
  );

  // Convert to desired output format
  const result = Object.entries(applicationCounts).map(
    ([companyName, count]) => ({
      companyName,
      TotalApplications: count,
    })
  );

  return result;
}

interface ClientData {
  agentId: string;
  clients: string[];
}
export function StaffChartData(
  applications: Application[],
  agentData: ClientData[]
) {
  if (!applications.length || !agentData.length) {
    return [];
  }

  // Create a map of agents and their clients for faster lookup
  const agentClientMap = new Map();

  // Initialize counts for each agent
  const agentCounts = {};

  // Set up initial agent data and client mappings
  agentData.forEach((agent) => {
    // Initialize count for each agent
    agentCounts[agent.agentId] = 0;

    // Map each client ID to this agent
    if (agent.clients && Array.isArray(agent.clients)) {
      agent.clients.forEach((clientId) => {
        agentClientMap.set(clientId, agent.agentId);
      });
    }
  });

  // Count applications
  applications.forEach((application) => {
    if (application.companyId) {
      const agentId = agentClientMap.get(application.companyId);
      if (agentId) {
        agentCounts[agentId]++;
      }
    }
  });

  // Format the output
  const result = Object.entries(agentCounts)
    .filter(([_, count]) => count > 0)
    .map(([agentName, count]) => ({
      agentName,
      TotalApplications: count,
    }));

  return result;
}
