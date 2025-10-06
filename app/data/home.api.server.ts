import { loadQueryOptions } from "~/sanity/load-query-options.server";
import { loadQuery } from "~/sanity/loader.server";
import { validateHome, validateExperience } from "~/sanity/schema-types/home";

const query = `*[_type == "home"][0]{
  headline,
  subheadline,
  tools,
  skills,
  location,
  email,
  github,
  linkedin,
  "experience": experience[]{
    company,
    role,
    summary,
    achievements,
    techStack,
    companyId,
    startDate,
    endDate,
    location
  },
  "education": education[]{
    institution,
    degree,
    field,
    additionalInfo
  }
  }`;

export async function getHome({ request }: { request: Request }) {
  const { options } = await loadQueryOptions(request.headers);
  const params = {};
  const initial = await loadQuery(query, params, options).then((res) => ({
    ...res,
    data: res.data ? validateHome(res.data) : null,
  }));

  if (!initial.data) {
    throw new Response("Not found", { status: 404 });
  }

  return { initial, query, params };
}

const experienceQuery = `*[_type == "home"][0].experience[]{
  company,
  role,
  summary,
  achievements,
  techStack,
  companyId,
  startDate,
  endDate,
  location
}`;

export async function getExperience({ request }: { request: Request }) {
  const { options } = await loadQueryOptions(request.headers);
  const params = {};
  const initial = await loadQuery(experienceQuery, params, options).then((res) => ({
    ...res,
    data: res.data ? validateExperience(res.data) : null,
  }));

  return { initial, query: experienceQuery, params };
}
