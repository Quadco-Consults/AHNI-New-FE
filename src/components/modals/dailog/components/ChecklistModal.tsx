// import logoPng from "assets/svgs/logo-bg-svg";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
//@ts-ignore
import logoPng from "assets/imgs/logo.png";
import { ScrollArea } from "components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import { Checkbox } from "components/ui/checkbox";
import { useForm } from "react-hook-form";
import { useMemo, useState } from "react";
import SupportiveSupervisionAPI from "services/programsApi/suportive-supervision";
import EvaluationCategoriesAPI from "services/programsApi/evaluation-categories";
import { LoadingSpinner } from "components/shared/Loading";
import { EvaluationCategoryData } from "definations/program-types/evaluation-category";
import { SupportiveSupervisionEvaluationData } from "definations/program-types/supportive-supervision";
import { FormControl, Form, FormField, FormItem } from "components/ui/form";
import FormButton from "atoms/FormButton";
import { toast } from "sonner";
import { useAppDispatch } from "hooks/useStore";
import { closeDialog } from "store/ui";

const ChecklistModal = () => {
  const [categoryValue, setCategoryValue] = useState("");
  const dispatch = useAppDispatch();

  const { data, isLoading: criteriaLoading } =
    SupportiveSupervisionAPI.useGetSupportiveSupervisionsEvaluationCriteriaQuery(
      useMemo(
        () => ({ params: { category_id: categoryValue } }),
        [categoryValue]
      )
    );
  const [createSupportiveSupervisionMutation, { isLoading: isSubmitting }] =
    SupportiveSupervisionAPI.useCreateSupportiveSupervisionMutation();

  const { data: EvaluationCategoryData, isLoading } =
    EvaluationCategoriesAPI.useGetEvaluationCategoriesQuery();

  const handleCategory = (value: string) => {
    setCategoryValue(value);
  };

  const form = useForm({
    defaultValues: {
      evaluation_criteria: [],
    },
  });

  const compositionData = JSON.parse(
    localStorage.getItem("compositionData") as string
  );

  const onSubmit = async (data: any) => {
    const formData = {
      ...compositionData,
      evaluation_criteria: data.evaluation_criteria,
    };

    try {
      await createSupportiveSupervisionMutation(formData).unwrap();
      toast.success("Successfully created");
      localStorage.removeItem("compositionData");
      dispatch(closeDialog());
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col mt-10 items-center justify-center w-full h-[80vh] ">
          <ScrollArea className="h-[90%]">
            <div className="flex flex-col items-center justify-between">
              <div>
                <img src={logoPng} alt="logo" width={150} />
              </div>
              <h4 className="mt-8 text-lg font-bold">Evaluation Criteria</h4>
              <p className="mt-5 text-muted-foreground">
                You can switch between evaluation categories and select all
                relevant questions
              </p>

              <div className="w-8/12 mt-6">
                <Select onValueChange={handleCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select evaluation category" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoading ? (
                      <LoadingSpinner />
                    ) : (
                      EvaluationCategoryData?.map(
                        (category: EvaluationCategoryData) => (
                          <SelectItem key={category?.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        )
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <h2 className="text-center my-10 text-yellow-500">
              Management System (Assess every 6 months; first visit at the
              beginning of the FY and first visit after SAPR)
            </h2>

            {criteriaLoading ? (
              <LoadingSpinner />
            ) : (
              <FormField
                control={form.control}
                name="evaluation_criteria"
                render={() => (
                  <FormItem className="grid grid-cols-2 gap-5 bg-gray-100 mt-10 p-5 rounded-lg shadow-inner md:grid-cols-3">
                    {data?.map(
                      (criteria: SupportiveSupervisionEvaluationData) => (
                        <FormField
                          key={criteria?.id}
                          control={form.control}
                          name="evaluation_criteria"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={criteria?.id}
                                className="flex p-5 bg-white border rounded-lg gap-3 items-center "
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(
                                      criteria?.id
                                    )}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...field.value,
                                            criteria?.id,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== criteria?.id
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <div className="text-sm space-y-1">
                                  <h4>{criteria?.name}</h4>
                                </div>
                              </FormItem>
                            );
                          }}
                        />
                      )
                    )}
                  </FormItem>
                )}
              />
            )}
          </ScrollArea>
          <div className="flex justify-end w-full my-5">
            <div className="flex items-center gap-x-4">
              {/* <p className="text-sm font-medium text-primary">
                2 Criteria Selected
              </p> */}
              <FormButton
                loading={isSubmitting}
                disabled={isSubmitting}
                type="submit"
              >
                Save & Continue
              </FormButton>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default ChecklistModal;
