import { Label } from "components/ui/label";
import LongArrowLeft from "components/icons/LongArrowLeft";
import Card from "components/shared/Card";
import DeleteIcon from "components/icons/DeleteIcon";
import { RouteEnum } from "constants/RouterConstants";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "components/ui/form";
import { useFieldArray, useForm } from "react-hook-form";
import FormInput from "atoms/FormInput";
import { useNavigate } from "react-router-dom";
import FormButton from "atoms/FormButton";
import { Button } from "components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
  DialogDescription,
  DialogClose,
} from "components/ui/dialog";
import { useEffect, useMemo, useState } from "react";
import logoPng from "assets/imgs/logo.png";
import { LoadingSpinner } from "components/shared/Loading";
import { Checkbox } from "components/ui/checkbox";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import StakeholderAPI from "services/programsApi/stakeholder";
import { StakeholderManagementResultsData } from "definations/program-types/stakeholder-management";
import StateAPI from "services/configs/state";
import { StakeholderMappingSchema } from "definations/program-validator";

const CreateAnalysis = () => {
  const [stateSearchParams, setStateSearchParams] = useState("");
  const [matchedStakeholdersData, setMatchedStakeholdersData] = useState<
    StakeholderManagementResultsData[]
  >([]);

  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  const handleStateValue = (value: string) => {
    setStateSearchParams(value);
  };

  const stakeholderQueryResult = StakeholderAPI.useGetStakeholdersQuery(
    useMemo(
      () => ({ params: { state: stateSearchParams } }),
      [stateSearchParams]
    )
  );
  const stateQueryResult = StateAPI.useGetStatesQuery();
  const stakeholders = stakeholderQueryResult?.data?.results;
  const states = stateQueryResult?.data;

  const data = matchedStakeholdersData.map(() => ({
    project_role: "",
    importance: "",
    major_concerns: "",
    influence: "",
    score: "",
    relationship_owner: "",
  }));
  console.log(data);

  const form = useForm<z.infer<typeof StakeholderMappingSchema>>({
    resolver: zodResolver(StakeholderMappingSchema),
    defaultValues: {
      stakeholders: data,
      submitted_stakeholders: [],
    },
  });

  const { handleSubmit, watch, control, setValue } = form;

  useEffect(() => {
    setValue("stakeholders", data);
  }, []);

  const { fields } = useFieldArray({
    control,
    name: "stakeholders",
  });
  console.log(watch("stakeholders"));

  useEffect(() => {
    const matchedStakeholders =
      stakeholders?.filter((stakeholder: StakeholderManagementResultsData) =>
        watch("submitted_stakeholders").includes(stakeholder?.id)
      ) || [];
    setMatchedStakeholdersData(matchedStakeholders);
  }, [watch("submitted_stakeholders")]);

  const onSubmit = () => {
    navigate(RouteEnum.PROGRAM_STAKEHOLDER_MANAGEMENT_ANALYSIS);
  };

  return (
    <div className="space-y-6 min-h-screen">
      <button
        onClick={goBack}
        className="w-[3rem] aspect-square rounded-full drop-shadow-md bg-white flex items-center justify-center"
      >
        <LongArrowLeft />
      </button>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="space-y-10 p-10">
            <div className="flex flex-col mt-10 space-y-3">
              <Label className="font-semibold">
                {matchedStakeholdersData.length} Stakeholders selected for this
                state
              </Label>

              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex flex-col items-center gap-5 md:flex-row"
                  >
                    <div className="bg-[#EBE8E1] space-y-4 rounded-lg p-3">
                      <h4 className="font-semibold">
                        {matchedStakeholdersData[index]?.stakeholder_name}
                      </h4>

                      <div className="text-sm">
                        <h4 className="font-semibold">
                          Institution/Organization:
                        </h4>
                        <p>
                          {
                            matchedStakeholdersData[index]
                              ?.institution_organization
                          }
                        </p>
                      </div>

                      <div className="grid text-xs grid-cols-2 gap-3">
                        <div>
                          <h4 className="font-semibold">Gender:</h4>
                          <p>{matchedStakeholdersData[index]?.gender}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold">Designation:</h4>
                          <p>{matchedStakeholdersData[index]?.designation}</p>
                        </div>
                      </div>

                      <div className="grid text-xs grid-cols-2 gap-3">
                        <div>
                          <h4 className="font-semibold">Phone Number:</h4>
                          <p>{matchedStakeholdersData[index]?.phone_number}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold">E-mail:</h4>
                          <p>{matchedStakeholdersData[index]?.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                      <FormInput
                        label="Project Role"
                        name={`stakeholders.${index}.project_role`}
                      />

                      <FormInput name="importance" label="Importance" />
                      <FormInput name="score" label="score" />
                      <FormInput name="major_concerns" label="Major Concerns" />
                      <FormInput
                        name="relationship_owner"
                        label="Relationship Owner"
                      />
                      <FormInput name="influence" label="Influence" />
                      {/* <div>
                          <Button className="flex gap-2 mt-3 py-6 bg-[#FFF2F2] text-red-500">
                            <DeleteIcon />
                            Remove Stakeholder
                          </Button>
                        </div> */}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Dialog>
                <DialogTrigger>
                  <div className="text-[#DEA004] font-medium border shadow-sm py-2 px-5 rounded-lg text-sm">
                    Click to select stakeholders that applies
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-6xl max-h-[700px] overflow-auto">
                  <DialogHeader className="mt-10 space-y-5 text-center">
                    <img
                      src={logoPng}
                      alt="logo"
                      className="mx-auto"
                      width={150}
                    />
                    <DialogTitle className="text-2xl text-center">
                      Stakeholders Register
                    </DialogTitle>
                    <DialogDescription className="text-center">
                      You can search with name, institution
                    </DialogDescription>
                  </DialogHeader>
                  <div className="w-1/3 mx-auto">
                    <Select onValueChange={handleStateValue}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project partner" />
                      </SelectTrigger>
                      <SelectContent>
                        {stateQueryResult?.isLoading ? (
                          <LoadingSpinner />
                        ) : (
                          states?.map((state: string, index: number) => (
                            <SelectItem key={index} value={state}>
                              {state}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-5 ">
                    {stakeholderQueryResult?.isLoading ? (
                      <LoadingSpinner />
                    ) : (
                      <FormField
                        control={form.control}
                        name="submitted_stakeholders"
                        render={() => (
                          <FormItem className="grid grid-cols-2 gap-5 bg-gray-100 mt-10 p-5 rounded-lg shadow-inner md:grid-cols-3">
                            {stakeholders?.map(
                              (
                                stakeholder: StakeholderManagementResultsData
                              ) => (
                                <FormField
                                  key={stakeholder?.id}
                                  control={form.control}
                                  name="submitted_stakeholders"
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={stakeholder.id}
                                        className="space-y-3 bg-white rounded-lg text-xs p-5"
                                      >
                                        <div className="flex items-center gap-4">
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value?.includes(
                                                stakeholder?.id
                                              )}
                                              onCheckedChange={(checked) => {
                                                return checked
                                                  ? field.onChange([
                                                      ...field.value,
                                                      stakeholder?.id,
                                                    ])
                                                  : field.onChange(
                                                      field.value?.filter(
                                                        (value) =>
                                                          value !==
                                                          stakeholder?.id
                                                      )
                                                    );
                                              }}
                                            />
                                          </FormControl>
                                          <h6 className="text-base text-yellow-600">
                                            {stakeholder?.stakeholder_name}
                                          </h6>
                                        </div>
                                        <div className="text-sm">
                                          <h4 className="font-semibold">
                                            Institution/Organization:
                                          </h4>
                                          <p>
                                            {
                                              stakeholder?.institution_organization
                                            }
                                          </p>
                                        </div>

                                        <div className="grid text-xs grid-cols-2 gap-3">
                                          <div>
                                            <h4 className="font-semibold">
                                              Gender:
                                            </h4>
                                            <p>{stakeholder?.gender}</p>
                                          </div>
                                          <div>
                                            <h4 className="font-semibold">
                                              Designation:
                                            </h4>
                                            <p>{stakeholder?.designation}</p>
                                          </div>
                                        </div>

                                        <div className="grid text-xs grid-cols-2 gap-3">
                                          <div>
                                            <h4 className="font-semibold">
                                              Phone Number:
                                            </h4>
                                            <p>{stakeholder?.phone_number}</p>
                                          </div>
                                          <div>
                                            <h4 className="font-semibold">
                                              E-mail:
                                            </h4>
                                            <p>{stakeholder?.email}</p>
                                          </div>
                                        </div>
                                      </FormItem>
                                    );
                                  }}
                                />
                              )
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <div className="flex justify-end">
                      <div className="flex gap-4 items-center">
                        <h6 className="text-primary">
                          {watch("submitted_stakeholders")?.length} categories
                          Selected
                        </h6>
                        <DialogClose>
                          <div className="flex items-center bg-primary text-primary-foreground rounded-md text-sm font-medium h-11 px-4 py-3 hover:opacity-60">
                            Save & Continue
                          </div>
                        </DialogClose>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </Card>

          <div className="flex justify-end gap-5 pt-10">
            <FormButton
              onClick={goBack}
              type="button"
              className="bg-[#FFF2F2] text-primary dark:text-gray-500"
            >
              Cancel
            </FormButton>

            <FormButton>Create</FormButton>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateAnalysis;
