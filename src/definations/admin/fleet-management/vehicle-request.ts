import { IUser } from "definations/auth/user";
import { TLocationData } from "definations/modules/config/location";
import { z } from "zod";

export const VehicleRequestSchema = z.object({
    requesting_staff: z.string().min(1, "Please select a requesting staff"),
    location: z.string().min(1, "Please select a location"),
    travel_destination: z.string().min(1, "Please enter a travel destination"),
    departure_point: z.string().min(1, "Please enter point of departure"),
    return_point: z.string().min(1, "Please enter point of return"),
    departure_datetime: z.string().min(1, "Please select a departure date"),
    return_datetime: z.string().min(1, "Please select date of return"),
    travel_team_members: z.array(
        z.string().min(1, "Please select a team member")
    ),
    supervisor: z.string().min(1, "Please select a supervisior"),
    recommendations: z.string().min(1, "Please enter a recommendation"),
});

export type TVehicleRequestFormValues = z.infer<typeof VehicleRequestSchema>;

export interface IVehicleRequestPaginatedData {
    id: string;
    created_by: string;
    location: string;
    supervisor: string;
    travel_team_members_names: string[];
    created_datetime: string;
    updated_datetime: string;
    status: string;
    travel_destination: string;
    departure_datetime: string;
    departure_point: string;
    return_datetime: string;
    return_point: string;
    recommendations: string;
    approved_datetime: null;
    updated_by: null;
    requesting_staff: string;
    approved_by: null;
    vehicles: [];
}

export interface IVehicleSingleData {
    id: string;
    travel_team_members: IUser[];
    location: TLocationData;
    created_by: IUser;
    supervisor: IUser;
    created_datetime: string;
    updated_datetime: string;
    status: string;
    travel_destination: string;
    departure_datetime: string;
    departure_point: string;
    return_datetime: string;
    return_point: string;
    recommendations: string;
    approved_datetime: string | null;
    updated_by: string | null;
    requesting_staff: string;
    approved_by: string | null;
    vehicles: [];
}
