import { ThemeProvider } from "@/contexts/theme-context";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AppHeaderBreadcrumb } from "@/components/app-header-breadcrumb";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <div></div>

          <div className="flex">
            <AppSidebar>
              {/* <div className="flex flex-col flex-1 overflow-hidden">
                <AppHeaderBreadcrumb />
                <main className="flex-1 overflow-auto p-4">{children}</main>
              </div> */}
              {children}
            </AppSidebar>
          </div>

          {/* {children} */}
        </ThemeProvider>
      </body>
    </html>
  );
}
