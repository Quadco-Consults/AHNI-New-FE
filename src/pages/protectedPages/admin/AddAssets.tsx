import { zodResolver } from "@hookform/resolvers/zod";
import BackNavigation from "atoms/BackNavigation";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelectField";
import { Form } from "components/ui/form";
import { ChevronRight } from "lucide-react";
import { useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  useCreateAssetsMutation,
  useGetAssetConditionsQuery,
  useGetAssetTypeQuery,
} from "services/adminApi/assetsApi";
import {
  useFundingSourcesQuery,
  useLocationQuery,
  useStatesQuery,
} from "services/moduleProjects";
import { toast } from "sonner";
import { z } from "zod";

const classification = [
  { label: "Electronics", value: "Electronics" },
  { label: "Furniture", value: "Furniture" },
  { label: "Generator & Inverter", value: "Generator & Inverter" },
  { label: "Health Equipment", value: "Health Equipment" },
  { label: "Non Health Equipment", value: "Non Health Equipment" },
  { label: "Other Non-Health Equipment", value: "Other Non-Health Equipment" },
  { label: "IT Equipment (Hardware)", value: "IT Equipment (Hardware)" },
  { label: "Office Equipment", value: "Office Equipment" },
  { label: "Office Safety Equipment", value: "Office Safety Equipment" },
  { label: "Vehicle", value: "Vehicle" },
];

const schema = z.object({
  asset_type: z.string().min(1, "Asset is required"),
  assignee: z.string().min(1, "Assignee is required"),
  implementer: z.string().min(1, "Implementer is required"),
  date_of_acquisition: z.string().min(1, "Date of Acquisition is required"),
  state: z.string().min(1, "State is required"),
  asset_condition: z.string().min(1, "Condition is required"),
  location: z.string().min(1, "Location is required"),
  estimated_life_span: z
    .string()
    .min(1, "Estimated Life Span must be at least 1"),
  classification: z.string().min(1, "Classification is required"),
  cost_in_usd: z.string().min(0, "Cost in USD must be at least 0").optional(),
  cost_in_ngn: z.string().min(0, "Cost in NGN must be at least 0").optional(),
  unit: z.string().min(1, "Unit must be at least 1"),
  asset_code: z.string().min(1, "Asset Code is required"),
});

const defaultValues = {
  asset_type: "",
  assignee: "",
  implementer: "",
  date_of_acquisition: "",
  state: "",
  asset_condition: "",
  location: "",
  estimated_life_span: "",
  classification: "",
  cost_in_usd: "",
  cost_in_ngn: "",
  unit: "",
  asset_code: "",
};

const AddAssets = () => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { data } = useGetAssetTypeQuery({ page: 1, page_size: 20 });

  const [createAsset, { isLoading }] = useCreateAssetsMutation();

  const { data: conditions } = useGetAssetConditionsQuery({
    page: 1,
    page_size: 20,
  });

  const { data: state } = useStatesQuery({});

  const drivedState = useMemo(() => {
    return state?.map((item: string) => {
      return {
        label: item,
        value: item,
      };
    });
  }, [state]);

  const drivedAssetType = useMemo(() => {
    return data?.results.map((item) => {
      return {
        label: item.name,
        value: item.id,
      };
    });
  }, [data?.results]);

  const drivedConditions = useMemo(() => {
    return conditions?.results.map((item) => {
      return {
        label: item.description,
        value: item.id,
      };
    });
  }, [conditions?.results]);

  const { data: fundingSource } = useFundingSourcesQuery({
    page: 1,
    page_size: 100,
  });
  const { data: location } = useLocationQuery({
    page: 1,
    page_size: 100,
  });
  const drivedFundingSource = useMemo(() => {
    return fundingSource?.results.map((item) => {
      return {
        label: item.name,
        value: item.id,
      };
    });
  }, [fundingSource?.results]);

  const drivedLocation = useMemo(() => {
    return location?.results.map((item: any) => {
      return {
        label: item.name,
        value: item.id,
      };
    });
  }, [location?.results]);

  const onSubmit: SubmitHandler<z.infer<typeof schema>> = async (data) => {
    try {
      await createAsset(data).unwrap();
      toast.success("Asset Added Successfully");
      form.reset(defaultValues);
    } catch (error) {
      toast.error("Error adding asset");
    }
  };

  return (
    <div className="space-y-6">
      <BackNavigation extraText="Asset Registration" />
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-y-7"
          >
            <FormSelect
              label="Asset"
              name="asset_type"
              required
              options={drivedAssetType}
            />
            <FormInput label="Assignee" name="assignee" required />
            <FormInput label="Asset Code" name="asset_code" required />
            <div className="grid grid-cols-3 gap-x-14">
              <FormSelect
                label="Implementer"
                name="implementer"
                required
                options={drivedFundingSource}
              />
              <FormInput
                label="Date of Acquisition"
                name="date_of_acquisition"
                required
                type="date"
              />
              <FormSelect
                label="Select State"
                name="state"
                required
                options={drivedState}
              />
            </div>
            <div className="grid grid-cols-3 gap-x-14">
              <FormSelect
                label="Asset Condition"
                name="asset_condition"
                options={drivedConditions}
                required
              />
              <FormSelect
                label="Location"
                name="location"
                required
                options={drivedLocation}
              />
              <FormInput
                label="Estimated Life Span"
                name="estimated_life_span"
                required
              />
            </div>
            <div className="grid grid-cols-3 gap-x-14">
              <FormSelect
                label="Classification"
                name="classification"
                required
                options={classification}
              />
              <div className="grid grid-cols-2 gap-x-10">
                <FormInput name="cost_in_usd" label="Cost in USD" />
                <FormInput name="cost_in_ngn" label="Cost in NGN" />
              </div>
              <FormInput type="number" label="Unit" name="unit" required />
            </div>
            <div>
              <FormButton loading={isLoading} suffix={<ChevronRight />}>
                Add Asset
              </FormButton>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AddAssets;
