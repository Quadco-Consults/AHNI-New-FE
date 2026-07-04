import { TItemData } from "definitions/modules/config/item";

export type ServiceOrderItems = {
    id: string;
    item: {
        id: string;
        created_at: string;
        updated_at: string;
        name: string;
        description: string;
        uom: string;
        category: string;
    };
    created_at: string;
    updated_at: string;
    category: string;
    fco: string;
    units: number;
    number_of_days: number;
    unit_cost: number;
    quantity: number;
    sub_total_amount: number;
    service_order: string;
};

export interface IServiceOrderPaginatedData {
    id: string;
    created_datetime: string;
    updated_datetime: string;
    vendor_name: string;
    service_order_number: string;
    purchase_date: string;
    request_dept: string;
    comment: string;
    delivery_lead_time: string;
    ship_to_address: string;
    payment_terms: string;
    transaction_type?: string;
    authorized_datetime: null;
    approved_date: string;
    agreed_date: string;
    funding_source: string;
    reviewed_by: null;
    authorized_by: null;
    approved_by: null;
    agreed_by: null;
    status_level: string;
    reviewed_by_detail?: {
        user_id: string;
        name: string;
    } | null;
    authorized_by_detail?: {
        user_id: string;
        name: string;
    } | null;
    approved_by_detail?: {
        user_id: string;
        name: string;
    } | null;
    agreed_by_detail?: {
        user_id: string;
        name: string;
    } | null;
    vendor_detail: {
        id: string;
        company_name: string;
        company_registration_number: string;
        type_of_business: string;
        status: string;
        email: string;
    } | null;
    solicitation_detail: {
        id: string;
        title: string;
        rfq_id: string;
    } | null;
    purchase_request_detail?: {
        id: string;
        ref_number: string;
        status: string;
        created_datetime: string;
    } | null;
    rfq_id?: string;
}

export interface IServiceOrderSingleData {
    id: string;
    reviewed_by_detail?: {
        user_id: string;
        name: string;
    } | null;
    authorized_by_detail?: {
        user_id: string;
        name: string;
    } | null;
    approved_by_detail?: {
        user_id: string;
        name: string;
    } | null;
    agreed_by_detail?: {
        user_id: string;
        name: string;
    } | null;
    vendor_detail: {
        id: string;
        company_name: string;
        company_registration_number: string;
        type_of_business: string;
        status: string;
        email: string;
    };
    solicitation_detail: {
        id: string;
        title: string;
        rfq_id: string;
    } | null;
    purchase_request_detail?: {
        id: string;
        ref_number: string;
        status: string;
        created_datetime: string;
    } | null;
    service_order_items: {
        id: number;
        item_detail: TItemData;
        description: null;
        quantity: number;
        uom: null;
        unit_price: string;
        total_price: string;
        service_order: string;
        item: string;
        fco_number: null;
    }[];
    created_datetime: string;
    updated_datetime: string;
    status_level: string;
    service_order_number: string;
    purchase_date: string;
    transaction_type?: string;
    comment: null;
    delivery_lead_time: null;
    payment_terms: "";
    reviewed_datetime: null;
    authorized_datetime: null;
    approved_date: null;
    agreed_date: null;
    vendor: string;
    purchase_request: string;
    cba: null;
    solicitation: null;
    funding_source: null;
    location: null;
    reviewed_by: null;
    authorized_by: null;
    approved_by: null;
    agreed_by: null;
    location_detail?: {
        id: string;
        name: string;
    } | null;
}
