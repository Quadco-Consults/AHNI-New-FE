import { useLocation, useNavigate } from "react-router-dom";
import { Form } from "components/ui/form";
import { useForm } from "react-hook-form";
import FormSelect from "atoms/FormSelectField";
import { ChevronRight } from "lucide-react";
import FormButton from "atoms/FormButton";
import { Button } from "components/ui/button";
import Card from "components/shared/Card";
import { Label } from "components/ui/label";
import FundRequstLayout from "./FundRequstLayout";
import { SelectContent, SelectItem } from "components/ui/select";
import projectsAPi from "services/projectsApi/projectsApi";
import partnersAPi from "services/projectsApi/partnersApi";
import { LoadingSpinner } from "components/shared/Loading";
import { ProjectsResultsData } from "definations/project-types/projects";
import { PartnerResultsData } from "definations/project-types/partners";
import { z } from "zod";
import { FundRequestDetailSchema } from "definations/program-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import FinancialAPI from "services/configs/financial-year";
import { FinancialYearResultsData } from "definations/configs/financial-year";
import { useLocationQuery } from "services/moduleProjects";
import _ from "lodash";
import { useGetUserQuery } from "services/users";

const getYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const startYear = 2012;
  return new Array(currentYear - startYear + 1).fill(_).map((_, i) => {
    const value = currentYear - i;
    return `${value}`;
  });
};

const getMonthOptions = () => {
  const monthsArr = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const months = monthsArr.map((month, index) => ({
    label: month,
    value: index < 9 ? `0${index + 1}` : `${index + 1}`
  }));

  return months;
};

const CreateFundRequest = () => {
  const form = useForm<z.infer<typeof FundRequestDetailSchema>>({
    resolver: zodResolver(FundRequestDetailSchema),
    defaultValues: {
      project: "",
      partner: "",
      year: "",
      month: "",
      currency: "",
      type: "",
      financial_year: "",
    },
  });

  const navigate = useNavigate();

  const { pathname } = useLocation();

  const { data: projects, isLoading: projectIsLoading } =
    projectsAPi.useGetProjectsQuery({});
  const { data: partners, isLoading: partnerIsLoading } =
    partnersAPi.useGetPartnersQuery({});
  const { data: financialYear, isLoading: financialYearLoading } =
    FinancialAPI.useGetFinancialYearsQuery({
      params: { no_paginate: true },
    });
  const { data: locations, isLoading: isLoadingLcation } = useLocationQuery({});
  const { data: users, isLoading: isLoadingUsers } = useGetUserQuery({});

  const { handleSubmit } = form;

  const onSubmit = (data: z.infer<typeof FundRequestDetailSchema>) => {
    const formData = {
      project: data.project,
      partner: data.partner,
      month_year: `${data.month}/${data.year}`,
      currency: data.currency,
      type: data.type,
      financial_year: data.financial_year,
    };

    localStorage.setItem("projectFundRequest", JSON.stringify(formData));

    let path = pathname;

    path = path.substring(0, path.lastIndexOf("/"));

    path += "/fund-request-summary";
    navigate(path);
  };

  return (
    <FundRequstLayout>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="space-y-10 py-5">
            <FormSelect
              name="project"
              label="Project Name"
              placeholder="Select Project"
              required
            >
              <SelectContent>
                {projectIsLoading ? (
                  <LoadingSpinner />
                ) : (
                  projects?.results?.map((project: ProjectsResultsData) => (
                    <SelectItem key={project?.id} value={project.id}>
                      {project.title}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </FormSelect>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="-mt-2">
                <Label>Financial Month</Label>
                <div className="grid grid-cols-2 gap-3 items-center">
                <FormSelect name="month" placeholder="Select month">
                    <SelectContent>
                      {getMonthOptions().map(({label, value}) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </FormSelect>
                  <FormSelect name="year" placeholder="Select year">
                    <SelectContent>
                      {getYearOptions().map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </FormSelect>
                </div>
              </div>

              <FormSelect
                name="partner"
                label="Partner"
                placeholder="Select Partner"
                required
              >
                <SelectContent>
                  {partnerIsLoading ? (
                    <LoadingSpinner />
                  ) : (
                    partners?.results?.map((partner: PartnerResultsData) => (
                      <SelectItem key={partner?.id} value={partner.id}>
                        {partner.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </FormSelect>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <FormSelect
                name="currency"
                label="Currency"
                placeholder="Select Currency"
                required
              >
                <SelectContent>
                  {["NGN", "USD"].map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </FormSelect>

              <FormSelect
                name="type"
                label="Type"
                placeholder="Select Type"
                required
              >
                <SelectContent>
                  {["Main", "Supplementary"].map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </FormSelect>
              <FormSelect
                name="financial_year"
                label="Financial Year"
                placeholder="Select year"
                required
              >
                <SelectContent>
                  {financialYearLoading ? (
                    <LoadingSpinner />
                  ) : (
                    financialYear?.map((value: FinancialYearResultsData) => (
                      <SelectItem key={value?.id} value={value?.year}>
                        {value?.year}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </FormSelect>
              <FormSelect
                name="locations"
                label="Location"
                placeholder="Select location"
                required
              >
                <SelectContent>
                  {isLoadingLcation ? (
                    <LoadingSpinner />
                  ) : (
                    locations?.results?.map(({ id, name }: any) => (
                      <SelectItem key={id} value={id}>
                        {name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </FormSelect>
              <FormSelect
                name="reviewer"
                label="Reviewer"
                placeholder="Select reviewer"
                required
              >
                <SelectContent>
                  {isLoadingUsers ? (
                    <LoadingSpinner />
                  ) : (
                    users?.results?.map(({ id, first_name, last_name }: any) => (
                      <SelectItem key={id} value={id}>
                        {first_name} {last_name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </FormSelect>
            </div>
          </Card>

          <div className="flex justify-end gap-5 mt-16">
            <Button
              type="button"
              className="bg-[#FFF2F2] text-primary dark:text-gray-500"
            >
              Cancel
            </Button>
            <FormButton type="submit" suffix={<ChevronRight size={14} />}>
              Next
            </FormButton>
          </div>
        </form>
      </Form>
    </FundRequstLayout>
  );
};

export default CreateFundRequest;
