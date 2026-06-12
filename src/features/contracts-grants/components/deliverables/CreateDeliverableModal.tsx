"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import FormTextArea from "@/components/FormTextArea";
import FormSelect from "@/components/FormSelect";
import { Form } from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  useCreateDeliverable,
  useGetMyConsultants,
  useGetMyFacilitators,
  useGetMyAdhocStaff,
  useGetConsultantLocations,
  useGetClustersForLocation,
} from "../../controllers/deliverableController";
import { useEffect, useState } from "react";

const DeliverableSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  staff_type: z.enum(["consultant", "facilitator", "adhoc_staff"], {
    required_error: "Staff type is required",
  }),
  consultant: z.string().min(1, "Staff member is required"),
  deadline: z.string().min(1, "Deadline is required"),
  comments: z.string().optional(),
});

type TDeliverableFormData = z.infer<typeof DeliverableSchema>;

interface CreateDeliverableModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateDeliverableModal({
  open,
  onClose,
}: CreateDeliverableModalProps) {
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedCluster, setSelectedCluster] = useState<string>("");
  const [selectedStaffType, setSelectedStaffType] = useState<string>("consultant");

  const form = useForm<TDeliverableFormData>({
    resolver: zodResolver(DeliverableSchema),
    defaultValues: {
      title: "",
      description: "",
      staff_type: "consultant",
      consultant: "",
      deadline: "",
      comments: "",
    },
  });

  // Fetch locations
  const { data: locationsData } = useGetConsultantLocations(open);

  // Find selected location to check if it has clusters
  const selectedLocationData = locationsData?.data?.find(
    (loc) => loc.id === selectedLocation
  );
  const locationHasClusters = selectedLocationData?.has_clusters || false;

  // Fetch clusters for selected location (only if location has clusters)
  const { data: clustersData } = useGetClustersForLocation(
    selectedLocation,
    open && locationHasClusters
  );

  // Fetch staff based on selected type
  const { data: consultantsData } = useGetMyConsultants(
    selectedLocation,
    selectedCluster,
    open && selectedStaffType === "consultant"
  );

  const { data: facilitatorsData } = useGetMyFacilitators(
    selectedLocation,
    selectedCluster,
    open && selectedStaffType === "facilitator"
  );

  const { data: adhocStaffData } = useGetMyAdhocStaff(
    selectedLocation,
    selectedCluster,
    open && selectedStaffType === "adhoc_staff"
  );

  const { createDeliverable, isLoading, isSuccess } = useCreateDeliverable();

  const onSubmit: SubmitHandler<TDeliverableFormData> = async (data) => {
    try {
      await createDeliverable(data);
      toast.success("Deliverable assigned successfully");
      form.reset();
      onClose();
    } catch (error) {
      toast.error("Failed to assign deliverable");
      console.error(error);
    }
  };

  // Reset form and filters when modal closes
  useEffect(() => {
    if (!open) {
      form.reset();
      setSelectedLocation("");
      setSelectedCluster("");
      setSelectedStaffType("consultant");
    }
  }, [open, form]);

  // Reset cluster and consultant when location changes
  useEffect(() => {
    setSelectedCluster("");
    form.setValue("consultant", "");
  }, [selectedLocation, form]);

  // Reset location, cluster, and consultant when staff type changes
  useEffect(() => {
    setSelectedLocation("");
    setSelectedCluster("");
    form.setValue("consultant", "");
    form.setValue("staff_type", selectedStaffType as any);
  }, [selectedStaffType, form]);

  // Clear location/cluster for consultants (since filtering not available)
  useEffect(() => {
    if (selectedStaffType === "consultant" && (selectedLocation || selectedCluster)) {
      setSelectedLocation("");
      setSelectedCluster("");
    }
  }, [selectedStaffType, selectedLocation, selectedCluster]);

  // Prepare location options
  const locationOptions = locationsData?.data?.map((location) => ({
    label: location.name,
    value: location.id,
  })) || [];

  // Prepare cluster options
  const clusterOptions = clustersData?.data?.map((cluster) => ({
    label: cluster.code ? `${cluster.name} (${cluster.code})` : cluster.name,
    value: cluster.id,
  })) || [];

  // Prepare staff options based on selected type
  let staffOptions: Array<{ label: string; value: string }> = [];

  if (selectedStaffType === "consultant") {
    staffOptions = consultantsData?.data?.map((consultant) => {
      // Don't show location info for consultants since it's not populated
      return {
        label: `${consultant.name} (${consultant.email})`,
        value: String(consultant.id),
      };
    }) || [];
  } else if (selectedStaffType === "facilitator") {
    staffOptions = facilitatorsData?.data?.map((facilitator) => {
      const locationNames = facilitator.locations?.map(l => l.name).join(", ") || "N/A";
      const clusterName = facilitator.cluster?.name || null;
      const displayInfo = clusterName
        ? `${locationNames} - ${clusterName}`
        : locationNames;

      return {
        label: `${facilitator.title} (${facilitator.grade_level}) - ${displayInfo}`,
        value: facilitator.id,
      };
    }) || [];
  } else if (selectedStaffType === "adhoc_staff") {
    staffOptions = adhocStaffData?.data?.map((staff) => {
      const locationName = staff.location?.name || staff.assignment_location || "N/A";
      const clusterName = staff.cluster?.name || null;
      const displayInfo = clusterName
        ? `${locationName} - ${clusterName}`
        : locationName;

      return {
        label: `${staff.name} (${staff.email}) - ${displayInfo}`,
        value: String(staff.id),
      };
    }) || [];
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assign New Deliverable</DialogTitle>
          <DialogDescription>
            Assign a deliverable to a consultant and set the deadline.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormInput
              form={form}
              name="title"
              label="Deliverable Title"
              placeholder="e.g., Monthly Progress Report"
              required
            />

            <FormTextArea
              form={form}
              name="description"
              label="Description"
              placeholder="Describe what needs to be delivered..."
              required
              rows={4}
            />

            {/* Staff Type Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Staff Type <span className="text-red-500">*</span>
              </label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={selectedStaffType}
                onChange={(e) => {
                  setSelectedStaffType(e.target.value);
                  form.setValue("staff_type", e.target.value as any);
                }}
              >
                <option value="consultant">Consultant</option>
                <option value="facilitator">Facilitator</option>
                <option value="adhoc_staff">Adhoc Staff</option>
              </select>
              <p className="text-xs text-muted-foreground">
                Select the type of staff to assign this deliverable to
              </p>
            </div>

            {/* Location Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Filter by Location (Optional)
              </label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                disabled={selectedStaffType === "consultant"}
              >
                <option value="">All Locations</option>
                {locationOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">
                {selectedStaffType === "consultant"
                  ? "Location filtering not available for consultants yet - showing all consultants"
                  : `Select a location to filter ${selectedStaffType === "facilitator" ? "facilitators" : "adhoc staff"}`
                }
              </p>
            </div>

            {/* Cluster Filter (shown only if selected location has clusters AND not consultant type) */}
            {locationHasClusters && selectedLocation && selectedStaffType !== "consultant" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Filter by Cluster (Required for this location)
                </label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={selectedCluster}
                  onChange={(e) => setSelectedCluster(e.target.value)}
                >
                  <option value="">Select a cluster</option>
                  {clusterOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground">
                  This location has clusters. Please select a cluster to see {selectedStaffType === "facilitator" ? "facilitators" : "adhoc staff"}
                </p>
              </div>
            )}

            <FormSelect
              form={form}
              name="consultant"
              label={`Assign to ${
                selectedStaffType === "consultant"
                  ? "Consultant"
                  : selectedStaffType === "facilitator"
                  ? "Facilitator"
                  : "Adhoc Staff"
              }`}
              placeholder={
                staffOptions.length === 0
                  ? selectedStaffType === "consultant"
                    ? "Loading consultants..."
                    : locationHasClusters && selectedLocation && !selectedCluster
                    ? "Please select a cluster first"
                    : selectedLocation
                    ? `No ${
                        selectedStaffType === "facilitator"
                          ? "facilitators"
                          : "adhoc staff"
                      } found for this selection`
                    : `Please select a location first`
                  : `Select a ${
                      selectedStaffType === "consultant"
                        ? "consultant"
                        : selectedStaffType === "facilitator"
                        ? "facilitator"
                        : "adhoc staff member"
                    }`
              }
              options={staffOptions}
              required
            />

            <FormInput
              form={form}
              name="deadline"
              label="Deadline"
              type="date"
              required
            />

            <FormTextArea
              form={form}
              name="comments"
              label="Additional Comments (Optional)"
              placeholder="Any additional instructions or notes..."
              rows={3}
            />

            <div className="flex justify-end gap-3 pt-4">
              <FormButton
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </FormButton>
              <FormButton type="submit" loading={isLoading}>
                Assign Deliverable
              </FormButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
