import Providers from "@/app/providers";
import { SidebarProvider, SidebarInset } from "@/app/components/ui/sidebar";
import { AppSidebar } from "@/app/components/app-sidebar";
import Header from "@/app/components/header";
import { Toaster } from "sonner";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <SidebarProvider defaultOpen={false}>
        <AppSidebar />
        <SidebarInset>
          <Toaster richColors position="top-center" />
          <Header />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </Providers>
  );
}
