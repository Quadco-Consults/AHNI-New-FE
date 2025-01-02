import { ColumnDef } from "@tanstack/react-table";
import BackNavigation from "atoms/BackNavigation";
import FormButton from "atoms/FormButton";
import DataTable from "components/Table/DataTable";
import {
    paymentColumns,
    TPaymentRequest,
} from "components/Table/columns/payment";
import { AdminRoutes } from "constants/RouterConstants";
import { Plus } from "lucide-react";
import { useMemo } from "react";
import { Link, generatePath } from "react-router-dom";
import { useGetPaymentRequestsQuery } from "services/admin/paymentRequest";

const PaymentRequestList = () => {
    const { data, isLoading } = useGetPaymentRequestsQuery({});

    const driveData = useMemo(() => {
        return (
            data?.results?.map((item) => ({
                ...item,
                requested_by:
                    item.requested_by.first_name +
                    " " +
                    item.requested_by.last_name,
            })) || []
        );
    }, [data?.results]);
    return (
        <div>
            <div className="flex items-center justify-between">
                <BackNavigation extraText="Payment Request" />
                <Link to={generatePath(AdminRoutes.PaymentRequestCreate)}>
                    <FormButton
                        type="button"
                        preffix={
                            <Plus
                                size={22}
                                className="bg-[#FFFF]/30 p-1 rounded"
                            />
                        }
                    >
                        Raise Request
                    </FormButton>
                </Link>
            </div>
            <div className="mt-8">
                <DataTable
                    columns={paymentColumns as ColumnDef<TPaymentRequest>[]}
                    data={driveData as TPaymentRequest[]}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
};

export default PaymentRequestList;
