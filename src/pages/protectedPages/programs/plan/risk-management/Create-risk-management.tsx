import { useNavigate } from "react-router-dom";
import LongArrowLeft from "components/icons/LongArrowLeft";
import Card from "components/shared/Card";
import { Form } from "components/ui/form";
import { useForm } from "react-hook-form";
import FormSelect from "atoms/FormSelect";
import FormInput from "atoms/FormInput";
import FormTextArea from "atoms/FormTextArea";
import { Button } from "components/ui/button";
import { RouteEnum } from "constants/RouterConstants";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "components/ui/breadcrumb";
import { Icon } from "@iconify/react";
import { SelectContent, SelectItem } from "components/ui/select";
import { LoadingSpinner } from "components/shared/Loading";
import RiskCategoriesAPI from "services/programsApi/risk-categories";
import { RiskCategoriesResultsData } from "definations/program-types/risk-categories";
import { RiskPlansSchema } from "definations/program-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import RiskPlansAPI from "services/programsApi/risk-plans";
import { toast } from "sonner";
import DepartmentsAPI from "services/programsApi/departments";
import { DepartmentsResultsData } from "definations/program-types/departments";

const CreateRickManagement = () => {
  const navigate = useNavigate();

  const { data, isLoading } = RiskCategoriesAPI.useGetRiskCategoriesQuery({
    params: { no_paginate: true },
  });
  const departmentQueryResults = DepartmentsAPI.useGetDepartmentsQuery({
    params: { no_paginate: true },
  });

  const [createRiskPlanMutation, { isLoading: loading }] =
    RiskPlansAPI.useCreateRiskPlanMutation();

  const form = useForm<z.infer<typeof RiskPlansSchema>>({
    resolver: zodResolver(RiskPlansSchema),
    defaultValues: {
      risk_description: "",
      impact_description: "",
      impact_level: "",
      occurrence_probability: "",
      total_risk_response: "",
      risk_response: "",
      implementation_timeline: "",
      risk_status: "",
      risk_category: "",
      risk_owner: "",
    },
  });

  const { handleSubmit } = form;

  const goBack = () => {
    navigate(-1);
  };

  const onSubmit = async (data: z.infer<typeof RiskPlansSchema>) => {
    console.log(data);
    try {
      await createRiskPlanMutation(data).unwrap();
      toast.success("Successfully created");

      navigate(RouteEnum.PROGRAM_RISK_MANAGEMENT);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="space-y-6 min-h-screen">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Programs</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Icon icon="iconoir:slash" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Plans</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Icon icon="iconoir:slash" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href={RouteEnum.PROGRAM_RISK_MANAGEMENT}>
              Risk Management Plan
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Icon icon="iconoir:slash" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Create</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <button
        onClick={goBack}
        className="w-[3rem] aspect-square rounded-full drop-shadow-md bg-white flex items-center justify-center"
      >
        <LongArrowLeft />
      </button>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="space-y-5 py-5">
            <FormInput
              name="impact_description"
              label="Risk Number Name"
              placeholder="Enter Risk Number"
            />
            <FormSelect
              name="risk_category"
              label="Risk Category"
              placeholder="Select Risk Category"
              required
            >
              <SelectContent>
                {isLoading ? (
                  <LoadingSpinner />
                ) : (
                  data?.map((value: RiskCategoriesResultsData) => (
                    <SelectItem key={value?.id} value={value?.id}>
                      {value?.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </FormSelect>
            <FormTextArea name="risk_description" label="Risk Description" />

            <FormSelect
              placeholder="Select risk owner"
              name="risk_owner"
              label="Risk Owner"
              required
            >
              <SelectContent>
                {departmentQueryResults?.isLoading ? (
                  <LoadingSpinner />
                ) : (
                  departmentQueryResults?.data?.map(
                    (value: DepartmentsResultsData) => (
                      <SelectItem key={value?.id} value={value?.id}>
                        {value?.name}
                      </SelectItem>
                    )
                  )
                )}
              </SelectContent>
            </FormSelect>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <FormSelect
                name="impact_level"
                label="Impact Level"
                placeholder="select a level"
                required
              >
                <SelectContent>
                  {["Very low", "Low", "Medium", "High", "Very high"].map(
                    (value: string, index: number) => (
                      <SelectItem key={index} value={value}>
                        {value}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </FormSelect>
              <FormSelect
                name="occurrence_probability"
                label="Probability of Occurrence"
                placeholder="select a level"
                required
              >
                <SelectContent>
                  {["Very low", "Low", "Medium", "High", "Very high"].map(
                    (value: string, index: number) => (
                      <SelectItem key={index} value={value}>
                        {value}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </FormSelect>
              <FormSelect
                name="total_risk_response"
                label="Total Risk on Response"
                placeholder="select a level"
                required
              >
                <SelectContent>
                  {["Very low", "Low", "Medium", "High", "Very high"].map(
                    (value: any, index: number) => (
                      <SelectItem key={index} value={value}>
                        {value}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </FormSelect>
            </div>

            <FormTextArea name="risk_response" label="Risk Response" />
            <FormInput
              name="implementation_timeline"
              label="Implementation Timeline"
            />
            <FormSelect
              name="risk_status"
              label="Risk Status"
              placeholder="select a status"
              required
            >
              <SelectContent>
                {["Open", "Closed", "Completed/Mitigated"].map(
                  (value: string, index: number) => (
                    <SelectItem key={index} value={value}>
                      {value}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </FormSelect>
          </Card>

          <div className="flex justify-end gap-5 mt-16">
            <Button className="bg-[#FFF2F2] text-primary dark:text-gray-500">
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateRickManagement;
