import { useEffect, useMemo } from "react";
import RfqLayout from "./RfqLayout";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelectField";
import { SelectContent, SelectItem } from "components/ui/select";
import { Button } from "components/ui/button";
import AddSquareIcon from "components/icons/AddSquareIcon";
import { Form, FormControl, FormField, FormItem } from "components/ui/form";
import { useFieldArray, useForm } from "react-hook-form";
import FormButton from "atoms/FormButton";
import { useNavigate } from "react-router-dom";
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
import SolicitationAPI from "services/procurementApi/solicitation";

const Items = () => {
  const navigate = useNavigate();
  const formData = JSON.parse(localStorage.getItem("rfqQuotation") as any);

  const { data: solicitationCriteria } =
    SolicitationCriteriaAPI.useGetSolicitationCriteriaListQuery({
      params: { no_paginate: true },
    });
  const { data: lots, isLoading: lotIsLoading } = LotsAPI.useGetLotListQuery({
    params: { no_paginate: true },
  });
  const { data: items, isLoading: itemsIsLoading } =
    ItemsAPI.useGetItemListQuery({
      params: { no_paginate: true },
    });
  const { data: purchaseRequests } =
    PurchaseRequestAPI.useGetPurchaseRequestQuery(
      useMemo(
        () => ({
          path: { id: formData?.purchase_request },
        }),
        [formData]
      )
    );
  const [createSolicitationMutation, { isLoading }] =
    SolicitationAPI.useCreateSolicitationMutation();

  const form = useForm<z.infer<typeof SolicitationItemsSchema>>({
    resolver: zodResolver(SolicitationItemsSchema),
    defaultValues: {
      criteria: [],
    },
  });

  const { control, handleSubmit, setValue, watch } = form;

  const purchaseRequestsData = useMemo(() => {
    return purchaseRequests?.items?.map((data) => ({
      item: data?.item?.id || "",
      quantity: data?.quantity || 0,
      lot: "",
    }));
  }, [purchaseRequests]);

  useEffect(() => {
    if (purchaseRequestsData) {
      setValue("items", purchaseRequestsData);
    }
  }, [purchaseRequestsData, setValue]);
  console.log(watch("items"));

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const onSubmit = async (data: z.infer<typeof SolicitationItemsSchema>) => {
    const submittedData = { ...formData, ...data };

    try {
      await createSolicitationMutation(submittedData).unwrap();
      toast.success("Successfully created.");
      sessionStorage.removeItem("rfqCompletedSteps");
      localStorage.removeItem("rfqQuotation");
      navigate(RouteEnum.RFQ);
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  };

  return (
    <RfqLayout>
      <Form {...form}>
        <form className="space-y-8 p-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-5">
            <h6 className="text-yellow-600">Items</h6>

            {fields?.map((field, index) => (
              <div key={index} className="flex items-center gap-5 w-full">
                <div className="grid grid-cols-1 gap-4 w-full md:grid-cols-3">
                  <FormSelect
                    name={`items.${index}.item`}
                    label="Item"
                    required
                  >
                    <SelectContent>
                      {itemsIsLoading && <Loading />}
                      {items?.map((value: ItemsResultsData) => (
                        <SelectItem key={value?.id} value={value?.id}>
                          {value?.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </FormSelect>
                  <FormInput
                    name={`items.${index}.quantity`}
                    label="Quantity"
                    required
                  />

                  <FormSelect name={`items.${index}.lot`} label="Lot" required>
                    <SelectContent>
                      {lotIsLoading && <LoadingSpinner />}
                      {lots?.map((lot: LotsResultsData) => (
                        <SelectItem
                          key={lot?.id}
                          value={String(lot?.packet_number)}
                        >
                          {lot?.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </FormSelect>
                </div>

                <div className="flex items-center h-full ">
                  <MinusCircle
                    onClick={() => remove(index)}
                    className="cursor-pointer text-primary"
                  />
                </div>
              </div>
            ))}
            <div className="flex justify-end">
              <Button
                type="button"
                className="text-primary bg-[#FFF2F2] mt-2 flex gap-2 items-center justify-center"
                onClick={() =>
                  append({
                    quantity: 0,
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

          <div>
            <Label className="text-yellow-600">Evaluation Criteria</Label>
            <FormField
              control={control}
              name="criteria"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <MultiSelectFormField
                      options={solicitationCriteria || []}
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select options"
                      variant="inverted"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-between mt-16">
            <Button
              onClick={() => navigate(-1)}
              type="button"
              className="bg-[#FFF2F2] text-primary dark:text-gray-500"
            >
              Cancel
            </Button>
            <FormButton loading={isLoading} disabled={isLoading} type="submit">
              Save Changes
            </FormButton>
          </div>
        </form>
      </Form>
    </RfqLayout>
  );
};

export default Items;
