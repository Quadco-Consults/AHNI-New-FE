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

export interface IPurchaseOrderSingleData {}
