import {
  type RouteConfig,
  index,
  route,
  prefix,
  layout,
} from "@react-router/dev/routes";

export default [
  ...prefix("studio", [
    index("routes/studio/studio.route.tsx"),
    route("/*", "routes/studio/studio.*.route.tsx"),
  ]),

  layout("routes/app.layout.tsx", [
    index("routes/home.route.tsx"),
    route("/work", "routes/work.route.tsx"),
    route("/work/:slug", "routes/work.$slug.route.tsx"),
    route("/blog", "routes/blog.route.tsx"),
    route("/blog/:slug", "routes/blog.$slug.route.tsx"),
    ...prefix("api", [
      route("theme", "routes/api/theme.api.ts"),
      route("preview-mode/enable", "routes/api/enable-preview-mode.api.ts"),
      route("preview-mode/disable", "routes/api/disable-preview-mode.api.ts"),
    ]),
  ]),
] satisfies RouteConfig;
