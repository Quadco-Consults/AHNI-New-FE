import { ColumnDef } from "@tanstack/react-table";
import BackNavigation from "atoms/BackNavigation";
import DataTable from "components/Table/DataTable";
import { Checkbox } from "components/ui/checkbox";
import TabState from "components/ui/TabState";
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { closeoutPlanAPis } from "services/cAndGApi/closeOutPlan";
import DepartmentsAPI from "services/configs/departments";

const CloseOutDetails: React.FC = () => {
  const params = useParams();
  const departmentQueryResults: any = DepartmentsAPI.useGetDepartmentsQuery({
    params: { no_paginate: true, fields: "id,name" },
  });
  const departments = useMemo(() => {
    return departmentQueryResults?.data?.map((item: any) => {
      return {
        label: item?.name,
        value: item?.id,
      };
    });
  }, [departmentQueryResults]);

  const tabDetails = useMemo(() => {
    return departments?.map((item: any) => {
      return { id: 1, state: item?.value, name: item?.label, tabComponent: <></> };
    });
  }, [departments]);

  const [tabState, setTabState] = useState<string | number>(tabDetails?.[0]?.state);
  const closeOutPlansDetails = closeoutPlanAPis.useGetCloseOutPlansDetailsQuery(
    useMemo(
      () => ({
        params: {
          project: params.id,
          department: tabState,
        },
      }),
      [params, tabState]
    )
  );

  useEffect(() => {
    setTabState(departments?.[0]?.value);
  }, [departments]);
  const closeOutTasks = closeOutPlansDetails?.data?.results?.[0]?.tasks || [];
  console.log(closeOutPlansDetails?.data?.results?.[0]?.tasks);
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
      header: "Pre-Closeout & Close-Out Activities",
      accessorKey: "key_task",
      size: 300,
      cell: ({ row }) => <p className="capitalize">{row?.original?.key_task}</p>,
    },
    {
      header: "Designation",
      accessorKey: "designation",
      size: 200,
      cell: ({ row }) => <p>{row?.original?.designation}</p>,
    },
    {
      header: "Start Date",
      accessorKey: "start_date",
      size: 200,
      cell: ({ row }) => <p>{row?.original?.start_date}</p>,
    },
    {
      header: "End Date",
      accessorKey: "end_date",
      size: 200,
      cell: ({ row }) => <p>{row?.original?.end_date}</p>,
    },
    {
      header: "Status",
      accessorKey: "status",
      size: 200,
      cell: ({ row }) => <p>{row?.original?.status || "-"}</p>,
    },
    {
      header: "Remarks",
      accessorKey: "remarks",
      size: 150,
      cell: ({ row }) => <p>{row?.original?.remarks}</p>,
    },
  ];

  return (
    <main className="w-full flex flex-col py-3 px-[1rem]">
      <section className="flex flex-col gap-y-[2rem] w-full">
        <div className="w-auto flex gap-x-[1.25rem] items-center justify-start">
          <BackNavigation />
          <TabState tabArray={tabDetails} setState={setTabState} tabState={tabState} />
        </div>
        <div className="w-full flex flex-col items-center justify-center">
          <DataTable columns={columns} data={closeOutTasks} isLoading={closeOutPlansDetails.isLoading} />
        </div>
      </section>
    </main>
  );
};

export default CloseOutDetails;
