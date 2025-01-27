import React, { useEffect } from "react";
import { useForm, Controller, Form } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "components/ui/separator";
import Card from "components/shared/Card";
import { Button } from "components/ui/button";
import { Save } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "store/index";
import { useGetAllBeneficiaryQuery } from "services/modules/project/beneficiaries";

import PurchaseRequestAPI from "services/procurementApi/purchase-sample-request ";
import { useGetAllProjectsQuery } from "services/project";
import { useGetAllActivityPlansQuery } from "services/programsApi/activity-plan";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "components/ui/table";

// Sample Checkbox component
// eslint-disable-next-line react/display-name
const Checkbox = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => <input type='checkbox' {...props} ref={ref} />);

// Define Zod Schema
const UploadSchema = z.object({
  beneficiaries: z
    .array(
      z.object({
        name: z.string(),
        selected: z.boolean(),
        id: z.string(), // Ensure 'id' is part of the schema
      })
    )
    .nonempty(),
  integratedTraining: z.string().nonempty(),
  budgeted: z.string().optional(),
  expended: z.string().optional(),
  balance: z.string().optional(),
});

type FormData = z.infer<typeof UploadSchema>;

const CheckboxForm = () => {
  const activity = useSelector((state: RootState) => state.activity.activity);
  const mergedObject = activity.reduce((acc: any, obj: any) => {
    return { ...acc, ...obj };
  }, {});

  const { data: beneficiaries } = useGetAllBeneficiaryQuery({
    page: 1,
    size: 2000000,
  });
  const { data: projects } = useGetAllProjectsQuery({
    page: 1,
    size: 2000000,
  });

  const { data: activites } = useGetAllActivityPlansQuery({
    page: 1,
    size: 2000000,
  });

  console.log({ beneficiaries, mergedObject, projects, activites });

  const form = useForm<FormData>({
    resolver: zodResolver(UploadSchema),
    defaultValues: {
      beneficiaries: [],
      integratedTraining: "",
    },
  });

  const { control, handleSubmit, setValue, watch } = form;

  const integratedTraining = watch("integratedTraining");

  // Update default values when beneficiaries data is available
  useEffect(() => {
    if (beneficiaries?.data?.results) {
      setValue(
        "beneficiaries",
        // @ts-ignore

        projects?.data?.results.map(({ title, id }) => ({
          name: title,
          selected: false,
          id,
        }))
      );
    }
  }, [projects, setValue]);

  // Reset beneficiaries when integratedTraining is "false"
  useEffect(() => {
    if (integratedTraining === "false") {
      setValue(
        "beneficiaries",
        // @ts-ignore

        beneficiaries?.data?.results.map(({ name, id }) => ({
          name,
          selected: false,
          id,
        }))
      );
    }
  }, [integratedTraining, beneficiaries, setValue]);

  const [createActivityMemoMutation] =
    PurchaseRequestAPI.useCreateActivityMemoMutation();

  // const dispatch = useDispatch();
  const onSubmit = (data: FormData) => {
    // dispatch(activityActions.clearActivity());

    console.log("Form Data:", { data });
    // // Define your programAreas array
    // // const programAreas = []; // Example IDs of program areas

    // // Filter the beneficiaries based on selected and IDs in programAreas
    // const filteredBeneficiaries = data?.beneficiaries?.filter(
    //   (beneficiary) => beneficiary.selected
    // );
    // const program_areas = filteredBeneficiaries.map((fb) => fb.id);
    // console.log(
    //   "Filtered Beneficiaries:",
    //   filteredBeneficiaries,
    //   program_areas
    // );
    // console.log("Form Data:", data);
    // console.log(mergedObject);
    // const payload = { ...mergedObject, program_areas };
    // console.log({ payload });

    // try {
    //   await createActivityMemoMutation(payload).unwrap();
    //   // navigate(RouteEnum.SAMPLE_PREVIEW);
    //   toast.success("Successfully created.");
    // } catch (error) {
    //   toast.error("Something went wrong");
    //   console.log(error);
    // }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-10'>
        <Card className='border-yellow-darker flex flex-col gap-2 justify-between'>
          <h2 className='font-semibold text-base'>Program Areas</h2>
          <div className='flex justify-between gap-2'>
            <p>
              Is the training an integrated training (contains more than one
              program area)?
            </p>
            <div className='flex gap-5 justify-between'>
              <div className='flex items-center space-x-2 justify-center'>
                <Controller
                  name='integratedTraining'
                  control={control}
                  render={({ field }) => (
                    <>
                      <input
                        type='radio'
                        value='true'
                        className='accent-purple-500 top-auto'
                        checked={field.value === "true"}
                        onChange={() => field.onChange("true")}
                      />
                      <label htmlFor='yes'>Yes</label>
                    </>
                  )}
                />
              </div>
              <div className='flex items-center space-x-2'>
                <Controller
                  name='integratedTraining'
                  control={control}
                  render={({ field }) => (
                    <>
                      <input
                        type='radio'
                        value='false'
                        className='accent-primary top-auto'
                        checked={field.value === "false"}
                        onChange={() => field.onChange("false")}
                      />
                      <label htmlFor='no'>No</label>
                    </>
                  )}
                />
              </div>
            </div>
          </div>
          {integratedTraining === "true" && (
            <>
              <Separator className='my-4' />
              <div className='flex flex-col gap-5'>
                <h2 className='font-semibold text-base'>
                  Please select Program Area(s):
                </h2>
                <div>
                  <h2 className='font-semibold text-base my-3'>Projects</h2>
                  <div className='grid grid-cols-4 gap-4'>
                    <Controller
                      name='beneficiaries'
                      control={control}
                      render={({ field }) =>
                        // @ts-ignore
                        field.value.map((beneficiary, index) => (
                          <div
                            key={beneficiary.id}
                            className='flex items-center gap-2'
                          >
                            <Checkbox
                              checked={beneficiary.selected}
                              onChange={(e) =>
                                field.onChange(
                                  field.value.map((b, i) =>
                                    i === index
                                      ? { ...b, selected: e.target.checked }
                                      : b
                                  )
                                )
                              }
                            />
                            <label>{beneficiary.name}</label>
                          </div>
                        ))
                      }
                    />
                  </div>
                </div>
              </div>
              <Separator className='my-4' />
            </>
          )}
        </Card>
        <div className=''>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell className='text-center'>
                  To be completed by Programs
                </TableCell>
                <TableCell className='text-center'>
                  {" "}
                  To be completed by Finance
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              <TableRow>
                <TableCell className='p-0'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableCell>Activity Code #</TableCell>
                        <TableCell>Cost Grouping/ Category</TableCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          {mergedObject?.selectedActivity?.activity_code}
                        </TableCell>
                        <TableCell>
                          {mergedObject?.selectedCostCategory?.name}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableCell>

                <TableCell className='p-0'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableCell>Budgeted for this activity (N)</TableCell>

                        <TableCell>Expended (N) for this activity</TableCell>
                        <TableCell>Balance</TableCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className='p-2 rounded-none h-2'>
                          {" "}
                          {/* <FormInput
                            label='Budgeted'
                            // name='budgeted'
                            type='text'
                          />
                           */}
                          <Controller
                            name='budgeted'
                            control={control}
                            render={({ field }) => (
                              <>
                                <input
                                  type='text'
                                  className='w-full h-full border-none rounded-none p-2'
                                />
                              </>
                            )}
                          />
                        </TableCell>
                        <TableCell className='p-2 rounded-none h-2'>
                          {" "}
                          {/* <FormInput
                            label='Expended'
                            // name='expended'
                            type='text'
                          /> */}
                          <Controller
                            name='expended'
                            control={control}
                            render={({ field }) => (
                              <>
                                <input
                                  type='text'
                                  // value='false'
                                  className='w-full h-full border-none rounded-none p-2'

                                  // checked={field.value === "false"}
                                  // onChange={() => field.onChange("false")}
                                />
                              </>
                            )}
                          />
                        </TableCell>
                        <TableCell className='p-2 rounded-none h-2'>
                          <Controller
                            name='balance'
                            control={control}
                            render={({ field }) => (
                              <>
                                <input
                                  type='text'
                                  // value='false'
                                  className='w-full h-full border-none rounded-none p-2'

                                  // checked={field.value === "false"}
                                  // onChange={() => field.onChange("false")}
                                />
                              </>
                            )}
                          />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className='w-full px-4'>
          <Button
            type='submit'
            className='mt-4 px-4 py-2 bg-alternate text-primary rounded w-full'
          >
            <Save size={20} />
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CheckboxForm;
