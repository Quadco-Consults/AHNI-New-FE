import LongArrowLeft from "components/icons/LongArrowLeft";
import { useNavigate } from "react-router-dom";
import CreateActivityMemo from "./form";
import BreadcrumbCard from "components/shared/Breadcrumb";

// type Props = {};

function CreatePurchaseRequest() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  const breadcrumbs = [
    { name: "Procurement", icon: true },
    { name: "Sample Memo", icon: true },
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

      <CreateActivityMemo />
    </section>
  );
}

export default CreatePurchaseRequest;
