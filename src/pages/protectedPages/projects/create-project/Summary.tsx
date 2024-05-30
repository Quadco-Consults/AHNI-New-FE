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
import { ChevronRight } from "lucide-react";
import { FormField, FormItem, Form, FormControl } from "components/ui/form";
import Card from "components/shared/Card";
import FormInput from "atoms/FormInput";
import MultiSelectFormField from "components/ui/multiselect";

const frameworksList = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];

const Summary = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  const dispatch = useAppDispatch();

  const form = useForm();

  const { pathname } = useLocation();

  const { handleSubmit } = form;

  const onSubmit = () => {
    let path = pathname;

    path = path.substring(0, path.lastIndexOf("/"));

    path += "/summary";
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
              <FormInput name="goal" label="Goal of the project" />
              <hr />

              <div className="flex flex-col w-[299px] mt-10 space-y-3">
                <Label className="font-semibold text-red-600">Objectives</Label>
                <Button
                  type="button"
                  variant="outline"
                  className="text-[#DEA004]"
                  onClick={() => {
                    dispatch(
                      openDialog({
                        type: DialogType.ProjectObjectiveModal,
                        dialogProps: {
                          width: "max-w-2xl",
                          height: "max-h-[700px]",
                        },
                      })
                    );
                  }}
                >
                  Click to add objectives
                </Button>
              </div>

              <FormInput name="result" label="Expected results" />

              <div className="space-y-1">
                <Label className="font-semibold">Location of the project</Label>
                <p className="text-xs font-light">
                  Enter all locations that applies and press the “Enter” key
                  after each location
                </p>
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <MultiSelectFormField
                          options={frameworksList}
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

              <FormInput name="population" label="Target population" />

              <div className="flex flex-col w-[350px] mt-10 space-y-3">
                <Label className="font-semibold">Consortium partners</Label>
                <Button
                  type="button"
                  variant="outline"
                  className="text-[#DEA004]"
                  onClick={() => {
                    dispatch(
                      openDialog({
                        type: DialogType.StateModal,
                        dialogProps: {
                          width: "max-w-5xl",
                        },
                      })
                    );
                  }}
                >
                  Click to select consortium partners that applies
                </Button>
              </div>
            </Card>

            <div className="flex justify-end gap-5 mt-16">
              <Button type="button" className="bg-[#FFF2F2] text-primary ">
                Cancel
              </Button>
              <FormButton suffix={<ChevronRight size={14} />}>Next</FormButton>
            </div>
          </form>
        </Form>
      </ProjectLayout>
    </div>
  );
};

export default Summary;
