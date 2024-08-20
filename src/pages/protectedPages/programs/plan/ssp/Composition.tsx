import { useLocation, useNavigate } from "react-router-dom";
import SupportiveSupervisionPlanLayout from "./SupportiveSupervisionPlanLayout";
import { Form, FormControl, FormField, FormItem } from "components/ui/form";
import { useForm } from "react-hook-form";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelectField";
import { ChevronRight } from "lucide-react";
import FormButton from "atoms/FormButton";
import { Button } from "components/ui/button";
import Card from "components/shared/Card";
import { Label } from "components/ui/label";
import FacilityAPI from "services/programsApi/facilities";
import { SelectContent, SelectItem } from "components/ui/select";
import { LoadingSpinner } from "components/shared/Loading";
import MultiSelectFormField from "components/ui/sspmultiselect";
import usersAPI from "services/usersAPI";
import { useMemo } from "react";

const Composition = () => {
  const { data, isLoading } = FacilityAPI.useGetFacilitiesQuery();
  const { data: usersData } = usersAPI.useGetUsersQuery(
    useMemo(
      () => ({
        params: {
          // fields: "id,name",
          no_paginate: true,
          // page_size: pagination.pageSize,
          // page: pagination.pageIndex + 1,
        },
      }),
      []
    )
  );

  const form = useForm({
    defaultValues: {
      facility: "",
      month: "",
      year: "",
      date_visit_day: "",
      date_visit_month: "",
      date_visit_year: "",
      team_members: [],
    },
  });

  const { data: facilityData } = FacilityAPI.useGetFacilityQuery({
    path: { id: form.watch("facility") as string },
  });

  const navigate = useNavigate();

  const { pathname } = useLocation();

  const { handleSubmit } = form;

  const onSubmit = (data: any) => {
    const formData = {
      facility: data?.facility,
      month_year: `${data?.month}/${data?.year}`,
      date_of_visit: `${data?.date_visit_year}-${data?.date_visit_month}-${data?.date_visit_day}`,
      status: "Pending",
      team_members: data?.team_members,
    };

    localStorage.setItem("compositionData", JSON.stringify(formData));

    let path = pathname;

    path = path.substring(0, path.lastIndexOf("/"));

    path += "/evolution-checklist";
    navigate(path);
  };

  return (
    <SupportiveSupervisionPlanLayout>
      <div className="px-3 ">
        <h2 className="text-lg font-bold">Facility & Team Composition</h2>
        <div className="mt-10">
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-5">
                <FormSelect name="facility" label="Facility" placeholder="Select facility" required>
                  <SelectContent>
                    {isLoading ? (
                      <LoadingSpinner />
                    ) : (
                      data?.map((value: any) => (
                        <SelectItem key={value?.id} value={value?.id}>
                          {value?.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </FormSelect>

                {facilityData?.id && (
                  <Card className="border-yellow-600 space-y-3">
                    <div className="flex items-center gap-5">
                      <h4 className="w-1/6 font-medium">State :</h4>
                      <h4>{facilityData?.state}</h4>
                    </div>
                    <div className="flex items-center gap-5">
                      <h4 className="w-1/6 font-medium">LGA :</h4>
                      <h4>{facilityData?.local_govt}</h4>
                    </div>
                  </Card>
                )}

                {facilityData?.id && (
                  <div className="space-y-1">
                    <Label>Facility Contact Person</Label>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      {facilityData?.facility_contacts?.map((facility) => (
                        <Card key={facility?.id} className="border-yellow-600 space-y-3">
                          <div className="flex items-center gap-5">
                            <h4 className="w-1/3 font-medium">Contact Person :</h4>
                            <h4>{facility?.name}</h4>
                          </div>
                          <div className="flex items-center gap-5">
                            <h4 className="w-1/3 font-medium">Position :</h4>
                            <h4>{facility?.position}</h4>
                          </div>
                          <div className="flex items-center gap-5">
                            <h4 className="w-1/3 font-medium">tel :</h4>
                            <h4>{facility?.phone_number}</h4>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <Label>Month/Year</Label>
                  <div className="grid grid-cols-2 w-1/3 col-span-3 gap-x-6 ">
                    <FormInput type="number" name="month" placeholder="MM" />
                    <FormInput type="number" name="year" placeholder="YYYY" />
                  </div>
                </div>

                <hr />

                <h2 className="text-yellow-600">Team Members</h2>

                <FormField
                  control={form.control}
                  name="team_members"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <MultiSelectFormField options={usersData || []} defaultValue={field.value} onValueChange={field.onChange} placeholder="Select team members" variant="inverted" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <hr />

                <div className="space-y-1">
                  <Label>Date of Visit</Label>
                  <div className="grid grid-cols-3 w-1/3 col-span-3 gap-x-6 ">
                    <FormInput type="number" name="date_visit_day" placeholder="DD" />
                    <FormInput type="number" name="date_visit_month" placeholder="MM" />
                    <FormInput type="number" name="date_visit_year" placeholder="YYYY" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-5 mt-16">
                <Button type="button" className="bg-[#FFF2F2] text-primary dark:text-gray-500">
                  Cancel
                </Button>
                <FormButton type="submit" suffix={<ChevronRight size={14} />}>
                  Next
                </FormButton>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </SupportiveSupervisionPlanLayout>
  );
};

export default Composition;
