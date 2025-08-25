/* eslint-disable no-unused-vars */
import { ColumnDef } from "@tanstack/react-table";
import FormButton from "@/components/FormButton";
import AddSquareIcon from "components/icons/AddSquareIcon";
import DataTable from "components/Table/DataTable";
import React, { useState } from "react";

import FilterIcon2 from "assets/svgs/FilterIcon2";
import { Button } from "components/ui/button";
import { useRouter } from "next/navigation";

import SearchBar from "components/atoms/SearchBar";
import { Checkbox } from "components/ui/checkbox";

import PayGroupModal from "./components/PayGroupModal";
import { useGetPayGroups } from "@/features/hr/controllers/payGroupController";
import useDebounce from "utils/useDebounce";

const PayGroup: React.FC = () => {
  const { data: payGroupsData, isLoading: isLoadingPayGroups } =
    useGetPayGroups();
  const [isModalOpen, setModalOpen] = useState(false);

  const columns: ColumnDef<any>[] = [
    {
      id: "select",
      size: 50,
      // header: ({ table }) => {
      //   return (
      //     <Checkbox
      //       checked={table?.getIsAllPageRowsSelected()}
      //       onCheckedChange={(value) => {
      //         table?.toggleAllPageRowsSelected(!!value);
      //       }}
      //     />
      //   );
      // },
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
      accessorKey: "position?.name",
      cell: ({ row }) => <p>{row?.original?.position?.name}</p>,

      size: 200,
    },
    {
      header: "Grade",
      accessorKey: "grade.name",
      size: 200,
    },

    {
      header: "Level",
      accessorKey: "level.name",
      size: 200,
    },
    {
      header: "Status",
      accessorKey: "Status",
      size: 200,
      cell: ({ row }) => (
        <p>{row?.original?.is_active ? "Active" : "In Active"}</p>
      ),
    },
  ];

  return (
    <div className='flex flex-col justify-center items-center gap-y-[1rem]'>
      <div className='w-full flex justify-between items-center'>
        <div className='flex items-center justify-center'>
          <SearchBar onchange={() => ""} />

          <Button variant='ghost' className=''>
            <FilterIcon2 />
          </Button>
        </div>
        <div className='flex items-center'>
          <FormButton onClick={() => setModalOpen(true)}>
            <AddSquareIcon />
            <p>Add New</p>
          </FormButton>
        </div>
      </div>
      <div className='w-full'>
        <DataTable
          columns={columns}
          data={payGroupsData?.data?.results || []} // ✅ Ensure data is always an array
          isLoading={isLoadingPayGroups}
          pagination={{
            total: 10,
            pageSize: 10,
            onChange: (page: number) => {},
          }}
        />
        <PayGroupModal
          isOpen={isModalOpen}
          onCancel={() => setModalOpen(false)}
          onOk={() => {}}
        />
      </div>
    </div>
  );
};

export default PayGroup;
