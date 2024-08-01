import { useNavigate, useParams } from "react-router-dom";
import LongArrowLeft from "components/icons/LongArrowLeft";
import PurchaseRequestAPI from "services/procurementApi/purchase-request";
import { LoadingSpinner } from "components/shared/Loading";
import { PurchaseRequestItems } from "definations/procurement-types/purchase-request";
import { Fragment } from "react/jsx-runtime";
import BreadcrumbCard from "components/shared/Breadcrumb";

const PurchaseRequesttDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data, isLoading } = PurchaseRequestAPI.useGetPurchaseRequestQuery({
    path: { id: id as string },
  });

  const goBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const breadcrumbs = [
    { name: "Procurement", icon: true },
    { name: "Purchase Request", icon: true },
    { name: "Detail", icon: false },
  ];

  return (
    <div className="min-h-screen space-y-6">
      <BreadcrumbCard list={breadcrumbs} />
      <button
        onClick={goBack}
        className="flex aspect-square w-[3rem] items-center justify-center rounded-full bg-white drop-shadow-md"
      >
        <LongArrowLeft />
      </button>
      <section className="relative top-5 w-full space-y-8 pb-[5rem]">
        <h3 className="text-primary text-xl font-semibold">
          Purchase Request Details
        </h3>
        <div className="grid grid-cols-4 gap-5">
          <span className="space-y-2">
            <h6 className="text-base font-semibold">Date of Request:</h6>
            <p className="text-sm">{data?.request_date}</p>
          </span>
          <span className="space-y-2">
            <h6 className="text-base font-semibold">Required Date:</h6>
            <p className="text-sm">{data?.required_date}</p>
          </span>
          <span className="space-y-2">
            <h6 className="text-base font-semibold">Requesting Dept:</h6>
            <p className="text-sm">{data?.requesting_department}</p>
          </span>
          <span className="space-y-2">
            <h6 className="text-base font-semibold">Deliver to:</h6>
            <p className="text-sm">{data?.deliver_to}</p>
          </span>
        </div>

        {/* table showing all results of the page */}
        <table className="w-full">
          <thead>
            <tr className="text-amber-500 whitespace-nowrap border-b-2 p-4 text-sm font-semibold">
              <th className="w-10 py-4 text-left">S/N</th>
              <th className="w-40 p-4 text-left">
                Description of items/services
              </th>
              <th className="w-32 p-4 text-left">NO of Persons/Unit</th>
              <th className="w-fit p-4 text-left">No of Days</th>
              <th className="w-fit p-4 text-left">FCO</th>
              <th className="w-fit p-4 text-left">Unit Cost</th>
              <th className="w-fit p-4 text-left">Total</th>
            </tr>
          </thead>
          <tbody>
            {/* Title 1: FEEDING  */}
            {data?.items?.map((item: PurchaseRequestItems, index) => (
              <Fragment key={item?.id}>
                <tr className="w-full whitespace-nowrap border-b-2 ">
                  <td className="w-fit p-4 text-left ">
                    <span className="bg-black rounded p-2 px-4 text-sm text-white">
                      {index + 1}.
                    </span>
                  </td>
                  <td className="w-fit p-4 text-left" colSpan={6}>
                    <strong>{item?.category}</strong>
                  </td>
                </tr>
                {/* Data for FEEDING */}
                <tr className="w-full whitespace-nowrap border-b-2 ">
                  <td className="w-10 py-4 text-left"></td>
                  <td className="w-40 p-4 text-left">
                    {item?.purchase_request}
                  </td>
                  <td className="w-32 p-4 text-left">{item?.units}</td>
                  <td className="w-fit p-4 text-left">
                    {item?.number_of_days}
                  </td>
                  <td className="w-fit p-4 text-left">{item?.fco}</td>
                  <td className="w-fit p-4 text-left">₦{item?.unit_cost}</td>
                  <td className="w-fit p-4 text-left">
                    ₦{item?.sub_total_amount}
                  </td>
                </tr>
              </Fragment>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-end">
          <div className="text-primary border-primary flex items-center justify-start gap-2 rounded border-2 px-6 py-3 text-base font-semibold">
            <span>Total:</span>
            <span>₦{data?.total_amount}</span>
          </div>
        </div>

        <h3 className="text-primary text-xl font-semibold">Requested By</h3>
        <div className="grid grid-cols-4 gap-5">
          <span className="space-y-2">
            <h6 className="text-base font-semibold">Name:</h6>
            <p className="text-sm">
              {data?.requested_by?.first_name} {data?.requested_by?.last_name}
            </p>
          </span>
          <span className="space-y-2">
            <h6 className="text-base font-semibold">Email:</h6>
            <p className="text-sm">{data?.requested_by?.email}</p>
          </span>
          <span className="space-y-2">
            <h6 className="text-base font-semibold">Gender:</h6>
            <p className="text-sm">{data?.requested_by?.gender}</p>
          </span>
          <span className="space-y-2">
            <h6 className="text-base font-semibold">Phone Number:</h6>
            <p className="text-sm">{data?.requested_by?.phone_number}</p>
          </span>
          <span className="space-y-2">
            <h6 className="text-base font-semibold">Designation:</h6>
            <p className="text-sm">{data?.requested_by?.designation}</p>
          </span>
        </div>
      </section>
    </div>
  );
};

export default PurchaseRequesttDetails;
