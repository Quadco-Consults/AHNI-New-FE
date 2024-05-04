import LongArrowLeft from "components/icons/LongArrowLeft"
import { useNavigate } from "react-router-dom";
import CreatePurchaseRequestForm from "./form";

type Props = {}

function CreatePurchaseRequest({}: Props) {

 const navigate = useNavigate();

  const goBack = () => {
    navigate(-1)
  };
  return (
    <div className="">
      <section className="space-y-4">
      <button onClick={goBack} className="w-[3rem] aspect-square rounded-full drop-shadow-md bg-white flex items-center justify-center">
        <LongArrowLeft />
      </button>
      <span className="block space-y-2">
        <h3 className="font-semibold text-xl text-black">Purchase Order Form</h3>
        <p className="flex gap-2 text-xs">10-04-2023 <div className="w-[1px] h-[15px] border-black/40 border-l-2"/>AHNI-010-002-ABJ-2023</p>
      </span>

      <CreatePurchaseRequestForm />
    </section>  
    </div>
  )
}

export default CreatePurchaseRequest