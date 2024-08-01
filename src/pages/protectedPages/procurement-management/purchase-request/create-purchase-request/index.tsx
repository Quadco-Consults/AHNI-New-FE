import LongArrowLeft from "components/icons/LongArrowLeft";
import { useNavigate } from "react-router-dom";
import CreatePurchaseRequestForm from "./form";
import BreadcrumbCard from "components/shared/Breadcrumb";

type Props = {};

function CreatePurchaseRequest({}: Props) {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  const breadcrumbs = [
    { name: "Procurement", icon: true },
    { name: "Purchase Request", icon: true },
    { name: "Create", icon: false },
  ];

  return (
    <section className="space-y-6">
      <BreadcrumbCard list={breadcrumbs} />

      <button
        onClick={goBack}
        className="w-[3rem] aspect-square rounded-full drop-shadow-md bg-white flex items-center justify-center"
      >
        <LongArrowLeft />
      </button>
      <span className="block space-y-2">
        <h3 className="font-semibold text-xl text-black">
          Purchase Request Form
        </h3>
      </span>

      <CreatePurchaseRequestForm />
    </section>
  );
}

export default CreatePurchaseRequest;
