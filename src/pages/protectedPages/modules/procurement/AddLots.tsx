import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import { CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  useAddLotsMutation,
  useUpdateLotsMutation,
} from "services/moduleProcurement";
import { TLots, lotsSchema } from "definations/module-procurement";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog, dailogSelector } from "store/ui";
import { toast } from "sonner";

const AddLots = () => {
  const { dialogProps } = useAppSelector(dailogSelector);

  const data = dialogProps?.data as unknown as TLots;
  const form = useForm<TLots>({
    resolver: zodResolver(lotsSchema),
    defaultValues: {
      name: data?.name ?? "",
      packet_number: data?.packet_number ?? "",
    },
  });

  const [lots, { isLoading }] = useAddLotsMutation();
  const [updateLots, { isLoading: updateLotsLoading }] =
    useUpdateLotsMutation();

  const dispatch = useAppDispatch();
  const onSubmit: SubmitHandler<TLots> = async (data) => {
    try {
      dialogProps?.type === "update"
        ? updateLots({
            //@ts-ignore
            id: String(dialogProps?.data?.id),
            body: data,
          }).unwrap()
        : await lots(data).unwrap();
      toast.success("Lots Added Succesfully");
      dispatch(closeDialog());
      form.reset();
    } catch (error: any) {
      toast.error(error.data.message || "Something went wrong");
    }
  };
  return (
    <CardContent>
      <Form {...form}>
        <form
          action=""
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-y-10"
        >
          <div className="grid grid-cols-1 gap-y-7">
            <FormInput
              label="Name"
              name="name"
              placeholder="admin@demo.com"
              required
            />
          </div>
          <div className="grid grid-cols-1 gap-y-7">
            <FormInput label="Packet Number" name="packet_number" required />
          </div>
          <div className="flex justify-start gap-4">
            <FormButton loading={isLoading || updateLotsLoading}>
              Save
            </FormButton>
          </div>
        </form>
      </Form>
    </CardContent>
  );
};

export default AddLots;
