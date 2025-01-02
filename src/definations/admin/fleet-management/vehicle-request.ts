import { z } from "zod";

export const VehicleRequestSchema = z.object({
    created_by: z.string().min(1, "Please select a user"),
    location: z.string().min(1, "Please select a location"),
    travel_destination: z.string().min(1, "Please enter a travel destination"),
    departure_date: z.string().min(1, "Please select a departure date"),
    departure_point: z.string().min(1, "Please enter a departure point"),
    return_date: z.string().min(1, "Please select a return date"),
    travel_team_members: z.array(
        z.string().min(1, "Please select a supervisor")
    ),
    supervisor: z.string().min(1, "Please select a supervisor"),
    reccomendations: z.string().min(1, "Please enter recommendations"),
});

export type TVehicleRequestFormValues = z.infer<typeof VehicleRequestSchema>;

export interface IVehicleRequestPaginatedData {}

export interface IVehicleSingleData {}
