import BackNavigation from "atoms/BackNavigation";
import FormSelect from "atoms/FormSelect";
import FormTextArea from "atoms/FormTextArea";
import { Card, CardContent, CardHeader } from "components/ui/card";
import { Form } from "components/ui/form";
import { Separator } from "components/ui/separator";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "components/ui/tabs";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { useGetOneAssetsQuery } from "services/adminApi/assetsApi";
import { APPROVAL_PROCESS } from "./FacilitiesManagment/FacilitiesMaintanance";
import { Button } from "components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import TableFilters from "components/Table/TableFilters";
import DataTable from "components/Table/DataTable";

const AssetsItem = ({
  desc,
  heading,
  className,
}: {
  heading?: string;
  desc?: string;
  className?: string;
}) => {
  return (
    <div className={className}>
      <h4 className="text-base font-semibold ">{heading}</h4>
      <p className="text-[#4D4545] text-sm">{desc}</p>
    </div>
  );
};

const ViewAssets = () => {
  const [seachParams] = useSearchParams();

  const form = useForm();

  const id = seachParams.get("id") as string;

  const { data } = useGetOneAssetsQuery({ id });

  return (
    <div>
      <div className="">
        <Tabs defaultValue="details">
          <TabsList>
            <BackNavigation />
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="approval">Management Approval</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <Card>
              <CardHeader className="font-bold">
                Asset Details
                <Separator className="mt-4" />
              </CardHeader>

              <CardContent className="grid grid-cols-3 gap-y-8 gap-x-4">
                <AssetsItem heading="Asset" desc={data?.asset_type?.name} />

                <AssetsItem heading="Asset Code" desc={data?.asset_code} />

                <AssetsItem
                  heading="Manufacturer"
                  desc={data?.asset_type.manufacturer}
                />

                <AssetsItem heading="Model" desc={data?.asset_type.model} />

                <AssetsItem
                  heading="Classification"
                  desc={data?.classification}
                />
                {/* 
                <Separator className="my-4" /> */}

                <AssetsItem
                  heading="Description"
                  desc={data?.asset_condition.description}
                />
                <AssetsItem heading="Current Insurance Duration" desc="N/A" />
                <AssetsItem heading="Serial Number" desc="N/A" />
                <AssetsItem heading="Salvage Value" desc="N/A" />
                <AssetsItem heading="Life of Project" desc="N/A" />

                {/* <Separator className="my-4" /> */}

                <AssetsItem
                  heading="Date of Acquisition"
                  desc={data?.date_of_acquisition}
                />

                <AssetsItem
                  heading="Acquisition Cost"
                  desc={`$${data?.cost_in_usd} equivalent ₦${data?.cost_in_ngn}`}
                />

                <AssetsItem heading="State" desc={data?.state} />

                <AssetsItem heading="Location" desc={data?.location.name} />

                <AssetsItem heading="Donor" desc={data?.implementer.name} />

                <AssetsItem heading="Assignee" desc={data?.assignee} />

                <AssetsItem
                  heading="Asset Condition"
                  desc={data?.asset_condition.name}
                />

                <AssetsItem
                  heading="Condition Details"
                  desc={data?.asset_condition.description}
                />
              </CardContent>

              <CardHeader className="font-bold text-lg">
                <Separator className="my-4" />
                Asset History Movement
              </CardHeader>

              <div className="px-5">
                <TableFilters>
                  <DataTable data={[]} columns={columns} />
                </TableFilters>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="approval">
            <Card>
              <CardHeader className="font-bold">
                Asset Details
                <Separator className="mt-4" />
              </CardHeader>

              <CardContent className="flex flex-col gap-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
                  <AssetsItem
                    className="px-5 py-3 border rounded-md"
                    heading="Asset"
                    desc="Laptop"
                  />

                  <AssetsItem
                    className="px-5 py-3 border rounded-md"
                    heading="Asset Code"
                    desc="AHHQICTB5907"
                  />

                  <AssetsItem
                    className="px-5 py-3 border rounded-md"
                    heading="Manufacturer"
                    desc="Dell"
                  />

                  <AssetsItem
                    className="px-5 py-3 border rounded-md"
                    heading="Model"
                    desc="Dell Latitude E5480"
                  />
                  <AssetsItem
                    className="px-5 py-3 border rounded-md"
                    heading="Serial Number"
                    desc="N/A"
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <AssetsItem
                    heading="Acquisition Cost"
                    desc="$819.53 equivalent ₦290,000"
                  />

                  <AssetsItem heading="State" desc="Abuja" />

                  <AssetsItem heading="Location" desc="AHNi Admin" />

                  <AssetsItem
                    heading="Implementer"
                    desc="Family Health International (FHI 360)"
                  />

                  <AssetsItem heading="Assignee" desc="Patricia Ohkahkumhe" />
                </div>

                <Form {...form}>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <FormTextArea
                          name=""
                          label="Justification for Disposal"
                          placeholder="This can be repaired and we donate it to CBOs"
                        />
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                          <FormSelect
                            name=""
                            placeholder="Select approval"
                            options={APPROVAL_PROCESS}
                          />
                          <FormSelect
                            name=""
                            placeholder="Select name"
                            options={APPROVAL_PROCESS}
                          />
                        </div>
                        <Button variant="custom" type="button">
                          Approve
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <FormTextArea
                          name=""
                          label="GT CT Approval"
                          placeholder="This can be repaired and we donate it to CBOs"
                        />
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                          <FormSelect
                            name=""
                            placeholder="Select approval"
                            options={APPROVAL_PROCESS}
                          />
                          <FormSelect
                            name=""
                            placeholder="Select name"
                            options={APPROVAL_PROCESS}
                          />
                        </div>
                        <Button variant="custom" type="button">
                          Approve
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <FormTextArea
                          name=""
                          label="CCM Approval"
                          placeholder="This can be repaired and we donate it to CBOs"
                        />
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                          <FormSelect
                            name=""
                            placeholder="Select approval"
                            options={APPROVAL_PROCESS}
                          />
                          <FormSelect
                            name=""
                            placeholder="Select name"
                            options={APPROVAL_PROCESS}
                          />
                        </div>
                        <Button variant="custom" type="button">
                          Approve
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <FormTextArea name="" label="Remarks" />
                        <FormSelect
                          name=""
                          placeholder="Select approval"
                          options={APPROVAL_PROCESS}
                        />
                        <Button variant="custom" type="button">
                          Approve
                        </Button>
                      </div>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ViewAssets;

type TItemRequisition = {
  name: string;
};

const columns: ColumnDef<TItemRequisition>[] = [
  {
    header: "Date",
    accessorKey: "date",
  },
  {
    header: "Description",
    accessorKey: "description",
  },
  {
    header: "Status",
    accessorKey: "status",
  },
  {
    header: "Remark",
    accessorKey: "remark",
  },
];
