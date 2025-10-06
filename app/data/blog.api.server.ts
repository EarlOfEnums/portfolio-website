import { validateBlogPost } from "~/sanity/schema-types/blog-post";
import { loadQueryOptions } from "~/sanity/load-query-options.server";
import { loadQuery } from "~/sanity/loader.server";

const blogPostBySlugQuery = `*[_type == 'blog-post' && slug.current == $slug][0] {
  _id,
  title,
  slug,
  excerpt,
  publishedAt,
  coverImage,
  category,
  tags,
  readTime,
  body
}`;

export async function getBlogPosts({
  request,
  experienceFilter,
  tagFilter,
}: {
  request: Request;
  experienceFilter?: string;
  tagFilter?: string;
}) {
  const { options } = await loadQueryOptions(request.headers);

  // Build dynamic query based on filters
  let filterConditions = `_type == "blog-post"`;
  const params: Record<string, string> = {};

  if (experienceFilter) {
    filterConditions += ` && relatedExperience == $experienceFilter`;
    params.experienceFilter = experienceFilter;
  }

  if (tagFilter) {
    filterConditions += ` && $tagFilter in tags`;
    params.tagFilter = tagFilter;
  }

  const blogPostsQuery = `*[${filterConditions}] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    coverImage,
    category,
    tags,
    readTime,
    relatedExperience
  }`;

  const initial = await loadQuery(blogPostsQuery, params, options).then(
    (res) => ({
      ...res,
      data: validateBlogPosts(res.data),
    })
  );

  if (!initial.data) {
    throw new Response("Not found", { status: 404 });
  }
  return { initial, blogPostsQuery, params };
}

function validateBlogPosts(data: unknown) {
  if (!data) return [];
  if (!Array.isArray(data)) return [];
  return data.map((data: unknown) => {
    const result = validateBlogPost(data);
    return result;
  });
}

export async function getBlogPostBySlug({
  slug,
  request,
}: {
  slug: string;
  request: Request;
}) {
  const { options } = await loadQueryOptions(request.headers);
  const params = { slug };
  const initial = await loadQuery(blogPostBySlugQuery, params, options).then(
    (res) => {
      return {
        ...res,
        data: res.data ? validateBlogPost(res.data) : null,
      };
    }
  );

  if (!initial.data) {
    throw new Response("Not found", { status: 404 });
  }
  return { initial, blogPostBySlugQuery, params };
}
