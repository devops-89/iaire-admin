import type { Metadata } from "next";
import "./globals.css";
import { poppins } from "@/utils/fonts";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";

export const metadata: Metadata = {
  title: "Admin Dashboard | Login",
  description: "Secure login for the admin panel",
};

import GlobalSnackbar from "@/components/widgets/GlobalSnackbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <AppRouterCacheProvider>
          {children}
          <GlobalSnackbar />
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
