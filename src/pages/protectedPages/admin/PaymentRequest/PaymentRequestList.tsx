import { ColumnDef } from "@tanstack/react-table";
import BackNavigation from "atoms/BackNavigation";
import FormButton from "atoms/FormButton";
import DataTable from "components/Table/DataTable";
import { paymentColumns } from "components/Table/columns/payment";
import { AdminRoutes } from "constants/RouterConstants";
import { Plus } from "lucide-react";
import { Link, generatePath, useNavigate } from "react-router-dom";
import {
  TPaymentRequest,
  useGetPaymentRequestsQuery,
} from "services/adminApi/paymentRequest";

const PaymentRequestList = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useGetPaymentRequestsQuery({});

  const onRowClick = () => {
    navigate(AdminRoutes.PaymentRequestView);
  };
  return (
    <div>
      <div className="flex items-center justify-between">
        <BackNavigation extraText="Payment Request" />
        <Link to={generatePath(AdminRoutes.PaymentRequestCreate)}>
          <FormButton
            type="button"
            preffix={<Plus size={22} className="bg-[#FFFF]/30 p-1 rounded" />}
          >
            Raise Request
          </FormButton>
        </Link>
      </div>
      <div className="mt-8">
        <DataTable
          onRowClick={onRowClick}
          columns={paymentColumns as ColumnDef<TPaymentRequest>[]}
          data={data?.results || []}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default PaymentRequestList;
