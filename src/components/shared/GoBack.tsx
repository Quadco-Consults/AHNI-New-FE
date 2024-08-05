import LongArrowLeft from "components/icons/LongArrowLeft";
import { useNavigate } from "react-router-dom";

const GoBack = () => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      className="w-[3rem] h-[3rem] rounded-full drop-shadow-md bg-white flex items-center justify-center"
    >
      <LongArrowLeft />
    </button>
  );
};

export default GoBack;
