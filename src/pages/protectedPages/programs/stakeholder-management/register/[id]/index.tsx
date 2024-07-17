import LongArrowLeft from "components/icons/LongArrowLeft";
import Card from "components/shared/Card";
import { LoadingSpinner } from "components/shared/Loading";
import { useNavigate, useParams } from "react-router-dom";
import StakeholderManagementAPI from "services/programsApi/stakeholder-management";

const RegisterDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data, isLoading } =
    StakeholderManagementAPI.useGetStakeholderManagementQuery({
      path: { id: id as string },
    });

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
        {isLoading && <LoadingSpinner />}
        <h4 className="font-semibold">{data?.stakeholder_name}</h4>
        <p className="font-extralight">ACEBAY</p>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <h4 className="font-semibold">Institution/Organization:</h4>
            <p>{data?.institution_organization}</p>
          </div>
          <div>
            <h4 className="font-semibold">Physical Office Address:</h4>
            <p>{data?.physical_office_address}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <h4 className="font-semibold">State:</h4>
            <p>{data?.state}</p>
          </div>
          <div>
            <h4 className="font-semibold">Designation:</h4>
            <p>{data?.designation}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <h4 className="font-semibold">Phone Number:</h4>
            <p>{data?.phone_number}</p>
          </div>
          <div>
            <h4 className="font-semibold">E-mail:</h4>
            <p>{data?.email}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RegisterDetails;
