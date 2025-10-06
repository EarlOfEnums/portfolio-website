import * as queryStore from "@sanity/react-loader";

import { client } from "~/sanity/client.server";
import { STUDIO_BASEPATH } from "./constants";

const clientWithToken = client.withConfig({
  // Token required for when perspective: 'previewDrafts'
  token: process.env.SANITY_VIEWER_TOKEN,
  // Minimum required stega config
  stega: { studioUrl: STUDIO_BASEPATH },
});

queryStore.setServerClient(clientWithToken);

export const { loadQuery } = queryStore;
