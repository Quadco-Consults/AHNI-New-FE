/* eslint-disable react/prop-types */
import { Button } from "components/ui/button";
import { RouteEnum } from "constants/RouterConstants";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
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

import { useForm } from "react-hook-form";
import { Input } from "components/ui/input";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "components/Table/DataTable";

type Data = {
  description: {
    title: string;
    desc: string;
  };
  qty: number;
  brand: string;
  price: string;
  total: string;
};

const ManualBidSubmission = () => {
  const formHook = useForm({
    defaultValues: {
      description: "",
      vendor_category: [],
      tender_type: "",
      document: "",
      vendor: "",
    },
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <div className="space-y-10">
      <Link to={RouteEnum.RFQ_DETAILS}>
        <Button variant="outline" className="gap-2 text-primary border-primary">
          <ArrowLeft size={15} />
        </Button>
      </Link>

      <div>
        <h4 className="text-lg font-bold">Manual Bid Submission Form</h4>
        <h6>LOT 1 SUPPLY OF IT AND NETWORKING EQUIPMENT FOR _ACEBAY PROJECT</h6>
      </div>

      <div className="space-y-1">
        <Label>
          Vendor
          <span className="text-primary">*</span>
        </Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select Vendor" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="Single Source">Single Source</SelectItem>
              <SelectItem value="Open Tender">Open Tender</SelectItem>
              <SelectItem value="National Open Tender">
                National Open Tender
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <h4 className="text-base font-bold">Items Quotation</h4>
        <h6>Please provide your quotation for the following Items</h6>
      </div>

      <div>
        <DataTable data={data} columns={columns} />

        <div className="flex items-center justify-center w-1/6 gap-20 px-5 py-3 mx-auto border rounded-lg border-primary text-primary">
          <h4>Total:</h4>
          <h4>₦0.00</h4>
        </div>
      </div>

      <Form {...formHook}>
        <form onSubmit={formHook.handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <FormField
              control={formHook.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Timefame</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={formHook.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Terms</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={formHook.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tax Identification Number (TIN)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <FormField
              control={formHook.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Validity Period of Quote</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={formHook.control}
              name="tender_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Bank Account?
                    <span className="text-primary">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Single Source">
                          Single Source
                        </SelectItem>
                        <SelectItem value="Open Tender">Open Tender</SelectItem>
                        <SelectItem value="National Open Tender">
                          National Open Tender
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={formHook.control}
              name="tender_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Registration with C.A.C.?
                    <span className="text-primary">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Single Source">
                          Single Source
                        </SelectItem>
                        <SelectItem value="Open Tender">Open Tender</SelectItem>
                        <SelectItem value="National Open Tender">
                          National Open Tender
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <FormField
              control={formHook.control}
              name="tender_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Previous work experience with AHNi?
                    <span className="text-primary">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Single Source">
                          Single Source
                        </SelectItem>
                        <SelectItem value="Open Tender">Open Tender</SelectItem>
                        <SelectItem value="National Open Tender">
                          National Open Tender
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={formHook.control}
              name="tender_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Currency For Payment:
                    <span className="text-primary">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Single Source">
                          Single Source
                        </SelectItem>
                        <SelectItem value="Open Tender">Open Tender</SelectItem>
                        <SelectItem value="National Open Tender">
                          National Open Tender
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={formHook.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Warranty</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-5">
            <Button type="submit" className="gap-2">
              Submit
              <span>
                <ChevronRight size={18} />
              </span>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ManualBidSubmission;

const columns: ColumnDef<Data>[] = [
  {
    header: "S/N",
    id: "id",
    size: 80,
    cell: ({ row, table }) =>
      (table
        .getSortedRowModel()
        ?.flatRows?.findIndex((flatRow) => flatRow.id === row.id) || 0) + 1,
  },
  {
    header: "Items Description",
    accessorKey: "description",
    size: 500,
    cell: ({ row }) => <Description data={row.original} />,
  },
  {
    header: "Qty",
    accessorKey: "qty",
    size: 100,
  },
  {
    header: "Unit Price",
    accessorKey: "price",
    size: 200,
    cell: ({ row }) => <Price data={row.original} />,
  },
  {
    header: "Total",
    accessorKey: "total",
    size: 200,
    cell: ({ row }) => <Total data={row.original} />,
  },
];

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

const data: Data[] = Array(7).fill({
  description: {
    title: "Laptop Computer",
    desc: "Specification: 15” 4k OLED Display, Intel Core i9 Processor, 32-64GB RAM, 2TB SSD (XPS 15 9530)",
  },
  qty: 5,
  brand: "",
  price: "₦0.00",
  total: "₦0.00",
});
