"use client";

import { Form } from "components/ui/form";
import { useForm } from "react-hook-form";
import FormInput from "components/atoms/FormInput";
import FormTextArea from "components/atoms/FormTextArea";
import FormSelect from "components/atoms/FormSelect";
import { Separator } from "components/ui/separator";
import { Button } from "components/ui/button";
import { ChevronRight, Save } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { generatePath } from "utils/generatePath"; 
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import { useAppDispatch } from "hooks/useStore";
import { HrRoutes } from "constants/RouterConstants";
import Card from "components/Card";
import { LoadingSpinner } from "components/Loading";

import FormButton from "@/components/FormButton";
import GoBack from "components/GoBack";
import { useGetHrEmergencyList } from "@/features/hr/controllers/hrEmployeeOnboardingAddInfoController";

import { EmergencyContactForm } from "./EmergencyContactForm";
import { AuthorizationForm } from "./AuthorizationForm";

const AdditionalInformation = () => {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { data, isLoading: contactsLoading } = useGetHrEmergencyList({
    employee: id as string,
  });

  if (!contactsLoading) console.log(data);

  return (
    <>
      <GoBack />

      <Card className='space-y-6 mt-6'>
        <div>
          <h4 className='font-semibold text-lg text-center'>
            Additional Information Form
          </h4>
          <p className='text-small text-center'>
            To be used for all requests concerning the granting, amending &
            removal of Network access
          </p>
        </div>

        <Card>
          <h4 className='text-red-500 text-lg font-medium'>
            Emergency Contacts
          </h4>

          {contactsLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              <EmergencyContactForm
                number={1}
                emergencyContact={data?.data.results[0]}
              />

              <EmergencyContactForm
                number={2}
                emergencyContact={data?.data.results[1]}
              />
            </>
          )}
        </Card>

        <Separator />

        <Card>
          <h4 className='text-red-500 text-lg font-medium mb-6'>
            System Analyst Authorization (Only if all previously completed and
            signed)
          </h4>

          <Separator />

          <AuthorizationForm />
        </Card>

        <div className='flex gap-x-6 justify-end'>
          <Link
            href={generatePath(HrRoutes.ONBOARDING_ADD_EMPLOYEE_BENEFICIARY, {
              id,
            })}
            className='flex flex-col items-start justify-between gap-1'
          >
            <Button type='button'>
              Next
              <ChevronRight size={20} />
            </Button>
          </Link>
        </div>
      </Card>

      {/* <Button
        onClick={() =>
          dispatch(
            updateStepCompletion({
              path: HrRoutes.ONBOARDING_ADD_EMPLOYEE_INFO,
            })
          )
        }
      >
        Hello
      </Button> */}
    </>
  );
};

export default AdditionalInformation;
