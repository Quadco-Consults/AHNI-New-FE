import { TItemData } from "definations/modules/config/item";

export type PurchaseOrderItems = {
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
    purchase_order: string;
};

export interface IPurchaseOrderPaginatedData {
    id: string;
    created_datetime: string;
    updated_datetime: string;
    vendor_name: string;
    purchase_order_number: string;
    purchase_date: string;
    request_dept: string;
    comment: string;
    delivery_lead_time: string;
    ship_to_address: string;
    payment_terms: string;
    authorized_datetime: null;
    approved_date: string;
    agreed_date: string;
    funding_source: string;
    authorized_by: null;
    approved_by: null;
    agreed_by: null;
}

export interface IPurchaseOrderSingleData {
    id: string;
    agreed_by_detail: null;
    approved_by_detail: null;
    vendor_detail: {
        id: string;
        company_name: string;
        company_registration_number: string;
        type_of_business: string;
        status: string;
        email: string;
    };
    solicitation_detail: null;
    purchase_order_items: {
        id: number;
        item_detail: TItemData;
        description: null;
        quantity: number;
        uom: null;
        unit_price: string;
        total_price: string;
        purchase_order: string;
        item: string;
        fco_number: null;
    }[];
    created_datetime: string;
    updated_datetime: string;
    status_level: string;
    purchase_order_number: string;
    purchase_date: string;
    comment: null;
    delivery_lead_time: null;
    payment_terms: "";
    authorized_datetime: null;
    approved_date: null;
    agreed_date: null;
    vendor: string;
    purchase_request: string;
    cba: null;
    solicitation: null;
    funding_source: null;
    location: null;
    authorized_by: null;
}
