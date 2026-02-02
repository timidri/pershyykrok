import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: "n1ug74wc",
  dataset: "production",
  useCdn: true, // Faster response, cached data
  apiVersion: "2024-02-01", // Always date your API version
});