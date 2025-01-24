import { zodResolver } from "@hookform/resolvers/zod";
import { skipToken } from "@reduxjs/toolkit/query/react";
import RoundBack from "assets/svgs/RoundBack";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelectField";
import FormTextArea from "atoms/FormTextArea";
import Card from "components/shared/Card";
import { Form } from "components/ui/form";
import { AdminRoutes } from "constants/RouterConstants";
import {
    ConsumableSchema,
    EditConsumableSchema,
    TConsumableFormValues,
} from "definations/admin/inventory-management/consumable";
import useQuery from "hooks/useQuery";
import { useEffect, useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
    useCreateConsumableMutation,
    useEditConsumableMutation,
    useGetSingleConsumableQuery,
} from "services/admin/inventory-management/consumable";
import { useGetAllCategoriesQuery } from "services/modules/config/category";
import { useGetAllItemsQuery } from "services/modules/config/item";
import { toast } from "sonner";
import { formatDate } from "utils/date";

const stockControlMethodOptions = [
    { label: "Stock Level", value: "STOCK_LEVEL" },
    { label: "Availability", value: "AVAILABILITY" },
    { label: "Just In Time", value: "JUST_IN_TIME" },
];

export default function CreateConsumablePage() {
    const query = useQuery();
    const consumableId = query.get("id");

    const { data: consumable } = useGetSingleConsumableQuery(
        consumableId ?? skipToken
    );

    const { data: category } = useGetAllCategoriesQuery({
        page: 1,
        size: 2000000,
    });

    const categoryOptions = useMemo(
        () =>
            category?.data.results.map(({ id, name }) => ({
                label: name,
                value: id,
            })),
        [category]
    );

    const Schema = consumableId ? EditConsumableSchema : ConsumableSchema;

    const defaultValues = useMemo(() => {
        return consumableId
            ? {
                  name: "",
                  description: "",

                  quantity: "",
                  stock_control_method: "STOCK_LEVEL",
                  category: "",
                  expiry_date: formatDate(String(new Date())),
                  previous_quantity: "",
                  re_order_level: "",
                  buffer_stock: "",
                  max_stock: "",
                  entry_date: "",
                  available_quantity: "",
                  item_cost: "",
                  grn_tracking_number: "",
              }
            : {
                  name: "",
                  description: "",
              };
    }, [consumableId]);

    const form = useForm<TConsumableFormValues>({
        resolver: zodResolver(Schema),
        defaultValues,
    });

    useEffect(() => {
        if (consumableId) {
            form.reset({
                name: consumable?.data.name,
                description: consumable?.data.description,
                // @ts-ignore
                quantity: String(consumable?.data.quantity),
                stock_control_method: consumable?.data.stock_control_method,
                category: consumable?.data?.category?.id,
                expiry_date: consumable?.data.expiry_date,
                previous_quantity: String(
                    consumable?.data.previous_quantity ?? ""
                ),
                re_order_level: String(consumable?.data.re_order_level ?? ""),
                buffer_stock: String(consumable?.data.buffer_stock ?? ""),
                max_stock: String(consumable?.data.max_stock ?? ""),
                entry_date: consumable?.data.entry_date,
                available_quantity: String(
                    consumable?.data.available_quantity ?? ""
                ),
                item_cost: consumable?.data.item_cost,
                grn_tracking_number: consumable?.data.grn_tracking_number,
            });
        }
    }, [consumableId, consumable]);

    const [createConsumable, { isLoading: isCreateLoading }] =
        useCreateConsumableMutation();

    const [editConsumable, { isLoading: isEditLoading }] =
        useEditConsumableMutation();

    const navigate = useNavigate();

    const onSubmit: SubmitHandler<TConsumableFormValues> = async (data) => {
        try {
            if (consumableId) {
                await editConsumable({ id: consumableId, body: data }).unwrap();
                toast.success("Consumable Updated");
            } else {
                await createConsumable(data).unwrap();
                toast.success("Consumable Created");
            }
            navigate(AdminRoutes.INDEX_CONSUMABLE);
        } catch (error: any) {
            toast.error(error.data.message ?? "Something went wrong");
        }
    };

    return (
        <div>
            <div className="flex items-center gap-x-2">
                <div onClick={() => navigate(-1)}>
                    <RoundBack />
                </div>
                <h4 className="text-xl font-bold">Create Consumable</h4>
            </div>
            <Card>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col gap-y-8"
                        action=""
                    >
                        <FormInput
                            label="Item Name"
                            name="name"
                            required
                            placeholder="Enter Item Name"
                        />

                        <FormTextArea
                            label="Item Description"
                            name="description"
                            placeholder="Enter Item Description"
                            required
                        />

                        <FormInput
                            label="Unit of Measurement"
                            name="uom"
                            placeholder="Enter Unit Measurement"
                            required
                        />

                        {consumableId && (
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                <FormInput
                                    name="quantity"
                                    label="Quantity"
                                    placeholder="Enter Quantity"
                                    required
                                />

                                <FormSelect
                                    name="stock_control_method"
                                    label="Stock Control Method"
                                    placeholder="Select Stock Control Method"
                                    options={stockControlMethodOptions}
                                    required
                                />
                                <FormSelect
                                    name="category"
                                    label="Category"
                                    placeholder="Select Category"
                                    options={categoryOptions}
                                    required
                                />
                                <FormInput
                                    label="Expiry Date"
                                    name="expiry_date"
                                    type="date"
                                    placeholder="Select Expiry Date"
                                    required
                                />
                                <FormInput
                                    name="previous_quantity"
                                    label="Previous Quantity"
                                    placeholder="Enter Previous Quantity"
                                    required
                                />

                                <FormInput
                                    name="re_order_level"
                                    placeholder="Enter Re-order Levek Stock"
                                    label="Re-order Level"
                                    required
                                />
                                <FormInput
                                    name="buffer_stock"
                                    label="Buffer Stock"
                                    placeholder="Enter Buffer Stock"
                                    required
                                />

                                <FormInput
                                    name="max_stock"
                                    label="Max Stock"
                                    placeholder="Enter Max Stock"
                                    required
                                />

                                <FormInput
                                    name="entry_date"
                                    type="date"
                                    label="Entry Date"
                                    placeholder="Select Entry Date"
                                    required
                                />

                                <FormInput
                                    name="available_quantity"
                                    label="Available Quantity"
                                    placeholder="Enter Available Quantity"
                                    required
                                />

                                <FormInput
                                    name="item_cost"
                                    label="Cost of Item"
                                    placeholder="Enter Cost of Item"
                                    required
                                />

                                <FormInput
                                    label="GRN Tracking Number"
                                    name="grn_tracking_number"
                                    placeholder="Enter GRN Tracking Number"
                                    // required
                                />
                            </div>
                        )}

                        <div className="ml-auto">
                            <FormButton
                                loading={isCreateLoading || isEditLoading}
                            >
                                {consumable
                                    ? "Update Consumable"
                                    : "Create Consumable"}
                            </FormButton>
                        </div>
                    </form>
                </Form>
            </Card>
        </div>
    );
}
