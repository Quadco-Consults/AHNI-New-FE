import { IUser } from "definations/auth/user";
import { TDepartmentData } from "definations/modules/config/department";
import { TFCONumberData } from "definations/modules/finance/fco-number";
import { IProjectSingleData } from "definations/project";
import { z } from "zod";

export const ExpenseAuthorizationSchema = z.object({
    project: z.string().min(1, "Please select a project"),
    department: z.string().min(1, "Please select a department"),
    fco: z.string().min(1, "Please select a fco"),
    address: z.string().min(1, "Please enter address"),
    city: z.string().min(1, "Please enter city"),
    ta_number: z.string().min(1, "Please enter TA number"),
    arrival_date: z.string().min(1, "Please select arrival date"),
    departure_date: z.string().min(1, "Please select departure date"),
    is_managing_director_notified: z.boolean().optional(),
    is_travel_advances_dependent: z.string().min(1, "Please select a choice"),
    is_document_needed: z.string().min(1, "Please select a choice"),
    is_car_rental_allowed: z.string().min(1, "Please select a choice"),
    is_hotel_reservation_required: z.string().min(1, "Please select a choice"),
    is_hotel_transport_required: z.string().min(1, "Please select a choice"),
    // destination: z.string().min(1, "Please enter destination"),

    // travel_fee: z.object({
    //     lodging: z.string().min(1, "Please enter lodging"),
    //     meals: z.string().min(1, "Please enter meals"),
    //     number_of_nights: z.string().min(1, "Please enter number of nights"),
    //     interstate: z.string().min(1, "Please enter interstate"),
    //     airport_taxi: z.string().min(1, "Please enter airport taxi"),
    //     car_hire: z.string().min(1, "Please enter car hire"),
    // }),

    reviewer: z.string().min(1, "Please select reviewer"),
    authorizer: z.string().min(1, "Please select authorizer"),
    approver: z.string().min(1, "Please select approver"),

    // to be added
    destinations: z.array(
        z.object({
            destination: z.string().min(1, "Please enter destination"),
            travel_fee: z.object({
                lodging: z.string().min(1, "Please enter lodging"),
                meals: z.string().min(1, "Please enter meals"),
                number_of_nights: z
                    .string()
                    .min(1, "Please enter number of nights"),
                interstate: z.string().min(1, "Please enter interstate"),
                airport_taxi: z.string().min(1, "Please enter airport taxi"),
                car_hire: z.string().min(1, "Please enter car hire"),
            }),
        })
    ),
});

export type TExpenseAuthorizationFormData = z.infer<
    typeof ExpenseAuthorizationSchema
>;

export interface IExpenseAuthorizationPaginatedData {
    id: string;
    department: string;
    fco: string;
    project: string;
    created_datetime: string;
    updated_datetime: string;
    full_name: string;
    address: string;
    phone_number: string;
    email: string;
    ta_number: string;
    city: string;
    arrival_date: string;
    departure_date: string;
    is_travel_advances_dependent: boolean;
    is_document_needed: boolean;
    is_car_rental_allowed: boolean;
    is_hotel_reservation_required: boolean;
    is_hotel_transport_required: boolean;
    is_hotel_transit_required: boolean;
    destination: string;
    created_by: IUser;
    updated_by: string | null;
}

export interface IExpenseAuthorizationSingleData {
    id: string;
    department: TDepartmentData;
    fco: TFCONumberData;
    project: IProjectSingleData;
    created_by: IUser;
    created_datetime: string;
    updated_datetime: string;
    address: string;
    ta_number: string;
    city: string;
    arrival_date: string;
    departure_date: string;
    is_managing_director_notified: boolean;
    is_travel_advances_dependent: boolean;
    is_document_needed: boolean;
    is_car_rental_allowed: boolean;
    is_hotel_reservation_required: boolean;
    is_hotel_transport_required: boolean;
    destination: string;
    status: string;
    updated_by: string | null;
}
