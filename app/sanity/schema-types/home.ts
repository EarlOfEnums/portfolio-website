import { defineField, defineType } from "sanity";
import { z } from "zod";

export const home = defineType({
  name: "home",
  title: "Home",
  type: "document",
  preview: {
    prepare: () => ({
      title: "Home",
      subtitle: "This is the landing page of the website.",
    }),
  },
  fields: [
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
    }),
    defineField({
      name: "subheadline",
      title: "Sub-Headline",
      type: "text",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
    }),
    defineField({
      name: "github",
      title: "GitHub",
      type: "string",
    }),
    defineField({
      name: "linkedin",
      title: "LinkedIn",
      type: "string",
    }),
    defineField({
      name: "tools",
      title: "Tools",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "skills",
      title: "Skills",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "experience",
      title: "Experience",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "company",
              title: "Company",
              type: "string",
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: "role",
              title: "Role",
              type: "string",
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: "startDate",
              title: "Start Date",
              type: "string",
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: "endDate",
              title: "End Date",
              type: "string",
              description: "Leave empty if current position",
            },
            {
              name: "location",
              title: "Location",
              type: "string",
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: "summary",
              title: "Summary",
              type: "text",
              description: "2-3 sentence overview of scope and impact",
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: "achievements",
              title: "Key Achievements",
              type: "array",
              of: [{ type: "string" }],
              description: "5-6 achievement bullets with metrics",
            },
            {
              name: "techStack",
              title: "Tech Stack",
              type: "array",
              of: [{ type: "string" }],
              description: "Technologies and tools used",
            },
            {
              name: "companyId",
              title: "Company ID",
              type: "slug",
              description:
                "Unique identifier for linking blog posts (e.g., 'anthropic', 'stripe')",
              validation: (Rule: any) => Rule.required(),
            },
          ],
        },
      ],
    }),
    defineField({
      name: "education",
      title: "Education",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "institution",
              title: "Institution",
              type: "string",
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: "degree",
              title: "Degree",
              type: "string",
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: "field",
              title: "Field of Study",
              type: "string",
            },
            {
              name: "additionalInfo",
              title: "Additional Information",
              type: "text",
              description: "Certificates, achievements, etc.",
            },
          ],
        },
      ],
    }),
  ],
});

// =============================================================================
// ZOD SCHEMAS
// =============================================================================

// Experience schema
export const ExperienceSchema = z.object({
  company: z.string().min(1, "Company is required"),
  role: z.string().min(1, "Role is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional().nullable(),
  location: z.string().min(1, "Location is required"),
  summary: z.string().min(1, "Summary is required"),
  achievements: z.array(z.string()).optional().default([]),
  techStack: z.array(z.string()).optional().default([]),
  companyId: z.object({
    current: z.string(),
  }),
});

// Education schema
export const EducationSchema = z.object({
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  field: z.string().optional(),
  additionalInfo: z.string().optional(),
});

// Main home schema
export const HomeSchema = z.object({
  headline: z.string().optional().nullable(),
  subheadline: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  github: z.string().optional().nullable(),
  linkedin: z.string().optional().nullable(),
  tools: z.array(z.string()).optional().default([]),
  skills: z.array(z.string()).optional().default([]),
  experience: z.array(ExperienceSchema).optional(),
  education: z.array(EducationSchema).optional(),
});

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type Home = z.infer<typeof HomeSchema>;
export type Experience = z.infer<typeof ExperienceSchema>;

// =============================================================================
// VALIDATION HELPERS
// =============================================================================

export const validateHome = (data: unknown): Home => {
  return HomeSchema.parse(data);
};

// Safe validation (returns result instead of throwing)
export const safeValidateHome = (data: unknown) => {
  return HomeSchema.safeParse(data);
};

export const validateExperience = (data: unknown): Experience[] => {
  return z.array(ExperienceSchema).parse(data);
};

// Safe validation (returns result instead of throwing)
export const safeValidateExperience = (data: unknown) => {
  return z.array(ExperienceSchema).safeParse(data);
};
