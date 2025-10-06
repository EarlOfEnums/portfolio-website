import { redirect } from "react-router";
import { validatePreviewUrl } from "@sanity/preview-url-secret";
import { client } from "~/sanity/client.server";
import { commitSession, getSession } from "~/sanity/preview.server";
import { projectId } from "~/sanity/project-details";
import type { Route } from "./+types/enable-preview-mode.api";
import invariant from "tiny-invariant";

export const loader = async ({ request }: Route.LoaderArgs) => {
  invariant(process.env.SANITY_VIEWER_TOKEN, "Sanity Viewer Token is required");

  const clientWithToken = client.withConfig({
    token: process.env.SANITY_VIEWER_TOKEN,
  });

  const { isValid, redirectTo = "/" } = await validatePreviewUrl(
    clientWithToken,
    request.url
  );

  if (!isValid) {
    throw new Response("Invalid secret", { status: 401 });
  }

  const session = await getSession(request.headers.get("Cookie"));
  session.set("projectId", projectId);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};
