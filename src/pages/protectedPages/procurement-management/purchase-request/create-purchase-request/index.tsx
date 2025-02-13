import LongArrowLeft from "components/icons/LongArrowLeft";
import { useNavigate } from "react-router-dom";
import CreatePurchaseRequestForm from "./form";
import BreadcrumbCard from "components/shared/Breadcrumb";
import useQuery from "hooks/useQuery";
import { useMemo } from "react";
import PurchaseRequestAPI from "services/procurementApi/purchase-sample-request ";

function CreatePurchaseRequest() {
  const query = useQuery();
  const id = query.get("request");
  const navigate = useNavigate();

  const { data: requestsDetails } = PurchaseRequestAPI.useGetActivityMemoQuery(
    useMemo(
      () => ({
        path: { id: id as string },
      }),
      [id]
    )
  );

  console.log({ requestsDetails });

  const goBack = () => {
    navigate(-1);
  };

  const breadcrumbs = [
    { name: "Procurement", icon: true },
    { name: "Purchase Request", icon: true },
    { name: "Create", icon: false },
  ];

  return (
    <section className='space-y-6'>
      <BreadcrumbCard list={breadcrumbs} />

      <button
        onClick={goBack}
        className='w-[3rem] aspect-square rounded-full drop-shadow-md bg-white flex items-center justify-center'
      >
        <LongArrowLeft />
      </button>
      <span className='block space-y-2'>
        <h3 className='font-semibold text-xl text-black text-[24px]'>
          Purchase Request Form
        </h3>
      </span>

      <CreatePurchaseRequestForm expenses={requestsDetails?.expenses} />
    </section>
  );
}

export default CreatePurchaseRequest;
