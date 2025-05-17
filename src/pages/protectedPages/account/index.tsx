import Card from "components/shared/Card";
import { Button } from "components/ui/button";
import SearchIcon from "components/icons/SearchIcon";
import FilterIcon from "components/icons/FilterIcon";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "components/ui/breadcrumb";
import { useAppDispatch } from "hooks/useStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { z } from "zod";
import {
  ProfileSchema,
  SecuritySchema,
  TProfileFormValues,
  TSecurityFormValues,
} from "definations/account/account";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import FormInput from "atoms/FormInput";
import FormButton from "atoms/FormButton";
import { ImagePlus } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";

export type TFormValues = z.infer<typeof ProfileSchema>;
export type TFormValuesSecond = z.infer<typeof SecuritySchema>;
export default function Account() {
  const Profileform = useForm<TFormValues>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      username: "",
      role: "",
    },
  });
  const Securityform = useForm<TFormValuesSecond>({
    resolver: zodResolver(SecuritySchema),
    defaultValues: {},
  });
  const dispatch = useAppDispatch();
  const [file, setFile] = useState<File>();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  return (
    <div className='space-y-5'>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Account</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <h2 className='text-[28px] font-semibold text-[#101928]'>Settings</h2>
        <div className='w-full grid grid-cols-1 lg:grid-cols-4 py-16 lg:py-36 gap-3'>
          <div className='col-span-1 py-20   px-2 flex flex-col items-center gap-3'>
            <div className='w-[200px] h-[200px] flex-shrink-0 rounded-full bg-[#FF0000]'></div>
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
                    /*  onSubmit={handleSubmit(onSubmit)} */
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
                    />
                    <FormInput
                      label='Username'
                      name='username'
                      className='bg-white h-[56px]'
                      required
                      placeholder='Enter username'
                    />

                    <FormInput
                      label='Role'
                      name='role'
                      className='bg-white h-[56px]'
                      disabled
                      placeholder='Enter role'
                    />

                    <div className='flex justify-end gap-5 mt-16'>
                      <FormButton
                        loading={false}
                        type='submit'
                        disabled={false}
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
                      /*  onSubmit={handleSubmit(onSubmit)} */
                      className='flex flex-col w-full gap-[20px]'
                    >
                      <FormInput
                        label='Old Password'
                        type='password'
                        name='old_password'
                        className='bg-white h-[56px]'
                        required
                        placeholder='Enter Email address'
                      />
                      <FormInput
                        label='New Password'
                        type='password'
                        name='new_password'
                        className='bg-white h-[56px]'
                        required
                        placeholder='Enter username'
                      />

                      <FormInput
                        label='Confirm Password'
                        type='password'
                        name='confirm_password'
                        className='bg-white h-[56px]'
                        disabled
                        placeholder='Enter role'
                      />

                      <div className='flex justify-end gap-5 mt-16'>
                        <FormButton
                          loading={false}
                          type='submit'
                          disabled={false}
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
