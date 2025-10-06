import type { MetaFunction } from "react-router";

import { SanityStudio, Hydrated } from "~/components/sanity-studio";

export const meta: MetaFunction = () => [
  { title: "Sanity Studio" },
  { name: "robots", content: "noindex" },
];

export default function StudioPage() {
  return (
    <Hydrated>
      <SanityStudio />
    </Hydrated>
  );
}
