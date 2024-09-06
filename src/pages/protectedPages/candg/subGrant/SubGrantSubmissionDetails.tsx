import { ColumnDef } from "@tanstack/react-table";
import FilterIcon2 from "assets/svgs/FilterIcon2";
import FormButton from "atoms/FormButton";
import SearchBar from "atoms/SearchBar";
import DataTable from "components/Table/DataTable";
import { Button } from "components/ui/button";
import { Checkbox } from "components/ui/checkbox";
import { useParams } from "react-router-dom";
import { SubGrantApplicationsApi } from "services/cAndGApi/subGrant";

const SubGrantSubmissionDetails = () => {
  const params = useParams();
  const getSubGrantsApplications = SubGrantApplicationsApi.useGetSubGrantsApplicationQuery({
    params: { no_paginate: false, sub_grant: params?.id },
  });
  // console.log(getSubGrantsApplications);
  const subGrantsApplications = getSubGrantsApplications?.data?.results;

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
    // {
    //   header: ({ table }) => (
    //     <Checkbox
    //       checked={table.getIsAllRowsSelected()}
    //       onCheckedChange={table.getToggleAllRowsSelectedHandler()}
    //     />
    //   ),
    //   accessorKey: "isSelected",
    //   size: 50,
    //   cell: ({ row }) => (
    //     <Checkbox
    //       checked={row.getIsSelected()}
    //       onCheckedChange={row.getToggleSelectedHandler()}
    //     />
    //   ),
    // },
    {
      header: "Legal Name of the Organization",
      accessorKey: "project",
      size: 200,
      cell: ({ row }) => <p>{row?.original?.project?.title}</p>,
    },
    {
      header: "Address",
      accessorKey: "location",
      size: 200,
      cell: ({ row }) => <p>{row?.original?.location?.name}</p>,
    },
    {
      header: "Telephone",
      accessorKey: "grantor",
      size: 200,
      cell: ({ row }) => <p>{row?.original?.grantor?.name}</p>,
    },
    {
      header: "Email",
      accessorKey: "award_amount",
      size: 200,
    },
  ];
  return (
    <div className="flex flex-col justify-center items-center gap-y-[1rem]">
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center justify-center">
          <SearchBar onchange={() => ""} />

          <Button variant="ghost" className="">
            <FilterIcon2 />
          </Button>
        </div>
        <div className="flex items-center">
          <FormButton
            onClick={() => {
              // navigate(CandGRoutes.MANUAL_SUB_GRANT_SUBMISSION);
            }}
            variant={"custom"}
            className="bg-[#FFF2F2] text-[#FF0000]"
          >
            <p>Bulk Actions</p>
            <CustomDownIcon />
          </FormButton>
        </div>
      </div>
      <div className="w-full">
        <DataTable
          columns={columns}
          onRowClick={() => {
            // navigate("/c-and-g/grant-details/" + row?.original?.id);
          }}
          data={subGrantsApplications || []}
          isLoading={getSubGrantsApplications.isLoading}
        />
      </div>
    </div>
  );
};

export default SubGrantSubmissionDetails;

const CustomDownIcon = () => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        opacity="0.4"
        d="M18.593 8.19486C19.0376 8.52237 19.1326 9.14837 18.8051 9.59306C18.5507 9.93847 18.2963 10.2668 18.0731 10.5528C17.6276 11.1236 17.0143 11.8882 16.3479 12.6556C15.6859 13.4181 14.9518 14.2064 14.2666 14.8119C13.9251 15.1136 13.5721 15.3911 13.2279 15.5986C12.9112 15.7895 12.476 16 11.9999 16C11.5238 16 11.0885 15.7895 10.7718 15.5986C10.4276 15.3911 10.0747 15.1136 9.7332 14.8119C9.04791 14.2064 8.31387 13.4181 7.65183 12.6556C6.98548 11.8882 6.37216 11.1236 5.92664 10.5528C5.70347 10.2668 5.44902 9.93847 5.19463 9.59307C4.86712 9.14837 4.96211 8.52237 5.4068 8.19486C5.58556 8.0632 5.79362 7.99983 5.99982 8L11.9999 8L17.9999 8C18.2061 7.99983 18.4142 8.0632 18.593 8.19486Z"
        fill="#FF0000"
      />
      <path
        d="M18.593 8.19486C19.0376 8.52237 19.1326 9.14837 18.8051 9.59306C18.5507 9.93847 18.2963 10.2668 18.0731 10.5528C17.6276 11.1236 17.0143 11.8882 16.3479 12.6556C15.6859 13.4181 14.9518 14.2064 14.2666 14.8119C13.9251 15.1136 13.5721 15.3911 13.2279 15.5986C12.9112 15.7895 12.476 16 11.9999 16C11.5238 16 11.0885 15.7895 10.7718 15.5986C10.4276 15.3911 10.0747 15.1136 9.7332 14.8119C9.15076 14.2973 8.53312 13.6506 7.95439 13L13 8L17.9999 8C18.2061 7.99983 18.4142 8.0632 18.593 8.19486Z"
        fill="#FF0000"
      />
    </svg>
  );
};
