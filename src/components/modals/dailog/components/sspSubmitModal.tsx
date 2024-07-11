import successProcess from "assets/imgs/successful.png";
import FormButton from "atoms/FormButton";
import { Button } from "components/ui/button";
import { RouteEnum } from "constants/RouterConstants";
import { useAppDispatch } from "hooks/useStore";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SupportiveSupervisionAPI from "services/programsApi/suportive-supervision";
import { toast } from "sonner";
import { supportiveSupervisionActions } from "store/formData/ssp-values";
import { RootState } from "store/index";
import { closeDialog } from "store/ui";

const SspSubmitModal = () => {
  const responses = useSelector((state: RootState) => state.ssp.items);
  const combinedArray = [].concat(...responses);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [createSupportiveSupervisionResponseDataMutation, { isLoading }] =
    SupportiveSupervisionAPI.useCreateSupportiveSupervisionResponseDataMutation();

  const onSubmit = async () => {
    console.log(combinedArray);
    dispatch(supportiveSupervisionActions.clearSupportiveSupervision());
    dispatch(closeDialog());
    navigate(RouteEnum.PROGRAM_SUPPORTIVE_SUPERVISION);
    // try {
    //   await createSupportiveSupervisionResponseDataMutation({
    //     responses: combinedArray,
    //   }).unwrap();
    //   toast.success("Document upload successfully.");
    //   dispatch(supportiveSupervisionActions.clearSupportiveSupervision());
    //   navigate(RouteEnum.PROGRAM_SUPPORTIVE_SUPERVISION);
    //   dispatch(closeDialog());
    // } catch (error) {
    //   console.log(error);
    //   toast.error("Something went wrong");
    // }
  };

  return (
    <div className="text-center space-y-5">
      <img className="mx-auto" src={successProcess} alt="success" width={150} />
      <h4>Click to submit</h4>

      <FormButton loading={isLoading} disabled={isLoading} onClick={onSubmit}>
        Submit
      </FormButton>
    </div>
  );
};

export default SspSubmitModal;
