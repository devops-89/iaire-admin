import type { Metadata } from "next";
import "./globals.css";
import { poppins } from "@/utils/fonts";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";

export const metadata: Metadata = {
  title: "Admin Dashboard | Login",
  description: "Secure login for the admin panel",
};

import GlobalSnackbar from "@/components/widgets/GlobalSnackbar";
import Modal from "@/components/widgets/Modal";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={poppins.className} suppressHydrationWarning>
        <AppRouterCacheProvider>
          <Modal />
          {children}
          <GlobalSnackbar />
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
