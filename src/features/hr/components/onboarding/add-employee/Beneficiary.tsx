"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Form } from "components/ui/form";
import GoBack from "components/GoBack";
// import FormCheckBox from "components/atoms/FormCheckBox";
import { Separator } from "components/ui/separator";
import { Button } from "components/ui/button";
import FormInput from "components/atoms/FormInput";
import { ChevronRight, Save } from "lucide-react";
import Link from "next/link";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import { useAppDispatch } from "hooks/useStore";
import { HrRoutes } from "constants/RouterConstants";
import { generatePath } from "utils/generatePath";
import Card from "components/Card";
import {
  HrBeneficiaryFormValues,
  hrBeneficiarySchema,
  HrContingentBeneficiaryFormValues,
  hrContingentBeneficiarySchema,
  HrSignatoriesBeneficiaryFormValues,
  hrSignatoriesBeneficiarySchema,
} from "features/hr/types/hr-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import FormButton from "@/components/FormButton";
import { updateStepCompletion } from "store/stepTracker";
import {
  useCreateHrBeneficiary,
  useUpdateHrBeneficiary,
  useGetHrBeneficiaries,
} from "@/features/hr/controllers/hrBeneficiaryController";
import {
  useCreateEmployeeOnboardingAddSignatory,
  useGetEmployeeOnboardingAddSignatory,
  useUpdateEmployeeOnboardingAddSignatory,
} from "@/features/hr/controllers/hrEmployeeOnboardingSignatoryController";
import FileUpload from "components/atoms/FileUpload";

import { createFileObjectFromUrl } from "utils/get-file-extension";

const Beneficiary = () => {
  const id = localStorage.getItem("workforceID") || "";
  const dispatch = useAppDispatch();
  const [signature, setSignature] = React.useState<any>({});

  const { createHrBeneficiaryMutation, isLoading } =
    useCreateHrBeneficiary();
  const { updateHrBeneficiaryMutation, isLoading: updateLoading } =
    useUpdateHrBeneficiary();

  const { createEmployeeOnboardingAddSignatory, isLoading: addingSignatory } =
    useCreateEmployeeOnboardingAddSignatory();
  const { updateEmployeeOnboardingAddSignatory, isLoading: updateSignatory } =
    useUpdateEmployeeOnboardingAddSignatory();

  const { data, isLoading: getLoading } = useGetHrBeneficiaries({
    params: {
      employee: id as string,
    },
  });

  const { data: signatories, isLoading: signatoriesLoading } =
    useGetEmployeeOnboardingAddSignatory({
      employee: id as string,
    });

  const beneficiaryForm = useForm<HrBeneficiaryFormValues>({
    resolver: zodResolver(hrBeneficiarySchema),
    defaultValues: {
      name: "",
      relationship: "",
      percentage_of_benefit: 0,
      phone_number: "",
      is_primary: true,
    },
  });

  const contingentBeneficiaryForm = useForm<HrContingentBeneficiaryFormValues>({
    resolver: zodResolver(hrContingentBeneficiarySchema),
    defaultValues: {
      name: "",
      relationship: "",
      phone_number: "",
      is_primary: false,
    },
  });

  const signatoriesForm = useForm<HrSignatoriesBeneficiaryFormValues>({
    resolver: zodResolver(hrSignatoriesBeneficiarySchema),
    defaultValues: {
      witness_name: "",
      witness_date: "",
      withness_signature: "",
    },
  });

  const onSubmit = async (hrData: HrBeneficiaryFormValues) => {
    const formData = {
      ...hrData,
      employee: id,
    };

    if (data?.data.results.length) {
      console.log(hrData);

      try {
        await updateHrBeneficiaryMutation({
          id: data?.data.results[0].id,
          body: formData,
        })();

        dispatch(
          openDialog({
            type: DialogType.HrSuccessModal,
            dialogProps: {
              label: "Beneficiary information saved",
            },
          })
        );

        beneficiaryForm.reset(formData);
      } catch (error) {
        console.log("Update Beneficiary", error);
        toast.error("Something went wrong");
      }
    } else {
      try {
        await createHrBeneficiaryMutation(formData)();
        dispatch(
          openDialog({
            type: DialogType.HrSuccessModal,
            dialogProps: {
              label: "Beneficiary information saved",
            },
          })
        );
        beneficiaryForm.reset();
      } catch (error) {
        toast.error("Something went wrong");
      }
    }
  };

  const submitHandler = async (data: HrContingentBeneficiaryFormValues) => {
    const formData = {
      ...data,
      employee: id,
    };
    try {
      await createHrBeneficiaryMutation(formData)();
      dispatch(
        updateStepCompletion({
          path: HrRoutes.ONBOARDING_ADD_EMPLOYEE_BENEFICIARY,
        })
      );

      dispatch(
        openDialog({
          type: DialogType.HrSuccessModal,
          dialogProps: {
            label: "Contingent Beneficiary information saved",
          },
        })
      );
      contingentBeneficiaryForm.reset();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const submitSignatoriesHandler = async (
    data: HrSignatoriesBeneficiaryFormValues
  ) => {
    const formData = new FormData();
    // console.log("Form data: ", data);

    formData.append("witness_name", data.witness_name);
    formData.append("witness_date", data.witness_date);
    formData.append("employee", id as string);

    if (signatories?.data.results.length) {
      if (typeof data.withness_signature !== "string") {
        // Has been changed [Backend returns string]
        // console.log(data.withness_signature);
        formData.append("withness_signature", data.withness_signature);
      } else {
        formData.append("withness_signature", signature);
      }
    } else {
      formData.append("withness_signature", data.withness_signature[0]);
    }

    if (signatories?.data.results.length) {
      console.log("Signatory Edit: ", formData);

      try {
        await updateEmployeeOnboardingAddSignatory({
          id: signatories?.data.results[0].id,
          body: formData,
        })();

        dispatch(
          updateStepCompletion({
            path: HrRoutes.ONBOARDING_ADD_EMPLOYEE_BENEFICIARY,
          })
        );

        dispatch(
          openDialog({
            type: DialogType.HrSuccessModal,
            dialogProps: {
              label: "Signatory information saved",
            },
          })
        );
        signatoriesForm.reset();
      } catch (error) {
        toast.error("Something went wrong");
      }
    } else {
      try {
        await createEmployeeOnboardingAddSignatory(formData)();

        dispatch(
          updateStepCompletion({
            path: HrRoutes.ONBOARDING_ADD_EMPLOYEE_BENEFICIARY,
          })
        );

        dispatch(
          openDialog({
            type: DialogType.HrSuccessModal,
            dialogProps: {
              label: "Signatory information saved",
            },
          })
        );
        signatoriesForm.reset();
      } catch (error) {
        toast.error("Something went wrong");
      }
    }
  };

  React.useEffect(() => {
    if (!getLoading && data?.data && data.data.results.length) {
      beneficiaryForm.reset({
        name: data?.data.results[0].name,
        relationship: data?.data.results[0].relationship,
        percentage_of_benefit: data?.data.results[0].percentage_of_benefit,
        phone_number: data?.data.results[0].phone_number,
        is_primary: data?.data.results[0].is_primary,
      });
    }
  }, [data]);

  React.useEffect(() => {
    if (
      !signatoriesLoading &&
      signatories?.data &&
      signatories.data.results.length
    ) {
      // console.log("Signatories ", signatories);

      signatoriesForm.reset({
        witness_name: signatories.data.results[0].witness_name,
        witness_date: signatories.data.results[0].witness_date,
        withness_signature: signatories.data.results[0].withness_signature,
      });

      createFileObjectFromUrl(
        signatories.data.results[0].withness_signature
      ).then((file) => {
        setSignature(file);
      });
    }
  }, [signatories]);

  return (
    <>
      <GoBack />
      <Card className='space-y-6 mt-6 max-w-4xl mx-auto'>
        <div>
          <h4 className='font-semibold text-lg text-center'>
            Beneficiary Designation Form
          </h4>
          <p className='text-small text-center'>
            To be used for all requests concerning the granting, amending &
            removal of Network access
          </p>
        </div>

        <Form {...beneficiaryForm}>
          <form
            onSubmit={beneficiaryForm.handleSubmit(onSubmit)}
            className='space-y-6'
          >
            <div className='card-wrapper bg-gray-100'>
              <p className='text-small'>
                I designate the person(s) named below as my primary
                beneficiary(ies) to receive payment under the policy in the
                event of death.
              </p>
            </div>
            <div className='card-wrapper space-y-6'>
              <h4 className='text-red-500 text-lg font-medium'>
                Primary Beneficiary(ies)
              </h4>

              <FormInput
                name='name'
                label='Beneficiary Names (Last, First)'
                required
              />
              <FormInput
                name='percentage_of_benefit'
                label='% of Benefit'
                type='number'
                required
              />
              <FormInput
                name='relationship'
                label='Relationship with Employee'
                required
              />
              <FormInput name='phone_number' label='Phone Number' required />
            </div>

            <FormButton
              loading={isLoading}
              disabled={isLoading}
              variant='outline'
            >
              <Save size={20} /> Save
            </FormButton>
          </form>
        </Form>

        <Form {...contingentBeneficiaryForm}>
          <form
            onSubmit={contingentBeneficiaryForm.handleSubmit(submitHandler)}
            className='space-y-6'
          >
            {/* <div className="flex justify-end gap-x-4">
            <FormCheckBox name="new" label="New" reverse />
            <FormCheckBox name="change" label="Change" reverse />
          </div> */}

            <div className='card-wrapper space-y-6'>
              <h4 className='text-red-500 text-lg font-medium'>
                Contingent Beneficiary
              </h4>
              <p className='text-small'>
                (Used only if any of the above beneficiaries passes on before
                you. The % allocated to the affected primary beneficiary will be
                transferred to the contingent beneficiary in the order listed
                below)
              </p>
              <Separator />
              <FormInput
                name='name'
                label='Contingent Beneficiary Names (Last, First)'
                required
              />
              <FormInput
                name='relationship'
                label='Relationship with Employee'
                required
              />
              <FormInput name='phone_number' label='Phone Number' required />
            </div>

            <FormButton
              loading={isLoading || updateLoading}
              disabled={isLoading || updateLoading}
              // disabled
              variant='outline'
            >
              <Save size={20} /> Save
            </FormButton>
          </form>
        </Form>

        <Form {...signatoriesForm}>
          <form
            onSubmit={signatoriesForm.handleSubmit(submitSignatoriesHandler)}
            className='space-y-6'
          >
            <div className='card-wrapper space-y-6'>
              <h4 className='text-red-500 text-lg font-medium'>
                Authorization and Signatories
              </h4>
              <p className='text-small'>
                By signing this document, I understand and agree that this
                Beneficiary Designation Form will apply to AHNi Business Travel/
                Accidental death and Dismemberment Policy.
              </p>
              <Separator />
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <FormInput
                  name='witness_name'
                  label='Full Name of Witness'
                  required
                />
                <FormInput
                  type='date'
                  name='witness_date'
                  label='Date'
                  required
                />
              </div>

              <FileUpload name='withness_signature' label='Witness Signature' />
            </div>

            <FormButton
              loading={addingSignatory || updateSignatory}
              disabled={addingSignatory || updateSignatory}
              variant='outline'
            >
              <Save size={20} /> Save
            </FormButton>
          </form>
        </Form>
        <div className='flex gap-x-6 justify-end'>
          <Link
            href={generatePath(HrRoutes.ONBOARDING_ADD_EMPLOYEE_ID_CARD, {
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
              path: HrRoutes.ONBOARDING_ADD_EMPLOYEE_ID_CARD,
            })
          )
        }
      >
        Hello
      </Button> */}
    </>
  );
};

export default Beneficiary;
