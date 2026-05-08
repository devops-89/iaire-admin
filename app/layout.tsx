import type { Metadata } from "next";
import "./globals.css";
import { poppins } from "@/utils/fonts";

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
    <html lang="en">
      <body className={poppins.className}>
        <Modal />
        {children}
        <GlobalSnackbar />
      </body>
    </html>
  );
}
