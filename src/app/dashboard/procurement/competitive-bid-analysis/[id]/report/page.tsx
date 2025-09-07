"use client";

import { useParams } from "next/navigation";
import BreadcrumbCard from "components/Breadcrumb";
import GoBack from "components/GoBack";
import CbaReportGenerator from "@/features/procurement/components/competitive-bid-analysis/CbaReportGenerator";

const CbaReportPage = () => {
  const { id } = useParams();

  const breadcrumbs = [
    { name: "Procurement", icon: true },
    { name: "Competitive Bid Analysis", icon: true },
    { name: "Report", icon: false },
  ];

  return (
    <div className="space-y-5">
      <BreadcrumbCard list={breadcrumbs} />
      
      <GoBack />
      
      <CbaReportGenerator cbaId={id as string} />
    </div>
  );
};

export default CbaReportPage;