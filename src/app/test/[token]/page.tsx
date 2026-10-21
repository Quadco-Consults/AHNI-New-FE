import PublicTestInterface from "@/features/hr/components/aptitude-tests/PublicTestInterface";

export async function generateStaticParams() {
  return [];
}

export default function PublicTestPage() {
  return <PublicTestInterface />;
}
