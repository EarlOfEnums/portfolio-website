import { Link } from "react-router";
import { ArrowLeft, GitBranch, ArrowRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Chip } from "~/components/ui/chip";
import type { Route } from "./+types/work.$slug.route";
import { getProjectBySlug } from "~/data/projects.api.server";

import { ImageModal } from "~/components/image-modal";
import { useQuery } from "@sanity/react-loader";

export async function loader({ params, request }: Route.LoaderArgs) {
  try {
    return await getProjectBySlug({ slug: params.slug, request });
  } catch (error) {
    console.error("Error fetching project from Sanity:", error);
    throw new Response("Not found", { status: 404 });
  }
}

export function meta({ data }: Route.MetaArgs) {
  const project = data?.initial.data;
  console.log("in meta");
  return [
    { title: `${project?.title || "Project"} - Rob Martin` },
    { name: "description", content: project?.description || "Project details" },
  ];
}

export default function ProjectDetail({ loaderData }: Route.ComponentProps) {
  const { initial, projectBySlugQuery, params } = loaderData;
  const { data: project } = useQuery(projectBySlugQuery, params, { initial });

  if (!project) {
    return (
      <div className="flex flex-col gap-8 mb-10 max-w-4xl">
        <h1 className="text-3xl md:text-5xl lg:text-7xl font-normal">
          Project not found
        </h1>
        <Button variant="ghost" asChild className="w-fit">
          <Link to="/work" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to projects
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-20 mb-20">
      {/* Header */}
      <div className="absolute top-0 left-0 p-4 hidden sm:block">
        <Button variant="ghost" asChild className="w-fit">
          <Link to="/work" className="flex items-center gap-2" viewTransition>
            <ArrowLeft className="h-4 w-4" />
            Back to projects
          </Link>
        </Button>
      </div>
      <div className="space-y-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-normal mb-3">
              {project.title}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              {project.tagline}
            </p>
          </div>

          <p className="text-lg leading-relaxed max-w-3xl">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-3">
            {project.links?.github && (
              <Button variant="outline" asChild>
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <GitBranch className="h-4 w-4" />
                  View Source
                </a>
              </Button>
            )}
            {project.links?.live && (
              <Button asChild>
                <a
                  href={project.links?.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  View Project
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Project Info */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
        <div>
          <h3 className="text-muted-foreground mb-2">Year</h3>
          <p>{project.year}</p>
        </div>
        <div>
          <h3 className="text-muted-foreground mb-2">Role</h3>
          <p>{project.role}</p>
        </div>
        <div>
          <h3 className="text-muted-foreground mb-2">Client</h3>
          <p>{project.client}</p>
        </div>
        <div>
          <h3 className="text-muted-foreground mb-2">Duration</h3>
          <p>{project.duration}</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {project.metrics.map((metric) => (
          <div key={metric.label} className="text-center">
            <div className="text-2xl md:text-3xl font-normal mb-1">
              {metric.value}
            </div>
            <div className="text-sm text-muted-foreground">{metric.label}</div>
          </div>
        ))}
      </div>

      {/* Overview */}
      <div className="space-y-4">
        <h2 className="text-xl font-normal">Overview</h2>
        <p className="text-muted-foreground leading-relaxed">
          {project.overview}
        </p>
      </div>

      {/* Images */}
      {project?.images && project?.images.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-normal">Interface</h2>
          {project?.images?.length === 1 ? (
            // Single image - browser frame
            <div className="border border-border rounded-lg overflow-hidden bg-background">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
                <div className="w-3 h-3 rounded-full bg-muted"></div>
                <div className="w-3 h-3 rounded-full bg-muted"></div>
                <div className="w-3 h-3 rounded-full bg-muted"></div>
              </div>
              {typeof project.images[0] === "string" ? (
                <img
                  src={project.images[0]}
                  alt={`${project.title} interface`}
                  className="w-full h-auto"
                />
              ) : (
                <ImageModal
                  image={project.images[0]}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                />
              )}
            </div>
          ) : (
            // Multiple images - simple grid
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project?.images.map((image, i) => (
                <div
                  key={i}
                  className="border border-border rounded-lg overflow-hidden"
                >
                  {typeof image === "string" ? (
                    <img
                      src={image}
                      alt={`${project.title} view ${i + 1}`}
                      className="w-full h-auto"
                    />
                  ) : (
                    <ImageModal
                      image={image}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Technologies */}
      <div className="space-y-6 max-w-xl">
        <h2 className="text-xl font-normal">Technologies</h2>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <Chip key={tech} variant="primary">
              {tech}
            </Chip>
          ))}
        </div>
      </div>

      {/* Key Features */}
      <div className="space-y-6">
        <h2 className="text-xl font-normal">Key Features</h2>
        <ul className="space-y-3">
          {project.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="text-muted-foreground mt-1.5 w-1 h-1 rounded-full bg-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Technical Challenges */}
      <div className="space-y-6">
        <h2 className="text-xl font-normal">Technical Challenges</h2>
        <ul className="space-y-3">
          {project.challenges.map((challenge, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="text-muted-foreground mt-1.5 w-1 h-1 rounded-full bg-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground">{challenge}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="border-t border-border pt-12">
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-normal">
            Interested in working together?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Let's discuss how I can help bring your project to life with the
            same attention to detail and technical excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <Link viewTransition to="/">
                Get in Touch
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link viewTransition to="/work">
                View More Projects
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-8 border-t border-border">
        <Button variant="ghost" asChild>
          <Link to="/work" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            All Projects
          </Link>
        </Button>
      </div>
    </div>
  );
}
