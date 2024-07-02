import { useAppDispatch } from "hooks/useStore";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import ProjectLayout from "./ProjectLayout";
import { Button } from "components/ui/button";
import FormButton from "atoms/FormButton";
import { Label } from "components/ui/label";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import { CalendarIcon, ChevronRight, X } from "lucide-react";
import { FormField, FormItem, Form, FormControl } from "components/ui/form";
import Card from "components/shared/Card";
import FormInput from "atoms/FormInput";
import MultiSelectFormField from "components/ui/multiselect";
import LocationSvg from "assets/svgs/LocationSvg";
import beneficiariesAPi from "services/projectsApi/beneficiariesApi";
import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProjectsSummarySchema } from "definations/project-validator";
import { z } from "zod";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "components/ui/dialog";
import FormTextArea from "atoms/FormTextArea";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/index";
import projectsAPi from "services/projectsApi/projectsApi";
import { toast } from "sonner";
import { closeDialog } from "store/ui";
import { format } from "date-fns";
import { cn } from "lib/utils";
import { Calendar } from "components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import FundingSourceAPi from "services/projectsApi/funding-sourceApi";
import { partnerActions } from "store/formData/project-values";
import { objectivesActions } from "store/formData/project-objective";
import { IndexKind, isIndexSignatureDeclaration } from "typescript";

interface InputValues {
  title: string;
}

const Summary = () => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const dispatchPartner = useDispatch();
  const beneficiariesQueryResults = beneficiariesAPi.useGetBeneficiariesQuery(
    useMemo(
      () => ({
        params: {
          // fields: "id,name",
          no_paginate: false,
          // page_size: pagination.pageSize,
          // page: pagination.pageIndex + 1,
        },
      }),
      []
    )
  );
  const fundingSourceQueryResults = FundingSourceAPi.useGetFundingSourcesQuery(
    useMemo(
      () => ({
        params: {
          // fields: "id,name",
          no_paginate: false,
          // page_size: pagination.pageSize,
          // page: pagination.pageIndex + 1,
        },
      }),
      []
    )
  );
  const [projectsMutation, { isLoading }] =
    projectsAPi.useCreateProjectMutation();

  const [inputValues, setInputValues] = useState<InputValues[]>([]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    index: number,
    field: keyof InputValues
  ) => {
    const newInputValues = [...inputValues];
    newInputValues[index][field] = e.target.value;
    setInputValues(newInputValues);
  };

  const handleAddInput = (e: React.FormEvent) => {
    e.preventDefault();
    const newInputValues = [...inputValues, { title: "" }];
    setInputValues(newInputValues);
  };

  const handleDeleteInput = (index: number) => {
    const newInputValues = inputValues.filter((_, i) => i !== index);
    setInputValues(newInputValues);
  };

  const beneficiariesData = beneficiariesQueryResults?.data?.results;
  const fundingSourceData = fundingSourceQueryResults?.data?.results;

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const location_partners = useSelector(
    (state: RootState) => state.partnerLocation.items
  );
  const idsObj = location_partners?.map((partner: any) => partner.ids);

  const objs = useSelector((state: RootState) => state.objectives.objectives);

  const form = useForm<z.infer<typeof ProjectsSummarySchema>>({
    resolver: zodResolver(ProjectsSummarySchema),
    defaultValues: {
      project_id: "",
      title: "",
      goal: "",
      budget: "",
      project_funding_source: [],
      project_manager: "",
      objectives: "",
      expected_results: "",
      beneficiaries: [],
    },
  });

  const { pathname } = useLocation();

  const { handleSubmit, watch } = form;
  const objTitle = watch("objectives");

  const addObjectivesHandler = () => {
    const submittedValues = {
      title: objTitle,
      sub_objectives: inputValues,
    };

    dispatchPartner(objectivesActions.addObjectives(submittedValues));
    dispatch(closeDialog());
  };

  const onSubmit = async (data: z.infer<typeof ProjectsSummarySchema>) => {
    const formData = {
      project_id: data.project_id,
      objectives: [
        {
          title: data.objectives,
          sub_objectives: inputValues,
        },
      ],
      project_manager: data.project_manager,
      location_partners: idsObj,
      goal: data.goal,
      expected_results: data.expected_results,
      beneficiaries: data.beneficiaries,
      funding_source: data.project_funding_source,
      title: data.title,
      budget: Number(data.budget),
      start_date: startDate && format(startDate, "yyy-MM-dd"),
      end_date: endDate && format(endDate, "yyy-MM-dd"),
    };

    try {
      const res = await projectsMutation(formData).unwrap();
      console.log(res?.data.id);
      localStorage.setItem("projectID", res?.data.id);
      toast.success("Project successfully added.");
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }

    dispatchPartner(partnerActions.clearPartnerLocation());
    dispatchPartner(objectivesActions.clearObjectives());

    let path = pathname;

    path = path.substring(0, path.lastIndexOf("/"));

    path += "/uploads";
    navigate(path);
  };

  return (
    <ProjectLayout>
      <div className="space-y-6">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="space-y-6 py-5">
              <h4 className="text-lg font-semibold">Project Summary</h4>
              <FormInput name="title" label="Project Name" />
              <FormInput name="project_id" label="Project ID" />
              <FormInput name="goal" label="Goal of the project" />

              <div className="flex gap-5">
                <div>
                  <Label>Start Date</Label>
                  <br />
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[280px] justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? (
                          format(startDate, "yyy-MM-dd")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>{" "}
                <div>
                  <Label>End Date</Label>
                  <br />
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[280px] justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? (
                          format(endDate, "yyy-MM-dd")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
                <FormInput name="budget" label="Budget" />

                <FormInput
                  required
                  name="project_manager"
                  label="Project Manager"
                />
              </div>

              <div>
                <Label className="font-semibold">Funding Source</Label>
                <FormField
                  control={form.control}
                  name="project_funding_source"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <MultiSelectFormField
                          options={fundingSourceData || []}
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          placeholder="Select options"
                          variant="inverted"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <hr />

              <div className=" mt-10 space-y-3">
                <Label className="font-semibold text-red-600">Objectives</Label>
                <div className="flex flex-wrap gap-3">
                  {objs?.map((option: any, index: number) => (
                    <div
                      key={index}
                      className="border px-7 py-4 space-y-3 rounded-lg"
                    >
                      <p className="text-sm font-semibold">{option?.title}</p>

                      {option?.sub_objectives && (
                        <ul className="space-y-2">
                          {option?.sub_objectives.map((obj: any, i: number) => (
                            <li
                              key={i}
                              className="text-sm text-gray-500 list-disc pl-5"
                            >
                              {obj?.title}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                  <div>
                    <Dialog>
                      <DialogTrigger>
                        <p className="text-[#DEA004] font-medium border shadow-sm py-2 px-5 rounded-lg text-sm">
                          Click to add objectives
                        </p>
                      </DialogTrigger>
                      <DialogContent>
                        <div className="space-y-10">
                          <h4 className="text-xl font-semibold">
                            Add Objective
                          </h4>

                          <FormTextArea name="objectives" label="Objective" />

                          <div className="space-y-3">
                            <h4 className="text-xl font-semibold">
                              Add Sub-Objective
                            </h4>

                            {inputValues.map((value, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <div className="w-[90%]">
                                  <textarea
                                    className="w-full border rounded-lg p-3"
                                    rows={3}
                                    onChange={(e) =>
                                      handleInputChange(e, index, "title")
                                    }
                                  />
                                </div>
                                <div>
                                  <Button
                                    onClick={() => handleDeleteInput(index)}
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-500"
                                  >
                                    <X />
                                  </Button>
                                </div>
                              </div>
                            ))}

                            <Button
                              onClick={handleAddInput}
                              type="button"
                              className="bg-[#FFF2F2] text-primary "
                            >
                              Add
                            </Button>
                          </div>

                          <div className="flex justify-end gap-5 mt-16">
                            <Button
                              type="button"
                              className="bg-[#FFF2F2] text-primary "
                            >
                              Cancel
                            </Button>

                            <DialogClose asChild>
                              <Button onClick={addObjectivesHandler}>
                                Done
                              </Button>
                            </DialogClose>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>

              <FormInput name="expected_results" label="Expected results" />

              <div className="space-y-1">
                <Label className="font-semibold">Target population</Label>
                <FormField
                  control={form.control}
                  name="beneficiaries"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <MultiSelectFormField
                          options={beneficiariesData || []}
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          placeholder="Select options"
                          variant="inverted"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* <FormInput name="population" label="Target population" /> */}

              <div className="flex flex-col w-full mt-10 space-y-3">
                <Label className="font-semibold">Consortium partners</Label>
                <div className="flex flex-wrap gap-3">
                  {location_partners.map((option: any, index: number) => (
                    <div
                      key={index}
                      className="border px-7 py-4 space-y-3 rounded-lg"
                    >
                      <div className="flex gap-3 items-center">
                        <LocationSvg />{" "}
                        <h4 className="font-semibold">
                          {option.obj.location_id}
                        </h4>
                      </div>
                      <ul className="text-sm text-[#756D6D] space-y-2">
                        {option.obj.partner_ids.map(
                          (partner: any, index: number) => (
                            <li key={index} className=" list-disc">
                              {partner.name}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    className="text-[#DEA004]"
                    onClick={() => {
                      dispatch(
                        openDialog({
                          type: DialogType.ConsortiumModal,
                          dialogProps: {
                            width: "max-w-6xl",
                          },
                        })
                      );
                    }}
                  >
                    Click to select consortium partners based on location
                  </Button>
                </div>
              </div>
            </Card>

            <div className="flex justify-between gap-5 mt-16">
              <Button type="button" className="bg-[#FFF2F2] text-primary ">
                Cancel
              </Button>
              <FormButton type="submit" suffix={<ChevronRight size={14} />}>
                Next
              </FormButton>
            </div>
          </form>
        </Form>
      </div>
    </ProjectLayout>
  );
};

export default Summary;
