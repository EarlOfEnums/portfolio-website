import { redirect } from "react-router";
import { destroySession, getSession } from "~/sanity/preview.server";
import type { Route } from "./+types/disable-preview-mode.api";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const session = await getSession(request.headers.get("Cookie"));

  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};
