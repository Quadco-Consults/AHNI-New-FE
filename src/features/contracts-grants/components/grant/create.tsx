"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { skipToken } from "@reduxjs/toolkit/query";
import BackNavigation from "components/atoms/BackNavigation";
import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelect";
import Card from "components/Card";
import { CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { CG_ROUTES } from "constants/RouterConstants";
import { GrantSchema, TGrantFormData } from "features/contracts-grants/types/grants";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useCreateGrant,
  useGetSingleGrant,
  useModifyGrant,
} from "@/features/contracts-grants/controllers/grantController";
import { useGetAllProjects } from "@/features/projects/controllers/projectController";
import { toast } from "sonner";

const awardTypeOptions = [
  { label: "CO_OPERATIVE_AGREEMENT", value: "CO_OPERATIVE_AGREEMENT" },
  { label: "CONTRACT", value: "CONTRACT" },
  { label: "IDQ", value: "IDQ" },
];

export default function CreateGrant() {
  const form = useForm<TGrantFormData>({
    resolver: zodResolver(GrantSchema),
    defaultValues: {
      // name: "",
      // grant_id: "",
      award_type: "",
      // award_amount: "",
      reference_number: "",
      project_id: "",
    },
  });

  const searchParams = useSearchParams();
  const id = searchParams?.get("id");

  const router = useRouter();

  const { data: project } = useGetAllProjects({
    page: 1,
    size: 2000000,
  });

  //     () =>
  //       project?.data.results.map(({ title, id }) => ({
  //         label: title,
  //         value: id,
  //       })),
  //     [project]
  //   );

  const { createGrant, isLoading: isCreateLoading } =
    useCreateGrant();

  const { modifyGrant, isLoading: isModifyLoading } =
    useModifyGrant(id || "");

  const onSubmit: SubmitHandler<TGrantFormData> = async (data) => {
    try {
      if (id) {
        await modifyGrant(data);
        toast.success("Grant Updated Successfully");
      } else {
        await createGrant(data);
        toast.success("Grant Created Successfully");
      }

      router.push(CG_ROUTES.GRANT);
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Something went wrong");
    }
  };

  const { data: grant } = useGetSingleGrant(id ?? skipToken);

  useEffect(() => {
    if (grant) {
      form.reset({
        // @ts-ignore
        // project: grant?.data?.project?.id || "",
        award_type: grant?.data.award_type,
        // award_amount: grant?.data.award_amount,
        // @ts-ignore
        project_id: project?.data.results.project_id,
        reference_number: grant?.data.reference_number,
      });
    }
  }, [grant, project, form]);

  return (
    <Card>
      <BackNavigation extraText={grant ? "Update Grant" : "New Grant"} />
      <CardContent>
        <Form {...form}>
          <form className='space-y-5' onSubmit={form.handleSubmit(onSubmit)}>
            <div className='grid grid-cols-2 gap-8'>
              {/* <FormInput
                name='name'
                label='Grant Name'
                placeholder='Enter Grant Name'
                required
              />

              <FormInput
                name='grant_id'
                label='Grant ID'
                placeholder='Enter Grant ID'
                required
              /> */}

              <FormSelect
                name='award_type'
                label='Award Type'
                required={true}
                options={awardTypeOptions}
                placeholder='Select Award type'
              />

              {/* <FormInput
                name='award_amount'
                label='Award Amount'
                type='number'
                required={true}
                placeholder='Enter Award Amount'
              /> */}

              <FormInput
                label='Agreement/Contract Reference Number'
                name='reference_number'
                type='number'
                placeholder='Enter Reference Number'
                required={true}
              />
            </div>
            <div className='flex justify-end'>
              <FormButton
                size='lg'
                loading={isCreateLoading || isModifyLoading}
                disabled={isCreateLoading || isModifyLoading}
              >
                Submit
              </FormButton>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
