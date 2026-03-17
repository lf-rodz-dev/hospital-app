"use client";

import { SidebarTrigger } from "@/app/components/ui/sidebar";
import { Separator } from "@/app/components/ui/separator";
import { usePathname } from "next/navigation";
import { getRouteName } from "@/app/config/routes";

function Header() {
  const pathname = usePathname();
  const routeName = getRouteName(pathname);

  return (
    <header className="bg-background sticky top-0 z-10 flex h-16 items-center gap-4 border-b px-6">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-6" />
      <h2 className="text-lg font-semibold">{routeName}</h2>
    </header>
  );
}

export default Header;