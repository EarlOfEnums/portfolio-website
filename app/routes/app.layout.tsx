import { Navigation } from "~/components/navigation";
import { Outlet } from "react-router";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen">
      <div className="sticky top-0 h-screen sm:border-r sm:border-border">
        <Navigation />
      </div>

      <main className="w-full container mx-auto px-4 md:px-10 mt-[40vh] pb-20">
        <Outlet />
      </main>
    </div>
  );
}
