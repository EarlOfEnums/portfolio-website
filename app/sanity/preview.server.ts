import { createCookieSessionStorage } from "react-router";
import type { FilteredResponseQueryOptions } from "@sanity/client";

import { projectId } from "~/sanity/project-details";
import invariant from "tiny-invariant";

const token = process.env.SANITY_VIEWER_TOKEN;
invariant(token, "Sanity Viewer Token is required");
const secret = process.env.SANITY_SESSION_SECRET;
invariant(secret, "Sanity Viewer Secret is required");

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      httpOnly: true,
      name: "__sanity_preview",
      path: "/",
      sameSite: !import.meta.env.DEV ? "none" : "lax",
      secrets: [secret],
      secure: !import.meta.env.DEV,
    },
  });

async function previewContext(
  headers: Headers
): Promise<{ preview: boolean; options: FilteredResponseQueryOptions }> {
  const previewSession = await getSession(headers.get("Cookie"));

  const preview = previewSession.get("projectId") === projectId;

  return {
    preview,
    options: preview
      ? {
          perspective: "drafts",
          stega: true,
          token,
        }
      : {
          perspective: "published",
          stega: false,
        },
  };
}

export { commitSession, destroySession, getSession, previewContext };
