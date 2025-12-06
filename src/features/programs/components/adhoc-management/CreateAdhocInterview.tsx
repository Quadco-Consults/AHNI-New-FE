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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { useGetSingleAdhocAdvertisement } from "@/features/programs/controllers/adhocAdvertisementController";
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
import { Search } from 'lucide-react';
import { Icon } from "@iconify/react";
import { Checkbox } from "components/ui/checkbox";
import { useGetAllUsers } from "@/features/auth/controllers/userController";
import { Badge } from "components/ui/badge";
import { toast } from "sonner";
import { useCreateAdhocInterview } from "@/features/programs/controllers/adhocInterviewController";
import { useGetApplicantsByAdvertisement } from "@/features/programs/controllers/adhocApplicantController";
import { filterAhniStaffOnly } from "@/utils/userFilters";
import { useGetEmployeeOnboardings } from "@/features/hr/controllers/employeeOnboardingController";

export default function CreateAdhocInterview() {
  const router = useRouter();
  const params = useParams();
  const advertisementId = params?.id as string;

  const [searchTerm, setSearchTerm] = useState("");

  const { data: advertisementData } = useGetSingleAdhocAdvertisement(
    advertisementId || "",
    !!advertisementId
  );

  const { data: applicantsData } = useGetApplicantsByAdvertisement(
    advertisementId || "",
    {
      page: 1,
      size: 100000000,
      enabled: !!advertisementId,
    }
  );

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

  // Extract users results from nested structure
  const usersResults = (users?.data?.results || users?.results || []) as any[];

  console.log('🔍 Raw data sources:', {
    users: usersResults.length,
    employees: employeeData?.data?.results?.length || 0,
    usersLoading: isUsersLoading,
    employeesLoading: isEmployeesLoading,
    usersError: usersError ? String(usersError) : null,
    usersDataStructure: users ? Object.keys(users) : [],
  });

  // Combine users from both sources
  const allStaff = [
    // Users from user table (filter to exclude vendors)
    ...filterAhniStaffOnly(usersResults),
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

  // Remove duplicates based on email (but keep entries with null emails)
  const uniqueStaff = allStaff.reduce((acc: any[], current: any) => {
    // If email is null, always add (can't deduplicate without email)
    if (!current.email) {
      acc.push(current);
      return acc;
    }

    // Otherwise, check for duplicates by email
    const exists = acc.find(item => item.email && item.email === current.email);
    if (!exists) {
      acc.push(current);
    }
    return acc;
  }, []);

  const ahniStaffUsers = uniqueStaff;

  console.log('👥 Combined AHNI staff:', {
    fromUsers: filterAhniStaffOnly(usersResults).length,
    fromEmployees: employeeData?.data?.results?.length || 0,
    combined: allStaff.length,
    afterDedup: ahniStaffUsers.length,
    sampleStaff: ahniStaffUsers.slice(0, 3).map((s: any) => ({
      name: `${s.first_name} ${s.last_name}`,
      email: s.email,
      source: s._source || 'users_table'
    }))
  });

  const { mutateAsync: createAdhocInterview, isPending: isCreating } = useCreateAdhocInterview();

  const form = useForm({
    defaultValues: {
      advertisement: "",
      interview_type: "",
      interview_date: "",
      interviewers: [],
    },
  });

  useEffect(() => {
    if (advertisementData?.data) {
      // Ensure advertisement title is always a string
      const titleData: any = advertisementData.data.title;
      const advertisementTitle = typeof titleData === 'object' && titleData !== null
        ? titleData?.name || titleData?.title || 'Unknown Advertisement'
        : titleData || 'Unknown Advertisement';

      form.setValue('advertisement', advertisementTitle);
      console.log('Setting advertisement title:', advertisementTitle);
    }
  }, [advertisementData, form]);

  const { handleSubmit, watch } = form;

  const matchedUsers =
    ahniStaffUsers?.filter((user: any) =>
      (form.watch("interviewers") as string[])?.includes(user?.id)
    ) || [];

  // Filter users based on search term
  const filteredUsers = ahniStaffUsers?.filter((user: any) => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    const firstName = typeof user?.first_name === 'object'
      ? user?.first_name?.name || ''
      : user?.first_name || '';
    const lastName = typeof user?.last_name === 'object'
      ? user?.last_name?.name || ''
      : user?.last_name || '';
    const email = user?.email || '';
    const fullName = `${firstName} ${lastName}`.toLowerCase();

    return fullName.includes(searchLower) || email.toLowerCase().includes(searchLower);
  });

  const onSubmit = async (interview_data: any) => {
    // Get eligible applicants
    const eligibleApplicants = applicantsData?.data?.results
      ?.filter((applicant: any) =>
        applicant.status === "SHORTLISTED" ||
        applicant.status === "SUBMITTED" ||
        applicant.status === "APPLIED"
      ) || [];

    console.log('📋 Creating AdHoc interviews for applicants:', {
      applicantsCount: eligibleApplicants.length,
      interviewType: interview_data.interview_type,
      interviewDate: interview_data.interview_date,
      interviewersCount: interview_data.interviewers?.length || 0,
    });

    // Validate required fields
    if (!interview_data.interview_type) {
      toast.error("Interview type is required");
      return;
    }

    if (!interview_data.interview_date) {
      toast.error("Interview date is required");
      return;
    }

    if (interview_data.interview_type === "COMMITTEE" && (!interview_data.interviewers || interview_data.interviewers.length === 0)) {
      toast.error("Please select at least one committee member");
      return;
    }

    if (eligibleApplicants.length === 0) {
      toast.error("No eligible applicants found. Please ensure there are shortlisted or submitted applicants.");
      return;
    }

    try {
      // Create interview for each applicant
      const promises = eligibleApplicants.map((applicant: any) => {
        const interviewPayload = {
          applicant: applicant.id,
          interview_type: interview_data.interview_type,
          interview_date: interview_data.interview_date,
          ...(interview_data.interview_type === "COMMITTEE" && {
            committee_members: interview_data.interviewers
          }),
          ...(interview_data.interview_type === "NON_COMMITTEE" && interview_data.interviewers?.[0] && {
            interviewer: interview_data.interviewers[0]
          }),
        };

        console.log(`📋 Creating interview for applicant ${applicant.id}:`, interviewPayload);
        return createAdhocInterview(interviewPayload as any);
      });

      // Wait for all interviews to be created
      const results = await Promise.all(promises);
      console.log('✅ All interviews created successfully:', results);

      toast.success(`Successfully created ${eligibleApplicants.length} interview(s)!`);
      router.back();
    } catch (error: any) {
      console.error('❌ Interview creation error:', error);
      console.error('❌ Error response:', error?.response?.data);

      const errorMessage = error?.response?.data?.message
        || error?.response?.data?.error
        || error?.response?.data?.detail
        || error?.message
        || "Failed to create interview";

      toast.error(`Failed to create interview: ${errorMessage}`);
    }
  };

  return (
    <section>
      <BackNavigation />

      {/* Advertisement Details Card */}
      {advertisementData?.data && (
        <Card className="mb-6 bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-amber-900">Advertisement Details</h2>
              <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold">
                {advertisementData.data.status || 'Active'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="text-gray-600 font-medium">Position Title:</label>
                <p className="text-gray-900 font-semibold mt-1">
                  {advertisementData.data.position_title || 'N/A'}
                </p>
              </div>

              <div>
                <label className="text-gray-600 font-medium">Advertisement Number:</label>
                <p className="text-gray-900 font-semibold mt-1">
                  {advertisementData.data.advertisement_number || 'N/A'}
                </p>
              </div>

              <div>
                <label className="text-gray-600 font-medium">Duration:</label>
                <p className="text-gray-900 font-semibold mt-1">
                  {advertisementData.data.start_date && advertisementData.data.end_date
                    ? `${new Date(advertisementData.data.start_date).toLocaleDateString()} - ${new Date(advertisementData.data.end_date).toLocaleDateString()}`
                    : 'N/A'}
                </p>
              </div>

              <div>
                <label className="text-gray-600 font-medium">Total Applicants:</label>
                <p className="text-gray-900 font-semibold mt-1">
                  {applicantsData?.data?.results?.length || 0} applicants
                </p>
              </div>

              {advertisementData.data.department && (
                <div>
                  <label className="text-gray-600 font-medium">Department:</label>
                  <p className="text-gray-900 font-semibold mt-1">
                    {typeof advertisementData.data.department === 'object'
                      ? advertisementData.data.department?.name || 'N/A'
                      : advertisementData.data.department}
                  </p>
                </div>
              )}

              {advertisementData.data.location && (
                <div>
                  <label className="text-gray-600 font-medium">Location:</label>
                  <p className="text-gray-900 font-semibold mt-1">
                    {typeof advertisementData.data.location === 'object'
                      ? advertisementData.data.location?.name || 'N/A'
                      : advertisementData.data.location}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      <Card>
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">Schedule Interview</h1>
          <p className="text-sm text-gray-600 mt-1">
            Set up interview details for the shortlisted applicants
          </p>
        </div>

        <Form {...form}>
          <form className='space-y-10' onSubmit={handleSubmit(onSubmit)}>
            {/* Hidden field to maintain form state */}
            <input type="hidden" {...form.register('advertisement')} />

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
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            type='search'
                            className='h-6 border-none bg-none'
                          />
                          <Icon icon='iconamoon:search-light' fontSize={25} />
                        </div>
                      </div>

                      <div className='space-y-5 '>
                        {isUsersLoading || isEmployeesLoading ? (
                          <div className='flex flex-col items-center justify-center py-10'>
                            <LoadingSpinner />
                            <p className='mt-4 text-gray-600'>Loading team members...</p>
                          </div>
                        ) : usersError ? (
                          <div className='flex flex-col items-center justify-center py-10'>
                            <p className='text-red-600'>Error loading users: {String(usersError)}</p>
                          </div>
                        ) : filteredUsers?.length === 0 ? (
                          <div className='flex flex-col items-center justify-center py-10'>
                            <p className='text-gray-600'>
                              {searchTerm ? `No team members found matching "${searchTerm}"` : 'No team members available'}
                            </p>
                          </div>
                        ) : (
                          <FormField
                            control={form.control}
                            name='interviewers'
                            render={() => (
                              <FormItem className='grid grid-cols-1 gap-5 bg-gray-100 mt-10 p-5 rounded-lg shadow-inner md:grid-cols-2'>
                                {filteredUsers?.map((user: any) => (
                                  <FormField
                                    key={user?.id}
                                    control={form.control}
                                    name='interviewers'
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
                              {watch("interviewers")?.length} members
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
              <Button variant='outline' size='lg' type='button' onClick={() => router.back()}>
                Cancel
              </Button>

              <FormButton size='lg' type='submit' loading={isCreating}>
                Submit
              </FormButton>
            </div>
          </form>
        </Form>
      </Card>
    </section>
  );
}
