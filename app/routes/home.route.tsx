import type { Route } from "./+types/home.route";
import { Linkedin, Mail, GitBranch, MapPin } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Chip } from "~/components/ui/chip";
import { Link } from "react-router";
import { useState } from "react";
import { useQuery } from "@sanity/react-loader";
import { getHome } from "~/data/home.api.server";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Rob Martin" },
    { name: "description", content: "Rob Martin is a software engineer" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  return getHome({ request });
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { initial, query, params } = loaderData;
  const { data: homeData } = useQuery(query, params, { initial });
  const [emailCopied, setEmailCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(homeData?.email || "");
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy email:", err);
    }
  };

  return (
    <div className="">
      <div className="flex flex-col gap-30">
        <h1 className="text-3xl md:text-5xl lg:text-7xl font-normal min-h-[100px] lg:min-h-[124px] max-w-xs md:max-w-md lg:max-w-xl">
          {homeData?.headline}
        </h1>

        {/* Summary Section */}
        <div className="grid grid-cols-1 gap-x-12">
          <p className="text-lg lg:text-2xl max-w-4xl">
            {homeData?.subheadline}
          </p>
          {/* Contact Header */}
          <div className="grid grid-cols-1 gap-x-12 my-16">
            <div className="flex flex-wrap items-baseline gap-4 sm:gap-6 lg:gap-8 text-sm">
              <Button
                variant="ghost"
                className="flex items-center gap-2 px-2 sm:px-4"
                asChild
              >
                <Link to={homeData?.github || ""}>
                  <GitBranch className="w-4 h-4" />

                  <span>GitHub</span>
                </Link>
              </Button>
              <Button
                variant="ghost"
                className="flex items-center gap-2 px-2 sm:px-4"
                asChild
              >
                <Link to={homeData?.linkedin || ""}>
                  <Linkedin className="w-4 h-4" />

                  <span>LinkedIn</span>
                </Link>
              </Button>
              <Button
                variant="ghost"
                className="flex items-center gap-2 px-2 sm:px-4"
              >
                <MapPin className="w-4 h-4" /> {homeData?.location}
              </Button>
              <Button
                variant="ghost"
                className="flex items-center gap-2 px-2 sm:px-4"
                onClick={copyEmail}
              >
                <Mail className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {emailCopied ? "Copied!" : homeData?.email}
                </span>
                <span className="sm:hidden">
                  {emailCopied ? "Copied!" : "Email"}
                </span>
              </Button>
            </div>
          </div>
        </div>

        {/* Resume Content */}
        <div className="max-w-4xl">
          {/* Main Content - Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-x-12 gap-y-8 lg:gap-y-16">
            {/* Tools Section */}
            <h2 className="text-xl font-normal text-text-muted lg:text-right">
              Tools
            </h2>

            <div className="flex flex-wrap gap-2">
              {homeData?.tools?.map((tool, index) => (
                <Chip key={tool} variant={index < 6 ? "primary" : "secondary"}>
                  {tool}
                </Chip>
              ))}
            </div>

            {/* Skills Section */}
            <h2 className="text-xl font-normal text-text-muted lg:text-right">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {homeData?.skills?.map((skill, index) => (
                <Chip key={skill} variant={index < 6 ? "primary" : "secondary"}>
                  {skill}
                </Chip>
              ))}
            </div>

            {/* Experience Section */}
            <h2 className="text-xl font-normal text-text-muted lg:text-right">
              Experience
            </h2>
            <div className="space-y-12">
              {homeData?.experience?.map((exp, index) => (
                <div
                  key={index}
                  className="group border border-border rounded-lg p-6 hover:border-text-muted transition-colors space-y-5"
                >
                  {/* Header */}
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-medium mb-1.5">
                        {exp.company}
                      </h3>
                      <div className="flex flex-wrap items-baseline gap-x-3 text-sm text-text-muted">
                        <span>{exp.role}</span>
                        <span>·</span>
                        <span>
                          {exp.startDate} – {exp.endDate || "Present"}
                        </span>
                      </div>
                    </div>
                    {exp.companyId?.current && (
                      <Link
                        to={`/blog?experience=${exp.companyId.current}`}
                        className="shrink-0 text-sm font-medium px-4 py-2 rounded-md border border-border hover:bg-background-muted transition-colors"
                        viewTransition
                      >
                        Read more →
                      </Link>
                    )}
                  </div>

                  {/* Summary */}
                  <p className="text-sm leading-relaxed text-text-muted">
                    {exp.summary}
                  </p>

                  {/* Achievements */}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="space-y-2.5 text-sm border-l-2 border-border pl-4">
                      {exp.achievements.map((achievement, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Tech Stack */}
                  {exp.techStack && exp.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {exp.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs px-2.5 py-1 rounded-md bg-background-muted text-text-muted border border-border"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Education Section */}
            <h2 className="text-xl font-normal text-text-muted lg:text-right">
              Education
            </h2>
            <div className="space-y-4">
              {homeData?.education?.map((edu, index) => (
                <div key={index}>
                  <h3 className="text-lg font-medium">{edu.institution}</h3>
                  <p className="text-sm">
                    {edu.degree} {edu.field ? `in ${edu.field}` : ""}
                  </p>
                  {edu.additionalInfo && (
                    <p className="text-sm mt-2">{edu.additionalInfo}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
