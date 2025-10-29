import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Consultant Contract Dashboard",
  description: "Consultant Contract Dashboard - Issued Contracts",
};

export default function ConsultantContractLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}