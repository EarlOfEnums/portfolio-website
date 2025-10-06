import { createClient } from "@sanity/client";

import { apiVersion, dataset, projectId } from "~/sanity/project-details";

const env = typeof document === "undefined" ? process.env : window.ENV;

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  stega: {
    studioUrl: env.VITE_SANITY_STUDIO_URL,
  },
});
