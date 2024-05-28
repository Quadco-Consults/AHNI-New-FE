import LongArrowLeft from "components/icons/LongArrowLeft";
import Card from "components/shared/Card";
import { useNavigate } from "react-router-dom";

const EngagementDetails = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="space-y-6 min-h-screen">
      <button
        onClick={goBack}
        className="w-[3rem] aspect-square rounded-full drop-shadow-md bg-white flex items-center justify-center"
      >
        <LongArrowLeft />
      </button>

      <Card className="space-y-6">
        <h4 className="font-semibold">Omar Calzoni</h4>
        <p className="font-extralight">ACEBAY</p>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <h4 className="font-semibold">Institution/Organization:</h4>
            <p>University of Maiduguri Teaching Hospital, Borno state</p>
          </div>
          <div>
            <h4 className="font-semibold">Physical Office Address:</h4>
            <p>University of Maiduguri Teaching Hospital, Borno state</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <h4 className="font-semibold">State:</h4>
            <p>Borno State</p>
          </div>
          <div>
            <h4 className="font-semibold">Designation:</h4>
            <p>Medical Director </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <h4 className="font-semibold">Phone Number:</h4>
            <p>09075364587</p>
          </div>
          <div>
            <h4 className="font-semibold">E-mail:</h4>
            <p>rogerdokidis@gmail.com</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EngagementDetails;
