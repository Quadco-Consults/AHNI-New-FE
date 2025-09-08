import { IUser } from "features/auth/types/user";
import { TDepartmentData } from "definations/modules/config/department";
import { TFCONumberData } from "definations/modules/finance/fco-number";
import { IProjectSingleData } from "definations/project";
import { z } from "zod";

// Travel fee schema for reuse
const TravelFeeSchema = z.object({
    lodging: z.coerce.number().min(0, "Lodging must be 0 or greater"),
    meals: z.coerce.number().min(0, "Meals must be 0 or greater"),
    number_of_nights: z.coerce.number().min(1, "Number of nights must be at least 1"),
    interstate: z.coerce.number().min(0, "Interstate must be 0 or greater"),
    airport_taxi: z.coerce.number().min(0, "Airport taxi must be 0 or greater"),
    car_hire: z.coerce.number().min(0, "Car hire must be 0 or greater"),
});

// Destination schema for single traveler
const DestinationSchema = z.object({
    project: z.string().min(1, "Please select a project"),
    city: z.string().min(1, "Please enter city"),
    state: z.string().min(1, "Please enter state"),
    arrival_date: z.string().min(1, "Please select arrival date"),
    departure_date: z.string().min(1, "Please select departure date"),
    purpose: z.string().min(1, "Please enter purpose"),
    accommodation_required: z.boolean(),
    transport_required: z.boolean(),
    travel_fee: TravelFeeSchema,
});

// Traveler schema for multiple travelers
const TravelerSchema = z.object({
    user: z.string().min(1, "Please select a user"),
    address: z.string().min(1, "Please enter address"),
    destinations: z.array(DestinationSchema).min(1, "Please add at least one destination"),
});

export const ExpenseAuthorizationSchema = z.object({
    traveler_type: z.enum(["SINGLE", "MULTIPLE"], {
        required_error: "Please select traveler type",
    }),
    ta_number: z.string().min(1, "Please enter TA number"),
    department: z.string().min(1, "Please select a department"),
    fco: z.string().min(1, "Please select a fco"),
    is_managing_director_notified: z.boolean().optional(),
    is_travel_advances_dependent: z.boolean(),
    is_document_needed: z.boolean(),
    is_car_rental_allowed: z.boolean(),
    is_hotel_reservation_required: z.boolean(),
    is_hotel_transport_required: z.boolean(),
    
    // Optional comment fields
    travel_advances_dependent_comment: z.string().optional(),
    document_needed_comment: z.string().optional(),
    car_rental_comment: z.string().optional(),
    hotel_reservation_comment: z.string().optional(),
    hotel_transport_comment: z.string().optional(),
    justification: z.string().optional(),

    // Approval workflow users
    reviewer: z.string().min(1, "Please select reviewer"),
    authorizer: z.string().min(1, "Please select authorizer"),
    approver: z.string().min(1, "Please select approver"),

    // Single traveler fields (conditional)
    address: z.string().optional(),
    destinations: z.array(DestinationSchema).optional(),

    // Multiple travelers field (conditional)
    travelers: z.array(TravelerSchema).optional(),
}).refine(
    (data) => {
        if (data.traveler_type === "SINGLE") {
            return data.address && data.destinations && data.destinations.length > 0;
        }
        if (data.traveler_type === "MULTIPLE") {
            return data.travelers && data.travelers.length > 0;
        }
        return false;
    },
    {
        message: "Please provide required fields based on traveler type",
        path: ["traveler_type"],
    }
);

export type TExpenseAuthorizationFormData = z.infer<
    typeof ExpenseAuthorizationSchema
>;

export interface IExpenseAuthorizationPaginatedData {
    id: string;
    department: string;
    fco: string;
    project: string;
    project_details: {
        id: string;
        project_id: string;
        title: string;
        status: string;
        currency: string;
        budget: number;
        award_amount: number;
    } | null;
    work_plan_activity_details: any | null;
    created_datetime: string;
    updated_datetime: string;
    description: string;
    amount: string;
    date: string;
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

// Destination interface for API response
interface IDestination {
    id: string;
    project: IProjectSingleData;
    created_datetime: string;
    updated_datetime: string;
    city: string;
    state: string;
    arrival_date: string;
    departure_date: string;
    purpose: string;
    accommodation_required: boolean;
    transport_required: boolean;
    travel_fee: {
        id: string;
        created_datetime: string;
        updated_datetime: string;
        lodging: string;
        meals: string;
        number_of_nights: number;
        interstate: string;
        airport_taxi: string;
        car_hire: string;
    }[];
}

// Traveler interface for API response
interface ITraveler {
    id: string;
    user: IUser;
    address: string;
    destinations: IDestination[];
}

// Approval interface for API response
interface IApproval {
    id: string;
    user: IUser;
    created_datetime: string;
    updated_datetime: string;
    approval_level: "REVIEW" | "AUTHORIZE" | "APPROVE";
    comments: string | null;
    justification: string | null;
    approved: boolean | null;
}

// Requestor details interface
interface IRequestorDetails {
    id: string;
    name: string;
    email: string;
    phone: string | null;
}

export interface IExpenseAuthorizationSingleData {
    id: string;
    department: TDepartmentData;
    fco: TFCONumberData;
    project: IProjectSingleData | null;
    created_by: IUser;
    destinations: IDestination[];
    travelers: ITraveler[];
    travel_fee: {
        id: string;
        created_datetime: string;
        updated_datetime: string;
        lodging: string;
        meals: string;
        number_of_nights: number;
        interstate: string;
        airport_taxi: string;
        car_hire: string;
    };
    travel_fees: {
        id: string;
        created_datetime: string;
        updated_datetime: string;
        lodging: string;
        meals: string;
        number_of_nights: number;
        interstate: string;
        airport_taxi: string;
        car_hire: string;
    }[];
    number_of_nights_list: number[];
    approvals: IApproval[];
    activity: any | null;
    security_clearance: any | null;
    employee_phone: string | null;
    activities: any[];
    requestor_details: IRequestorDetails;
    employee_details: any | null;
    created_datetime: string;
    updated_datetime: string;
    address: string;
    ta_number: string;
    is_managing_director_notified: boolean;
    is_travel_advances_dependent: boolean;
    travel_advance_percentage: number | null;
    travel_advances_dependent_comment: string;
    is_document_needed: boolean;
    document_needed_comment: string;
    is_car_rental_allowed: boolean;
    car_rental_comment: string;
    is_hotel_reservation_required: boolean;
    hotel_reservation_comment: string;
    is_hotel_transport_required: boolean;
    hotel_transport_comment: string;
    justification: string;
    destination: string | null;
    traveler_type: "SINGLE" | "MULTIPLE";
    is_international_travel: boolean;
    special_instructions: string | null;
    document_submission_deadline: string | null;
    status: string;
    security_clearance_status: string;
    updated_by: string | null;
}
