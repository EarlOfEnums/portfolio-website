import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { SanityImage } from "~/components/sanity-image";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

type Image = {
  lightImage: SanityImageSource;
  darkImage?: SanityImageSource | null;
  alt: string;
  caption?: string | null;
};

interface ImageModalProps {
  image: Image;
  sizes?: string;
}

export function ImageModal({
  image,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px",
}: ImageModalProps) {
  const { lightImage, darkImage, alt } = image;

  if (!lightImage && !darkImage) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="cursor-pointer">
          {lightImage && (
            <SanityImage
              image={lightImage}
              alt={alt}
              className="block dark:hidden w-full h-auto"
              sizes={sizes}
            />
          )}
          {darkImage && (
            <SanityImage
              image={darkImage}
              alt={alt}
              className="hidden dark:block w-full h-auto"
              sizes={sizes}
            />
          )}
        </div>
      </DialogTrigger>
      <DialogContent className="!max-w-none !max-h-none !w-screen !h-screen !p-0 !border-0 !rounded-none bg-background/95 backdrop-blur-sm !m-0 !translate-x-0 !translate-y-0 !left-0 !top-0 !transform-none">
        <div className="w-full h-full flex items-center justify-center p-4 md:p-8 mt-3">
          {lightImage && (
            <SanityImage
              image={lightImage}
              alt={alt}
              className="block dark:hidden max-h-full max-w-full object-contain border border-border rounded-lg"
              sizes="100vw"
              priority
              widths={[800, 1200, 1600, 2000, 2400]}
              quality={95}
            />
          )}
          {darkImage && (
            <SanityImage
              image={darkImage}
              alt={alt}
              className="hidden dark:block max-h-full max-w-full object-contain border border-border rounded-lg"
              sizes="100vw"
              priority
              widths={[800, 1200, 1600, 2000, 2400]}
              quality={95}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
