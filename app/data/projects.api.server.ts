import { validateProject } from "~/sanity/schema-types/project";
import { loadQueryOptions } from "~/sanity/load-query-options.server";
import { loadQuery } from "~/sanity/loader.server";
const projectsQuery = `*[_type == "project"] | order(order asc) {
  _id,
  title,
  slug,
  year,
  role,
  description,
  technologies,
  highlights,
  links
}`;

const projectBySlugQuery = `*[_type == 'project' && slug.current == $slug][0] {
  _id,
  title,
  slug,
  year,
  role,
  description,
  technologies,
  highlights,
  links,
  client,
  duration,
  order,
  metrics,
  features,
  challenges,
  featured,
  images,
  tagline,
  overview,
}`;

export async function getProjects({ request }: { request: Request }) {
  const { options } = await loadQueryOptions(request.headers);
  const params = {};
  const initial = await loadQuery(projectsQuery, params, options).then(
    (res) => ({
      ...res,
      data: validateProjects(res.data),
    })
  );

  if (!initial.data) {
    throw new Response("Not found", { status: 404 });
  }
  return { initial, projectsQuery, params };
}

function validateProjects(data: unknown) {
  if (!data) return [];
  if (!Array.isArray(data)) return [];
  return data.map((data: unknown) => {
    const result = validateProject(data);
    return result;
  });
}

export async function getProjectBySlug({
  slug,
  request,
}: {
  slug: string;
  request: Request;
}) {
  const { options } = await loadQueryOptions(request.headers);
  const params = { slug };
  const initial = await loadQuery(projectBySlugQuery, params, options).then(
    (res) => {
      return {
        ...res,
        data: res.data ? validateProject(res.data) : null,
      };
    }
  );

  if (!initial.data) {
    throw new Response("Not found", { status: 404 });
  }
  return { initial, projectBySlugQuery, params };
}
