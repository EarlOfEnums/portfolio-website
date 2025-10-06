import { useRouteLoaderData } from "react-router";

export function useColorScheme() {
  const loaderData = useRouteLoaderData("root");
  const colorScheme = loaderData?.colorScheme;
  return { colorScheme };
}
