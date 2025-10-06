import { Studio } from "sanity";

import config from "../../sanity.config";

import { Link } from "react-router";
import { VisualEditing } from "@sanity/visual-editing/react-router";
import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";

let isHydrating = true;

export function SanityStudio() {
  return <Studio config={config} />;
}

export function Hydrated(props: PropsWithChildren) {
  const [isHydrated, setIsHydrated] = useState(!isHydrating);

  useEffect(() => {
    isHydrating = false;
    setIsHydrated(true);
  }, []);

  return isHydrated && props.children ? props.children : null;
}

function DisablePreviewMode() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(window === window.parent && !window.opener);
  }, []);
  return (
    show && (
      <Link
        to="/api/preview-mode/disable"
        className="p-4 bg-orange-400 text-white font-bold flex items-center justify-center"
      >
        Disable Preview Mode
      </Link>
    )
  );
}

export function SanityVisualEditing() {
  return (
    <div className="absolute bottom-0 right-0">
      <VisualEditing />
      <DisablePreviewMode />
    </div>
  );
}
