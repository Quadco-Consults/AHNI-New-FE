import ContractAcceptance from "@/features/contracts-grants/components/contract-management/consultant-management/id/applicants/ContractAcceptance";


export async function generateStaticParams() {
  // Return empty array to generate no static pages by default
  // Pages will be generated on-demand in development
  return [];
}
export default function ContractAcceptancePage() {
  return <ContractAcceptance />;
}