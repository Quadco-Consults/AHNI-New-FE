"use client";

import React, { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "components/ui/separator";
import Card from "components/Card";
import { Button } from "components/ui/button";
import { ChevronRight, Save } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/index";

import { toast } from "sonner";
import { useGetActivityMemo, usePatchActivityMemo, useCreateActivityMemo } from "@/features/procurement/controllers/activityMemoController";
import { useGetAllProjects } from "@/features/projects/controllers/projectController";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "components/ui/table";
// import FormInput from "components/atoms/FormInput";
import { Form } from "components/ui/form";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { RouteEnum } from "constants/RouterConstants";
import { skipToken } from "@reduxjs/toolkit/query";
import { activityActions } from "store/formData/activity-memo";

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
        project_id: z.string(),
      })
    ),
  integratedTraining: z.string().nonempty(),
  activity_budget: z.string().optional(),
  budget_expended: z.string().optional(),
  balance: z.string().optional(),
}).refine((data) => {
  // If integrated training is true, at least one beneficiary must be selected
  if (data.integratedTraining === "true") {
    return data.beneficiaries.some(b => b.selected);
  }
  // If integrated training is false, validation passes regardless of beneficiaries
  return true;
}, {
  message: "Please select at least one project area when integrated training is enabled",
  path: ["beneficiaries"]
});

type FormData = z.infer<typeof UploadSchema>;

const CheckboxForm = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const request = searchParams.get("request");

  const router = useRouter();
  const dispatch = useDispatch();

  const activity = useSelector((state: RootState) => state.activity.activity);
  console.log("Redux activity data:", activity);
  const mergedObject = activity.reduce((acc: any, obj: any) => {
    return { ...acc, ...obj };
  }, {});
  console.log("Merged activity data:", mergedObject);
  console.log("Available merged object keys:", Object.keys(mergedObject));
  console.log("Selected activity:", mergedObject?.selectedActivity);
  console.log("Selected cost category:", mergedObject?.selectedCostCategory);

  // Get memo ID for potential update
  const memoId = mergedObject.createdMemoId;
  console.log("Memo ID for update:", memoId);

  // Initialize hooks for both update and create scenarios
  const { patchActivityMemo, isLoading: isPatchLoading } = usePatchActivityMemo(memoId || "dummy");
  const { createActivityMemo: createNewActivityMemo, isLoading: isCreateLoading } = useCreateActivityMemo();

  const { data: projects } = useGetAllProjects({
    page: 1,
    size: 2000000,
  });

  // const { data: requestsDetails } = PurchaseRequestAPI.useGetActivityMemo(
  //   useMemo(
  //     () => ({
  //       path: { id: id as string },
  //     }),
  //     [id]
  //   )
  // );
  const { data: requestsDetails } = useGetActivityMemo(id as string, !!id);

  // Extract data from nested structure - try both direct and data property
  const apiData = requestsDetails?.data || requestsDetails;

  const form = useForm<FormData>({
    resolver: zodResolver(UploadSchema),
    defaultValues: {
      beneficiaries: [],
      integratedTraining: "",
      activity_budget: "",
      budget_expended: "",
      balance: "",
    },
  });

  const { control, handleSubmit, setValue, watch, getValues, formState: { errors } } = form;

  const integratedTraining = watch("integratedTraining");
  const beneficiary = watch("beneficiaries");

  useEffect(() => {}, []);

  const lon = getValues();

  console.log({ requestsDetails, projects, lon, request });

  // Update default values when beneficiaries data is available
  useEffect(() => {
    if (projects?.data?.results) {
      setValue(
        "beneficiaries",
        // @ts-ignore

        projects?.data?.results.map(({ title, id, project_id }) => ({
          name: title,
          selected: false,
          id,
          project_id,
        }))
      );
    }
  }, [projects, setValue]);

  useEffect(() => {
    if (requestsDetails) {
      setValue(
        "activity_budget",
        // @ts-ignore
        requestsDetails.activity_budget || ""
      );
      setValue(
        "budget_expended",
        // @ts-ignore
        requestsDetails.budget_expended || ""
      );
      setValue(
        "balance",
        // @ts-ignore
        requestsDetails.balance || ""
      );
    }
  }, [requestsDetails, setValue]);

  // useEffect(() => {
  //   const balance = Number(activityBudget) - Number(budgets) || 0;
  //   setValue("balance", balance);
  // }, [setValue, activityBudget, budgets]);

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

  useEffect(() => {
    if (request) {
      setValue(
        "integratedTraining",
        // @ts-ignore
        "true"
      );
    }

    if (requestsDetails?.project_area && projects?.data?.results) {
      setValue(
        "beneficiaries",
        // @ts-ignore
        projects?.data?.results.map(({ title, id, project_id }) => ({
          name: title,
          selected: id === requestsDetails?.project_area ? true : false,
          id,
          project_id,
        }))
      );
    }
  }, [request, setValue, requestsDetails, projects]);

  const { createActivityMemo, data: createResponse, isLoading: isCreating, isSuccess, error } =
    useCreateActivityMemo();

  // Handle successful creation and redirect
  // NOTE: Removed automatic redirect since we're already on the preview page
  // The form component handles the initial redirect to this page
  // useEffect(() => {
  //   if (isSuccess && createResponse?.data?.id) {
  //     router.push(`${RouteEnum.PREVIEW_LETTER}?id=${createResponse.data.id}&created=${"true"}`);
  //   } else if (isSuccess) {
  //     // Fallback: redirect without ID if we can't get it
  //     router.push(`${RouteEnum.PREVIEW_LETTER}?created=${"true"}`);
  //   }
  // }, [isSuccess, createResponse, router]);

  // const dispatch = useDispatch();
  const onSubmit = async (data: FormData) => {
    // Filter the beneficiaries based on selected and IDs in programAreas
    const filteredBeneficiaries = data?.beneficiaries?.filter(
      (beneficiary) => beneficiary.selected
    );
    const program_area = filteredBeneficiaries.map((fb) => fb.id);
    const payload = {
      // activity: mergedObject.activity, // Excluded - ActivityPlan vs ActivityPlanFromWorkPlan mismatch
      activity_budget: data.activity_budget,
      created_by: mergedObject.created_by,
      approved_by: mergedObject.approved_by,
      reviewed_by: mergedObject.copy,
      authorized_by: mergedObject.through,
      is_program: true,
      balance: data.balance,
      subject: mergedObject.subject,
      budget_line: mergedObject.budget_line,
      comment: mergedObject.comment,
      cost_categories: mergedObject.cost_categories,
      cost_input: mergedObject.cost_input,
      expenses: mergedObject.expenses,
      fconumber: mergedObject.fconumber,
      funding_source: mergedObject.funding_source,
      intervention_areas: mergedObject.intervention_areas,
      requested_date: mergedObject.requested_date,
      project_area: program_area[0],
      budget_expended: data.budget_expended,
    };
    console.log({ payload, here: "I am here" });

    try {
      if (request) {
        // If there's a request parameter, we're in the purchase request workflow
        // Update the existing memo and then navigate to final preview
        if (id) {
          await patchActivityMemo(payload);
          console.log("Patched activity memo with payload:", payload);
          toast.success("Successfully updated.");
          router.push(`${RouteEnum.FINAL_PREVIEW}?id=${id}&request=${request}`);
        } else {
          toast.error("Missing activity memo ID");
        }
      } else if (memoId && memoId !== "dummy") {
        // Update the existing memo with additional budget information
        await patchActivityMemo(payload);
        console.log("Patched activity memo with payload:", payload);
        toast.success("Successfully updated.");

        // Navigate to final preview page with the memo ID
        router.push(`${RouteEnum.FINAL_PREVIEW}?id=${memoId}&created=true`);
      } else {
        // If no memo ID, create a new memo (fallback)
        await createNewActivityMemo(payload);
        console.log("Created new activity memo with payload:", payload);
        toast.success("Successfully created.");

        // Note: createActivityMemo doesn't return response directly,
        // so we navigate without specific ID
        router.push(`${RouteEnum.FINAL_PREVIEW}?created=true`);
      }

      // Don't clear activity data yet - we need it for the next page
      // dispatch(activityActions.clearActivity());
    } catch (error) {
      toast.error("Something went wrong updating memo");
      console.log("Error updating memo:", error);
    }
  };

  const filteredBeneficiaries = beneficiary?.filter(
    (beneficiary) => beneficiary.selected
  );

  const activity_budget = watch(`activity_budget`);
  const budget_expended = watch(`budget_expended`);
  const total_balance = Number(activity_budget || 0) - Number(budget_expended || 0);

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
                        field.value.map((beneficiary, index) => {
                          return (
                            <div
                              key={beneficiary.id}
                              className='flex items-center gap-2'
                            >
                              <Checkbox
                                checked={beneficiary.selected}
                                // value={}
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
                          );
                        })
                      }
                    />
                  </div>
                </div>
                {errors.beneficiaries && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.beneficiaries.message}
                  </p>
                )}
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
                            mergedObject?.selectedActivity?.code ||
                            mergedObject?.activity_code ||
                            requestsDetails?.activity_detail?.code ||
                            requestsDetails?.activity ||
                            "N/A"}
                        </TableCell>
                        <TableCell>
                          {mergedObject?.selectedCostCategory?.name ||
                            mergedObject?.selectedCostCategory?.module_name ||
                            mergedObject?.selectedCostCategory?.description ||
                            mergedObject?.cost_category_name ||
                            // @ts-ignore
                            requestsDetails?.cost_categories_details?.[0]?.module_name ||
                            requestsDetails?.cost_categories_details?.[0]?.name ||
                            "N/A"}
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
                                  value={field.value || ""}
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
                                  value={field.value || ""}
                                />
                              </>
                            )}
                          />
                        </TableCell>
                        <TableCell className='p-2 rounded-none h-2'>
                          <input
                            value={Number(total_balance).toLocaleString()}
                            type='text'
                            className='w-full h-full border-none rounded-none p-2'
                            disabled
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
                      {filteredBeneficiaries?.map((data) => {
                        return (
                          <TableRow key={data?.id} className='h-[80px]'>
                            <TableCell>Award ID: {data?.project_id}</TableCell>
                            <TableCell>100 % </TableCell>
                          </TableRow>
                        );
                      })}
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
                      {filteredBeneficiaries?.map(({ id }) => (
                        <TableRow key={id} className=''>
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
                                    value={field.value || ""}
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
                                    value={field.value || ""}
                                  />
                                </>
                              )}
                            />{" "}
                          </TableCell>
                          <TableCell className='p-2 rounded-none h-2'>
                            <input
                              value={Number(total_balance).toLocaleString()}
                              type='text'
                              className='w-full h-full border-none rounded-none p-2'
                              disabled
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
          {!request && (
            <Button
              type='submit'
              className='mt-4 px-4 py-2 bg-alternate text-primary rounded w-full'
            >
              <Save size={20} />
              Save
            </Button>
          )}

          {request && (
            <Button
              type='submit'
              className='mt-4 px-4 py-2 rounded w-full'
            >
              <ChevronRight size={20} />
              Next
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default CheckboxForm;
