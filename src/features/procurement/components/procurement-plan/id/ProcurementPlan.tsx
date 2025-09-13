import { ProcurementPlanResultsData } from "../../../definations/procurement-types/procurementPlan";

const ProcurementPlan = (data: ProcurementPlanResultsData) => {
  return (
    <div className="w-[95%] mx-auto space-y-6">
      <h3 className="text-primary text-xl font-semibold py-5">
        Procurement Plan Details
      </h3>

      <div className="flex data?s-start gap-8 overflow-x-auto pb-6">
        <div className="flex flex-row gap-6 min-w-[400px] flex-shrink-0">
          {/* Details Table */}
          <div className="overflow-x-auto">
            <table className="table-auto min-w-max border border-gray-300 text-left border-collapse">
              <thead>
                {/* Row 1: Procurement Milestones */}
                <tr className="bg-gray-100">
                  <th
                    colSpan={31}
                    className="px-4 py-2 border text-center text-base font-semibold"
                  >
                    Procurement Plan- <span>{}</span>
                  </th>
                </tr>

                {/* Row 2: Date Info */}
                <tr className="bg-gray-50">
                  <th
                    colSpan={31}
                    className="text-red-500 px-4 py-2 border text-center text-sm font-semibold whitespace-nowrap"
                  >
                    FY25 (<span>{}</span>)
                  </th>
                </tr>

                {/* Row 3: Main Headers */}
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border text-sm font-semibold">SN</th>
                  <th className="px-4 py-2 border text-sm font-semibold">
                    IMPLEMENTER (OWNER)
                  </th>
                  <th className="px-4 py-2 border text-sm font-semibold">
                    Implementation Location
                  </th>
                  <th className="px-4 py-2 border text-sm font-semibold bg-red-300">
                    Workplan Activity Reference
                  </th>
                  <th className="px-4 py-2 border text-sm font-semibold">
                    Description Of Procurement Activities
                  </th>
                  <th
                    colSpan={1}
                    className="px-4 py-2 border text-center font-semibold text-[#DEA004]"
                  >
                    BUDGET REFERENCE NUMBER
                  </th>
                  <th
                    colSpan={2}
                    className="px-4 py-2 border text-center font-semibold "
                  >
                    APPROVED BUDGET AMOUNT
                  </th>
                  <th className="px-4 py-2 border text-sm font-semibold">
                    PPM
                  </th>
                  <th className="px-4 py-2 border text-sm font-semibold">
                    NON-PPM
                  </th>
                  <th className="px-4 py-2 border text-sm font-semibold">
                    FY25 TARGETS
                  </th>
                  <th className="px-4 py-2 border text-sm font-semibold">
                    UOM
                  </th>
                  <th className="px-4 py-2 border text-sm font-semibold">
                    QUANTITY
                  </th>
                  <th className="px-4 py-2 border text-sm font-semibold">
                    RESPONSIBLE PR STAFF
                  </th>
                  <th className="px-4 py-2 border text-sm font-semibold">
                    MODE OF PROCUREMENT
                  </th>
                  <th className="px-4 py-2 border text-sm font-semibold">
                    PROCURMENT COMMITTEE REVIEW (Yes - existing, new; No)
                  </th>
                  <th className="px-4 py-2 border text-sm font-semibold">
                    APPLICABLE SOLICITATION METHOD (EOI, RFP, RFQ, as per
                    organizational Procurement Policy)
                  </th>
                  <th className="px-4 py-2 border text-sm font-semibold">
                    PROCUREMENT START DATE(This is date PR is due or to be
                    submitted to Procurement unit)
                  </th>
                  <th
                    colSpan={7}
                    className="px-4 py-2 border text-sm font-semibold text-center text-[#DEA004]"
                  >
                    PROCURMENT MILESTONES
                  </th>
                  <th className="px-4 py-2 border text-sm font-semibold">
                    SELECTED SUPPLIER
                  </th>
                  <th className="px-4 py-2 border text-sm font-semibold">
                    DELIVERY LEADTIME
                  </th>

                  <th className="px-4 py-2 border text-sm font-semibold">
                    EXPECTED DELIVERY DUE DATE
                  </th>
                  <th className="px-4 py-2 border text-sm font-semibold">
                    DELIVERY TO PHO, Borno Office, Adamawa Office, Yobe Office,
                    Taraba Office, Clusters and Health Facilities
                  </th>
                  <th className="px-4 py-2 border text-sm font-semibold">
                    PROUCREMENT PERFORMANCE/MONITORING REMARKS
                  </th>
                  <th className="px-4 py-2 border text-sm font-semibold">
                    PROCUREMENT PERFORMANCE SOCRE
                  </th>
                </tr>

                {/* Row 4: Sub-Headers */}
                <tr className="bg-gray-50">
                  <th colSpan={7}></th>
                  <th className="px-4 py-2 border text-sm font-semibold">{}</th>

                  <th className="px-4 py-2 border text-sm font-semibold bg-blue-300">
                    {"₦"}
                  </th>
                  <th className="px-4 py-2 border text-sm font-semibold bg-cyan-300">
                    {"$"}
                  </th>
                  <th className="px-4 py-2 border text-sm font-semibold">{}</th>
                  <th className="px-4 py-2 border text-sm font-semibold">{}</th>
                  <th colSpan={6}></th>
                  <th className="px-4 py-2 border text-sm font-semibold bg-[#c4bd97]">
                    Procurement Method (ICB, ILCB, NCB, NLCB, National Shopping,
                    Local Shopping, Micro Purchase, Single Source, Sole Source)
                  </th>
                  <th className="px-4 py-2 border text-sm font-semibold bg-[#c4bd97]">
                    Start Date of RFQ
                  </th>
                  <th className="px-4 py-2 border text-sm font-semibold bg-[#c4bd97]">
                    Closing Date of RFQ
                  </th>
                  <th className="px-4 py-2 border text-sm font-semibold bg-[#c4bd97]">
                    Evaluation
                  </th>
                  <th className="px-4 py-2 border text-sm font-semibold bg-[#c4bd97]">
                    Negotiation (if Applicable)
                  </th>
                  <th className="px-4 py-2 border text-sm font-semibold bg-[#c4bd97]">
                    Date CBA and Report is Finalised
                  </th>
                  <th className="px-4 py-2 border text-sm font-semibold bg-[#c4bd97]">
                    Date Purchase Order/PC is issued
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                <tr>
                  <td className="px-4 py-2 border text-sm text-gray-500">
                    {data?.budget_line}
                  </td>
                  <td className="px-4 py-2 border text-sm text-gray-500">
                    {data?.implementer}
                  </td>
                  <td className="px-4 py-2 border text-sm text-gray-500">
                    {data?.implementation_location}
                  </td>
                  <td className="px-4 py-2 border text-sm text-gray-500">
                    {data?.workplan_activity_reference}
                  </td>
                  <td className="px-4 py-2 border text-sm text-gray-500">
                    {data?.description}
                  </td>
                  {/* Budget Allocation */}
                  <td className="px-4 py-2 border text-sm text-gray-500">
                    $68,125.26
                  </td>
                  <td className="px-4 py-2 border text-sm text-gray-500">
                    $68,125.26
                  </td>
                  <td className="px-4 py-2 border text-sm text-gray-500">
                    $68,125.26
                  </td>
                  <td className="px-4 py-2 border text-sm text-gray-500">
                    {"N/A"}
                  </td>
                  {/* Quantity Targets */}
                  <td className="px-4 py-2 border text-sm text-gray-500">
                    {"NON-PPM"}
                  </td>
                  <td className="px-4 py-2 border text-sm text-gray-500">2</td>
                  {/* Other Details */}
                  <td className="px-4 py-2 border text-sm text-gray-500">
                    {/* {data?.pr_staff} */ "LOT"}
                  </td>
                  <td className="px-4 py-2 border text-sm text-gray-500">
                    {/* {data?.pr_staff} */ "1.0"}
                  </td>
                  <td className="px-4 py-2 border text-sm text-gray-500">
                    {
                      /* {data?.mode_of_procurement} */ "Director Of Finance & Operations"
                    }
                  </td>
                  <td className="px-4 py-2 border text-sm text-gray-500">
                    {
                      /* {data?.procurement_committee_review} */ "Local Procurement"
                    }
                  </td>
                  <td className="px-4 py-2 border text-sm text-gray-500">
                    {/* {data?.selected_supplier} */ "NO"}
                  </td>
                  <td className="px-4 py-2 border text-sm text-gray-500">
                    {/* {data?.procurement_process} */ "N/A"}
                  </td>
                  <td className="px-4 py-2 border text-sm text-gray-500">
                    {/* {data?.start_date} */ "N/A"}
                  </td>
                  <td className="px-4 py-2 border text-sm text-gray-500">
                    {/* {data?.expected_delivery_date_1} */ "Sole Source"}
                  </td>
                  <td className="px-4 py-2 border text-sm text-gray-500">
                    {/* {data?.expected_delivery_date_2} */ "N/A"}
                  </td>
                  <td className="px-4 py-2 border text-sm text-gray-500">
                    {/* {data?.ware_houses} */ "N/A"}
                  </td>
                  <td className="px-4 py-2 border text-sm text-gray-500">
                    {/* {data?.donor_remarks} */ "N/A"}
                  </td>
                  <td className="px-4 py-2 border text-sm text-gray-500">
                    {/* {data?.implenter_remarks} */ "N/A"}
                  </td>
                  <td className="px-4 py-2 border text-sm text-gray-500">
                    {/* {data?.implenter_remarks} */ "N/A"}
                  </td>{" "}
                  <td className="px-4 py-2 border text-sm text-gray-500">
                    {/* {data?.implenter_remarks} */ "N/A"}
                  </td>{" "}
                  <td className="px-4 py-2 border text-sm text-gray-500">
                    {/* {data?.implenter_remarks} */ "N/A"}
                  </td>{" "}
                  <td className="px-4 py-2 border text-sm text-gray-500">
                    {/* {data?.implenter_remarks} */ "N/A"}
                  </td>{" "}
                  <td className="px-4 py-2 border text-sm text-gray-500">
                    {/* {data?.implenter_remarks} */ "N/A"}
                  </td>{" "}
                  <td className="px-4 py-2 border text-sm text-gray-500">
                    {"PHO"}
                  </td>{" "}
                  <td className="px-4 py-2 border text-sm text-gray-500">
                    {
                      /* {data?.implenter_remarks} */ "The budgeted cost covers a monthly recharge of electricity of N200,000 for FY25"
                    }
                  </td>{" "}
                  <td className="px-4 py-2 border text-sm text-gray-500">
                    {data?.implenter_remarks}
                  </td>{" "}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcurementPlan;
