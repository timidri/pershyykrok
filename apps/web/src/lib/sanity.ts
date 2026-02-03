import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";

/** In dev, bypass CDN so published content updates show immediately. */
export const client = createClient({
  projectId: "n1ug74wc",
  dataset: "production",
  useCdn: !import.meta.env.DEV,
  apiVersion: "2024-02-01",
});

const previewClient = createClient({
  projectId: "n1ug74wc",
  dataset: "production",
  useCdn: false,
  apiVersion: "2024-02-01",
  token: import.meta.env.SANITY_API_READ_TOKEN,
  perspective: "previewDrafts",
});

const missingPreviewVars: string[] = [];
if (!import.meta.env.SANITY_API_READ_TOKEN) {
  missingPreviewVars.push("SANITY_API_READ_TOKEN");
}
if (!import.meta.env.SANITY_PREVIEW_SECRET) {
  missingPreviewVars.push("SANITY_PREVIEW_SECRET");
}
if (missingPreviewVars.length > 0) {
  console.warn(
    `[preview] Missing env vars: ${missingPreviewVars.join(
      ", "
    )}. Preview routes will be unavailable until they are set.`
  );
}

export function getClient({ preview = false }: { preview?: boolean } = {}) {
  if (preview) {
    return previewClient;
  }
  return client;
}

const builder = createImageUrlBuilder(client);
export function urlForImage(source: Parameters<typeof builder.image>[0]) {
  return builder.image(source);
}
