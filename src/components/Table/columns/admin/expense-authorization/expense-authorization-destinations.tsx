import { ColumnDef } from "@tanstack/react-table";
import { IExpenseAuthorizationPaginatedData } from "definations/admin/expense-authorization";

export const expenseAuthorizationDestinationColumns: ColumnDef<IExpenseAuthorizationPaginatedData>[] =
    [
        {
            header: "Destination",
            accessorKey: "destination",
        },

        {
            header: "Travel Fee",
            accessorKey: "travel_fee",
            columns: [
                { header: "Lodging", size: 200 },
                { header: "Meals", size: 200 },
                { header: "Number of Nights", size: 200 },
                { header: "Interstate", size: 200 },
                { header: "Airport Taxi", size: 200 },
                { header: "Car Hire", size: 200 },
            ],
        },
    ];
