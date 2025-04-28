import { zodResolver } from "@hookform/resolvers/zod";
import { skipToken } from "@reduxjs/toolkit/query/react";
import BackNavigation from "atoms/BackNavigation";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelectField";
import { Form } from "components/ui/form";
import { AdminRoutes } from "constants/RouterConstants";
import {
  AssetSchema,
  TAssetFormValues,
} from "definations/admin/inventory-management/asset";
import useQuery from "hooks/useQuery";
import { nigerianStates } from "lib/index";
import { useEffect, useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  useCreateAssetMutation,
  useEditAssetMutation,
  useGetSingleAssetQuery,
} from "services/admin/inventory-management/asset";
import { useGetAllAssetConditionQuery } from "services/modules/admin/asset-condition";
import { useGetAllAssetTypeQuery } from "services/modules/admin/asset-type";
import { useGetAllAssetClassificationsQuery } from "services/modules/config/asset-classification";
import { useGetAllLocationsQuery } from "services/modules/config/location";
import { useGetAllProjectsQuery } from "services/project";
import { useGetAllUsersQuery } from "services/auth/user";
import { toast } from "sonner";
import { useUseGetAllFundingSourceQuery } from "services/modules/project/funding-source";
import { useGetAllPartnersQuery } from "services/modules/project/partners";
import FormTextArea from "atoms/FormTextArea";

export default function CreateAsset() {
  const form = useForm<TAssetFormValues>({
    resolver: zodResolver(AssetSchema),
    defaultValues: {
      name: "",
      asset_type: "",
      project: "",
      assignee: "",
      asset_code: "",
      plate_number: "",
      chasis_number: "",
      description: "",
      donor: "",
      depreciation_rate: "",
      acquisition_date: "",
      state: "",
      asset_condition: "",
      location: "",
      estimated_life_span: "",
      classification: "",
      usd_cost: "",
      ngn_cost: "",
      unit: "",
      implementer: "",
      insurance_duration: "",
    },
  });

  const { data: assetType } = useGetAllAssetTypeQuery({
    page: 1,
    size: 2000000,
  });

  const assetTypeOptions = useMemo(
    () =>
      assetType?.data.results.map(({ name, id }) => ({
        label: name,
        value: id,
      })),
    [assetType]
  );

  const { data: project } = useGetAllProjectsQuery({
    page: 1,
    size: 2000000,
  });

  const projectOptions = useMemo(
    () =>
      project?.data.results.map(({ title, id }) => ({
        label: title,
        value: id,
      })),
    [project]
  );

  const { data: user } = useGetAllUsersQuery({
    page: 1,
    size: 2000000,
  });

  const userOptions = useMemo(
    () =>
      user?.data.results.map(({ first_name, last_name, id }) => ({
        label: `${first_name} ${last_name}`,
        value: id,
      })),
    [user]
  );

  const { data: partner } = useGetAllPartnersQuery({
    page: 1,
    size: 2000000,
  });

  const partnerOptions = useMemo(
    () =>
      partner?.data.results.map(({ name, id }) => ({
        label: name,
        value: id,
      })),
    [partner]
  );

  const stateOptions = useMemo(
    () =>
      nigerianStates.map((state) => ({
        label: state,
        value: state,
      })),
    [nigerianStates]
  );

  const { data: assetCondition } = useGetAllAssetConditionQuery({
    page: 1,
    size: 2000000,
  });

  const assetConditionOptions = useMemo(
    () =>
      assetCondition?.data.results.map(({ name, id }) => ({
        label: name,
        value: id,
      })),
    [assetCondition]
  );

  const { data: location } = useGetAllLocationsQuery({
    page: 1,
    size: 2000000,
  });

  const locationOptions = useMemo(
    () =>
      location?.data.results.map(({ name, id }) => ({
        label: name,
        value: id,
      })),
    [location]
  );

  const { data: assetClassification } = useGetAllAssetClassificationsQuery({
    page: 1,
    size: 2000000,
  });

  const assetClassificationOptions = useMemo(
    () =>
      assetClassification?.data.results.map(({ name, id }) => ({
        label: name,
        value: id,
      })),
    [assetClassification]
  );

  const { data: fundingSource } = useUseGetAllFundingSourceQuery({
    page: 1,
    size: 200000,
  });

  const fundingSourceOptions = useMemo(
    () =>
      fundingSource?.data.results.map(({ name, id }) => ({
        label: name,
        value: id,
      })),
    [fundingSource]
  );

  const query = useQuery();
  const assetId = query.get("id");

  const { data: asset } = useGetSingleAssetQuery(assetId ?? skipToken);

  useEffect(() => {
    if (asset) {
      form.reset({
        name: asset?.data.name,
        assignee: asset?.data.assignee.id,
        asset_code: asset?.data.asset_code,
        project: asset?.data.project.id,
        donor: asset?.data.donor.id,
        depreciation_rate: asset?.data.depreciation_rate,
        asset_type: asset?.data.asset_type.id,
        acquisition_date: asset?.data.acquisition_date,
        state: asset?.data.state,
        asset_condition: asset?.data.asset_condition.id,
        location: asset?.data.location.id,
        estimated_life_span: asset?.data.estimated_life_span,
        classification: asset?.data.classification.id,
        usd_cost: asset?.data.usd_cost,
        ngn_cost: asset?.data.ngn_cost,
        unit: String(asset?.data.unit),
        implementer: asset?.data.implementer.id,
        insurance_duration: asset?.data.insurance_duration,
        chasis_number: asset?.data?.chasis_number,
        plate_number: asset?.data?.plate_number,
        description: asset?.data?.description,
      });
    }
  }, [asset, user]);

  const navigate = useNavigate();

  const [createAsset, { isLoading: isCreateLoading }] =
    useCreateAssetMutation();

  const [editAsset, { isLoading: isEditLoading }] = useEditAssetMutation();

  const onSubmit: SubmitHandler<TAssetFormValues> = async (data) => {
    try {
      if (assetId) {
        await editAsset({ id: assetId, body: data }).unwrap();
        toast.success("Asset Updated");
      } else {
        await createAsset(data).unwrap();
        toast.success("Asset Created");
      }

      navigate(AdminRoutes.ASSETS);
    } catch (error: any) {
      toast.error(error.data.message ?? "Something went wrong");
    }
  };

  const selectedAssetTypeId = form.watch("asset_type");
  const selectedAssetTypeName = assetType?.data.results.find(
    (assetType) => assetType.id === selectedAssetTypeId
  )?.name;

  return (
    <div className="space-y-6">
      <BackNavigation extraText="Asset Registration" />
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-y-7"
          >
            <div className="grid grid-cols-3 gap-x-5 gap-y-10">
              <FormInput
                label="Asset Name"
                name="name"
                placeholder="Enter Asset Name"
                required
              />

              <FormSelect
                label="Asset Type"
                name="asset_type"
                placeholder="Select Asset Type"
                required
                options={assetTypeOptions}
              />

              <FormSelect
                label="Project"
                name="project"
                placeholder="Select Project"
                required
                options={projectOptions}
              />

              <FormSelect
                label="Assignee"
                name="assignee"
                placeholder="Select Assignee"
                options={userOptions}
                required
              />

              <FormInput
                label="Asset Code"
                name="asset_code"
                placeholder="Enter Asset Code"
                required
              />

              {selectedAssetTypeName?.toLowerCase() === "vehicle" && (
                <>
                  <FormInput
                    label="Plate Number"
                    name="plate_number"
                    placeholder="Enter Plate Number"
                    required
                  />

                  <FormInput
                    label="Chasis Number"
                    name="chasis_number"
                    placeholder="Enter Plate Number"
                    required
                  />
                </>
              )}

              <FormSelect
                label="Donor"
                name="donor"
                placeholder="Select Donor"
                required
                options={fundingSourceOptions}
              />

              <FormInput
                label="Date of Acquisition"
                name="acquisition_date"
                required
                placeholder="Select Acquisition Date"
                type="date"
              />

              <FormInput
                label="Current Insurance Duration"
                name="insurance_duration"
                placeholder="Enter Current Insurance Duration"
                required
              />

              <FormInput
                label="Depreciation Rate"
                name="depreciation_rate"
                placeholder="Enter Depreciation Rate"
                required
                type="number"
              />

              <FormSelect
                label="Select State"
                name="state"
                placeholder="Select State"
                required
                options={stateOptions}
              />

              <FormSelect
                label="Asset Condition"
                name="asset_condition"
                placeholder="Select Asset Condition"
                required
                options={assetConditionOptions}
              />

              <FormSelect
                label="Location"
                name="location"
                placeholder="Select Location"
                required
                options={locationOptions}
              />

              <FormInput
                label="Life of the Project"
                name="estimated_life_span"
                placeholder="Enter Life of Project"
                required
              />

              <FormSelect
                label="Classification"
                name="classification"
                placeholder="Select Classification"
                required
                options={assetClassificationOptions}
              />

              <FormInput
                label="Cost in USD"
                name="usd_cost"
                placeholder="Enter USD Cost"
                required
                type="number"
              />
              <FormInput
                label="Cost in NGN"
                name="ngn_cost"
                placeholder="Enter NGN Cost"
                required
                type="number"
              />

              <FormInput
                label="Unit"
                name="unit"
                placeholder="Enter Unit"
                required
                type="number"
              />

              <FormSelect
                label="Implementer"
                name="implementer"
                placeholder="Select Implementer"
                required
                options={partnerOptions}
              />
            </div>

            <FormTextArea
              label="Description"
              name="description"
              placeholder="Enter Description"
              required
            />

            <FormButton
              loading={isCreateLoading || isEditLoading}
              className="ml-auto"
              size="lg"
            >
              Submit
            </FormButton>
          </form>
        </Form>
      </div>
    </div>
  );
}
