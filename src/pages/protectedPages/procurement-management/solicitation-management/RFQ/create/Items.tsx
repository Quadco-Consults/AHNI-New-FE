import { useEffect, useMemo } from "react";
import RfqLayout from "./RfqLayout";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelectField";
import { SelectContent, SelectItem } from "components/ui/select";
import { Button } from "components/ui/button";
import AddSquareIcon from "components/icons/AddSquareIcon";
import { Form, FormControl, FormField, FormItem } from "components/ui/form";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import FormButton from "atoms/FormButton";
import { Link, useNavigate } from "react-router-dom";
import { RouteEnum } from "constants/RouterConstants";
import { z } from "zod";
import { SolicitationItemsSchema } from "definations/procurement-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { MinusCircle } from "lucide-react";
import { Label } from "components/ui/label";
import SolicitationCriteriaAPI from "services/procurementApi/solicitation-evaluation-criteria";
import MultiSelectFormField from "components/ui/rfqmultiselect";
import LotsAPI from "services/procurementApi/lots";
import { LotsResultsData } from "definations/procurement-types/lots";
import { Loading, LoadingSpinner } from "components/shared/Loading";
import PurchaseRequestAPI from "services/procurementApi/purchase-request";
import ItemsAPI from "services/configs/items";
import { ItemsResultsData } from "definations/configs/itmes";
import { toast } from "sonner";
import { useGetAllAssetsQuery } from "services/admin/inventory-management/item";
import { useGetAllLotsQuery } from "services/modules/procurement/lot";
import { useGetAllSolicitationEvaluationCriteriaQuery } from "services/modules/procurement/solicitation-evaluation-criteria";
import { useCreateSolicitationMutation } from "services/procurementApi/solicitation";
import { useGetAllItemsQuery } from "services/modules/config/item";

const ItemSchema = z.object({
  solicitation_evaluations: z.array(
    z.object({
      criteria: z.string().min(1, "Please select a category"),
    })
  ),
  solicitation_items: z.array(
    z.object({
      item: z.string().min(1, "Please select an item"),
      lot: z.string().min(1, "Please select a lot"),
      quantity: z.string().min(1, "Please enter quantity"),
    })
  ),
});

const Items = () => {
  const navigate = useNavigate();
  const formData = JSON.parse(localStorage.getItem("rfqQuotation") as any);

  const form = useForm<z.infer<typeof ItemSchema>>({
    defaultValues: {
      solicitation_evaluations: [{ criteria: "" }],
      solicitation_items: [{ item: "", lot: "", quantity: "0" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "solicitation_items",
  });

  const {
    fields: criteriaFields,
    append: appendCriteria,
    remove: removeCriteria,
  } = useFieldArray({
    control: form.control,
    name: "solicitation_evaluations",
  });

  const { data: item } = useGetAllItemsQuery({
    page: 1,
    size: 2000000,
  });

  const itemOptions = useMemo(
    () =>
      item?.data.results.map(({ name, id }) => ({
        label: name,
        value: id,
      })),
    [item]
  );

  const { data: lot, isLoading: isLotLoading } = useGetAllLotsQuery({
    page: 1,
    size: 2000000,
  });

  const lotOptions = useMemo(
    () =>
      lot?.data.results.map(({ name, id }) => ({
        label: name,
        value: id,
      })),
    [lot]
  );

  const { data: solicitationCriteria } =
    useGetAllSolicitationEvaluationCriteriaQuery({
      page: 1,
      size: 2000000,
    });

  const solicitationCriteriaOptions = useMemo(
    () =>
      solicitationCriteria?.data.results.map(({ name, id }) => ({
        label: name,
        value: id,
      })),
    [solicitationCriteria]
  );

  const [createSolicitation, { isLoading: isCreateLoading }] =
    useCreateSolicitationMutation();

  const onSubmit: SubmitHandler<z.infer<typeof ItemSchema>> = async (data) => {
    const quotationData = JSON.parse(
      sessionStorage.getItem("rfqQuotationFormData") || "{}"
    );

    const payload = { ...quotationData, ...data };
    // console.log({ payload });

    try {
      const res = await createSolicitation(payload).unwrap();
      console.log({ res, id: res?.data?.id });
      sessionStorage.removeItem("rfqQuotationFormData");
      toast.success("Solicitation Created Successfully");
      navigate(`${RouteEnum.RFQ_CREATE_CBA}?id=${res?.data?.id}`);
    } catch (error: any) {
      toast.error(error.data.message ?? "Something went wrong");
    }
  };

  return (
    <RfqLayout>
      <Form {...form}>
        <form className='space-y-8 p-5' onSubmit={form.handleSubmit(onSubmit)}>
          <div className='space-y-5'>
            <h6 className='text-yellow-600'>Items</h6>

            {fields?.map((field, index) => (
              <div key={index} className='flex items-center gap-5 w-full'>
                <div className='grid grid-cols-1 gap-4 w-full md:grid-cols-3'>
                  <FormSelect
                    name={`solicitation_items.${index}.item`}
                    label='Item'
                    required
                    options={itemOptions}
                  />
                  <FormInput
                    name={`solicitation_items.${index}.quantity`}
                    label='Quantity'
                    required
                  />

                  <FormSelect
                    name={`solicitation_items.${index}.lot`}
                    label='Lot'
                    required
                  >
                    <SelectContent>
                      {isLotLoading && <LoadingSpinner />}
                      {lotOptions?.map(({ label, value }) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </FormSelect>
                </div>

                <div className='flex items-center h-full '>
                  <MinusCircle
                    onClick={() => remove(index)}
                    className='cursor-pointer text-primary'
                  />
                </div>
              </div>
            ))}
            <div className='flex justify-end'>
              <Button
                type='button'
                className='text-primary bg-[#FFF2F2] mt-2 flex gap-2 items-center justify-center'
                onClick={() =>
                  append({
                    quantity: "",
                    item: "",
                    lot: "",
                  })
                }
              >
                <AddSquareIcon />
                Add
              </Button>
            </div>
          </div>

          <div className='space-y-5'>
            <Label className='text-yellow-600'>Evaluation Criteria</Label>

            {criteriaFields.map((field, index) => (
              <div key={index} className='flex items-center gap-5 w-full'>
                <div className='grid grid-cols-1 gap-4 w-full md:grid-cols-3'>
                  <FormSelect
                    label='Category'
                    name={`solicitation_evaluations.${index}.criteria`}
                    required
                    options={solicitationCriteriaOptions}
                  />
                </div>

                <div className='flex items-center h-full '>
                  <MinusCircle
                    onClick={() => removeCriteria(index)}
                    className='cursor-pointer text-primary'
                  />
                </div>
              </div>
            ))}

            <div className='flex justify-end'>
              <Button
                type='button'
                className='text-primary bg-[#FFF2F2] mt-2 flex gap-2 items-center justify-center'
                onClick={() =>
                  appendCriteria({
                    criteria: "",
                  })
                }
              >
                <AddSquareIcon />
                Add
              </Button>
            </div>
          </div>

          <div className='flex justify-between mt-16'>
            <Button
              onClick={() => navigate(-1)}
              type='button'
              className='bg-[#FFF2F2] text-primary dark:text-gray-500'
            >
              Cancel
            </Button>
            {/* <Link to={{ pathname: RouteEnum.RFQ_CREATE_CBA }}> */}
            <FormButton
              loading={isCreateLoading}
              disabled={isCreateLoading}
              type='submit'
            >
              Save Changes
            </FormButton>
            {/* </Link> */}
          </div>
        </form>
      </Form>
    </RfqLayout>
  );
};

export default Items;
