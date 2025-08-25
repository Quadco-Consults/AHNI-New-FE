import BackNavigation from "components/atoms/BackNavigation";
import { useState } from "react";
import AddSquareIcon from "components/icons/AddSquareIcon";
import { Button } from "components/ui/button";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import { useAppDispatch } from "hooks/useStore";
import { useParams } from "next/navigation";
import { LoadingSpinner } from "components/Loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetSingleGrant } from "@/features/contracts-grants/controllers/grant/grantController";
import GrantDetailsCard from "../../grant/_components/GrantDetailsCard";
import ExpenditureHistory from "../../grant/_components/ExpenditureHistory";
import ObligationHistory from "../../grant/_components/ObligationHistory";
import { useGetSingleSubGrant } from "@/features/contracts-grants/controllers/subGrantController";

export default function SubGrantAwardDetails() {
  const [tabValue, setTabValue] = useState("details");

  const { id } = useParams();

  const { data, isLoading } = useGetSingleSubGrant(id ?? skipToken);

  const dispatch = useAppDispatch();

  return (
    <section className='space-y-5'>
      <div className='flex items-center justify-between'>
        <BackNavigation />

        {(tabValue === "expenditure" || tabValue === "obligation") && (
          <Button
            className='flex gap-2 py-6'
            type='button'
            onClick={() => {
              dispatch(
                openDialog({
                  type:
                    tabValue === "expenditure"
                      ? DialogType.ExpenditureModal
                      : DialogType.ADD_OBLIGATION_MODAL,
                  dialogProps: {
                    header:
                      tabValue === "expenditure"
                        ? "Add Expenditure"
                        : "Add Obligation",
                    width: "max-w-lg",
                    grantId: id,
                  },
                })
              );
            }}
          >
            <AddSquareIcon />
            {tabValue === "expenditure" ? "Add Expenditure" : "Add Obligation"}
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
        </Tabs>
      )}
    </section>
  );
}
