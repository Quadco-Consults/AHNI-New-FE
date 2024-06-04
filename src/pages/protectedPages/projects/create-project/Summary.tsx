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
import LocationSvg from "assets/svgs/LocationSvg";

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
                <Label className="font-semibold">Target population</Label>
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

              {/* <FormInput name="population" label="Target population" /> */}

              <div className="flex flex-col w-full mt-10 space-y-3">
                <Label className="font-semibold">Consortium partners</Label>
                <div className="flex flex-wrap gap-3">
                  {[
                    {
                      location: "Abuja",
                      partner: [
                        "Family Health International (FHI 360)",
                        "The American University of Nigeria-AUN",
                      ],
                    },
                    {
                      location: "Kaduna",
                      partner: [
                        "The American University of Nigeria-AUN",
                        "The American University of Nigeria-AUN",
                      ],
                    },
                    {
                      location: "Jigawa",
                      partner: [
                        "Ekklesiyar ‘Yan uwa a Nigeria (EYN)",
                        "The American University of Nigeria-AUN",
                      ],
                    },
                  ].map((option: any, index: number) => (
                    <div
                      key={index}
                      className="border px-7 py-4 space-y-3 rounded-lg"
                    >
                      <div className="flex gap-3 items-center">
                        <LocationSvg />{" "}
                        <h4 className="font-semibold">{option.location}</h4>
                      </div>
                      <ul className="text-sm text-[#756D6D] space-y-2">
                        {option.partner.map(
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
                    Click to select consortium partners that applies
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
