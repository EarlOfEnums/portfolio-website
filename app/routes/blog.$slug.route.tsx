import { Link } from "react-router";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Chip } from "~/components/ui/chip";
import type { Route } from "./+types/blog.$slug.route";
import { getBlogPostBySlug } from "~/data/blog.api.server";
import { PortableText } from "@portabletext/react";
import { useQuery } from "@sanity/react-loader";
import { SanityImage } from "~/components/sanity-image";
import { CodeBlock } from "~/components/code-block";

export async function loader({ params, request }: Route.LoaderArgs) {
  try {
    return await getBlogPostBySlug({ slug: params.slug, request });
  } catch (error) {
    console.error("Error fetching blog post from Sanity:", error);
    throw new Response("Not found", { status: 404 });
  }
}

export function meta({ data }: Route.MetaArgs) {
  const post = data?.initial.data;
  return [
    { title: `${post?.title || "Post"} - Rob Martin` },
    { name: "description", content: post?.excerpt || "Blog post" },
  ];
}

const portableTextComponents = {
  block: {
    h2: ({ children }: any) => (
      <h2 className="text-2xl md:text-3xl font-normal mt-12 mb-6">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-xl md:text-2xl font-normal mt-10 mb-4">{children}</h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="text-lg md:text-xl font-normal mt-8 mb-3">{children}</h4>
    ),
    normal: ({ children }: any) => (
      <p className="text-lg leading-relaxed text-muted-foreground mb-6">
        {children}
      </p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-foreground/20 pl-6 my-8 italic text-muted-foreground">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="list-disc list-outside ml-6 my-6 space-y-2 text-lg text-muted-foreground">
        {children}
      </ul>
    ),
    number: ({ children }: any) => (
      <ol className="list-decimal list-outside ml-6 my-6 space-y-2 text-lg text-muted-foreground">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }: any) => <li className="pl-2">{children}</li>,
    number: ({ children }: any) => <li className="pl-2">{children}</li>,
  },
  marks: {
    link: ({ children, value }: any) => (
      <a
        href={value.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors"
      >
        {children}
      </a>
    ),
    code: ({ children }: any) => (
      <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
        {children}
      </code>
    ),
    strong: ({ children }: any) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    em: ({ children }: any) => <em className="italic">{children}</em>,
  },
  types: {
    code: ({ value }: any) => (
      <CodeBlock
        code={value.code}
        language={value.language || "javascript"}
        filename={value.filename}
      />
    ),
    image: ({ value }: any) => {
      if (!value?.asset) return null;
      return (
        <figure className="my-12">
          <div className="overflow-hidden rounded-lg border border-border">
            <SanityImage
              image={value}
              alt={value.alt || ""}
              className="w-full"
              widths={[600, 900, 1200, 1600]}
              sizes="(max-width: 768px) 100vw, 900px"
            />
          </div>
          {value.caption && (
            <figcaption className="text-center text-sm text-muted-foreground mt-4">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};

export default function BlogPost({ loaderData }: Route.ComponentProps) {
  const { initial, blogPostBySlugQuery, params } = loaderData;
  const { data: post } = useQuery(blogPostBySlugQuery, params, { initial });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!post) {
    return (
      <div className="flex flex-col gap-8 mb-10 max-w-3xl mx-auto mt-[40vh]">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-normal">
          Post not found
        </h1>
        <Button variant="ghost" asChild className="w-fit">
          <Link to="/blog" className="flex items-center gap-2" viewTransition>
            <ArrowLeft className="h-4 w-4" />
            Back to writing
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col mb-20">
      {/* Back button */}
      <div className="absolute top-0 left-0 p-4 hidden sm:block">
        <Button variant="ghost" asChild className="w-fit">
          <Link to="/blog" className="flex items-center gap-2" viewTransition>
            <ArrowLeft className="h-4 w-4" />
            Back to writing
          </Link>
        </Button>
      </div>

      <article className="max-w-4xl mx-auto px-4 w-full">
        {/* Header */}
        <header className="space-y-8 mb-16">
          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight leading-tight">
            {post.title}
          </h1>
          {/* Category */}
          {post.category && (
            <div>
              <Chip
                variant="primary"
                className="uppercase text-xs tracking-wide"
              >
                {post.category}
              </Chip>
            </div>
          )}
          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl text-muted-foreground leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pb-8 border-b border-border">
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
        </header>
        {/* Hero Cover Image */}
        {post.coverImage && (
          <div className="mb-12">
            <div className="overflow-hidden rounded-xl border border-border">
              <SanityImage
                image={post.coverImage}
                alt={post.title}
                className="w-full aspect-[21/9] object-cover"
                widths={[800, 1200, 1600, 2000]}
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px"
                priority
              />
            </div>
          </div>
        )}
        {/* Body content */}
        <div className="prose prose-lg max-w-none">
          <PortableText value={post.body} components={portableTextComponents} />
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-16 pt-8 border-t border-border">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="text-sm text-muted-foreground/60">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer CTA */}
        <div className="mt-20 pt-12 border-t border-border">
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-normal">
              Let's work together
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              If you enjoyed this post and want to discuss your project or just
              chat about technology, feel free to reach out.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/" viewTransition>
                  Get in Touch
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/blog" viewTransition>
                  Read More
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
