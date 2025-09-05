export default function Test() {
  return <></>;
}

// import { ColumnDef } from "@tanstack/react-table";
// import TableAction from "components/atoms/TableAction";
// import { AdminRoutes } from "constants/RouterConstants";
// import { toast } from "sonner";

// // eslint-disable-next-line react-refresh/only-export-components
// // const OnTableAction = ({ row }: { row: Agreement }) => {
// //     const [deleteAgrement] = useDeleteAgreementMutation();
// //     const onSubmit = async () => {
// //         try {
// //             await deleteAgrement(row.id) ;
// //             toast.success("Agreement deleted successfully");
// //         } catch (error) {
// //             toast.error("Error deleting");
// //         }
// //     };
// //     return (
// //         <TableAction
// //             row={row}
// //             route={AdminRoutes.ViewAggrement}
// //             action={onSubmit}
// //         />
// //     );
// // };

// export const columnsLease: ColumnDef<Agreement>[] = [
//     {
//         accessorKey: "provider",
//         header: "Provider",
//     },
//     {
//         accessorKey: "service",
//         header: "Service",
//     },
//     {
//         accessorKey: "type",
//         header: "Type",
//     },
//     {
//         accessorKey: "start_date",
//         header: "Start Date",
//     },
//     {
//         accessorKey: "end_date",
//         header: "End Date",
//     },
//     {
//         accessorKey: "status",
//         header: "Status",
//         cell: ({ getValue }) => {
//             return (
//                 <div
//                     className={`${
//                         getValue<string>().toLowerCase() === "active"
//                             ? "bg-[#E9F9F0] text-[#008248]"
//                             : "bg-[#FEEFEF] text-[#D8000C]"
//                     } px-2 text-center py-1 rounded-md text-sm capitalize`}
//                 >
//                     {getValue<string>()}
//                 </div>
//             );
//         },
//     },
//     {
//         accessorKey: "actions",
//         header: "",
//         cell: ({ row }) => <OnTableAction row={row.original} />,
//     },
// ];
