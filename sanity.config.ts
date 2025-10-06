import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import { structure, defaultDocumentNode } from "~/sanity/structure";
import { STUDIO_BASEPATH } from "~/sanity/constants";
import { resolve } from "~/sanity/presentation/resolve";
import { schema } from "~/sanity/schema-types";

export default defineConfig({
  projectId: "88ryji29",
  dataset: "production",
  apiVersion: "2024-06-07",
  name: "default",
  title: "portfolio-v4",
  document: {
    newDocumentOptions: (prev) =>
      prev.filter((item) => item.templateId !== "home"),
  },
  resolve,
  plugins: [
    presentationTool({
      resolve,
      previewUrl: {
        previewMode: {
          enable: "/api/preview-mode/enable",
          disable: "/api/preview-mode/disable",
        },
      },
    }),
    structureTool({
      structure,
      defaultDocumentNode,
    }),
    visionTool(),
  ],
  basePath: STUDIO_BASEPATH,
  schema: {
    types: schema,
  },
});
