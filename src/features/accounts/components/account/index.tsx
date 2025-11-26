"use client";

import Card from "components/Card";
// import { Button } from "components/ui/button";
// import SearchIcon from "components/icons/SearchIcon";
// import FilterIcon from "components/icons/FilterIcon";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "components/ui/breadcrumb";
// import { useAppDispatch } from "hooks/useStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { z } from "zod";
import {
  ProfileSchema,
  SecuritySchema,
  // TProfileFormValues,
  // TSecurityFormValues,
} from "features/accounts/types/account/account";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import FormInput from "components/FormInput";
import FormButton from "components/FormButton";
import { ImagePlus } from "lucide-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  useGetUserProfile,
  useUpdateUser,
} from "@/features/auth/controllers/userController";
import { toast } from "sonner";
import FormSelect from "components/FormSelect";
import FormMultiSelect from "components/FormMultiSelect";
import { useGetAllRoles } from "@/features/auth/controllers/roleController";
import { useAuthChangePassword } from "@/features/auth/controllers/authController";
import { useAppDispatch } from "hooks/useStore";
import { logOut } from "store/auth/authSlice";
import { AuthRoutes } from "constants/RouterConstants";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export type TFormValues = z.infer<typeof ProfileSchema>;
export type TFormValuesSecond = z.infer<typeof SecuritySchema>;
export default function Account() {
  // const dispatch = useAppDispatch();

  const { data: profile, refetch: refetchProfile, isLoading: isProfileLoading, error } = useGetUserProfile();

  // Enhanced debugging for account data loading
  console.log('🔍 Account Component - useGetUserProfile state:', {
    profile,
    isLoading: isProfileLoading,
    error,
    hasData: !!profile?.data,
    fullProfile: profile,
    errorDetails: error
  });

  // Check authentication state
  console.log('🔍 Account Component - Authentication check:', {
    hasToken: !!localStorage.getItem('token'),
    tokenPreview: localStorage.getItem('token')?.substring(0, 20) + '...',
    hasAccessToken: !!localStorage.getItem('access_token'),
    accessTokenPreview: localStorage.getItem('access_token')?.substring(0, 20) + '...'
  });
  const dispatch = useAppDispatch();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { updateUser, isLoading: isUpdateLoading } = useUpdateUser(profile?.data?.id || "");
  const { data: role } = useGetAllRoles({
    page: 1,
    size: 2000000,
  });

  const { authChangePassword, isLoading: isPasswordChangeLoading } = useAuthChangePassword();

  const Profileform = useForm<TFormValues>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      username: "",
      role: [],
      gender: "",
      profile_picture: "",
      mobile_number: "",
      department: "",
      position: "",
      location: "",
      user_type: "",
    },
  });

  const roleOptions = role?.data?.results?.map(({ name, id }: any) => ({
    label: name,
    value: id,
  })) || [];
  const Securityform = useForm<TFormValuesSecond>({
    resolver: zodResolver(SecuritySchema),
    // defaultValues: {},
    defaultValues: {
      old_password: "",
      new_password: "",
      confirm_password: "",
    },
  });
  const [file, setFile] = useState<File>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manual API test for debugging
  useEffect(() => {
    const testDirectAPICall = async () => {
      try {
        const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'https://ahni-erp-029252c2fbb9.herokuapp.com/api/v1/';
        const fullURL = `${baseURL}users/profile/`;

        console.log('🧪 Manual API Test - Attempting direct call to:', fullURL);
        console.log('🧪 Manual API Test - Using token:', localStorage.getItem('token')?.substring(0, 20) + '...');

        const response = await fetch(fullURL, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('🧪 Manual API Test - Response status:', response.status);
        console.log('🧪 Manual API Test - Response headers:', Object.fromEntries(response.headers.entries()));

        const data = await response.json();
        console.log('🧪 Manual API Test - Response data:', data);
      } catch (err) {
        console.error('🧪 Manual API Test - Error:', err);
      }
    };

    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
      testDirectAPICall();
    }
  }, []);

  useEffect(() => {
    console.log('🔍 Account Component - Profile data:', profile);
    console.log('🔍 Account Component - Profile loading:', !profile);
    console.log('🔍 Account Component - Profile structure check:', {
      hasProfile: !!profile,
      hasProfileData: !!profile?.data,
      profileKeys: profile ? Object.keys(profile) : [],
      dataKeys: profile?.data ? Object.keys(profile.data) : []
    });

    // Check if we have profile data in the right structure
    // The API returns data directly, not nested under profile.data
    const profileData = profile;

    if (profileData && typeof profileData === 'object' && profileData.id) {
      console.log('📋 Raw profile data structure:', JSON.stringify(profileData, null, 2));
      console.log('🔄 Form reset triggered - About to populate form with profile data');

      const roles = profileData.roles || [];
      const roleValues = roles.map((role: any) => role.id || role);

      console.log('🔄 Form reset - Processed role values:', roleValues);

      const formData = {
        first_name: profileData.first_name || "",
        last_name: profileData.last_name || "",
        email: profileData.email || "",
        // @ts-ignore
        username: profileData.username || profileData.employee_id || "",
        // @ts-ignore
        role: roleValues || [],
        gender: profileData.gender || "",
        profile_picture: profileData.profile_picture || "",
        mobile_number: profileData.mobile_number || "",
        department: typeof profileData.department === 'object' && profileData.department !== null
          ? profileData.department.name || profileData.department.title || ""
          : profileData.department || "",
        position: typeof profileData.position === 'object' && profileData.position !== null
          ? profileData.position.name || profileData.position.title || ""
          : profileData.position || "",
        location: typeof profileData.location === 'object' && profileData.location !== null
          ? profileData.location.name || profileData.location.title || ""
          : profileData.location || "",
        user_type: profileData.user_type || "",
      };

      console.log('🔄 Form reset - Data about to be set:', formData);

      Profileform.reset(formData);

      console.log('✅ Form reset completed');
    } else {
      console.log('❌ No profile data available for form reset');
    }
  }, [profile, Profileform]);

  const handlePaperclipClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const onSubmitProfile = async (data: TFormValues) => {
    // Dispatch update profile action or API call

    try {
      if (!profile?.data?.id) {
        toast.error("User ID is missing. Please refresh the page.");
        return;
      }

      const formData = new FormData();

      formData.append("first_name", data.first_name);
      formData.append("last_name", data.last_name);
      formData.append("email", data.email);
      formData.append("gender", data.gender);
      formData.append("mobile_number", data.mobile_number);
      // Don't send disabled fields (department, position, location, user_type) as they are read-only
      // and the backend expects UUIDs but returns display names
      data.role.forEach((role) => formData.append("roles", role));

      if (file) {
        formData.append("profile_picture", file);
      }

      await updateUser(formData);

      // Manually invalidate and refetch the user profile to update the header avatar
      await queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      await refetchProfile();

      // Clear the file state so the preview updates with the new URL from the server
      setFile(undefined);

      toast.success("User Updated");
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast.error(error?.message || error?.data?.message || "Something went wrong");
    }
  };

  const onSubmitSecurity = async (data: TFormValuesSecond) => {
    // Dispatch update password action or API call
    const payload = {
      new_password: data?.new_password,
      confirm_password: data?.confirm_password,
      current_password: data?.old_password,
    };

    try {
      await authChangePassword(payload);
      toast.success("Password changed successfully");

      // Only log out and redirect if password change is successful
      dispatch(logOut());
      router.push(AuthRoutes.LOGIN);
      router.push("/login");
    } catch (err: any) {
      // On error, just show toast and do not log out or redirect
      toast.error(err.data.message || "Something went wrong");
    }
  };

  return (
    <div className='space-y-5'>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            /
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Account</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <h2 className='text-[28px] font-semibold text-[#101928]'>Settings</h2>
        <div className='w-full grid grid-cols-1 lg:grid-cols-4 py-16 lg:py-36 gap-3'>
          <div className='col-span-1 py-20   px-2 flex flex-col items-center gap-3'>
            {/* <div
              className='w-[200px] h-[200px] flex-shrink-0 rounded-full bg-[#FF0000]'
              style={{
                backgroundImage: file
                  ? `url(${URL.createObjectURL(file)})`
                  : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            /> */}
            <div
              className='w-[200px] h-[200px] flex-shrink-0 rounded-full bg-[#FF0000]'
              style={{
                backgroundImage: file
                  ? `url(${URL.createObjectURL(file)})`
                  : profile?.profile_picture
                  ? `url(${profile?.profile_picture})`
                  : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />

            <div
              onClick={handlePaperclipClick}
              className='rounded-[8px] cursor-pointer border-[1.5px] w-fit p-2 flex justify-center items-center gap-1 border-[#FF0000] text-[#FF0000] text-[14px] font-semibold'
            >
              <ImagePlus />
              Change Photo
            </div>
            <input
              ref={fileInputRef}
              type='file'
              onChange={handleChangeFile}
              className='hidden'
            />
          </div>
          <div className='col-span-3'>
            <Tabs defaultValue='profile'>
              <TabsList className='border-b !py-0 rounded-none border-[#E4E7EC] w-full justify-start '>
                <TabsTrigger
                  className='rounded-none data-[state=active]:bg-transparent data-[state=active]:text-[#FF0000] data-[state=active]:border-b data-[state=active]:border-[#FF0000]'
                  value='profile'
                >
                  Profile Settings
                </TabsTrigger>
                <TabsTrigger
                  className='rounded-none data-[state=active]:bg-transparent data-[state=active]:text-[#FF0000] data-[state=active]:border-b data-[state=active]:border-[#FF0000]'
                  value='security'
                >
                  Security
                </TabsTrigger>
              </TabsList>
              <TabsContent
                className='w-full lg:w-[60%] py-16 lg:py-32'
                value='profile'
              >
                <FormProvider {...Profileform}>
                  <form
                    onSubmit={Profileform.handleSubmit(onSubmitProfile)}
                    className='flex flex-col w-full gap-[20px]'
                  >
                    <div className='w-full grid grid-cols-1 lg:grid-cols-2 gap-[20px]'>
                      <FormInput
                        label='First Name'
                        name='first_name'
                        className='bg-white h-[56px]'
                        required
                        placeholder='Enter First name'
                      />
                      <FormInput
                        label='Last Name'
                        name='last_name'
                        className='bg-white h-[56px]'
                        required
                        placeholder='Enter Last name'
                      />
                    </div>
                    <FormInput
                      label='Email Address'
                      name='email'
                      className='bg-white h-[56px]'
                      required
                      placeholder='Enter Email address'
                      disabled={true}
                    />

                    <FormMultiSelect
                      label='Role'
                      placeholder='Select Role'
                      name='role'
                      required
                      options={roleOptions}
                      disabled={true}
                    />

                    <FormSelect
                      label='Gender'
                      placeholder='Select Gender'
                      name='gender'
                      required
                      options={[
                        { label: "Male", value: "MALE" },
                        { label: "Female", value: "FEMALE" },
                      ]}
                    />

                    <FormInput
                      label='Mobile Number'
                      name='mobile_number'
                      className='bg-white h-[56px]'
                      required
                      placeholder='Enter mobile number'
                      type='tel'
                    />

                    <div className='w-full grid grid-cols-1 lg:grid-cols-2 gap-[20px]'>
                      <FormInput
                        label='Department'
                        name='department'
                        className='bg-white h-[56px]'
                        placeholder='Department'
                        disabled={true}
                      />
                      <FormInput
                        label='Position'
                        name='position'
                        className='bg-white h-[56px]'
                        placeholder='Position'
                        disabled={true}
                      />
                    </div>

                    <div className='w-full grid grid-cols-1 lg:grid-cols-2 gap-[20px]'>
                      <FormInput
                        label='Location'
                        name='location'
                        className='bg-white h-[56px]'
                        placeholder='Location'
                        disabled={true}
                      />
                      <FormInput
                        label='User Type'
                        name='user_type'
                        className='bg-white h-[56px]'
                        placeholder='User Type'
                        disabled={true}
                      />
                    </div>

                    <div className='flex justify-end gap-5 mt-16'>
                      <FormButton
                        loading={isUpdateLoading}
                        type='submit'
                        disabled={isUpdateLoading}
                      >
                        Save
                      </FormButton>
                    </div>
                  </form>
                </FormProvider>
              </TabsContent>
              <TabsContent
                className='w-full lg:w-[60%] py-10 '
                value='security'
              >
                <div className='flex flex-col gap-3 rounded-[10px] border border-[#F0F2F5] py-10 px-10'>
                  <h2 className='text-[20px] text-[#101928] font-semibold'>
                    Change Password
                  </h2>
                  <FormProvider {...Securityform}>
                    <form
                      onSubmit={Securityform.handleSubmit(onSubmitSecurity)}
                      className='flex flex-col w-full gap-[20px]'
                    >
                      <FormInput
                        label='Old Password'
                        type='password'
                        name='old_password'
                        className='bg-white h-[56px]'
                        required
                        placeholder='Enter old password'
                      />
                      <FormInput
                        label='New Password'
                        type='password'
                        name='new_password'
                        className='bg-white h-[56px]'
                        required
                        placeholder='Enter new password'
                      />

                      <FormInput
                        label='Confirm Password'
                        type='password'
                        name='confirm_password'
                        className='bg-white h-[56px]'
                        // disabled
                        placeholder='Confirm new password'
                      />

                      <div className='flex justify-end gap-5 mt-16'>
                        <FormButton
                          loading={isPasswordChangeLoading}
                          type='submit'
                          disabled={isPasswordChangeLoading}
                        >
                          Update Password
                        </FormButton>
                      </div>
                    </form>
                  </FormProvider>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </Card>
    </div>
  );
}