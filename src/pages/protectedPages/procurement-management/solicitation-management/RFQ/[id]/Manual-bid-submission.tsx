/* eslint-disable react/prop-types */
import { Button } from "components/ui/button";
import { RouteEnum } from "constants/RouterConstants";
import { ArrowLeft, ChevronRight, MinusCircle } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import { Label } from "components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "components/ui/form";

import { useFieldArray, useForm } from "react-hook-form";
import { Input } from "components/ui/input";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "components/Table/DataTable";
import SolicitationAPI from "services/procurementApi/solicitation";
import VendorsAPI from "services/procurementApi/vendors";
import FormSelect from "atoms/FormSelectField";
import { LoadingSpinner } from "components/shared/Loading";
import { VendorsResultsData } from "definations/procurement-types/vendors";
import FormInput from "atoms/FormInput";
import { useEffect, useMemo } from "react";
import { z } from "zod";
import { SolicitationSubmissionSchema } from "definations/procurement-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import FormButton from "atoms/FormButton";

const ManualBidSubmission = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: vendors, isLoading: vendorsIsLoading } =
    VendorsAPI.useGetVendorListQuery({
      params: { no_paginate: true },
    });
  const { data: items, isLoading } = SolicitationAPI.useGetSolicitationQuery({
    path: { id: id as string },
  });

  const [
    createSolicitationBidMutation,
    { isLoading: solicitationBidIsLoading },
  ] = SolicitationAPI.useCreateSolicitationBidMutation();

  const form = useForm<z.infer<typeof SolicitationSubmissionSchema>>({
    resolver: zodResolver(SolicitationSubmissionSchema),
    defaultValues: {
      solicitation_id: id,
      vendor_id: "",
    },
  });

  const { control, handleSubmit, setValue, watch } = form;

  const { fields } = useFieldArray({
    control,
    name: "items",
  });

  const { fields: FieldItems } = useFieldArray({
    control,
    name: "responses",
  });

  const data = useMemo(() => {
    return items?.items?.map((data) => ({
      solicitation_item: data?.id,
      quantity: data?.quantity || 0,
      unit_price: "",
    }));
  }, [items]);

  const dataVal = useMemo(() => {
    return items?.criteria?.map((data) => ({
      response: "",
      solicitation_criteria: data?.id,
    }));
  }, [items]);

  useEffect(() => {
    if (data) {
      setValue("items", data);
    }
  }, [data, setValue]);

  useEffect(() => {
    if (dataVal) {
      setValue("responses", dataVal);
    }
  }, [dataVal, setValue]);

  const itemsWatchData = watch("items");
  console.log(watch());

  const onSubmit = async (
    data: z.infer<typeof SolicitationSubmissionSchema>
  ) => {
    console.log(data);
    try {
      await createSolicitationBidMutation(data).unwrap();
      toast.success("Successfully created.");
      navigate(RouteEnum.RFQ);
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  };

  return (
    <div className="space-y-10">
      <Button
        onClick={() => navigate(-1)}
        variant="outline"
        className="gap-2 text-primary border-primary"
      >
        <ArrowLeft size={15} />
      </Button>

      <div>
        <h4 className="text-lg font-bold">Manual Bid Submission Form</h4>
        <h6>LOT 1 SUPPLY OF IT AND NETWORKING EQUIPMENT FOR _ACEBAY PROJECT</h6>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          <FormSelect name="vendor_id" label="Vendor" required>
            <SelectContent>
              {vendorsIsLoading && <LoadingSpinner />}
              {vendors?.map((vendor: VendorsResultsData) => (
                <SelectItem key={vendor?.id} value={String(vendor?.id)}>
                  {vendor?.company_name}
                </SelectItem>
              ))}
            </SelectContent>
          </FormSelect>

          <div className="space-y-1">
            <h4 className="text-base font-bold">Items Quotation</h4>
            <h6>Please provide your quotation for the following Items</h6>
          </div>

          <div>
            <table className="w-full border mt-10">
              <thead>
                <tr className="text-amber-500 whitespace-nowrap border-b-2 text-sm font-semibold">
                  <th className="px-2 py-5">S/N</th>
                  <th className="px-2 py-5">Items Description</th>
                  <th className="px-2 py-5">Qty</th>
                  <th className="px-2 py-5"> Unit price</th>
                  <th className="px-2 py-5">Total</th>
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
                        <div className="space-y-2">
                          <h2 className="font-semibold">
                            {items?.items[index]?.item?.name}
                          </h2>
                          <h6>{items?.items[index]?.item?.description}</h6>
                        </div>
                      </td>
                      <td className="w-fit p-2 text-center">
                        <FormInput
                          label=""
                          name={`items.[${index}].quantity`}
                          type="number"
                          className="w-24"
                        />
                      </td>
                      <td className="w-fit p-2 text-center">
                        <FormInput
                          label=""
                          type="number"
                          name={`items.[${index}].unit_price`}
                          className="w-24"
                        />
                      </td>
                      <td className="w-fit p-2 text-center">
                        <h6>
                          ₦
                          {Number(
                            Number(itemsWatchData[index]?.quantity) *
                              Number(itemsWatchData[index]?.unit_price)
                          ).toLocaleString()}
                        </h6>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* <div className="flex items-center justify-center w-1/6 gap-20 px-5 py-3 mx-auto border rounded-lg border-primary text-primary">
              <h4>Total:</h4>
              <h4>₦0.00</h4>
            </div> */}
          </div>

          <table className="w-full border mt-10">
            <thead>
              <tr className="text-amber-500 whitespace-nowrap border-b-2 text-sm font-semibold">
                <th className="px-2 py-5">Criteria</th>
                <th className="px-2 py-5">Vendor Response</th>
              </tr>
            </thead>
            <tbody>
              {FieldItems.map((field, index) => {
                return (
                  <tr key={index} className="w-full">
                    <td className="w-fit p-2">
                      <h6>{items?.criteria[index]?.name}</h6>
                    </td>
                    <td className="w-fit p-2 text-center">
                      <FormInput
                        label=""
                        name={`responses.[${index}].response`}
                        className="w-full"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="flex justify-end">
            <FormButton
              loading={solicitationBidIsLoading}
              disabled={solicitationBidIsLoading}
              type="submit"
            >
              Create
            </FormButton>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ManualBidSubmission;

// const columns: ColumnDef<Data>[] = [
//   {
//     header: "S/N",
//     id: "id",
//     size: 80,
//     cell: ({ row, table }) =>
//       (table
//         .getSortedRowModel()
//         ?.flatRows?.findIndex((flatRow) => flatRow.id === row.id) || 0) + 1,
//   },
//   {
//     header: "Items Description",
//     accessorKey: "description",
//     size: 500,
//     cell: ({ row }) => <Description data={row.original} />,
//   },
//   {
//     header: "Qty",
//     accessorKey: "qty",
//     size: 100,
//   },
//   {
//     header: "Unit Price",
//     accessorKey: "price",
//     size: 200,
//     cell: ({ row }) => <Price data={row.original} />,
//   },
//   {
//     header: "Total",
//     accessorKey: "total",
//     size: 200,
//     cell: ({ row }) => <Total data={row.original} />,
//   },
// ];

const Price = ({ data }: any) => {
  return (
    <div>
      <Input value={data.price} />
    </div>
  );
};
const Total = ({ data }: any) => {
  return (
    <div>
      <Input value={data.price} />
    </div>
  );
};

const Description = ({ data }: any) => {
  return (
    <div className="space-y-2">
      <h2 className="font-semibold">{data.description.title}</h2>
      <h6>{data.description.desc}</h6>
    </div>
  );
};
