import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

const builder = imageUrlBuilder({
  projectId: "88ryji29",
  dataset: "production",
});

function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

interface SanityImageProps {
  image: SanityImageSource;
  alt: string;
  className?: string;
  sizes?: string;
  loading?: "lazy" | "eager";
  priority?: boolean;
  widths?: number[];
  quality?: number;
  onLoad?: () => void;
  onClick?: () => void;
}

export function SanityImage({
  image,
  alt,
  className = "",
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 90vw, (max-width: 1536px) 80vw, 1200px",
  loading = "lazy",
  priority = false,
  widths = [400, 600, 800, 1200, 1600, 2000],
  quality = 90,
  onLoad,
  onClick,
}: SanityImageProps) {
  if (!image) return null;

  const baseUrl = urlFor(image).auto("format").fit("max").quality(quality);

  const srcSet = widths
    .map((width) => `${baseUrl.width(width).url()} ${width}w`)
    .join(", ");

  const src = baseUrl.width(1200).url();

  const blurUrl = urlFor(image).width(20).blur(10).quality(30).url();

  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      className={className}
      loading={priority ? "eager" : loading}
      decoding={priority ? "sync" : "async"}
      onLoad={onLoad}
      onClick={onClick}
      style={{
        backgroundImage: `url(${blurUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />
  );
}

export function getImageDimensions(
  image: any
): { width: number; height: number; aspectRatio: number } | null {
  if (!image?.asset?._ref) return null;

  const dimensions = image.asset._ref.split("-")[2];
  if (!dimensions) return null;

  const [width, height] = dimensions.split("x").map(Number);

  return {
    width,
    height,
    aspectRatio: width / height,
  };
}

export { urlFor };
