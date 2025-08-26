"use client";

import { useRouter } from "next/navigation";
import LongArrowLeft from "components/icons/LongArrowLeft";
import Card from "components/Card";
import { Form } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import FormSelect from "components/atoms/FormSelectField";
import FormInput from "components/atoms/FormInput";
import FormTextArea from "components/atoms/FormTextArea";
import { Button } from "components/ui/button";
import { RouteEnum } from "constants/RouterConstants";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import {
  RiskPlanManagementSchema,
  TRiskPlanManagementFormValues,
} from "features/programs/types/program-validator";
import {
  useCreateRiskManagementPlanController,
  useGetSingleRiskPlanManagement,
  useUpdateRiskManagementPlan,
} from "@/features/programs/controllers/riskPlansController";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { useEffect } from "react";
import { useGetAllRiskCategoryController } from "@/features/modules/controllers/program/riskCategoryController";
import { useGetAllDepartments } from "@/features/modules/controllers/config/departmentController";
import BreadcrumbCard, { TBreadcrumbList } from "components/Breadcrumb";

const levelOptions = ["VERY_LOW", "LOW", "MEDIUM", "HIGH", "VERY_HIGH"].map(
  (option) => ({
    label: option,
    value: option,
  })
);

const timelineOptions = [
  "IMMEDIATE",
  "SHORT_TERM",
  "MEDIUM_TERM",
  "LONG_TERM",
].map((option) => ({
  label: option,
  value: option,
}));

const statusOptions = ["OPEN", "CLOSED", "MITIGATED"].map((option) => ({
  label: option,
  value: option,
}));

const breadcrumbs: TBreadcrumbList[] = [
  { name: "Programs", icon: true },
  { name: "Plans", icon: true },
  { name: "Risk Management Plan", icon: true },
  { name: "Create", icon: false },
];

const CreateRickManagement = () => {
  const router = useRouter();
  const form = useForm<TRiskPlanManagementFormValues>({
    resolver: zodResolver(RiskPlanManagementSchema),
    defaultValues: {
      risk_number: "",
      risk_description: "",
      impact_description: "",
      risk_response: "",
      risk_category: "",
      risk_owner: "",
    },
  });

  const { handleSubmit, reset } = form;

  const { data: riskCategory } = useGetAllRiskCategoryController({
    page: 1,
    size: 2000000,
  });

  const riskCategoryOptions = riskCategory?.data.results.map((cat) => ({
    label: cat.name,
    value: cat.id,
  }));

  const { data: departments } = useGetAllDepartments({
    page: 1,
    size: 2000000,
  });

  const departmentOptions = departments?.data.results.map((dep) => ({
    label: dep.name,
    value: dep.id,
  }));

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const { data: prevRiskManagement } = useGetSingleRiskPlanManagement(
    id ?? skipToken
  );

  useEffect(() => {
    if (prevRiskManagement) {
      const { risk_number, risk_category, risk_owner } =
        prevRiskManagement.data;

      reset({
        ...prevRiskManagement.data,
        risk_number: String(risk_number),
        risk_category: risk_category.id,
        risk_owner: risk_owner.id,
      });
    }
  }, [prevRiskManagement]);

  const { createRiskManagementPlan, isLoading } =
    useCreateRiskManagementPlanController();

  const { updateRiskManagementPlan, isLoading: isUpdateLoading } =
    useUpdateRiskManagementPlan(id ?? skipToken);

  const goBack = () => {
    router.back();
  };

  const onSubmit: SubmitHandler<TRiskPlanManagementFormValues> = async (
    data
  ) => {
    try {
      if (id) {
        await updateRiskManagementPlan(data);
        toast.success("Risk Management Plan Updated");
      } else {
        await createRiskManagementPlan(data);
        toast.success("Risk Management Plan Created");
      }

      router.push(RouteEnum.PROGRAM_RISK_MANAGEMENT);
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Something went wrong");
    }
  };

  return (
    <div className='space-y-6 min-h-screen'>
      <BreadcrumbCard list={breadcrumbs} />

      <button
        onClick={goBack}
        className='w-[3rem] aspect-square rounded-full drop-shadow-md bg-white flex items-center justify-center'
      >
        <LongArrowLeft />
      </button>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className='space-y-8 py-5'>
            <FormInput
              name='risk_number'
              label='Risk Number'
              placeholder='Enter Risk Number'
              required
            />

            <FormTextArea
              name='risk_description'
              required
              placeholder='Enter Risk Description'
              label='Risk Description'
            />

            <FormTextArea
              label='Impact Description'
              required
              name='impact_description'
              placeholder='Enter Impact Description'
            />

            <FormSelect
              name='impact_level'
              label='Impact Level'
              placeholder='Select Impact Level'
              required
              options={levelOptions}
            />

            <FormSelect
              name='occurence_probability'
              label='Occurence Probability'
              placeholder='Select Occurence Probability'
              required
              options={levelOptions}
            />

            <FormSelect
              name='total_risk_on_response'
              label='Total Risk on Response'
              placeholder='Select Total Risk Response'
              required
              options={levelOptions}
            />

            <FormInput
              name='risk_response'
              label='Risk Response'
              placeholder='Enter Risk Response'
              required
            />

            <FormSelect
              name='implementation_timeline'
              label='Implementation Timeline'
              placeholder='Select Implementation Timeline'
              required
              options={timelineOptions}
            />

            <FormSelect
              name='risk_status'
              label='Risk Status'
              placeholder='Select Risk Status'
              required
              options={statusOptions}
            />

            <FormSelect
              name='risk_category'
              label='Risk Category'
              placeholder='Select Risk Category'
              required
              options={riskCategoryOptions}
            />

            <FormSelect
              placeholder='Select risk owner'
              name='risk_owner'
              label='Risk Owner'
              required
              options={departmentOptions}
            ></FormSelect>
          </Card>

          <div className='flex justify-end gap-5 mt-16'>
            <Button
              className='bg-[#FFF2F2] text-primary dark:text-gray-500'
              onClick={goBack}
            >
              Cancel
            </Button>
            <FormButton
              loading={isLoading || isUpdateLoading}
              disabled={isLoading || isUpdateLoading}
              type='submit'
            >
              {id ? "Update" : "Create"}
            </FormButton>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateRickManagement;

/*   <SelectContent>
                                {isLoading ? (
                                    <LoadingSpinner />
                                ) : (
                                    data?.map(
                                        (value: RiskCategoriesResultsData) => (
                                            <SelectItem
                                                key={value?.id}
                                                value={value?.id}
                                            >
                                                {value?.name}
                                            </SelectItem>
                                        )
                                    )
                                )}
                            </SelectContent> */
