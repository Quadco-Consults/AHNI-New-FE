import Card from "components/shared/Card";
import { LoadingSpinner } from "components/shared/Loading";
import { Button } from "components/ui/button";
import { Checkbox } from "components/ui/checkbox";
import { RouteEnum } from "constants/RouterConstants";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import VendorPrequalificationAPI from "services/procurementApi/vendor-prequalification";
import { toast } from "sonner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "components/ui/breadcrumb";
import { Icon } from "@iconify/react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "components/ui/form";
import { z } from "zod";
import { VendorPrequalificationSchema } from "definations/procurement-types/vendor-prequalification";
import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";

type FormData = {
  [key: string]: string;
};

const StartPrequalification = () => {
  const [formData, setFormData] = useState<FormData>({});

  const { id } = useParams();
  const navigate = useNavigate();

  const { data: vendors, isLoading } =
    VendorPrequalificationAPI.useGetVendorPrequalificationsQuery({
      params: { vendor: id as string },
    });
  const [createVendorPrequalificationMutation, { isLoading: loading }] =
    VendorPrequalificationAPI.useCreateVendorPrequalificationMutation();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const form = useForm<z.infer<typeof VendorPrequalificationSchema>>({
    resolver: zodResolver(VendorPrequalificationSchema),
    defaultValues: {
      vendor: id,
      approved_categories: [],
    },
  });

  const onSubmit = async (
    data: z.infer<typeof VendorPrequalificationSchema>
  ) => {
    console.log(data);

    try {
      if (vendors) {
        const result = vendors?.categories.map((category) =>
          category.criteria.map((criteria) => ({
            criteria: criteria.id,
            score: formData[criteria.name] === "true" ? true : false,
            remark: formData[criteria.remark] || "",
          }))
        );
        const combinedArray = [].concat(...(result as any));

        const finalData = {
          vendor: data.vendor,
          financial_year: vendors?.financial_year_id,
          prequalifications: combinedArray,
          approved_categories: data.approved_categories,
        };

        await createVendorPrequalificationMutation(finalData).unwrap();
        toast.success("Successfully created.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
    navigate(RouteEnum.VENDOR_MANAGEMENT);
  };

  return (
    <div className="space-y-5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Procurement</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Icon icon="iconoir:slash" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbItem>Prequalification</BreadcrumbItem>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Icon icon="iconoir:slash" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Start Prequalification</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Button
        onClick={() => navigate(-1)}
        variant="outline"
        className="gap-2 text-primary border-primary"
      >
        <span>
          <ArrowLeft size={15} />
        </span>
        View Vendor info
      </Button>

      {isLoading && <LoadingSpinner />}

      {vendors?.categories?.map((category, index) => (
        <div
          key={index}
          className="bg-white border shadow-sm rounded-2xl dark:bg-[hsl(15,13%,6%)]"
        >
          <div className="p-5 ">
            <h4 className="font-bold text-lg">{category.name}</h4>
          </div>

          <hr />

          <div className="p-5">
            {category.criteria.map((criteria) => (
              <div key={criteria.id} className="py-2">
                <Card className="border-yellow-darker flex gap-2 justify-between">
                  <h2 className="font-semibold text-base">{criteria.name}</h2>
                  <div className="flex gap-5 justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={criteria.id}
                        value="true"
                        name={criteria.name}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="yes">Yes</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={criteria.id}
                        value="false"
                        name={criteria.name}
                        className=" text-primary"
                        onChange={handleInputChange}
                      />
                      <label htmlFor="no">No</label>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      ))}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="bg-white border shadow-sm rounded-2xl dark:bg-[hsl(15,13%,6%)]">
            <div className="p-5 ">
              <h4 className="font-bold text-lg">Selected Category</h4>
            </div>

            <hr />

            <div className="p-5">
              <Card className="space-y-5 border-yellow-darker">
                <FormField
                  control={form.control}
                  name="approved_categories"
                  render={() => (
                    <FormItem className="space-y-6">
                      {vendors?.vendor.submitted_categories.map((category) => (
                        <FormField
                          key={category?.id}
                          control={form.control}
                          name="approved_categories"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={category?.id}
                                className="flex gap-2 justify-between"
                              >
                                <div className="space-y-2">
                                  <h2 className="font-semibold">
                                    {category.code}
                                  </h2>
                                  <h6 className="font-light">
                                    {category.description}
                                  </h6>
                                </div>
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
                                              (value) => value !== category?.id
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </FormItem>
                  )}
                />
              </Card>
            </div>
          </div>

          <div className="flex mt-10 justify-end">
            <FormButton loading={loading} disabled={loading} type="submit">
              Finish
            </FormButton>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default StartPrequalification;
