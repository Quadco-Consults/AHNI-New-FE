import { ProcurementPlanResultsData } from "definations/procurement-types/procurementPlan";
import React from "react";

const ProcurementPlan = (data: ProcurementPlanResultsData) => {
  return (
    <div className="w-[95%] mx-auto space-y-4">
      <h3 className="text-primary text-xl font-semibold py-5">
        Procurement Plan Details
      </h3>
      <div className="w-full grid grid-cols-2 gap-5 border-b pb-16">
        <span className="space-y-2">
          <h4 className="text-lg font-semibold">Workplan Activity Reference</h4>
          <p className="text-sm text-gray-500">{data?.workplan_activity}</p>
        </span>
        <span className="space-y-2">
          <h4 className="text-lg font-semibold">
            Description Of Procurement Activities
          </h4>
          <p className="text-sm text-gray-500">{data?.description}</p>
        </span>
      </div>
      <h3 className="text-base font-semibold text-[#DEA004]">
        Budget Allocation Over Three Years (USD)
      </h3>
      <div className="w-full grid grid-cols-3 gap-5 border-b pb-16">
        <span className="space-y-2">
          <h4 className="text-lg font-semibold">Year 1 (2021) </h4>
          <p className="text-sm text-gray-500">$68,125.26</p>
        </span>
        <span className="space-y-2">
          <h4 className="text-lg font-semibold">Year 2 (2021) </h4>
          <p className="text-sm text-gray-500">$68,125.26</p>
        </span>
        <span className="space-y-2">
          <h4 className="text-lg font-semibold">Year 3 (2021) </h4>
          <p className="text-sm text-gray-500">$68,125.26</p>
        </span>
        <span className="space-y-2">
          <h4 className="text-lg font-semibold">Approved Budget Amount</h4>
          <p className="text-sm text-gray-500">${data?.approved_budget}</p>
        </span>
      </div>
      <h3 className="text-base font-semibold text-[#DEA004]">
        Quantity Targets Over Three Years
      </h3>
      <div className="w-full grid grid-cols-3 gap-5 border-b pb-16">
        <span className="space-y-2">
          <h4 className="text-lg font-semibold">Year 1 (2021) </h4>
          <p className="text-sm text-gray-500">0.3</p>
        </span>
        <span className="space-y-2">
          <h4 className="text-lg font-semibold">Year 2 (2021) </h4>
          <p className="text-sm text-gray-500">0.3</p>
        </span>
        <span className="space-y-2">
          <h4 className="text-lg font-semibold">Year 3 (2021) </h4>
          <p className="text-sm text-gray-500">0.3</p>
        </span>
        <span className="space-y-2">
          <h4 className="text-lg font-semibold">Total Quantity (1-3 Years)</h4>
          <p className="text-sm text-gray-500">1.0</p>
        </span>
      </div>
      <div className="w-full grid grid-cols-2 gap-5 border-b pb-16">
        <span className="space-y-2">
          <h4 className="text-lg font-semibold">Responsible PR Staff</h4>
          <p className="text-sm text-gray-500">{data?.pr_staff}</p>
        </span>
        <span className="space-y-2">
          <h4 className="text-lg font-semibold">Mode Of Procurement</h4>
          <p className="text-sm text-gray-500">{data?.mode_of_procurement}</p>
        </span>
        <span className="space-y-2">
          <h4 className="text-lg font-semibold">
            Procurement Committee Review (Yes - existing, new; No)
          </h4>
          <p className="text-sm text-gray-500">
            {data?.procurement_committee_review}
          </p>
        </span>
        <span className="space-y-2">
          <h4 className="text-lg font-semibold">Selected Supplier</h4>
          <p className="text-sm text-gray-500">{data?.selected_supplier}</p>
        </span>
      </div>
      <div className="w-full grid grid-cols-1 gap-5 border-b pb-16">
        <span className="space-y-2">
          <h4 className="text-lg font-semibold">
            PROCUREMENT PROCESS (EOI, RFP, RFQ, Minimum Quotes, Open or Limited
            Bidding etc. as per organizational Procurement Policy, refer
            relevant section)
          </h4>
          <p className="text-sm text-gray-500">{data?.procurement_process}</p>
        </span>
      </div>
      <div className="w-full grid grid-cols-3 gap-5 border-b pb-16">
        <span className="space-y-2">
          <h4 className="text-lg font-semibold">
            Start Date (at least week of the month)
          </h4>
          <p className="text-sm text-gray-500">{data?.start_date}</p>
        </span>
        <span className="space-y-2">
          <h4 className="text-lg font-semibold">Expected Delivery Date 1</h4>
          <p className="text-sm text-gray-500">
            {data?.expected_delivery_date_1}
          </p>
        </span>
        <span className="space-y-2">
          <h4 className="text-lg font-semibold">Expected Delivery Date 2</h4>
          <p className="text-sm text-gray-500">
            {data?.expected_delivery_date_2}
          </p>
        </span>
        <span className="space-y-2 col-span-3">
          <h4 className="text-lg font-semibold">
            DELIVERY TO (Central warehouse, State warehouse, treatment site, SR)
          </h4>
          <p className="text-sm text-gray-500">{data?.ware_houses}</p>
        </span>
      </div>
      <div className="w-full grid grid-cols-2 gap-5 pb-16">
        <span className="space-y-2">
          <h4 className="text-lg font-semibold">Donor Remarks</h4>
          <p className="text-sm text-gray-500">{data?.donor_remarks}</p>
        </span>
        <span className="space-y-2">
          <h4 className="text-lg font-semibold">Implementer Remarks</h4>
          <p className="text-sm text-gray-500">{data?.implenter_remarks}</p>
        </span>
      </div>
    </div>
  );
};

export default ProcurementPlan;
