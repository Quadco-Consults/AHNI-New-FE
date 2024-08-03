import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelectField";
import GoBack from "components/shared/GoBack";
import { Button } from "components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "components/ui/form";
import { SelectContent, SelectItem } from "components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
  DialogDescription,
  DialogClose,
} from "components/ui/dialog";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import logoPng from "assets/imgs/logo.png";
import { Input } from "components/ui/input";
import { Icon } from "@iconify/react";
import { LoadingSpinner } from "components/shared/Loading";
import { Checkbox } from "components/ui/checkbox";
import BreadcrumbCard from "components/shared/Breadcrumb";

const CreateCBA = () => {
  const navigate = useNavigate();

  const form = useForm({});
  const { control, handleSubmit, watch } = form;

  const onSubmit = (data: any) => {
    console.log(data);

    //    navigate(RouteEnum.RFQ);
  };

  const breadcrumbs = [
    { name: "Procurement", icon: true },
    { name: "Solicitation Management", icon: true },
    { name: "RFQ", icon: true },
    { name: "Detail", icon: true },
    { name: "Create CBA", icon: false },
  ];

  return (
    <div className="space-y-5">
      <BreadcrumbCard list={breadcrumbs} />

      <GoBack />

      <h4 className="font-semibold text-lg pb-5">Create CBA</h4>

      <Form {...form}>
        <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-4 w-full md:grid-cols-3">
            <FormSelect name="type_of_business" label="CBA type" required>
              <SelectContent>
                {[
                  "Limited Liability",
                  "Public Limited Company",
                  "Registered Business Enterprise",
                ].map((value: string, index: number) => (
                  <SelectItem key={index} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </FormSelect>

            <FormSelect name="type_of_business" label="Lot" required>
              <SelectContent>
                {[
                  "Limited Liability",
                  "Public Limited Company",
                  "Registered Business Enterprise",
                ].map((value: string, index: number) => (
                  <SelectItem key={index} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </FormSelect>
            <FormInput name="title" type="date" label="CBA Date" required />
          </div>

          <div>
            <Dialog>
              <DialogTrigger>
                <div className="text-[#DEA004] font-medium border shadow-sm py-2 px-5 rounded-lg text-sm">
                  Click to select team members to make up the committee
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
                    Team Members
                  </DialogTitle>
                  <DialogDescription className="text-center">
                    Please select all team members needed to make up the
                    committee
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center">
                  <div className="flex items-center w-1/2 px-4 py-2 border rounded-lg">
                    <Input
                      placeholder="Search team members"
                      //   value={categorySearchParams}
                      //   onChange={(e) => setCategorySearchParams(e.target.value)}
                      type="search"
                      className="h-6 border-none bg-none"
                    />
                    <Icon icon="iconamoon:search-light" fontSize={25} />
                  </div>
                </div>

                {/* <div className="space-y-5 ">
                  {categoryQueryResult?.isLoading ? (
                    <LoadingSpinner />
                  ) : (
                    <FormField
                      control={form.control}
                      name="submitted_categories"
                      render={() => (
                        <FormItem className="grid grid-cols-2 gap-5 bg-gray-100 mt-10 p-5 rounded-lg shadow-inner md:grid-cols-4">
                          {categories?.map((category: CategoryResultsData) => (
                            <FormField
                              key={category?.id}
                              control={form.control}
                              name="submitted_categories"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={category.id}
                                    className="space-y-3 bg-white rounded-lg text-xs p-5"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(
                                          category?.id
                                        )}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([
                                                ...field.value,
                                                category?.id,
                                              ])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) =>
                                                    value !== category?.id
                                                )
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <h6>{category?.code}</h6>
                                    <h2 className="text-sm font-medium">
                                      {category.name}
                                    </h2>
                                    <h6>{category.description}</h6>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <div className="flex justify-end">
                    <div className="flex gap-4 items-center">
                      <h6 className="text-primary">
                        {watch("submitted_categories")?.length} members
                        Selected
                      </h6>
                      <DialogClose>
                        <div className="flex items-center bg-primary text-primary-foreground rounded-md text-sm font-medium h-11 px-4 py-3 hover:opacity-60">
                          Save & Continue
                        </div>
                      </DialogClose>
                    </div>
                  </div>
                </div> */}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <h6 className="w-24">Name:</h6>
                    <h6>Willie Tanner</h6>
                  </div>
                  <div className="flex items-center">
                    <h6 className="w-24">Position:</h6>
                    <h6>Willie Tanner</h6>
                  </div>
                  <div className="flex items-center">
                    <h6 className="w-24">Tel:</h6>
                    <h6>Willie Tanner</h6>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <FormSelect name="type_of_business" label="Assignee" required>
            <SelectContent>
              {[
                "Limited Liability",
                "Public Limited Company",
                "Registered Business Enterprise",
              ].map((value: string, index: number) => (
                <SelectItem key={index} value={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </FormSelect>

          <div className="flex justify-between mt-16">
            <Button
              onClick={() => navigate(-1)}
              type="button"
              className="bg-[#FFF2F2] text-primary dark:text-gray-500"
            >
              Cancel
            </Button>
            <FormButton type="submit">Create CBA</FormButton>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateCBA;
