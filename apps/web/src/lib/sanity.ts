import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";

/** In dev, bypass CDN so published content updates show immediately. */
export const client = createClient({
  projectId: "n1ug74wc",
  dataset: "production",
  useCdn: !import.meta.env.DEV,
  apiVersion: "2024-02-01",
});

const builder = createImageUrlBuilder(client);
export function urlForImage(source: Parameters<typeof builder.image>[0]) {
  return builder.image(source);
}