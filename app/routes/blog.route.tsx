import { Clock, Calendar } from "lucide-react";
import { Chip } from "~/components/ui/chip";
import { Link, useSearchParams } from "react-router";
import type { Route } from "./+types/blog.route";
import { getBlogPosts } from "~/data/blog.api.server";
import { getExperience } from "~/data/home.api.server";
import { useQuery } from "@sanity/react-loader";
import { SanityImage } from "~/components/sanity-image";
import { useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Writing - Rob Martin" },
    {
      name: "description",
      content: "Thoughts on engineering, design, and building products",
    },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const url = new URL(request.url);
    const experienceFilter = url.searchParams.get("experience") || undefined;
    const tagFilter = url.searchParams.get("tag") || undefined;

    const blogData = await getBlogPosts({
      request,
      experienceFilter,
      tagFilter,
    });
    const experienceData = experienceFilter
      ? await getExperience({ request })
      : undefined;

    return {
      ...blogData,
      experienceInitial: experienceData?.initial,
      experienceQuery: experienceData?.query,
      experienceParams: experienceData?.params,
    };
  } catch (error) {
    console.error("Error fetching blog posts from Sanity:", error);
    throw new Response("Not found", { status: 404 });
  }
}

export default function Blog({ loaderData }: Route.ComponentProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const experienceFilter = searchParams.get("experience");
  const tagFilter = searchParams.get("tag");

  const {
    initial,
    blogPostsQuery,
    params,
    experienceInitial,
    experienceQuery,
    experienceParams,
  } = loaderData;
  const { data: posts } = useQuery(blogPostsQuery, params, { initial });
  const { data: experienceList } = useQuery(
    experienceQuery || "",
    experienceParams || {},
    {
      initial: experienceInitial || {
        data: null,
        sourceMap: undefined,
        perspective: undefined,
      },
    }
  );

  const experienceData = useMemo(() => {
    if (!experienceFilter || !experienceList) return null;
    return experienceList.find(
      (exp) => exp.companyId?.current === experienceFilter
    );
  }, [experienceFilter, experienceList]);

  const uniqueTags = useMemo(() => {
    const tags = new Set<string>();
    posts.forEach((post) => {
      post.tags?.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [posts]);

  const setTagFilter = (tag: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (tag === "all") {
      newParams.delete("tag");
    } else {
      newParams.set("tag", tag);
    }
    setSearchParams(newParams);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-col gap-16 mb-20">
      {experienceData ? (
        /* Experience-focused header */
        <div className="space-y-8">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-sm text-text-muted">
              <Link
                to="/blog"
                className="hover:text-text transition-colors"
                viewTransition
              >
                Writing
              </Link>
              <span>/</span>
              <span>{experienceData.company}</span>
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-normal tracking-tight">
                My time at {experienceData.company}
              </h1>
              <div className="flex flex-wrap items-baseline gap-x-3 text-lg text-text-muted">
                <span>{experienceData.role}</span>
                <span>·</span>
                <span>
                  {experienceData.startDate} –{" "}
                  {experienceData.endDate || "Present"}
                </span>
              </div>
              <p className="text-lg md:text-xl text-text-muted leading-relaxed max-w-3xl">
                {experienceData.summary}
              </p>
            </div>
          </div>

          {uniqueTags.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-text-muted">Filter by tag:</span>
              <Select value={tagFilter || "all"} onValueChange={setTagFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All tags" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All tags</SelectItem>
                  {uniqueTags.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      ) : (
        /* Default writing header */
        <div className="space-y-6">
          <div className="space-y-3">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-normal tracking-tight">
              Writing
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Thoughts on engineering, design, and building products
            </p>
          </div>

          {uniqueTags.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-text-muted">Filter by tag:</span>
              <Select value={tagFilter || "all"} onValueChange={setTagFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All tags" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All tags</SelectItem>
                  {uniqueTags.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}

      <div className="space-y-12 divide-y divide-border">
        {posts.map((post, index) => (
          <article
            key={post._id}
            className="group block bg-background p-8 lg:p-12 transition-all duration-300 hover:bg-muted/30 border border-border rounded-lg"
          >
            <Link
              to={`/blog/${post.slug.current}`}
              className="block"
              viewTransition
            >
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Cover Image */}
                {post.coverImage && (
                  <div className="w-full md:w-80 flex-shrink-0 overflow-hidden rounded-lg border border-border aspect-video md:aspect-[4/3]">
                    <SanityImage
                      image={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      widths={[320, 640, 800]}
                      sizes="(max-width: 768px) 100vw, 320px"
                      loading="lazy"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 space-y-6">
                  {/* Category tag */}
                  {post.category && (
                    <div className="flex items-center gap-3">
                      <Chip
                        variant="primary"
                        className="uppercase text-xs tracking-wide"
                      >
                        {post.category}
                      </Chip>
                    </div>
                  )}

                  {/* Title and excerpt */}
                  <div className="space-y-4">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal group-hover:text-muted-foreground transition-colors">
                      {post.title}
                    </h2>

                    <p className="text-lg text-muted-foreground leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Meta info */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <time dateTime={post.publishedAt}>
                        {formatDate(post.publishedAt)}
                      </time>
                    </div>
                    {post.readTime && (
                      <>
                        <span>·</span>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{post.readTime} min read</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="text-sm text-muted-foreground/60"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
