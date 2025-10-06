import { defineType, defineField } from "sanity";
import { z } from "zod";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      description: "Short tagline for the project",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      description: "Brief description for the project listing",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "overview",
      title: "Overview",
      type: "text",
      description: "Detailed overview of the project",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "client",
      title: "Client",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "duration",
      title: "Duration",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Order in which projects appear (lower numbers first)",
      validation: (Rule) => Rule.required().integer().min(0),
    }),
    defineField({
      name: "metrics",
      title: "Key Metrics",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "label",
              title: "Label",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "value",
              title: "Value",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
          ],
        },
      ],
    }),
    defineField({
      name: "technologies",
      title: "Technologies",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "highlights",
      title: "Highlights",
      type: "array",
      of: [{ type: "string" }],
      description: "Key highlights for the project listing",
    }),
    defineField({
      name: "features",
      title: "Key Features",
      type: "array",
      of: [{ type: "text" }],
      description: "Detailed feature list",
    }),
    defineField({
      name: "challenges",
      title: "Technical Challenges",
      type: "array",
      of: [{ type: "text" }],
      description: "Technical challenges solved",
    }),
    defineField({
      name: "images",
      title: "Project Images",
      type: "array",
      of: [
        {
          type: "object",
          title: "Project Image",
          fields: [
            {
              name: "lightImage",
              title: "Light Mode Image",
              type: "image",
              options: {
                hotspot: true,
              },
              validation: (Rule) => Rule.required(),
            },
            {
              name: "darkImage",
              title: "Dark Mode Image",
              type: "image",
              description:
                "Optional: If not provided, light image will be used for both modes",
              options: {
                hotspot: true,
              },
            },
            {
              name: "alt",
              title: "Alt Text",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "caption",
              title: "Caption",
              type: "string",
            },
          ],
          preview: {
            select: {
              media: "lightImage",
              title: "alt",
              subtitle: "caption",
            },
          },
        },
      ],
    }),
    defineField({
      name: "links",
      title: "Project Links",
      type: "object",
      fields: [
        {
          name: "live",
          title: "Live URL",
          type: "url",
        },
        {
          name: "github",
          title: "GitHub URL",
          type: "url",
        },
      ],
    }),
    defineField({
      name: "featured",
      title: "Featured Project",
      type: "boolean",
      description: "Show this project on the homepage",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "tagline",
      media: "images.0.lightImage",
      order: "order",
    },
    prepare(selection) {
      const { title, subtitle, media, order } = selection;
      return {
        title: `${order !== undefined ? `${order}. ` : ""}${title}`,
        subtitle,
        media,
      };
    },
  },
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
    {
      title: "Year (Newest First)",
      name: "yearDesc",
      by: [{ field: "year", direction: "desc" }],
    },
  ],
});

// =============================================================================
// ZOD SCHEMAS
// =============================================================================

// Metric schema
export const MetricSchema = z.object({
  label: z.string().min(1, "Label is required"),
  value: z.string().min(1, "Value is required"),
});

// Project image schema
export const ProjectImageSchema = z.object({
  lightImage: z.object({
    asset: z.object({
      _ref: z.string(),
    }),
  }),
  darkImage: z
    .object({
      asset: z.object({
        _ref: z.string(),
      }),
    })
    .optional()
    .nullable(),
  alt: z.string().min(1, "Alt text is required"),
  caption: z.string().optional().nullable(),
});

// Project links schema
export const ProjectLinksSchema = z.object({
  live: z.string().url().optional().nullable(),
  github: z.string().url().optional().nullable(),
});

// Main project schema
export const ProjectSchema = z.object({
  _id: z.string().min(1, "ID is required"),
  _type: z.string().min(1, "Type is required").optional(),
  title: z.string().min(1, "Title is required"),
  slug: z.object({
    current: z.string().min(1, "Slug is required"),
  }),
  tagline: z.string().min(1, "Tagline is required").optional(),
  description: z.string().min(1, "Description is required"),
  overview: z.string().min(1, "Overview is required").optional(),
  year: z.string().min(1, "Year is required"),
  role: z.string().min(1, "Role is required"),
  client: z.string().min(1, "Client is required").optional(),
  duration: z.string().min(1, "Duration is required").optional(),
  order: z
    .number()
    .int()
    .min(0, "Order must be a non-negative integer")
    .optional(),
  metrics: z.array(MetricSchema).optional().default([]),
  technologies: z.array(z.string()).optional().default([]),
  highlights: z.array(z.string()).optional().default([]),
  features: z.array(z.string()).optional().default([]),
  challenges: z.array(z.string()).optional().default([]),
  images: z.array(ProjectImageSchema).optional().default([]),
  links: ProjectLinksSchema.optional().nullable(),
  featured: z.boolean().optional().default(false),
});

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type Project = z.infer<typeof ProjectSchema>;

// =============================================================================
// VALIDATION HELPERS
// =============================================================================

export const validateProject = (data: unknown): Project => {
  return ProjectSchema.parse(data);
};

// Safe validation (returns result instead of throwing)
export const safeValidateProject = (data: unknown) => {
  return ProjectSchema.safeParse(data);
};
