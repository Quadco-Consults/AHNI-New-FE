import React, { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "components/ui/separator";
import Card from "components/shared/Card";
import { Button } from "components/ui/button";
import { ChevronRight, Save } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "store/index";

import { toast } from "sonner";
import PurchaseRequestAPI from "services/procurementApi/purchase-sample-request ";
import { useGetAllProjectsQuery } from "services/project";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "components/ui/table";
// import FormInput from "atoms/FormInput";
import { Form } from "components/ui/form";
import { Link, useNavigate } from "react-router-dom";
import { RouteEnum } from "constants/RouterConstants";
import useQuery from "hooks/useQuery";

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
  activity_budget: z.string().optional(),
  budget_expended: z.string().optional(),
  balance: z.string().optional(),
});

type FormData = z.infer<typeof UploadSchema>;

const CheckboxForm = () => {
  const query = useQuery();
  const id = query.get("id");
  const request = query.get("request");

  const navigate = useNavigate();

  const activity = useSelector((state: RootState) => state.activity.activity);
  const mergedObject = activity.reduce((acc: any, obj: any) => {
    return { ...acc, ...obj };
  }, {});

  const { data: projects } = useGetAllProjectsQuery({
    page: 1,
    size: 2000000,
  });

  const { data: requestsDetails } = PurchaseRequestAPI.useGetActivityMemoQuery(
    useMemo(
      () => ({
        path: { id: id as string },
      }),
      [id]
    )
  );

  const form = useForm<FormData>({
    resolver: zodResolver(UploadSchema),
    defaultValues: {
      beneficiaries: [],
      integratedTraining: "",
    },
  });

  const { control, handleSubmit, setValue, watch } = form;

  const integratedTraining = watch("integratedTraining");
  const beneficiary = watch("beneficiaries");

  // Update default values when beneficiaries data is available
  useEffect(() => {
    if (projects?.data?.results) {
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

  useEffect(() => {
    if (requestsDetails) {
      setValue(
        "activity_budget",
        // @ts-ignore

        requestsDetails.activity_budget
      );
      setValue(
        "budget_expended",
        // @ts-ignore

        requestsDetails.budget_expended
      );
      setValue(
        "balance",
        // @ts-ignore

        requestsDetails.balance
      );
    }
  }, [requestsDetails, setValue]);

  // Reset beneficiaries when integratedTraining is "false"
  useEffect(() => {
    if (integratedTraining === "false") {
      setValue(
        "beneficiaries",
        // @ts-ignore

        projects?.data?.results.map(({ name, id }) => ({
          name,
          selected: false,
          id,
        }))
      );
    }
  }, [integratedTraining, projects, setValue]);

  const [createActivityMemoMutation] =
    PurchaseRequestAPI.useCreateActivityMemoMutation();

  // const dispatch = useDispatch();
  const onSubmit = async (data: FormData) => {
    // dispatch(activityActions.clearActivity());

    // Define your programAreas array
    // const programAreas = []; // Example IDs of program areas

    // Filter the beneficiaries based on selected and IDs in programAreas
    const filteredBeneficiaries = data?.beneficiaries?.filter(
      (beneficiary) => beneficiary.selected
    );
    const program_area = filteredBeneficiaries.map((fb) => fb.id);

    const payload = {
      activity: mergedObject.activity,
      activity_budget: data.activity_budget,
      approved_by: mergedObject.approved_by,
      balance: data.balance,
      location: "south park",
      // copy: mergedObject.copy,
      // subject: mergedObject.subject,
      budget_line: mergedObject.budget_line,
      comment: mergedObject.comment,
      cost_categories: mergedObject.cost_categories,
      cost_input: mergedObject.cost_input,
      created_by: mergedObject.created_by,
      expenses: mergedObject.expenses,
      fconumber: mergedObject.fconumber,
      funding_source: mergedObject.funding_source,
      intervention_areas: mergedObject.intervention_areas,
      requested_date: mergedObject.requested_date,
      reviewed_by: mergedObject.reviewed_by,
      program_area: program_area[0],
      budget_expended: data.budget_expended,
    };

    try {
      await createActivityMemoMutation(payload).unwrap();
      navigate(RouteEnum.SAMPLE_PREVIEW);
      toast.success("Successfully created.");
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  };

  const filteredBeneficiaries = beneficiary?.filter(
    (beneficiary) => beneficiary.selected
  );

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-10'>
        <Card className='border-yellow-darker flex flex-col gap-2 justify-between'>
          <h2 className='font-semibold text-base'>Project Area(s)</h2>
          <div className='flex justify-between gap-2'>
            <p>
              Is the training an integrated training (contains more than one
              project area)?
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
                  Please select Project Area(s):
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
                  To be completed by Projects
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
                          {mergedObject?.selectedActivity?.activity_code ||
                            requestsDetails?.activity}
                        </TableCell>
                        <TableCell>
                          {mergedObject?.selectedCostCategory?.name ||
                            // @ts-ignore
                            requestsDetails?.cost_categories[0]}
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
                          <Controller
                            name='activity_budget'
                            control={control}
                            render={({ field }) => (
                              <>
                                <input
                                  type='text'
                                  className='w-full h-full border-none rounded-none p-2'
                                  {...field}
                                />
                              </>
                            )}
                          />
                        </TableCell>
                        <TableCell className='p-2 rounded-none h-2'>
                          <Controller
                            name='budget_expended'
                            control={control}
                            render={({ field }) => (
                              <>
                                <input
                                  type='text'
                                  className='w-full h-full border-none rounded-none p-2'
                                  {...field}
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
                                  className='w-full h-full border-none rounded-none p-2'
                                  {...field}
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
        <div className=''>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell className='text-center'>
                  To be completed by Projects
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
                        <TableCell className='w-[300px]'>Award ID</TableCell>
                        <TableCell className='w-[150px]'>% Charged</TableCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBeneficiaries.map(({ id }) => (
                        <TableRow key={id} className='h-[80px]'>
                          <TableCell>Award ID: {id}</TableCell>
                          <TableCell>100 % </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableCell>

                <TableCell className='p-0'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableCell className='w-[280px]'>
                          Budgeted for this activity (N)
                        </TableCell>

                        <TableCell className='w-[300px]'>
                          Expended (N) for this activity
                        </TableCell>
                        <TableCell className='w-[280px]'>Balance</TableCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBeneficiaries.map(({ id }) => (
                        <TableRow key={id} className='h-[80px]'>
                          <TableCell>
                            {" "}
                            <Controller
                              name='activity_budget'
                              control={control}
                              render={({ field }) => (
                                <>
                                  <input
                                    type='text'
                                    className='w-full h-full border-none rounded-none p-2'
                                    {...field}
                                  />
                                </>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <Controller
                              name='budget_expended'
                              control={control}
                              render={({ field }) => (
                                <>
                                  <input
                                    type='text'
                                    className='w-full h-full border-none rounded-none p-2'
                                    {...field}
                                  />
                                </>
                              )}
                            />{" "}
                          </TableCell>
                          <TableCell className='p-2 rounded-none h-2'>
                            <Controller
                              name='balance'
                              control={control}
                              render={({ field }) => (
                                <>
                                  <input
                                    type='text'
                                    className='w-full h-full border-none rounded-none p-2'
                                    {...field}
                                  />
                                </>
                              )}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className='w-full px-4'>
          {!requestsDetails && (
            <Button
              type='submit'
              className='mt-4 px-4 py-2 bg-alternate text-primary rounded w-full'
            >
              <Save size={20} />
              Save
            </Button>
          )}

          {requestsDetails && (
            <Link
              className='w-fit'
              to={{
                pathname: RouteEnum.FINAL_PREVIEW,
                search: `?id=${id}&request=${request}`,
              }}
            >
              <Button className='mt-4 px-4 py-2 rounded w-full'>
                <ChevronRight size={20} />
                Next
              </Button>
            </Link>
          )}
        </div>
      </form>
    </Form>
  );
};

export default CheckboxForm;
