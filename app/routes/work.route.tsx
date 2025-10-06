import { ExternalLink, GitBranch, ArrowUpRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Chip } from "~/components/ui/chip";
import { Link } from "react-router";
import type { Route } from "./+types/work.route";
import { getProjects } from "~/data/projects.api.server";
import { useQuery } from "@sanity/react-loader";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Work - Rob Martin" },
    { name: "description", content: "Selected projects by Rob Martin" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  try {
    return await getProjects({ request });
  } catch (error) {
    console.error("Error fetching projects from Sanity:", error);
    throw new Response("Not found", { status: 404 });
  }
}

export default function Work({ loaderData }: Route.ComponentProps) {
  const { initial, projectsQuery, params } = loaderData;
  const { data: projects } = useQuery(projectsQuery, params, { initial });

  return (
    <div className="flex flex-col gap-8 mb-10">
      <div className="space-y-4">
        <h1 className="text-3xl md:text-5xl lg:text-7xl font-normal">
          Selected Work
        </h1>
        <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl">
          A collection of projects showcasing full-stack development, system
          design, and technical leadership
        </p>
      </div>

      <div className="grid gap-px bg-border rounded-lg overflow-hidden mt-12">
        {projects.map((project) => (
          <Link
            viewTransition
            to={`/work/${project.slug.current}`}
            key={project._id}
            className="block bg-background p-8 lg:p-12 transition-all duration-300 hover:bg-muted/30 border border-border rounded-lg"
          >
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8">
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-4 sm:gap-6">
                  <h2 className="text-2xl lg:text-3xl font-normal">
                    {project.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{project.year}</span>
                    <span>·</span>
                    <span>{project.role}</span>
                  </div>
                </div>

                <p className="text-base lg:text-lg text-muted-foreground max-w-2xl">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <Chip key={tech} variant="primary">
                      {tech}
                    </Chip>
                  ))}
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                  {project.highlights.map((highlight) => (
                    <span key={highlight} className="text-muted-foreground">
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-start gap-2">
                {project?.links?.github ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                    asChild
                  >
                    <Link to={project.links?.github}>
                      <GitBranch className="h-4 w-4" />
                      <span className="sr-only">View source</span>
                    </Link>
                  </Button>
                ) : null}
                {project.links?.live ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                    asChild
                  >
                    <Link to={project.links?.live}>
                      <ExternalLink className="h-4 w-4" />
                      <span className="sr-only">View project</span>
                    </Link>
                  </Button>
                ) : null}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-16 p-8 lg:p-12 border border-border rounded-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h3 className="text-xl lg:text-2xl font-normal mb-2">
              Open Source Contributions
            </h3>
            <p className="text-muted-foreground">
              Active contributor to various open source projects
            </p>
          </div>
          <Button variant="ghost" className="w-fit" asChild>
            <Link
              to="https://github.com/RobLMartin"
              className="flex items-center gap-2"
            >
              View GitHub Profile
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
