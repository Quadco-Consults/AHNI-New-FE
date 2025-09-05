import successProcess from "assets/imgs/successful.png";
import FormButton from "@/components/FormButton";
import { Button } from "@/components/ui/button";
import { RouteEnum } from "constants/RouterConstants";
import { useAppDispatch } from "hooks/useStore";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useCreateSupportiveSupervision } from "@/features/programs/controllers/supportiveSupervisionController";
import { toast } from "sonner";
import { supportiveSupervisionActions } from "store/formData/ssp-values";
import { RootState } from "store/index";
import { closeDialog } from "store/ui";

const SspSubmitModal = () => {
  const responses = useSelector((state: RootState) => state.ssp.items);
  const combinedArray = [].concat(...responses);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [createSupportiveSupervisionResponseDataController, { isLoading }] =
    SupportiveSupervisionAPI.useCreateSupportiveSupervisionResponseDataController();

  const onSubmit = async () => {
    console.log(combinedArray);
    dispatch(supportiveSupervisionActions.clearSupportiveSupervision());
    dispatch(closeDialog());
    router.push(RouteEnum.PROGRAM_SUPPORTIVE_SUPERVISION);
    // try {
    //   await createSupportiveSupervisionResponseDataController({
    //     responses: combinedArray,
    //   }) ;
    //   toast.success("Document upload successfully.");
    //   dispatch(supportiveSupervisionActions.clearSupportiveSupervision());
    //   router.push(RouteEnum.PROGRAM_SUPPORTIVE_SUPERVISION);
    //   dispatch(closeDialog());
    // } catch (error) {
    //   console.log(error);
    //   toast.error("Something went wrong");
    // }
  };

  return (
    <div className='text-center space-y-5'>
      <img className='mx-auto' src={successProcess} alt='success' width={150} />
      <h4>Click to submit</h4>

      <FormButton loading={isLoading} disabled={isLoading} onClick={onSubmit}>
        Submit
      </FormButton>
    </div>
  );
};

export default SspSubmitModal;
