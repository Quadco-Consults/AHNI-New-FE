import LongArrowLeft from "components/icons/LongArrowLeft";
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
import beneficiariesAPi from "services/beneficiariesApi";
import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProjectsSummarySchema } from "definations/validator";
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
import projectsAPi from "services/projectsApi";
import { toast } from "sonner";
import { closeDialog } from "store/ui";
import { format } from "date-fns";
import { cn } from "lib/utils";
import { Calendar } from "components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import FundingSourceAPi from "services/funding-sourceApi";
import { partnerActions } from "store/formData/partner-location";

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

  const goBack = () => {
    navigate(-1);
  };

  const dispatch = useAppDispatch();
  const location_partners = useSelector(
    (state: RootState) => state.partnerLocation.items
  );

  const form = useForm<z.infer<typeof ProjectsSummarySchema>>({
    resolver: zodResolver(ProjectsSummarySchema),
    defaultValues: {
      // project_id: "5667e",
      title: "",
      goal: "",
      budget: "",
      funding_source: [],
      project_manager: "",
      objectives: "",
      expected_results: "",
      beneficiaries: [],
    },
  });

  const { pathname } = useLocation();

  const { handleSubmit } = form;

  const onSubmit = async (data: z.infer<typeof ProjectsSummarySchema>) => {
    const formData = {
      project_id: "f12345",
      objectives: [
        {
          title: data.objectives,
          sub_objectives: inputValues,
        },
      ],
      project_manager: data.project_manager,
      location_partners,
      goal: data.goal,
      expected_results: data.expected_results,
      beneficiaries: data.beneficiaries,
      funding_source: data.funding_source,
      title: data.title,
      budget: Number(data.budget),
      start_date: startDate && format(startDate, "yyy-MM-dd"),
      end_date: endDate && format(endDate, "yyy-MM-dd"),
    };

    try {
      projectsMutation(formData).unwrap();
      toast.success("Project successfully added.");
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }

    dispatchPartner(partnerActions.clearPartnerLocation());

    let path = pathname;

    path = path.substring(0, path.lastIndexOf("/"));

    path += "/performance";
    navigate(path);
  };

  return (
    <div className="space-y-6 min-h-screen">
      <button
        onClick={goBack}
        className="w-[3rem] h-[3rem] rounded-full drop-shadow-md bg-white flex items-center justify-center"
      >
        <LongArrowLeft />
      </button>

      <ProjectLayout>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="space-y-6 py-5">
              <h4 className="text-lg font-semibold">Project Summary</h4>
              <FormInput name="title" label="Project Name" />
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
                  name="funding_source"
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

              <div className="w-[299px] mt-10 space-y-3">
                <Label className="font-semibold text-red-600">Objectives</Label>
                <div>
                  <Dialog>
                    <DialogTrigger>
                      <p className="text-[#DEA004] font-medium border shadow-sm py-2 px-5 rounded-lg text-sm">
                        Click to add objectives
                      </p>
                    </DialogTrigger>
                    <DialogContent>
                      <div className="space-y-10">
                        <h4 className="text-xl font-semibold">Add Objective</h4>

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
                            <Button onClick={() => dispatch(closeDialog())}>
                              Done
                            </Button>
                          </DialogClose>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
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
                        <h4 className="font-semibold">{option.location_id}</h4>
                      </div>
                      <ul className="text-sm text-[#756D6D] space-y-2">
                        {option.partner_ids.map(
                          (partner: string, index: number) => (
                            <li key={index} className=" list-disc">
                              {partner}
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
      </ProjectLayout>
    </div>
  );
};

export default Summary;
