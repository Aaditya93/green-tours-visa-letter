import { IApplication } from "@/db/models/application";

export function extractUniqueCreators(applications: IApplication[]) {
  if (!applications || !Array.isArray(applications)) return [];

  const uniqueNames = Array.from(
    new Set(applications.map((app) => app.creator).filter(Boolean)),
  );

  return uniqueNames.map((username) => ({ username }));
}
