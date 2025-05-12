/* eslint-disable no-unused-vars */
import { ColumnDef } from "@tanstack/react-table";
import FormButton from "atoms/FormButton";
import AddSquareIcon from "components/icons/AddSquareIcon";
import DataTable from "components/Table/DataTable";
import React from "react";
import { cn } from "lib/utils";
import { Icon } from "@iconify/react";

import { Button } from "components/ui/button";
import { generatePath, Link, useNavigate } from "react-router-dom";
import { HrRoutes } from "constants/RouterConstants";
import { Checkbox } from "components/ui/checkbox";
import PencilIcon from "components/icons/PencilIcon";
import IconButton from "components/shared/IconButton";
import FilterIcon from "components/icons/FilterIcon";
import { useGetWorkforceNeedAnalysisQuery } from "services/hrApi/hr-workforce-need-analysis";

import Card from "components/shared/Card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "components/ui/accordion";
import { SelectContent, SelectItem } from "components/ui/select";
import { useGetLocationListQuery } from "services/configs/locationApi";
import { useGetPositionPaginateQuery } from "services/configs/positions";
import { LocationResultsData } from "definations/configs/location";
import { PositionsResultsData } from "definations/configs/positions";
import { SubmitHandler, useForm } from "react-hook-form";
import FormSelect from "atoms/FormSelectField";
import { Form } from "components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ConfirmationDialog from "components/modals/dailog/ConfirmationDialog";

export const filterSchema = z.object({
  position: z.string(),
  location: z.string(),
});

export type TFormValues = z.infer<typeof filterSchema>;

const WFNA: React.FC = () => {
  const [isDialogOpen, setDialogOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<string>("");
  const navigate = useNavigate();
  const form = useForm<TFormValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      // current_staff_count: 0,
      // wisn_required_staff_count: 0,
      // shortage_excess_count: 0,
      // wisn_ratio: "",
      // workforce_problem: "",
      // workload_problem: "",
      position: "",
      location: "",
    },
  });

  const { handleSubmit, reset, getValues } = form;
  const { location, position } = getValues();

  const { data, isLoading: loadingWorkforce } =
    useGetWorkforceNeedAnalysisQuery({
      ...(location && { location }),
      ...(position && { position }),
    });
  // const [deleteWorkforceNeedAnalysis, { isLoading: deleting }] =
  //     useWorkforceNeedAnalysisMutation({});
  const { data: locations, isLoading: locationIsLoading } =
    useGetLocationListQuery({});
  const { data: positions, isLoading: positionIsLoading } =
    useGetPositionPaginateQuery({});

  const onSubmit: SubmitHandler<TFormValues> = (values) => {
    console.log("filter; ", values);
  };

  // const onDelete = async () => {
  //   await deleteWorkforceNeedAnalysis({
  //     id: selectedId as string,
  //   });
  //   setDialogOpen(false);
  // };

  const columns: ColumnDef<any>[] = [
    {
      id: "select",
      size: 50,
      header: ({ table }) => {
        return (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => {
              table.toggleAllPageRowsSelected(!!value);
            }}
          />
        );
      },
      cell: ({ row }) => {
        return (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => {
              row.toggleSelected(!!value);
            }}
          />
        );
      },
    },
    {
      header: "Position",
      accessorKey: "position.name",
      size: 200,
    },
    {
      header: "Location",
      accessorKey: "location.name",
      size: 200,
    },
    {
      header: "Current Staff",
      accessorKey: "current_staff_count",
      size: 200,
    },
    {
      header: "Required Staff Based on WISN",
      accessorKey: "wisn_required_staff_count",
      size: 250,
    },
    {
      header: "Shortage or excess",
      accessorKey: "shortage_excess_count",
      size: 200,
    },
    {
      header: "Workforce Problem",
      accessorKey: "workforce_problem",
      size: 200,
      cell: ({ getValue }) => {
        return (
          <h4
            className={cn(
              "p-1 rounded-lg capitalize",
              getValue() === "SURPLUS" && "text-green-500",
              getValue() === "SHORTAGE" && "text-red-500",
              getValue() === "BALANCE" && "text-[#021A0D]"
            )}
          >
            {getValue() as string}
          </h4>
        );
      },
    },
    {
      header: "WISN Ratio",
      accessorKey: "wisn_ratio",
      size: 200,
      cell: ({ getValue }) => {
        return (
          <h4
            className={cn(
              "p-1 rounded-lg capitalize",
              parseFloat(getValue() as string) > 1.0 && "text-green-500",
              parseFloat(getValue() as string) < 1.0 && "text-red-500",
              parseFloat(getValue() as string) === 1.0 && "text-[#021A0D]"
            )}
          >
            {getValue() as string}
          </h4>
        );
      },
    },
    {
      header: "Workload Pressure",
      accessorKey: "workload_problem",
      size: 200,
      cell: ({ getValue }) => {
        return (
          <h4
            className={cn(
              "p-1 rounded-lg capitalize",
              getValue() === "NONE" && "text-green-500",
              getValue() === "HIGH" && "text-red-500",
              getValue() === "NORMAL" && "text-[#021A0D]"
            )}
          >
            {getValue() as string}
          </h4>
        );
      },
    },
    {
      header: "Actions",
      id: "actions",
      size: 150,
      cell: ({ row }) => <ActionListAction data={row} />,
    },
  ];

  const ActionListAction = ({ data }: any) => {
    return (
      <div className='flex center'>
        <Link
          to={{
            pathname: HrRoutes.WORKFORCE_NEED_ANALYSIS_CREATE,
            search: `?id=${data.original.id}`,
          }}
        >
          <Button
            className='w-full flex items-center justify-start gap-2'
            variant='ghost'
          >
            <PencilIcon />
          </Button>
        </Link>
      </div>
    );
  };

  return (
    <div className='flex flex-col justify-center items-center gap-y-[1rem]'>
      {/** ============================================= FILTER ============================================= */}
      <Card className='w-full px-6'>
        <Accordion
          type='single'
          collapsible
          defaultValue='1'
          className='w-full'
        >
          <AccordionItem value={"1"}>
            <AccordionTrigger className='mx-4'>
              <FilterIcon />
            </AccordionTrigger>

            <AccordionContent>
              <Form {...form}>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className='grid grid-cols-2 gap-6 mt-6 mx-4'
                >
                  <div className='col-span-1'>
                    <FormSelect
                      // label='location'
                      name='location'
                      placeholder='Select a location'
                    >
                      <SelectContent>
                        {locationIsLoading ? (
                          <div className='flex justify-center items-center p-4'>
                            <p className='text-sm text-muted-foreground'>
                              Loading...
                            </p>
                          </div>
                        ) : (locations?.data?.results || []).length > 0 ? (
                          (locations?.data?.results || []).map(
                            (location: LocationResultsData) => (
                              <SelectItem key={location.id} value={location.id}>
                                {location.name}
                              </SelectItem>
                            )
                          )
                        ) : (
                          <div className='flex justify-center items-center p-4'>
                            <p className='text-sm text-muted-foreground'>
                              No locations found
                            </p>
                          </div>
                        )}
                      </SelectContent>
                    </FormSelect>
                  </div>

                  <div className='col-span-1'>
                    <FormSelect
                      // label='position'
                      name='position'
                      placeholder='Select a position'
                    >
                      <SelectContent>
                        {positionIsLoading ? (
                          <div className='flex justify-center items-center p-4'>
                            <p className='text-sm text-muted-foreground'>
                              Loading...
                            </p>
                          </div>
                        ) : (positions?.data?.results || []).length > 0 ? (
                          (positions?.data?.results || []).map(
                            (position: PositionsResultsData) => (
                              <SelectItem key={position.id} value={position.id}>
                                {position.name}
                              </SelectItem>
                            )
                          )
                        ) : (
                          <div className='flex justify-center items-center p-4'>
                            <p className='text-sm text-muted-foreground'>
                              No locations found
                            </p>
                          </div>
                        )}
                      </SelectContent>
                    </FormSelect>
                  </div>

                  <div className='col-span-2 flex justify-end'>
                    <div className='flex center gap-4'>
                      <FormButton
                        onClick={() => reset()}
                        className='flex items-center justify-center gap-2'
                      >
                        Reset
                      </FormButton>
                    </div>
                  </div>
                </form>
              </Form>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>

      {/* <div className='w-full flex justify-end items-center'>
        <div className='flex items-center'>
          <FormButton
            onClick={() => {
              navigate(HrRoutes.WORKFORCE_NEED_ANALYSIS_CREATE);
            }}
          >
            <AddSquareIcon />
            <p>Create Workforce Need Analysis</p>
          </FormButton>
        </div>
      </div> */}

      <div className='w-full'>
        <DataTable
          columns={columns}
          data={data?.data?.results ?? []}
          isLoading={loadingWorkforce}
          pagination={{
            total: 10,
            pageSize: 10,
            onChange: (page: number) => {},
          }}
        />
      </div>

      {/* <ConfirmationDialog
        open={isDialogOpen}
        title='Are you sure you want to delete this complaint?'
        onCancel={() => setDialogOpen(false)}
        onOk={onDelete}
        loading={deleting}
      /> */}
    </div>
  );
};

export default WFNA;
