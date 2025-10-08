"use client";

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
import { useGetAllUsers } from "@/features/auth/controllers/userController";
import { Badge } from "components/ui/badge";
import { toast } from "sonner";
import { useCreateContractInterview } from "@/features/contracts-grants/controllers/contractController";
import { useGetAllConsultancyStaffs } from "@/features/contracts-grants/controllers/consultantManagementController";
import { filterAhniStaffOnly } from "@/utils/userFilters";
import { useGetEmployeeOnboardings } from "@/features/hr/controllers/employeeOnboardingController";

export default function CreateInterview() {
  const router = useRouter();

  const params = useParams();
  const applicantId = params?.id as string;

  const { data } = useGetSingleConsultantManagement(
    applicantId || "",
    !!applicantId
  );

  const { data: applicants } = useGetAllConsultancyStaffs({
    page: 1,
    size: 100000000,
    search: applicantId || "",
    enabled: !!applicantId,
  });
  // Fetch from both sources: Users table AND Employee database
  const { data: users, isLoading: isUsersLoading, error: usersError } = useGetAllUsers({
    page: 1,
    size: 2000000,
    enabled: true,
  });

  const { data: employeeData, isLoading: isEmployeesLoading } = useGetEmployeeOnboardings({
    page: 1,
    size: 2000000,
  });

  console.log('🔍 Raw data sources:', {
    users: users?.results?.length || 0,
    employees: employeeData?.data?.results?.length || 0,
    usersLoading: isUsersLoading,
    employeesLoading: isEmployeesLoading,
  });

  // Combine users from both sources
  const allStaff = [
    // Users from user table (filter to exclude vendors)
    ...filterAhniStaffOnly((users?.results || []) as any[]),
    // Employees from employee database (all are AHNI staff)
    ...((employeeData?.data?.results || []) as any[]).map((emp: any) => ({
      id: emp.id,
      first_name: emp.legal_firstname || emp.first_name,
      last_name: emp.legal_lastname || emp.last_name,
      email: emp.email,
      user_type: 'STAFF',
      designation: emp.designation?.name || emp.position,
      department: emp.department?.name,
      phone_number: emp.phone_number || emp.mobile_number,
      is_staff: true,
      _source: 'employee_database'
    }))
  ];

  // Remove duplicates based on email
  const uniqueStaff = allStaff.reduce((acc: any[], current: any) => {
    const exists = acc.find(item => item.email === current.email);
    if (!exists) {
      acc.push(current);
    }
    return acc;
  }, []);

  const ahniStaffUsers = uniqueStaff;

  console.log('👥 Combined AHNI staff:', {
    fromUsers: filterAhniStaffOnly((users?.results || []) as any[]).length,
    fromEmployees: employeeData?.data?.results?.length || 0,
    combined: allStaff.length,
    afterDedup: ahniStaffUsers.length,
    sampleStaff: ahniStaffUsers.slice(0, 3).map((s: any) => ({
      name: `${s.first_name} ${s.last_name}`,
      email: s.email,
      source: s._source || 'users_table'
    }))
  });

  const { createContractInterview, isLoading: isCreating } = useCreateContractInterview();

  const form = useForm({
    defaultValues: {
      consultancy: "",
      interview_type: "",
      interview_date: "",
      committee_members: [],
    },
  });

  useEffect(() => {
    if (data?.data) {
      // Ensure consultancy title is always a string
      const titleData: any = data.data.title;
      const consultancyTitle = typeof titleData === 'object' && titleData !== null
        ? titleData?.name || titleData?.title || 'Unknown Consultancy'
        : titleData || 'Unknown Consultancy';

      form.setValue('consultancy', consultancyTitle);
      console.log('Setting consultancy title:', consultancyTitle);
    }
  }, [data, form]);

  const { handleSubmit, watch } = form;

  const matchedUsers =
    ahniStaffUsers?.filter((user: any) =>
      (form.watch("committee_members") as string[])?.includes(user?.id)
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
                  {matchedUsers?.map((user: any) => {
                    // Ensure user names are strings, not objects
                    const firstName = typeof user?.first_name === 'object'
                      ? user?.first_name?.name || 'Unknown'
                      : user?.first_name || 'Unknown';
                    const lastName = typeof user?.last_name === 'object'
                      ? user?.last_name?.name || ''
                      : user?.last_name || '';

                    return (
                      <Badge
                        key={user?.id}
                        className='py-2 rounded-lg bg-[#EBE8E1] text-black'
                      >
                        {firstName} {lastName}
                      </Badge>
                    );
                  })}
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
                        {isUsersLoading ? (
                          <div className='flex flex-col items-center justify-center py-10'>
                            <LoadingSpinner />
                            <p className='mt-4 text-gray-600'>Loading team members...</p>
                          </div>
                        ) : usersError ? (
                          <div className='flex flex-col items-center justify-center py-10'>
                            <p className='text-red-600'>Error loading users: {String(usersError)}</p>
                          </div>
                        ) : ahniStaffUsers?.length === 0 ? (
                          <div className='flex flex-col items-center justify-center py-10'>
                            <p className='text-gray-600'>No team members available</p>
                          </div>
                        ) : (
                          <FormField
                            control={form.control}
                            name='committee_members'
                            render={() => (
                              <FormItem className='grid grid-cols-1 gap-5 bg-gray-100 mt-10 p-5 rounded-lg shadow-inner md:grid-cols-2'>
                                {ahniStaffUsers?.map((user: any) => (
                                  <FormField
                                    key={user?.id}
                                    control={form.control}
                                    name='committee_members'
                                    render={({ field }) => {
                                      return (
                                        <FormItem
                                          key={user.id}
                                          className='space-y-3 bg-white rounded-lg text-xs p-4 shadow-sm border'
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
                                          <div className='space-y-3'>
                                            <div className='flex items-start'>
                                              <h6 className='w-20 text-gray-600 font-medium'>Name:</h6>
                                              <h6 className='font-semibold'>
                                                {typeof user?.first_name === 'object' ? user?.first_name?.name || 'Unknown' : user?.first_name || 'Unknown'}{" "}
                                                {typeof user?.last_name === 'object' ? user?.last_name?.name || '' : user?.last_name || ''}
                                              </h6>
                                            </div>
                                            <div className='flex items-start'>
                                              <h6 className='w-20 text-gray-600 font-medium'>Email:</h6>
                                              <h6 className='break-all'>{user?.email || 'N/A'}</h6>
                                            </div>
                                            <div className='flex items-start'>
                                              <h6 className='w-20 text-gray-600 font-medium'>Position:</h6>
                                              <h6>{
                                                typeof user?.designation === 'object'
                                                  ? user?.designation?.name || user?.designation?.title || 'N/A'
                                                  : user?.designation ||
                                                    (typeof user?.position === 'object'
                                                      ? user?.position?.name || user?.position?.title || 'N/A'
                                                      : user?.position) || 'N/A'
                                              }</h6>
                                            </div>
                                            <div className='flex items-start'>
                                              <h6 className='w-20 text-gray-600 font-medium'>Phone:</h6>
                                              <h6>{user?.phone_number || 'N/A'}</h6>
                                            </div>
                                            <div className='flex items-start'>
                                              <h6 className='w-20 text-gray-600 font-medium'>Department:</h6>
                                              <h6>{
                                                typeof user?.department === 'object'
                                                  ? user?.department?.name || user?.department?.title || 'N/A'
                                                  : user?.department || 'N/A'
                                              }</h6>
                                            </div>
                                            <div className='flex items-start'>
                                              <h6 className='w-20 text-gray-600 font-medium'>Organization:</h6>
                                              <h6>{user?.organization || user?.company || 'AHNI'}</h6>
                                            </div>
                                            {user?.user_type && (
                                              <div className='flex items-start'>
                                                <h6 className='w-20 text-gray-600 font-medium'>Type:</h6>
                                                <span className='px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs'>
                                                  {user?.user_type}
                                                </span>
                                              </div>
                                            )}
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
