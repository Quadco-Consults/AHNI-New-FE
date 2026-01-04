import GoodReceiveNoteDetail from "@/features/admin/components/good-receive-note/id";


export async function generateStaticParams() {
  // Return empty array to generate no static pages by default
  // Pages will be generated on-demand in development
  return [];
}
export default function GoodReceiveNoteDetailPage() {
  return <GoodReceiveNoteDetail />;
}