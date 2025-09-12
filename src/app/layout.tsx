import type { Metadata } from "next";
import "./globals.css";
import "@/utils/polyfills";
import AppProviders from "./providers";
import StoreProvider from "./StoreProvider";
import { ChatButton } from "@/components/chat";

export const metadata: Metadata = {
  title: "AHNI ERP System",
  description: "Enterprise Resource Planning System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <AppProviders>
            {children}
            <ChatButton />
          </AppProviders>
        </StoreProvider>
      </body>
    </html>
  );
}