"use client";

import BackNavigation from "components/atoms/BackNavigation";
import FormButton from "@/components/FormButton";
import FormTextArea from "components/atoms/FormTextArea";
import DescriptionCard from "components/DescriptionCard";
import { LoadingSpinner } from "components/Loading";
import { Card, CardContent } from "components/ui/card";
import { format } from "date-fns";
import { FormProvider, useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import { useGetSingleFacilityMaintenanceQuery } from "@/features/admin/controllers/facilityMaintenanceController";
import { formatNumberCurrency } from "utils/utls";

export default function ViewFacilityMaintenance() {
  const { id } = useParams();

  const { data, isLoading } = useGetSingleFacilityMaintenanceQuery(
    id || "", !!id
  );

  const form = useForm();

  return (
    <div>
      <BackNavigation extraText="View Facility Maintenance Ticket" />

      <Card>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          data && (
            <CardContent className="mt-10">
              <div className="grid grid-cols-3 gap-5">
                <DescriptionCard
                  label="Name of Staff"
                  description={`${data?.data?.staff?.first_name} ${data?.data?.staff?.last_name}`}
                />

                <DescriptionCard
                  label="Department"
                  description={data?.data.department?.name || "N/A"}
                />

                <DescriptionCard
                  label="Location"
                  description={data?.data.location?.name}
                />

                <DescriptionCard
                  label="Date"
                  description={format(
                    data?.data.created_datetime,
                    "dd-MMM-yyyy"
                  )}
                />

                <DescriptionCard
                  label="Facility"
                  description={data?.data.facility.name}
                />

                <DescriptionCard
                  label="Maintenance Type"
                  description={data?.data.maintenance_type}
                />

                <DescriptionCard
                  label="Rate"
                  description={formatNumberCurrency(data?.data.rate, "NGN")}
                />

                <DescriptionCard
                  label="Cost Estimate"
                  description={formatNumberCurrency(
                    data?.data.cost_estimate,
                    "NGN"
                  )}
                />

                <DescriptionCard
                  label="Total Cost Estimate"
                  description={formatNumberCurrency(
                    data?.data.total_cost_estimate,
                    "NGN"
                  )}
                />

                <DescriptionCard
                  label="Description"
                  description={data?.data.description}
                />
              </div>

              <DescriptionCard
                label="Description of Problem"
                description={data?.data.problem_description}
                className="mt-5"
              />

              <FormProvider {...form}>
                <form className="space-y-6 mt-5">
                  <FormTextArea
                    label="Comment"
                    name="comment"
                    placeholder="Enter Comment"
                  />

                  <FormButton size="lg" className="bg-green-500">
                    Approve
                  </FormButton>
                </form>
              </FormProvider>
            </CardContent>
          )
        )}
      </Card>
    </div>
  );
}
