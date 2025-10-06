import { data } from "react-router";
import { schema, setColorScheme } from "~/lib/theme.server";
import type { Route } from "./+types/theme.api";

export async function action({ request }: Route.ActionArgs) {
  let formData = await request.formData();
  let colorScheme = schema.parse(formData.get("color-scheme"));
  return data(null, {
    headers: { "Set-Cookie": await setColorScheme(colorScheme) },
  });
}
