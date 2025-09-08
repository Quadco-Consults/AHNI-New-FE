import { ColumnDef } from "@tanstack/react-table";

// Define the destination interface based on API response
interface IDestination {
    id: string;
    project: {
        id: string;
        project_id: string;
        title: string;
        status: string;
    };
    city: string;
    state: string;
    arrival_date: string;
    departure_date: string;
    purpose: string;
    accommodation_required: boolean;
    transport_required: boolean;
    travel_fee: {
        id: string;
        lodging: string;
        meals: string;
        number_of_nights: number;
        interstate: string;
        airport_taxi: string;
        car_hire: string;
    }[];
}

export const expenseAuthorizationDestinationColumns: ColumnDef<IDestination>[] = [
    {
        header: "Project",
        id: "project",
        accessorFn: ({ project }) => project?.title || "N/A",
        size: 200,
    },
    {
        header: "Destination",
        id: "destination",
        accessorFn: ({ city, state }) => `${city}, ${state}`,
        size: 150,
    },
    {
        header: "Purpose",
        accessorKey: "purpose",
        size: 200,
    },
    {
        header: "Arrival Date",
        accessorKey: "arrival_date",
        size: 120,
    },
    {
        header: "Departure Date", 
        accessorKey: "departure_date",
        size: 120,
    },
    {
        header: "Accommodation",
        id: "accommodation",
        accessorFn: ({ accommodation_required }) => accommodation_required ? "Yes" : "No",
        size: 120,
    },
    {
        header: "Transport",
        id: "transport", 
        accessorFn: ({ transport_required }) => transport_required ? "Yes" : "No",
        size: 100,
    },
    {
        header: "Lodging",
        id: "lodging",
        accessorFn: ({ travel_fee }) => travel_fee?.[0]?.lodging ? `$${travel_fee[0].lodging}` : "N/A",
        size: 100,
    },
    {
        header: "Meals",
        id: "meals",
        accessorFn: ({ travel_fee }) => travel_fee?.[0]?.meals ? `$${travel_fee[0].meals}` : "N/A",
        size: 100,
    },
    {
        header: "Nights",
        id: "nights",
        accessorFn: ({ travel_fee }) => travel_fee?.[0]?.number_of_nights || "N/A",
        size: 80,
    },
    {
        header: "Interstate",
        id: "interstate",
        accessorFn: ({ travel_fee }) => travel_fee?.[0]?.interstate ? `$${travel_fee[0].interstate}` : "N/A",
        size: 100,
    },
    {
        header: "Airport Taxi",
        id: "airport_taxi",
        accessorFn: ({ travel_fee }) => travel_fee?.[0]?.airport_taxi ? `$${travel_fee[0].airport_taxi}` : "N/A",
        size: 120,
    },
    {
        header: "Car Hire",
        id: "car_hire",
        accessorFn: ({ travel_fee }) => travel_fee?.[0]?.car_hire ? `$${travel_fee[0].car_hire}` : "N/A",
        size: 100,
    },
];
