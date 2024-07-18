import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelectField";
import FormTextArea from "atoms/FormTextArea";
import LongArrowLeft from "components/icons/LongArrowLeft";
import Card from "components/shared/Card";
import { LoadingSpinner } from "components/shared/Loading";
import { Form } from "components/ui/form";
import { SelectContent, SelectItem } from "components/ui/select";
import { RouteEnum } from "constants/RouterConstants";
import { StakeholderManagementSchema } from "definations/program-validator";
import { PartnerResultsData } from "definations/project-types/partners";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import StateAPI from "services/configs/state";
import StakeholderManagementAPI from "services/programsApi/stakeholder-management";
import partnersAPi from "services/projectsApi/partnersApi";
import { toast } from "sonner";
import { z } from "zod";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "components/ui/breadcrumb";
import { Icon } from "@iconify/react";
import { useEffect } from "react";

const EditRegister = () => {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };
  const { id } = useParams();

  const { data, isLoading: mgtLoading } =
    StakeholderManagementAPI.useGetStakeholderManagementQuery({
      path: { id: id as string },
    });
  const stateResultQuery = StateAPI.useGetStatesQuery();
  const states = stateResultQuery?.data;
  const partnerResultQuery = partnersAPi.useGetPartnersQuery({});
  const partners = partnerResultQuery?.data?.results;
  const [updateStakeholderManagementMutation, { isLoading }] =
    StakeholderManagementAPI.useModifyStakeholderManagementMutation();

  const form = useForm<z.infer<typeof StakeholderManagementSchema>>({
    resolver: zodResolver(StakeholderManagementSchema),
    defaultValues: {
      stakeholder_name: "",
      institution_organization: "",
      physical_office_address: "",
      state: "",
      gender: "",
      designation: "",
      phone_number: "",
      email: "",
    },
  });

  const { handleSubmit, setValue } = form;

  useEffect(() => {
    if (data) {
      setValue("stakeholder_name", data?.stakeholder_name),
        setValue("institution_organization", data?.institution_organization),
        setValue("physical_office_address", data?.physical_office_address),
        setValue("state", data?.state),
        setValue("gender", data?.gender),
        setValue("designation", data?.designation),
        setValue("phone_number", data?.phone_number),
        setValue("email", data?.email);
    }
  }, [data]);

  const onSubmit = async (
    data: z.infer<typeof StakeholderManagementSchema>
  ) => {
    console.log(data);

    try {
      await updateStakeholderManagementMutation({
        path: { id: id as string },
        body: data,
      }).unwrap();
      toast.success("Stakeholder successfully updated.");
      navigate(RouteEnum.PROGRAM_STAKEHOLDER_MANAGEMENT_REGISTER);
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  };

  return (
    <div className="space-y-6 min-h-screen">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Plans</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Icon icon="iconoir:slash" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Stakeholder</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Icon icon="iconoir:slash" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Stakeholder Register</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Icon icon="iconoir:slash" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Edit</BreadcrumbPage>
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
          <Card className="space-y-10 p-10">
            {mgtLoading && <LoadingSpinner />}
            <FormInput
              name="stakeholder_name"
              label="Stakeholder Name"
              required
            />
            <FormSelect
              name="institution_organization"
              label="Institution/Organization"
              required
            >
              <SelectContent>
                {partnerResultQuery?.isLoading ? (
                  <LoadingSpinner />
                ) : (
                  partners?.map((partner: PartnerResultsData) => (
                    <SelectItem value={partner.id} key={partner.id}>
                      {partner.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </FormSelect>
            <FormTextArea
              name="physical_office_address"
              label="Physical Office Address"
            />
            <FormSelect
              name="state"
              label="State"
              placeholder="Select state"
              required
            >
              <SelectContent>
                {stateResultQuery?.isLoading ? (
                  <LoadingSpinner />
                ) : (
                  states?.map((state: string, index: number) => (
                    <SelectItem value={state} key={index}>
                      {state}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </FormSelect>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <FormInput name="designation" label="Designation" />
              <FormSelect name="gender" label="Gender">
                <SelectContent>
                  {["Male", "Female"].map((gender: string, index: number) => (
                    <SelectItem value={gender} key={index}>
                      {gender}
                    </SelectItem>
                  ))}
                </SelectContent>
              </FormSelect>
            </div>
            <FormInput name="phone_number" label="Phone Number" />
            <FormInput name="email" label="E-Mail" />
          </Card>

          <div className="flex justify-end gap-5 pt-10">
            <FormButton
              onClick={goBack}
              type="button"
              className="bg-[#FFF2F2] text-primary dark:text-gray-500"
            >
              Cancel
            </FormButton>

            <FormButton loading={isLoading} disabled={isLoading}>
              Create
            </FormButton>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditRegister;
