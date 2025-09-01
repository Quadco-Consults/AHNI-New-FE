"use client";

import BackNavigation from "components/atoms/BackNavigation";
import React, { useState } from "react";
import GrantDetailsCard from "./_components/GrantDetailsCard";
import ExpenditureHistory from "./_components/ExpenditureHistory";
import ModificationHistory from "./_components/ModificationHistory";
import AddSquareIcon from "components/icons/AddSquareIcon";
import { Button } from "components/ui/button";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import { useAppDispatch } from "hooks/useStore";
import { useParams } from "next/navigation";
import { LoadingSpinner } from "components/Loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { skipToken } from "@reduxjs/toolkit/query";
import ObligationHistory from "./_components/ObligationHistory";
// import { useGetSingleGrant } from "@/features/contracts-grants/controllers/grant/grant";
import { useGetSingleProject } from "@/features/projects/controllers/projectController";

const GrantDetails: React.FC = () => {
  const [tabValue, setTabValue] = useState("details");

  const { id } = useParams();
  const grantId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : undefined;
  

  const { data, isLoading } = useGetSingleProject(id ?? skipToken);

  //   const { data } = useGetSingleGrant(id ?? skipToken);

  const dispatch = useAppDispatch();

  return (
    <section className='space-y-5'>
      <div className='flex items-center justify-between'>
        <BackNavigation />

        {(tabValue === "expenditure" || tabValue === "obligation" || tabValue === "modifications") && grantId && (
          <Button
            className='flex gap-2 py-6'
            type='button'
            onClick={() => {
              dispatch(
                openDialog({
                  type:
                    tabValue === "expenditure"
                      ? DialogType.ExpenditureModal
                      : tabValue === "obligation"
                      ? DialogType.ADD_OBLIGATION_MODAL
                      : DialogType.MODIFY_GRANT,
                  dialogProps: {
                    header:
                      tabValue === "expenditure"
                        ? "Add Expenditure"
                        : tabValue === "obligation"
                        ? "Add Obligation"
                        : "Add Modification",
                    width: "max-w-lg",
                    grantId: grantId,
                    data: { id: grantId, title: data?.data?.title },
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
          className='space-y-5'
        >
          <TabsList className='ml-10'>
            <TabsTrigger value='details'>Details</TabsTrigger>

            <TabsTrigger value='expenditure'>Expenditure History</TabsTrigger>

            <TabsTrigger value='obligation'>Obligations</TabsTrigger>

            <TabsTrigger value='modifications'>Modifications</TabsTrigger>
          </TabsList>

          <TabsContent value='details'>
            {data && <GrantDetailsCard {...data?.data} />}
          </TabsContent>

          <TabsContent value='expenditure'>
            {data && <ExpenditureHistory {...data?.data} />}
          </TabsContent>

          <TabsContent value='obligation'>
            {data && <ObligationHistory {...data?.data} />}
          </TabsContent>

          <TabsContent value='modifications'>
            <ModificationHistory />
          </TabsContent>
        </Tabs>
      )}
    </section>
  );
};

export default GrantDetails;
