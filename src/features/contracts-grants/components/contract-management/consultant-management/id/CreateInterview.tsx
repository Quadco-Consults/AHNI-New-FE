"use client";

import { skipToken } from "@reduxjs/toolkit/query";
import BackNavigation from "components/atoms/BackNavigation";
import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelectField";
import Card from "components/Card";
import { Button } from "components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "components/ui/form";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { useGetSingleConsultantManagement } from "@/features/contracts-grants/controllers/consultantManagementController";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
  DialogDescription,
  DialogClose,
} from "components/ui/dialog";
import { LoadingSpinner } from "components/Loading";
import { Input } from "components/ui/input";
import { Icon } from "@iconify/react";
import { Checkbox } from "components/ui/checkbox";
import { useGetAllSolicitations } from "@/features/procurement/controllers/solicitationController";
import { useGetAllUsers } from "@/features/auth/controllers/userController";
import { Badge } from "components/ui/badge";
import { toast } from "sonner";
import { useCreateContractInterview } from "@/features/contracts-grants/controllers/contractController";
import { useGetAllConsultancyStaffs } from "@/features/contracts-grants/controllers/consultantManagementController";

export default function CreateInterview() {
  const router = useRouter();

  const params = useParams();
  const applicantId = params?.id as string;

  const { data } = useGetSingleConsultantManagement(
    applicantId || skipToken
  );

  const { data: applicants } = useGetAllConsultancyStaffs({
    page: 1,
    size: 100000000,
    search: applicantId || "",
    enabled: !!applicantId,
  });
  const { data: users } = useGetAllUsers({
    page: 1,
    size: 2000000,
  });

  console.log({ applicants: applicants?.data?.results });

  const { createContractInterview, isLoading } = useCreateContractInterview();

  const form = useForm({
    defaultValues: {
      consultancy: data?.data.title || "",
      interview_type: "",
      interview_date: "",
      committee_members: [],
    },
  });

  useEffect(() => {
    if (data?.data?.title) {
      form.setValue('consultancy', data.data.title);
      console.log('Setting consultancy title:', data.data.title);
    }
  }, [data, form]);

  const { handleSubmit, watch } = form;

  const matchedUsers =
    users?.data?.results?.filter((user) =>
      // @ts-ignore
      form.watch("committee_members")?.includes(user?.id)
    ) || [];

  const onSubmit = async (interview_data: any) => {
    const interviewData = {
      consultancy: data?.data.id,
      interview_type: interview_data.interview_type,
      interview_date: interview_data.interview_date,
      committee_members:
        watch("interview_type") === "COMMITTEE"
          ? interview_data.committee_members
          : [],
      applicants:
        applicants?.data?.results?.map((applicant) => applicant.id) || [],
    };

    try {
      await createContractInterview(interviewData as any);
      toast.success("Successfully created.");
      // router.push(RouteEnum.COMPETITIVE_BID_ANALYSIS);
      router.back();
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  };

  return (
    <section>
      <BackNavigation />

      <Card>
        <Form {...form}>
          <form className='space-y-10' onSubmit={handleSubmit(onSubmit)}>
            <FormInput
              label='Consultancy'
              name='consultancy'
              placeholder='Select Consultancy'
              required
              disabled
            />

            <div className='grid grid-cols-2 gap-10'>
              <FormSelect
                label='Interview Type'
                name='interview_type'
                placeholder='Select type'
                required
                options={[
                  { label: "COMMITTEE", value: "COMMITTEE" },
                  {
                    label: "Non-COMMITTEE",
                    value: "NON_COMMITTEE",
                  },
                ]}
              />

              <FormInput
                type='date'
                label='Interview Date'
                name='interview_date'
                required
              />
            </div>

            {/* <Button
              variant='outline'
              size='lg'
              className='text-[#DEA004] border-[#DEA004] border-solid '
            >
              Select Committes
            </Button> */}

            {watch("interview_type") === "COMMITTEE" && (
              <div className='flex items-center gap-2 flex-wrap'>
                <div className='flex items-center gap-2 flex-wrap'>
                  {matchedUsers?.map((user) => (
                    <Badge
                      key={user?.id}
                      className='py-2 rounded-lg bg-[#EBE8E1] text-black'
                    >
                      {user?.first_name} {user?.last_name}
                    </Badge>
                  ))}
                </div>
                <div>
                  <Dialog>
                    <DialogTrigger>
                      <div className='text-[#DEA004] font-medium border shadow-sm py-2 px-5 rounded-lg text-sm'>
                        Click to select team members to make up the committee
                      </div>
                    </DialogTrigger>
                    <DialogContent className='max-w-6xl max-h-[700px] overflow-auto'>
                      <DialogHeader className='mt-10 space-y-5 text-center'>
                        {/* <img
                        src={logoPng}
                        alt='logo'
                        className='mx-auto'
                        width={150}
                      /> */}
                        <DialogTitle className='text-2xl text-center'>
                          Team Members
                        </DialogTitle>
                        <DialogDescription className='text-center'>
                          Please select all team members needed to make up the
                          committee
                        </DialogDescription>
                      </DialogHeader>
                      <div className='flex justify-center'>
                        <div className='flex items-center w-1/2 px-4 py-2 border rounded-lg'>
                          <Input
                            placeholder='Search team members'
                            //   value={categorySearchParams}
                            //   onChange={(e) => setCategorySearchParams(e.target.value)}
                            type='search'
                            className='h-6 border-none bg-none'
                          />
                          <Icon icon='iconamoon:search-light' fontSize={25} />
                        </div>
                      </div>

                      <div className='space-y-5 '>
                        {isLoading ? (
                          <LoadingSpinner />
                        ) : (
                          <FormField
                            control={form.control}
                            name='committee_members'
                            render={() => (
                              <FormItem className='grid grid-cols-2 gap-5 bg-gray-100 mt-10 p-5 rounded-lg shadow-inner md:grid-cols-4'>
                                {users?.data?.results?.map((user) => (
                                  <FormField
                                    key={user?.id}
                                    control={form.control}
                                    name='committee_members'
                                    render={({ field }) => {
                                      return (
                                        <FormItem
                                          key={user.id}
                                          className='space-y-3 bg-white rounded-lg text-xs p-5'
                                        >
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value?.includes(
                                                // @ts-ignore
                                                user?.id
                                              )}
                                              onCheckedChange={(checked) => {
                                                return checked
                                                  ? field.onChange([
                                                      ...field.value,
                                                      user?.id,
                                                    ])
                                                  : field.onChange(
                                                      field.value?.filter(
                                                        (value) =>
                                                          value !== user?.id
                                                      )
                                                    );
                                              }}
                                            />
                                          </FormControl>
                                          <div className='space-y-4'>
                                            <div className='flex items-center'>
                                              <h6 className='w-24'>Name:</h6>
                                              <h6>
                                                {user?.first_name}{" "}
                                                {user?.last_name}
                                              </h6>
                                            </div>
                                            <div className='flex items-center'>
                                              <h6 className='w-24'>
                                                Position:
                                              </h6>
                                              <h6>{user?.designation}</h6>
                                            </div>
                                            <div className='flex items-center'>
                                              <h6 className='w-24'>Tel:</h6>
                                              {/* @ts-ignore */}
                                              <h6>{user?.phone_number}</h6>
                                            </div>
                                          </div>
                                        </FormItem>
                                      );
                                    }}
                                  />
                                ))}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

                        <div className='flex justify-end'>
                          <div className='flex gap-4 items-center'>
                            <h6 className='text-primary'>
                              {watch("committee_members")?.length} members
                              Selected
                            </h6>
                            <DialogClose>
                              <div className='flex items-center bg-primary text-primary-foreground rounded-md text-sm font-medium h-11 px-4 py-3 hover:opacity-60'>
                                Save & Continue
                              </div>
                            </DialogClose>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            )}
            <div className='flex items-center justify-between'>
              <Button variant='outline' size='lg'>
                Cancel
              </Button>

              <FormButton size='lg' type='submit'>
                Submit
              </FormButton>
            </div>
          </form>
        </Form>
      </Card>
    </section>
  );
}
