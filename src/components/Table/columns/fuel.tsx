export default function Test() {
  return <></>;
}

// import { ColumnDef, Row } from "@tanstack/react-table";
// import TableAction from "components/atoms/TableAction";
// import DeleteIcon from "components/icons/DeleteIcon";
// import EyeIcon from "components/icons/EyeIcon";
// import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
// import { Button } from "components/ui/button";
// import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
// import { AdminRoutes } from "constants/RouterConstants";
// import { formatCurrency } from "lib/utils";
// import Link from "next/link";
// import { toast } from "sonner";

// export type IFuelVehicle = {
//     condition: string;
//     name: string;
//     manufacturer: string;
//     model: string;
//     implementer: string;
//     id: string;
// };

// const ActionList = () => {
//     const onFuelDelete = async () => {
//         // try {
//         //     await deleteFuel(row.original.id) ;
//         //     toast.success("Fuel Record Deleted");
//         // } catch (error) {
//         //     toast.error("Failed to delete fuel record");
//         // }
//     };

//     return (
//         <Popover>
//             <PopoverTrigger asChild>
//                 <Button variant="ghost" className="flex gap-2 py-6">
//                     <MoreOptionsHorizontalIcon />
//                 </Button>
//             </PopoverTrigger>
//             <PopoverContent className=" w-fit">
//                 <div className="flex flex-col items-start justify-between gap-1">
//                     <Link
//                         className="w-full"
//                         href={generatePath(AdminRoutes.FuelViewDetail, {
//                             id: 1,
//                         })}
//                     >
//                         <Button
//                             className="w-full flex items-center justify-start gap-2"
//                             variant="ghost"
//                         >
//                             <EyeIcon />
//                             View
//                         </Button>
//                     </Link>
//                     <Button
//                         onClick={onFuelDelete}
//                         className="w-full flex items-center justify-start gap-2"
//                         variant="ghost"
//                     >
//                         <DeleteIcon />
//                         delete
//                     </Button>
//                 </div>
//             </PopoverContent>
//         </Popover>
//     );
// };

// export const fuelConsumption: ColumnDef<IFuelVehicle>[] = [
//     {
//         header: "vehicle",
//         accessorKey: "name",
//     },

//     {
//         header: "Model",
//         accessorKey: "model",
//     },
//     {
//         header: "Manufacturer",
//         accessorKey: "manufacturer",
//     },
//     {
//         header: "Implementer",
//         accessorKey: "implementer",
//     },
//     {
//         header: "condition",
//         accessorKey: "condition",
//     },
//     {
//         header: "",
//         accessorKey: "actions",
//         cell: ({ row }) => {
//             return (
//                 <TableAction row={row.original} route={AdminRoutes.FuelView} />
//             );
//         },
//     },
// ];

// export const fuelConsumptionColumnsOne: ColumnDef<FuelRecord>[] = [
//     {
//         header: "Date",
//         accessorKey: "date",
//     },
//     {
//         header: "Previous Odometer Reading",
//         accessorKey: "odometer",
//         size: 200,
//     },
//     {
//         header: "Current Odometer Reading",
//         accessorKey: "current_odometer",
//         size: 200,
//     },
//     {
//         header: "Distance Covered",
//         accessorKey: "distance_covered",
//     },
//     {
//         header: "Fuel Coupon Number",
//         accessorKey: "coupon_number",
//     },
//     {
//         header: "Location",
//         accessorKey: "-",
//     },
//     {
//         header: "Vendor",
//         accessorKey: "--",
//     },
//     {
//         header: "Price Per Liter (₦)",
//         accessorKey: "price_per_liter",
//     },
//     {
//         header: "Litre Quantity",
//         accessorKey: "quantity",
//     },
//     {
//         header: "Amount",
//         accessorKey: "amount",
//         cell: ({ getValue }) => {
//             return (
//                 <div className="flex items-center justify-center">
//                     {formatCurrency(getValue<number>())}
//                 </div>
//             );
//         },
//     },
//     {
//         header: "Action",
//         id: "action",
//         cell: ({ row }) => <ActionList row={row} />,
//     },
// ];

// export const fuelConsumptionColumns: ColumnDef<FuelRecord>[] = [
//     {
//         header: "Driver",
//         accessorKey: "driver",
//     },
//     {
//         header: "Date",
//         accessorKey: "date",
//     },
//     {
//         header: "Odometer",
//         accessorKey: "odometer",
//     },
//     {
//         header: "Distance Covered",
//         accessorKey: "distance_covered",
//     },
//     {
//         header: "Price Per Liter (₦)",
//         accessorKey: "price_per_liter",
//     },
//     {
//         header: "Quantity",
//         accessorKey: "quantity",
//     },
//     {
//         header: "Amount",
//         accessorKey: "amount",
//         cell: ({ getValue }) => {
//             return (
//                 <div className="flex items-center justify-center">
//                     {formatCurrency(getValue<number>())}
//                 </div>
//             );
//         },
//     },
// ];
