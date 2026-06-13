"use client";

/* eslint-disable no-unused-vars */
import { ColumnDef } from "@tanstack/react-table";
import FormButton from "@/components/FormButton";
import AddSquareIcon from "@/components/icons/AddSquareIcon";
import DataTable from "@/components/Table/DataTable";
import React from "react";
import { cn } from "@/lib/utils";
import { Filter } from 'lucide-react';import { Icon } from "@iconify/react";

import { Button } from "@/components/ui/button";
import Link from "next/link"; import { useRouter } from "next/navigation";
import { HrRoutes } from "@/constants/RouterConstants";
import { Checkbox } from "@/components/ui/checkbox";
import PencilIcon from "@/components/icons/PencilIcon";
import EyeIcon from "@/components/icons/EyeIcon";
import IconButton from "@/components/IconButton";
import FilterIcon from "@/components/icons/FilterIcon";
import { useGetWorkforceNeedAnalysis } from "@/features/hr/controllers/hrWorkforceNeedAnalysisController";
import { useGetWorkforces } from "@/features/hr/controllers/workforceController";

import Card from "@/components/Card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SelectContent, SelectItem } from "@/components/ui/select";
import { useGetLocationList } from "@/features/modules/controllers/config/locationController";
import { useGetPositionPaginate } from "@/features/modules/controllers/config/positionController";
import { LocationResultsData } from "definitions/configs/location";
import { PositionsResultsData } from "definitions/configs/positions";
import { SubmitHandler, useForm } from "react-hook-form";
import FormSelect from "@/components/FormSelectField";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ConfirmationDialog from "@/components/ConfirmationDialog";

export const filterSchema = z.object({
  position: z.string(),
  location: z.string(),
});

export type TFormValues = z.infer<typeof filterSchema>;

const WFNA: React.FC = () => {
  const [isDialogOpen, setDialogOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<string>("");
  const router = useRouter();
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

  const { handleSubmit, reset, watch } = form;

  // Watch form values for reactive filtering
  const selectedLocation = watch("location");
  const selectedPosition = watch("position");

  // Get all locations (increased page size to fetch all locations)
  const { data: locations, isLoading: locationIsLoading } =
    useGetLocationList({
      page: 1,
      size: 1000, // Increased size to get all locations
      search: "",
      enabled: true
    });

  // Get all positions (increased page size to fetch all positions)
  const { data: positions, isLoading: positionIsLoading } =
    useGetPositionPaginate({
      page: 1,
      size: 1000, // Increased size to get all positions
      search: "",
      enabled: true
    });

  const { data, isLoading: loadingWorkforce, error } =
    useGetWorkforceNeedAnalysis({
      ...(selectedLocation && { location: selectedLocation }),
      ...(selectedPosition && { position: selectedPosition }),
    });

  // Debug: Get actual employee data to see how MD user is stored
  const { data: employeeData, isLoading: employeeLoading } = useGetWorkforces({
    page: 1,
    size: 100,
    search: "",
    enabled: true,
  });

  // Debug logging
  React.useEffect(() => {
    console.log('=== WORKFORCE NEED ANALYSIS DEBUG ===');
    console.log('Selected Location:', selectedLocation);
    console.log('Selected Position:', selectedPosition);
    console.log('Full API Response:', data);
    console.log('Analysis Results:', data?.data?.results);
    console.log('Results Count:', data?.data?.results?.length);
    console.log('Pagination:', data?.data?.pagination);
    console.log('Loading:', loadingWorkforce);
    console.log('Error:', error);
    console.log('API Endpoint:', 'hr/employees/workforce/need-analysis/');
    console.log('====================================');
  }, [data, loadingWorkforce, error, selectedLocation, selectedPosition]);

  // Debug positions and locations fetching
  React.useEffect(() => {
    console.log('=== POSITIONS & LOCATIONS DEBUG ===');
    console.log('Positions Data:', positions);
    console.log('Positions Count:', positions?.data?.results?.length);
    console.log('Positions Loading:', positionIsLoading);
    console.log('Locations Data:', locations);
    console.log('Locations Count:', locations?.data?.results?.length);
    console.log('Locations Loading:', locationIsLoading);
    console.log('===================================');
  }, [positions, positionIsLoading, locations, locationIsLoading]);

  // Debug employee data to see how MD user position is stored
  React.useEffect(() => {
    console.log('=== EMPLOYEE DATA DEBUG ===');
    console.log('Employee Data:', employeeData);
    console.log('Employee Count:', employeeData?.data?.results?.length);
    console.log('Employee Loading:', employeeLoading);

    // Find MD user specifically
    const mdEmployees = employeeData?.data?.results?.filter((employee: any) => {
      const position = employee.position;
      const positionName = typeof position === 'object' ? position?.name : position;
      const positionId = typeof position === 'object' ? position?.id : position;

      // Check if position matches MD in any form
      return positionName?.toLowerCase().includes('md') ||
             positionName?.toLowerCase().includes('managing director') ||
             positionId === selectedPosition;
    });

    console.log('MD Employees Found:', mdEmployees);
    console.log('Selected Position ID:', selectedPosition);

    // Log all employee positions for comparison
    if (employeeData?.data?.results?.length > 0) {
      console.log('All Employee Positions:');
      employeeData.data.results.forEach((employee: any, index: number) => {
        console.log(`Employee ${index + 1}:`, {
          name: `${employee.first_name} ${employee.last_name}`,
          position: employee.position,
          positionType: typeof employee.position,
          positionId: typeof employee.position === 'object' ? employee.position?.id : employee.position,
          positionName: typeof employee.position === 'object' ? employee.position?.name : employee.position
        });
      });
    }
    console.log('==============================');
  }, [employeeData, employeeLoading, selectedPosition]);

  const onSubmit: SubmitHandler<TFormValues> = (values) => {
    // Filter values are automatically applied through getValues() in the query
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
      accessorKey: "position",
      size: 200,
      cell: ({ getValue, row }) => {
        const position = getValue();
        console.log('Position cell data:', position, 'Row:', row.original);

        if (typeof position === 'object' && position !== null) {
          return String((position as any).name || (position as any).title || 'Unknown Position');
        }
        return String(position || 'N/A');
      },
    },
    {
      header: "Location",
      accessorKey: "location",
      size: 200,
      cell: ({ getValue, row }) => {
        const location = getValue();
        console.log('Location cell data:', location, 'Row:', row.original);

        if (typeof location === 'object' && location !== null) {
          return String((location as any).name || (location as any).state || (location as any).city || 'Unknown Location');
        }
        return String(location || 'N/A');
      },
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
      <div className='flex center gap-1'>
        <Link
          href={`/dashboard/hr/workforce-need-analysis/${data.original.id}`}
        >
          <Button
            className='flex items-center justify-center gap-2'
            variant='ghost'
            size='sm'
            title='View Analysis'
          >
            <EyeIcon />
          </Button>
        </Link>
        <Link
          href={{
            pathname: HrRoutes.WORKFORCE_NEED_ANALYSIS_CREATE,
            search: `?id=${data.original.id}`,
          }}
        >
          <Button
            className='flex items-center justify-center gap-2'
            variant='ghost'
            size='sm'
            title='Edit Analysis'
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
                              <SelectItem key={location.id} value={String(location.id)}>
                                {String(location.name || 'Unknown Location')}
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
                              <SelectItem key={position.id} value={String(position.id)}>
                                {String(position.name)}
                              </SelectItem>
                            )
                          )
                        ) : (
                          <div className='flex justify-center items-center p-4'>
                            <p className='text-sm text-muted-foreground'>
                              No positions found
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

      {/* Filter Status Info */}
      {(selectedLocation || selectedPosition) && (
        <Card className='w-full px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Filter size={16} />
              <p className='text-sm font-medium'>
                Showing results for:
                {selectedPosition && (
                  <span className='ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded'>
                    Position: {positions?.data?.results?.find((p: PositionsResultsData) => String(p.id) === selectedPosition)?.name || 'Loading...'}
                  </span>
                )}
                {selectedLocation && (
                  <span className='ml-2 px-2 py-1 bg-green-100 text-green-800 rounded'>
                    Location: {locations?.data?.results?.find((l: LocationResultsData) => String(l.id) === selectedLocation)?.name || 'Loading...'}
                  </span>
                )}
                <span className='ml-3 text-gray-600'>
                  ({data?.data?.pagination?.count || 0} {(data?.data?.pagination?.count || 0) === 1 ? 'result' : 'results'})
                </span>
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => reset()}
              className='flex items-center gap-2'
            >
              <XCircle size={16} />
              Clear Filters
            </Button>
          </div>
        </Card>
      )}

      <div className='w-full'>
        <DataTable
          columns={columns}
          data={data?.data?.results ?? []}
          isLoading={loadingWorkforce}
          pagination={{
            total: data?.data?.pagination?.count || 0,
            pageSize: data?.data?.pagination?.page_size || 20,
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
