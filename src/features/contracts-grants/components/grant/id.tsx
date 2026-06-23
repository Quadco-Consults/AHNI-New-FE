"use client";

import BackNavigation from "@/components/BackNavigation";
import React, { useState } from "react";
import GrantDetailsCard from "./_components/GrantDetailsCard";
import ExpenditureHistory from "./_components/ExpenditureHistory";
import ModificationHistory from "./_components/ModificationHistory";
import DisbursementHistory from "./_components/DisbursementHistory";
import AddSquareIcon from "@/components/icons/AddSquareIcon";
import { Button } from "@/components/ui/button";
import { openDialog } from "@/store/ui";
import { DialogType } from "@/constants/dialogs";
import { useAppDispatch } from "@/hooks/useStore";
import { useParams } from "next/navigation";
import { LoadingSpinner } from "@/components/Loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { skipToken } from "@reduxjs/toolkit/query";
import ObligationHistory from "./_components/ObligationHistory";
import { useGetSingleGrant } from "@/features/contracts-grants/controllers/grantController";
import { useGetSingleProject } from "@/features/projects/controllers/projectController";

const GrantDetails: React.FC = () => {
  const [tabValue, setTabValue] = useState("details");

  const { id } = useParams();
  const grantId =
    typeof id === "string" ? id : Array.isArray(id) ? id[0] : undefined;

  const { data: projectData, isLoading: projectLoading, error: projectError } = useGetSingleProject(grantId ?? skipToken);
  const { data: grantData, error: grantError } = useGetSingleGrant(grantId ?? skipToken);

  // Merge project and grant data, prioritizing grant data for grant-specific fields
  const data = grantData ? {
    ...projectData,
    data: {
      ...projectData?.data,
      ...grantData?.data,
    }
  } : projectData;

  const isLoading = projectLoading;

  const dispatch = useAppDispatch();

  // Show error state if both APIs fail
  if (projectError && grantError) {
    return (
      <section className="space-y-5">
        <BackNavigation />
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error Loading Grant Details</h3>
          <p className="text-red-600 text-sm mt-1">
            Unable to load grant information. Please check if the grant ID is correct.
          </p>
          <p className="text-red-600 text-sm">Grant ID: {grantId}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <BackNavigation />

        {(tabValue === "expenditure" ||
          tabValue === "obligation" ||
          tabValue === "modifications" ||
          tabValue === "disbursements") &&
          grantId && (
            <Button
              className="flex gap-2 py-6"
              type="button"
              onClick={() => {
                dispatch(
                  openDialog({
                    type:
                      tabValue === "expenditure"
                        ? DialogType.ExpenditureModal
                        : tabValue === "obligation"
                        ? DialogType.ADD_OBLIGATION_MODAL
                        : tabValue === "disbursements"
                        ? DialogType.ADD_DISBURSEMENT_MODAL
                        : DialogType.MODIFY_GRANT,
                    dialogProps: {
                      header:
                        tabValue === "expenditure"
                          ? "Add Expenditure"
                          : tabValue === "obligation"
                          ? "Add Obligation"
                          : tabValue === "disbursements"
                          ? "Add Disbursement"
                          : "Add Modification",
                      width: "max-w-lg",
                      grantId: grantId,
                      projectId: data?.data?.project_id,
                      data: {
                        id: grantId,
                        title: data?.data?.title,
                        start_date: data?.data?.start_date,
                        end_date: data?.data?.end_date,
                      },
                    },
                  })
                );
              }}
            >
              <AddSquareIcon />
              {tabValue === "expenditure"
                ? "Add Expenditure"
                : tabValue === "obligation"
                ? "Add Obligation"
                : tabValue === "disbursements"
                ? "Add Disbursement"
                : "Add Modification"}
            </Button>
          )}
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <Tabs
          defaultValue={tabValue}
          value={tabValue}
          onValueChange={(value) => setTabValue(value)}
          className="space-y-5"
        >
          <TabsList className="ml-10">
            <TabsTrigger value="details">Details</TabsTrigger>

            <TabsTrigger value="expenditure">Expenditure History</TabsTrigger>

            <TabsTrigger value="obligation">Obligations</TabsTrigger>

            <TabsTrigger value="disbursements">Disbursements</TabsTrigger>

            <TabsTrigger value="modifications">Modifications</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            {data && <GrantDetailsCard {...data?.data as any} />}
          </TabsContent>

          <TabsContent value="expenditure">
            {data && <ExpenditureHistory {...data?.data as any} />}
          </TabsContent>

          <TabsContent value="obligation">
            {data && <ObligationHistory {...data?.data as any} />}
          </TabsContent>

          <TabsContent value="disbursements">
            {data && <DisbursementHistory {...data?.data as any} />}
          </TabsContent>

          <TabsContent value="modifications">
            <ModificationHistory modifications={(data?.data as any)?.modifications || []} />
          </TabsContent>
        </Tabs>
      )}
    </section>
  );
};

export default GrantDetails;
