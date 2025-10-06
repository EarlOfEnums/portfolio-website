import { defineField, defineType } from "sanity";
import { z } from "zod";

export const blogPost = defineType({
  name: "blog-post",
  title: "Blog Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publishedAt",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "coverImage",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "category",
      type: "string",
    }),
    defineField({
      name: "tags",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "readTime",
      type: "number",
      description: "Estimated read time in minutes",
    }),
    defineField({
      name: "relatedExperience",
      type: "string",
      title: "Related Work Experience",
      description: "Optional: Company ID if this post relates to a work experience (e.g., 'anthropic', 'stripe')",
    }),
    defineField({
      name: "body",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "H4", value: "h4" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
              { title: "Code", value: "code" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  {
                    name: "href",
                    type: "url",
                    title: "URL",
                  },
                ],
              },
            ],
          },
        },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative text",
              description: "Important for SEO and accessibility",
            },
            {
              name: "caption",
              type: "string",
              title: "Caption",
            },
          ],
        },
        {
          type: "object",
          name: "code",
          title: "Code Block",
          fields: [
            {
              name: "language",
              type: "string",
              title: "Language",
              options: {
                list: [
                  { title: "JavaScript", value: "javascript" },
                  { title: "TypeScript", value: "typescript" },
                  { title: "JSX", value: "jsx" },
                  { title: "TSX", value: "tsx" },
                  { title: "CSS", value: "css" },
                  { title: "HTML", value: "html" },
                  { title: "JSON", value: "json" },
                  { title: "Bash", value: "bash" },
                  { title: "Python", value: "python" },
                  { title: "SQL", value: "sql" },
                  { title: "Markdown", value: "markdown" },
                  { title: "YAML", value: "yaml" },
                ],
              },
            },
            {
              name: "code",
              type: "text",
              title: "Code",
              rows: 10,
            },
            {
              name: "filename",
              type: "string",
              title: "Filename (optional)",
            },
          ],
          preview: {
            select: {
              language: "language",
              code: "code",
              filename: "filename",
            },
            prepare({ language, code, filename }) {
              return {
                title: filename || `${language || "Code"} block`,
                subtitle: code?.substring(0, 50) + (code?.length > 50 ? "..." : ""),
              };
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "excerpt",
      media: "coverImage",
      category: "category",
    },
    prepare(selection) {
      const { title, subtitle, media, category } = selection;
      return {
        title: `${category ? `[${category.toUpperCase()}] ` : ""}${title}`,
        subtitle,
        media,
      };
    },
  },
  orderings: [
    {
      title: "Published Date (Newest First)",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
    {
      title: "Published Date (Oldest First)",
      name: "publishedAtAsc",
      by: [{ field: "publishedAt", direction: "asc" }],
    },
  ],
});

// =============================================================================
// ZOD SCHEMAS
// =============================================================================

// Image Asset Reference
const ImageAssetSchema = z.object({
  _ref: z.string(),
  _type: z.literal("reference").optional(),
});

// Sanity Image schema
const SanityImageSchema = z.object({
  _type: z.literal("image"),
  _key: z.string().optional(),
  asset: ImageAssetSchema,
  hotspot: z.any().optional(),
  crop: z.any().optional(),
  alt: z.string().optional(),
  caption: z.string().optional(),
});

// Code Block schema
const CodeBlockSchema = z.object({
  _type: z.literal("code"),
  _key: z.string().optional(),
  language: z.string().optional(),
  code: z.string(),
  filename: z.string().optional(),
});

// Text span in portable text
const TextSpanSchema = z.object({
  _type: z.literal("span"),
  _key: z.string().optional(),
  text: z.string(),
  marks: z.array(z.string()).optional(),
});

// Portable Text Block schema
const PortableTextBlockSchema = z.object({
  _type: z.literal("block"),
  _key: z.string().optional(),
  children: z.array(TextSpanSchema).optional(),
  markDefs: z.array(z.any()).optional(),
  style: z.string().optional(),
  listItem: z.string().optional(),
  level: z.number().optional(),
});

// Union of all body content types
const BodyContentSchema = z.discriminatedUnion("_type", [
  PortableTextBlockSchema,
  SanityImageSchema,
  CodeBlockSchema,
]);

// Cover Image schema (simpler, no alt/caption at top level)
const CoverImageSchema = z
  .object({
    asset: ImageAssetSchema,
    hotspot: z.any().optional(),
    crop: z.any().optional(),
  })
  .optional()
  .nullable();

// Main blog post schema
export const BlogPostSchema = z.object({
  _id: z.string().min(1, "ID is required"),
  _type: z.string().min(1, "Type is required").optional(),
  title: z.string().min(1, "Title is required"),
  slug: z.object({
    current: z.string().min(1, "Slug is required"),
  }),
  excerpt: z.string().min(1, "Excerpt is required"),
  publishedAt: z.string().min(1, "Published date is required"),
  coverImage: CoverImageSchema,
  category: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  readTime: z.number().int().positive().optional().nullable(),
  relatedExperience: z.string().optional().nullable(),
  body: z.array(BodyContentSchema).optional().default([]),
});

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type BlogPost = z.infer<typeof BlogPostSchema>;

// =============================================================================
// VALIDATION HELPERS
// =============================================================================

export const validateBlogPost = (data: unknown): BlogPost => {
  return BlogPostSchema.parse(data);
};

// Safe validation (returns result instead of throwing)
export const safeValidateBlogPost = (data: unknown) => {
  return BlogPostSchema.safeParse(data);
};
