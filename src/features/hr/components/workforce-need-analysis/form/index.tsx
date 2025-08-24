"use client";

// import { zodResolver } from "@hookform/resolvers/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
// import { skipToken } from "@reduxjs/toolkit/query/react";
import FormSelect from "components/atoms/FormSelectField";
import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import Card from "components/Card";
// import AddSquareIcon from "components/icons/AddSquareIcon";
import GoBack from "components/GoBack";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "components/Loading";

// import { Button } from "components/ui/button";
import { Form } from "components/ui/form";
import { Separator } from "components/ui/separator";
import { HrRoutes } from "constants/RouterConstants";
import { SelectContent, SelectItem } from "components/ui/select";
import { LocationResultsData } from "definations/configs/location";
import { PositionsResultsData } from "definations/configs/positions";
import { workforceNeedAnalysisSchema } from "@/features/hr/types/hr-validator";

import { UploadIcon } from "lucide-react";
// import { ItemsResultsData } from "definations/configs/itmes";
// import { SampleMemoSchema } from "definations/procurement-validator";
// import { MinusCircle } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";

import { useGetDepartmentPaginate } from "@/features/modules/controllers/config/departmentController";
import { useGetLocationList } from "@/features/modules/controllers/config/locationController";
import { useGetPositionPaginate } from "@/features/modules/controllers/config/positionController";
import {
  useCreateWorkforceNeedAnalysis,
  useGetWorkforceNeedAnalysisId,
} from "@/features/hr/controllers/hrWorkforceNeedAnalysisController";
import { z } from "zod";
import { useSearchParams } from "next/navigation";

export type TFormValues = z.infer<typeof workforceNeedAnalysisSchema>;

const CreateActivityMemo = () => {
  const searchParams = useSearchParams();
  const analysisId = searchParams.get("id");

  const form = useForm<TFormValues>({
    resolver: zodResolver(workforceNeedAnalysisSchema),
    defaultValues: {
      current_staff_count: 0,
      wisn_required_staff_count: 0,
      shortage_excess_count: 0,
      workforce_problem: "",
      wisn_ratio: "",
      workload_problem: "",
      position: "",
      location: "",
    },
  });

  const { createWorkforceNeedAnalysis, isLoading: isCreatingLoading } =
    useCreateWorkforceNeedAnalysis();
  const router = useRouter();

  const { data: locations, isLoading: locationIsLoading } =
    useGetLocationList({});
  const { data: positions, isLoading: positionIsLoading } =
    useGetPositionPaginate({});

  const { handleSubmit } = form;

  const onSubmit: SubmitHandler<TFormValues> = async (data: any) => {
    await createWorkforceNeedAnalysis(data)();
    router.push(HrRoutes.WORKFORCE_NEED_ANALYSIS);
  };

  const problemTypes = [
    { value: "SHORTAGE", label: "Shortage" },
    { value: "SURPLUS", label: "Surplus" },
    { value: "BALANCE", label: "Balance" },
  ];

  const loadProblemTypes = [
    { value: "HIGH", label: "High" },
    { value: "NORMAL", label: "Normal" },
    { value: "NONE", label: "None" },
  ];

  const { data: analysis } = useGetWorkforceNeedAnalysisId({
    id: analysisId,
  });

  // console.log(analysisId);

  React.useEffect(() => {
    if (analysis) {
      form.reset({
        current_staff_count: analysis.data.current_staff_count,
        wisn_required_staff_count: analysis.data.wisn_required_staff_count,
        shortage_excess_count: analysis.data.shortage_excess_count,
        workforce_problem: analysis.data.workforce_problem,
        wisn_ratio: analysis.data.wisn_ratio,
        workload_problem: analysis.data.workload_problem,
        position: analysis.data.position.name,
        location: analysis.data.location.name,
      });
    }

    console.log(form.getValues());
  }, [analysis]);

  return (
    <div>
      <GoBack />

      <div className='pt-20'>
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col gap-6'
          >
            <div className='grid grid-cols-2 gap-5'>
              <div className='col-span-1'>
                <FormSelect
                  label='Position'
                  name='position'
                  required
                  disabled={!!analysisId}
                >
                  <SelectContent>
                    {positionIsLoading ? (
                      <LoadingSpinner />
                    ) : (
                      positions?.data?.results?.map(
                        (position: PositionsResultsData) => (
                          <SelectItem key={position?.id} value={position.name}>
                            {position?.name}
                          </SelectItem>
                        )
                      )
                    )}
                  </SelectContent>
                </FormSelect>
              </div>

              <div className='col-span-1'>
                <FormSelect
                  label='Location'
                  name='location'
                  required
                  disabled={!!analysisId}
                >
                  <SelectContent>
                    {locationIsLoading ? (
                      <LoadingSpinner />
                    ) : (
                      locations?.data?.results?.map(
                        (location: LocationResultsData) => (
                          <SelectItem key={location?.id} value={location.name}>
                            {location?.name}
                          </SelectItem>
                        )
                      )
                    )}
                  </SelectContent>
                </FormSelect>
              </div>
            </div>

            <Card>
              <h4 className='text-xl mb-8'>Staff Information</h4>

              <div className='grid grid-cols-3 gap-5'>
                <FormInput
                  label='Current Staff Count'
                  name='current_staff_count'
                  type='number'
                  required
                  disabled={!!analysisId}
                />
                <FormInput
                  label='Required Staff Based on WISN'
                  name='wisn_required_staff_count'
                  type='number'
                  required
                />
                <FormInput
                  label='Shortage or excess count'
                  name='shortage_excess_count'
                  type='number'
                  disabled={!!analysisId}
                  required
                />
              </div>

              <div className='grid grid-cols-3 gap-5 mt-8'>
                <FormSelect
                  label='Workforce Problem'
                  name='workforce_problem'
                  options={problemTypes}
                  disabled={!!analysisId}
                />

                <FormInput
                  label='WISN Ratio'
                  name='wisn_ratio'
                  type='text'
                  required
                  disabled={!!analysisId}
                />

                <FormSelect
                  label='Workload Problem'
                  name='workload_problem'
                  options={loadProblemTypes}
                  disabled={!!analysisId}
                />
              </div>
            </Card>

            <Separator className='my-4' />
            <div className='flex justify-end'>
              <FormButton
                // loading={isLoading}
                // disabled={isLoading}
                type='submit'
                className='flex items-center justify-center gap-2'
              >
                {!analysisId && <UploadIcon />}
                {analysisId ? "Edit" : "Submit"}
              </FormButton>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateActivityMemo;
