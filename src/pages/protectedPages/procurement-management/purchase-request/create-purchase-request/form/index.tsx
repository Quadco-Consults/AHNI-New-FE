import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelectField";
import AddSquareIcon from "components/icons/AddSquareIcon";
import LongArrowRight from "components/icons/LongArrowRight";
import { LoadingSpinner } from "components/shared/Loading";
import { Button } from "components/ui/button";
import { Form } from "components/ui/form";
import { SelectContent, SelectItem } from "components/ui/select";
import { RouteEnum } from "constants/RouterConstants";
import { DepartmentsResultsData } from "definations/configs/departments";
import { ItemsResultsData } from "definations/configs/itmes";
import { PurchaseRequestSchema } from "definations/procurement-validator";
import { MinusCircle } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import DepartmentsAPI from "services/configs/departments";
import ItemsAPI from "services/configs/items";
import { useGetAllPartnersQuery } from "services/modules/project/partners";
import PurchaseRequestAPI from "services/procurementApi/purchase-request";
import { toast } from "sonner";
import { z } from "zod";

const CreatePurchaseRequestForm = () => {
    const { data: departments, isLoading: departmentsIsLoading } =
        DepartmentsAPI.useGetDepartmentsQuery({});
    const { data: partner, isLoading: partnersIsLoading } =
        useGetAllPartnersQuery({ page: 1, size: 2000000 });
    const { data: items, isLoading: itemsIsLoading } =
        ItemsAPI.useGetItemsQuery({});
    const [createPurchaseRequestMutation, { isLoading }] =
        PurchaseRequestAPI.useCreatePurchaseRequestMutation();

    const form = useForm<z.infer<typeof PurchaseRequestSchema>>({
        resolver: zodResolver(PurchaseRequestSchema),
        defaultValues: {
            items: [
                {
                    item_id: "",
                    category: "",
                    fco: "",
                    units: 0,
                    number_of_days: 0,
                    unit_cost: 0,
                },
            ],
            request_date: "",
            required_date: "",
            requesting_department: "",
            deliver_to: "",
        },
    });

    const navigate = useNavigate();

    const { control, handleSubmit, watch } = form;

    const { fields, append, remove } = useFieldArray({
        control,
        name: "items",
    });

    const onSubmit = async (data: z.infer<typeof PurchaseRequestSchema>) => {
        try {
            await createPurchaseRequestMutation(data).unwrap();
            navigate(RouteEnum.PURCHASE_REQUEST);
            toast.success("Successfully created.");
        } catch (error) {
            toast.error("Something went wrong");
            console.log(error);
        }
    };

    return (
        <div className="pt-5">
            <Form {...form}>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-6"
                >
                    <div className="grid grid-cols-2 gap-5">
                        <FormInput
                            label="Date of Request"
                            name="request_date"
                            type="date"
                            placeholder="01/01/2024"
                        />
                        <FormInput
                            label="Required Date"
                            name="required_date"
                            type="date"
                            placeholder="01/01/2024"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                        <FormSelect
                            label="Requesting Dept."
                            name="requesting_department"
                            required
                        >
                            <SelectContent>
                                {departmentsIsLoading ? (
                                    <LoadingSpinner />
                                ) : (
                                    departments?.results?.map(
                                        (
                                            department: DepartmentsResultsData
                                        ) => (
                                            <SelectItem
                                                key={department?.id}
                                                value={department?.id}
                                            >
                                                {department?.name}
                                            </SelectItem>
                                        )
                                    )
                                )}
                            </SelectContent>
                        </FormSelect>
                        <FormSelect
                            label="Deliver to"
                            name="deliver_to"
                            required
                        >
                            <SelectContent>
                                {partnersIsLoading ? (
                                    <LoadingSpinner />
                                ) : (
                                    partner?.data.results?.map((partner) => (
                                        <SelectItem
                                            key={partner?.id}
                                            value={partner?.id}
                                        >
                                            {partner?.name}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </FormSelect>
                    </div>

                    <div>
                        <table className="w-full border">
                            <thead>
                                <tr className="text-amber-500 whitespace-nowrap border-b-2 text-xs font-semibold">
                                    <th className="px-2 py-5">S/N</th>
                                    <th className="px-2 py-5">
                                        Description of items/services
                                    </th>
                                    <th className="px-2 py-5">
                                        NO of Persons/Unit
                                    </th>
                                    <th className="px-2 py-5">No of Days</th>
                                    <th className="px-2 py-5">FCO</th>
                                    <th className="px-2 py-5">Unit Cost</th>
                                    <th className="px-2 py-5">Category</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fields.map((field, index) => {
                                    return (
                                        <tr key={index} className="w-full">
                                            <td className="w-fit p-2 text-center ">
                                                <span className="p-2 px-4 text-xs bg-black text-white rounded">
                                                    {index + 1}.
                                                </span>
                                            </td>
                                            <td className="w-fit p-2 text-center">
                                                <FormSelect
                                                    label=""
                                                    name={`items.[${index}].item_id`}
                                                >
                                                    <SelectContent>
                                                        {itemsIsLoading ? (
                                                            <LoadingSpinner />
                                                        ) : (
                                                            items?.results?.map(
                                                                (
                                                                    item: ItemsResultsData
                                                                ) => (
                                                                    <SelectItem
                                                                        key={
                                                                            item?.id
                                                                        }
                                                                        value={
                                                                            item?.id
                                                                        }
                                                                    >
                                                                        {
                                                                            item?.name
                                                                        }
                                                                    </SelectItem>
                                                                )
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </FormSelect>
                                            </td>
                                            <td className="w-fit p-2 text-center">
                                                <FormInput
                                                    label=""
                                                    name={`items.[${index}].units`}
                                                    type="number"
                                                    className="w-24"
                                                />
                                            </td>
                                            <td className="w-fit p-2 text-center">
                                                <FormInput
                                                    label=""
                                                    name={`items.[${index}].number_of_days`}
                                                    type="number"
                                                    className="w-24"
                                                />
                                            </td>
                                            <td className="w-fit p-2 text-center">
                                                <FormInput
                                                    label=""
                                                    name={`items.[${index}].fco`}
                                                />
                                            </td>
                                            <td className="w-fit p-2 text-center">
                                                <FormInput
                                                    label=""
                                                    type="number"
                                                    name={`items.[${index}].unit_cost`}
                                                    className="w-24"
                                                />
                                            </td>
                                            <td className="w-fit p-2 text-center">
                                                <FormInput
                                                    label=""
                                                    name={`items.[${index}].category`}
                                                />
                                            </td>
                                            <td className="flex items-center justify-center py-5">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                >
                                                    <MinusCircle
                                                        onClick={() =>
                                                            remove(index)
                                                        }
                                                        className="cursor-pointer text-primary"
                                                    />
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        <div className="flex justify-end">
                            <Button
                                type="button"
                                className="text-primary bg-[#FFF2F2] flex gap-2 items-center justify-center"
                                onClick={() =>
                                    append({
                                        item_id: "",
                                        category: "",
                                        fco: "",
                                        units: 0,
                                        number_of_days: 0,
                                        unit_cost: 0,
                                    })
                                }
                            >
                                <AddSquareIcon />
                                Add
                            </Button>
                        </div>
                    </div>

                    {/* <div className="flex items-center justify-end">
            <div className="text-primary border-primary flex items-center justify-start gap-2 rounded border-2 px-6 py-3 text-base font-semibold">
              <span>Total:</span>
              <span>N0.00</span>
            </div>
          </div> */}
                    <div className="flex items-center justify-end">
                        <FormButton
                            loading={isLoading}
                            disabled={isLoading}
                            type="submit"
                            className="flex items-center justify-center gap-2"
                        >
                            Submit
                            <LongArrowRight />
                        </FormButton>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default CreatePurchaseRequestForm;
