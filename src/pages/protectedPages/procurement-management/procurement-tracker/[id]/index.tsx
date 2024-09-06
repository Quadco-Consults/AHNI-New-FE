import BreadcrumbCard from "components/shared/Breadcrumb";
import Card from "components/shared/Card";
import GoBack from "components/shared/GoBack";
import React from "react";

const ProcurementTrackerDetail = () => {
  const breadcrumbs = [
    { name: "Procurement", icon: true },
    { name: "Procurement Tracker", icon: true },
    { name: "Detail", icon: false },
  ];

  return (
    <div className="space-y-5">
      <BreadcrumbCard list={breadcrumbs} />
      <GoBack />

      <Card className="space-y-10">
        <Card className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
          <div className="space-y-2">
            <h4 className="font-bold">Solicitation Ref</h4>
            <p className="text-sm">65568862579+8</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold">Lot</h4>
            <p className="text-sm">10/2022 - 09/2023</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold">Solicitation Date</h4>
            <p className="text-sm">10/2022 - 09/2023</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold">Request Type</h4>
            <p className="text-sm">10/2022 - 09/2023</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold">Tender Type</h4>
            <p className="text-sm">Open Tender</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold">Status</h4>
            <p className="text-sm">Pending</p>
          </div>
        </Card>
        <Card className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
          <div className="space-y-2">
            <h4 className="font-bold">PO Ref</h4>
            <p className="text-sm">10/2022 - 09/2023</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold">PO Date</h4>
            <p className="text-sm">10/2022 - 09/2023</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold">Vendor</h4>
            <p className="text-sm">10/2022 - 09/2023</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold">Unit Cost</h4>
            <p className="text-sm">10/2022 - 09/2023</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold">Total Amount</h4>
            <p className="text-sm">Open Tender</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold">Status</h4>
            <p className="text-sm">Pending</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold">Delivery Date</h4>
            <p className="text-sm">Pending</p>
          </div>
        </Card>
      </Card>
    </div>
  );
};

export default ProcurementTrackerDetail;
