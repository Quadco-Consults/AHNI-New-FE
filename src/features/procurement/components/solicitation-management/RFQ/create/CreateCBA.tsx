"use client";

import FormButton from "@/components/FormButton";
import FormInput from "@/components/atoms/FormInput";
import FormSelect from "@/components/atoms/FormSelectField";
// import GoBack from "@/components/GoBack";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { SelectContent, SelectItem } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";

import logoPng from "assets/imgs/logo.png";
import { Input } from "@/components/ui/input";
import { Search, Info, Edit, ClipboardList, Building, Inbox, CheckCircle, XCircle } from 'lucide-react';
import { Icon } from "@iconify/react";
import { LoadingSpinner } from "@/components/Loading";
import { Checkbox } from "@/components/ui/checkbox";

import { z } from "zod";
// import { CbaSchema } from "definations/procurement-validator";
// import { TUser } from "@/features/auth/types/user";
// import CbaAPI from "@/features/procurementApi/cbaController";
import { toast } from "sonner";
import { RouteEnum } from "@/constants/RouterConstants";
import { Badge } from "@/components/ui/badge";
// import LotsAPI from "@/features/procurementApi/lotsController";
// import { LotsResultsData } from "definations/procurement-types/lots";
// import { useGetAllUsers } from "@/features/auth/user";

import { zodResolver } from "@hookform/resolvers/zod";

// import { useGetAllSolicitations } from "@/features/procurementApi/solicitation";
import { useEffect } from "react";
import {
  useCreateCba,
  useGetAllSolicitations,
  useGetLotList,
  useGetSingleCba,
  useUpdateCba,
} from "@/features/procurement/controllers";
import { useGetAllUsers, useGetProcurementOfficers } from "@/features/auth/controllers";
import { useGetSolicitationSubmission } from "@/features/procurement/controllers/vendorBidSubmissionsController";
import { useGetPurchaseRequest } from "@/features/procurement/controllers/purchaseRequestController";
import { useRouter, useSearchParams } from "next/navigation";
import { CbaSchema } from "@/features/procurement/types/procurement-validator";
import { LotsResultsData } from "@/features/procurement/types/lots";
import Image from "next/image";
import { cn } from "@/lib/utils";
const CreateCBA = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rfqId = searchParams?.get("id");
  const eoiId = searchParams?.get("eoi_id");
  const solicitationId = searchParams?.get("solicitation_id");
  const cbaId = searchParams?.get("cba_id");
  const isEditMode = searchParams?.get("edit") === "true";

  console.log("🔍 URL PARAMS:", { rfqId, eoiId, solicitationId, cbaId, isEditMode });
  console.log("🔍 FULL URL:", window.location.href);
  console.log("🔍 SEARCH PARAMS:", searchParams?.toString());

  const { data: rfqData, isLoading } = useGetAllSolicitations({
    // page,
    size: 2000000,
    // Don't filter by status - get all RFQs regardless of status
    status: "",
    search: "",
  });

  // Debug: Log all RFQ data to see what's available
  console.log("🔍 DEBUG: All RFQ Data:", rfqData);
  console.log("🔍 DEBUG: RFQ Results:", rfqData?.data?.results);
  console.log("🔍 DEBUG: Looking for RFQ ID:", rfqId || solicitationId);
  console.log("🔍 DEBUG: RFQ Results Count:", rfqData?.data?.results?.length);

  // Debug: Check if our specific RFQ exists
  const targetId = rfqId || solicitationId;
  const foundRFQ = rfqData?.data?.results?.find(rfq => rfq.id === targetId);
  console.log("🔍 DEBUG: Found Target RFQ:", foundRFQ);

  // Debug: List all available RFQ IDs
  const allIds = rfqData?.data?.results?.map(rfq => ({ id: rfq.id, rfq_id: rfq.rfq_id, title: rfq.title }));
  console.log("🔍 DEBUG: All Available RFQ IDs:", allIds);

  // const query = useQuery();
  // const rfqId = query.get("id");

  // Get all AHNI staff users (internal staff)
  const { data: users, isLoading: usersLoading } = useGetAllUsers({
    page: 1,
    size: 2000000,
    search: "",
    status: "",
    user_type: "", // Get all user types, we'll filter in the component
  });

  const { data: lots, isLoading: lotIsLoading } = useGetLotList({
    params: { no_paginate: true },
  });
  const { createCba, isLoading: createCbaIsLoading } = useCreateCba();

  // Fetch existing CBA data when in edit mode
  const { data: existingCbaData, isLoading: cbaDataLoading } = useGetSingleCba(
    cbaId || "",
    isEditMode && !!cbaId
  );

  console.log("🔍 EDIT MODE STATUS:", { isEditMode, cbaId, cbaDataLoading });
  console.log("🔍 EXISTING CBA DATA:", existingCbaData);

  // Update CBA hook for edit mode
  const { updateCba, isLoading: updateCbaIsLoading } = useUpdateCba(cbaId || "");

  // Get vendor bid submissions for this RFQ
  // In edit mode, use the solicitation from existing CBA data
  const effectiveRfqId = isEditMode && existingCbaData?.data?.solicitation
    ? existingCbaData.data.solicitation as string
    : rfqId || solicitationId || "";

  const { data: vendorSubmissions, isLoading: vendorSubmissionsLoading } = useGetSolicitationSubmission(
    effectiveRfqId,
    !!effectiveRfqId
  );

  // Get selected RFQ details
  const selectedRFQ = rfqData?.data?.results?.find(rfq => rfq.id === effectiveRfqId);

  // Get purchase request ID from the selected RFQ
  const purchaseRequestId = selectedRFQ?.purchase_request;

  // Fetch purchase request data if we have an ID
  const { data: purchaseRequestData } = useGetPurchaseRequest(
    purchaseRequestId || "",
    !!purchaseRequestId
  );

  const form = useForm<z.infer<typeof CbaSchema> & {
    reviewers?: string[];
    authorisers?: string[];
    approvers?: string[];
  }>({
    resolver: zodResolver(CbaSchema),
    defaultValues: {
      solicitation: "",
      lot: undefined,
      cba_type: "",
      cba_date: "",
      assignee: "",
      committee_members: [],
      reviewers: [],
      authorisers: [],
      approvers: [],
    },
  });
  const { handleSubmit, watch, reset } = form;

  // Populate form with existing CBA data when in edit mode (PRIORITY)
  useEffect(() => {
    if (isEditMode && existingCbaData?.data) {
      const cbaData = existingCbaData.data;
      console.log("🔧 RAW CBA DATA FROM API:", cbaData);

      // Prepare the form data
      const formData: any = {
        solicitation: "",
        cba_type: "",
        cba_date: "",
        assignee: "",
        lot: undefined,
        committee_members: [],
        reviewers: [],
        authorisers: [],
        approvers: [],
      };

      // Extract solicitation (always a string UUID)
      if (cbaData.solicitation) {
        formData.solicitation = typeof cbaData.solicitation === 'string'
          ? cbaData.solicitation
          : cbaData.solicitation?.id || "";
        console.log("🔧 SOLICITATION:", formData.solicitation);
      }

      // Extract CBA type
      if (cbaData.cba_type) {
        formData.cba_type = cbaData.cba_type;
        console.log("🔧 CBA TYPE:", formData.cba_type);
      }

      // Extract CBA date
      if (cbaData.cba_date) {
        formData.cba_date = cbaData.cba_date;
        console.log("🔧 CBA DATE:", formData.cba_date);
      }

      // Extract assignee (it's an object with user_id and name)
      if (cbaData.assignee) {
        formData.assignee = typeof cbaData.assignee === 'string'
          ? cbaData.assignee
          : cbaData.assignee?.user_id || cbaData.assignee?.id || "";
        console.log("🔧 ASSIGNEE:", formData.assignee, "from", cbaData.assignee);
      }

      // Extract lot
      if (cbaData.lot) {
        formData.lot = typeof cbaData.lot === 'string'
          ? cbaData.lot
          : cbaData.lot?.id || "";
        console.log("🔧 LOT:", formData.lot);
      }

      // Extract committee member IDs
      if (cbaData.committee_members && Array.isArray(cbaData.committee_members)) {
        formData.committee_members = cbaData.committee_members.map((member: any) =>
          typeof member === 'string' ? member : member?.id
        ).filter(Boolean);
        console.log("🔧 COMMITTEE MEMBERS:", formData.committee_members, "from", cbaData.committee_members);
      }

      // Extract approval workflow (arrays of user IDs)
      if (cbaData.reviewers && Array.isArray(cbaData.reviewers)) {
        formData.reviewers = cbaData.reviewers.map((user: any) =>
          typeof user === 'string' ? user : user?.id
        ).filter(Boolean);
      }

      if (cbaData.authorisers && Array.isArray(cbaData.authorisers)) {
        formData.authorisers = cbaData.authorisers.map((user: any) =>
          typeof user === 'string' ? user : user?.id
        ).filter(Boolean);
      }

      if (cbaData.approvers && Array.isArray(cbaData.approvers)) {
        formData.approvers = cbaData.approvers.map((user: any) =>
          typeof user === 'string' ? user : user?.id
        ).filter(Boolean);
      }

      console.log("🔧 EXTRACTED APPROVAL WORKFLOW:", {
        reviewers: formData.reviewers,
        authorisers: formData.authorisers,
        approvers: formData.approvers
      });

      console.log("🔧 FINAL FORM DATA TO RESET:", formData);
      // Use reset to update all fields at once
      reset(formData);
    }
  }, [isEditMode, existingCbaData, reset]);

  // Set solicitation from URL params (only in create mode)
  useEffect(() => {
    if (!isEditMode && rfqId) {
      console.log("🔧 Setting solicitation from URL:", rfqId);
      form.setValue("solicitation", rfqId);
    }
  }, [isEditMode, rfqId]);

  // Auto-populate assignee from purchase request (only in create mode)
  useEffect(() => {
    if (!isEditMode && purchaseRequestData?.data?.assigned_to) {
      console.log("🔧 Auto-populating assignee from purchase request:", purchaseRequestData.data.assigned_to);
      form.setValue("assignee", purchaseRequestData.data.assigned_to);
    }
  }, [isEditMode, purchaseRequestData, form]);

  // Filter for internal AHNI staff only (exclude vendors and consultants)
  const allUsers = users?.data?.results || [];
  const internalUsers = allUsers.filter((user: any) =>
    user?.user_type === 'AHNI_STAFF' || user?.user_type === 'ADMIN'
  );
  const procurementOfficers = internalUsers; // For backward compatibility

  const matchedUsers =
    internalUsers?.filter((user) =>
      // @ts-ignore
      form.watch("committee_members").includes(user?.id)
    ) || [];

  const onSubmit = async (data: z.infer<typeof CbaSchema> & {
    reviewers?: string[];
    authorisers?: string[];
    approvers?: string[];
  }) => {
    // Ensure cba_date is in 'YYYY-MM-DD' format
    let formattedDate = data?.cba_date;
    if (formattedDate && !/^\d{4}-\d{2}-\d{2}$/.test(formattedDate)) {
      const dateObj = new Date(formattedDate);
      if (!isNaN(dateObj.getTime())) {
        formattedDate = dateObj.toISOString().slice(0, 10);
      }
    }

    const payload = {
      committee_members: data.committee_members,
      cba_type: data?.cba_type,
      cba_date: formattedDate,
      assignee: data?.assignee,
      status: "PENDING",
      solicitation: data?.solicitation,
      ...(data.lot && data.lot.trim() !== "" && { lot: data.lot }),
      // Add items from the selected RFQ/solicitation
      ...(selectedRFQ?.solicitation_items && {
        items: selectedRFQ.solicitation_items
      }),
      // Add 3-level approval workflow (arrays of user IDs)
      ...(data?.reviewers && data.reviewers.length > 0 && { reviewers: data.reviewers }),
      ...(data?.authorisers && data.authorisers.length > 0 && { authorisers: data.authorisers }),
      ...(data?.approvers && data.approvers.length > 0 && { approvers: data.approvers }),
    };

    console.log("🔍 DEBUG: CBA Payload being sent:", payload);
    console.log("🔍 DEBUG: Items in payload:", payload.items?.length || 0);
    console.log("🔍 DEBUG: Is Edit Mode:", isEditMode);

    try {
      let response;
      if (isEditMode && cbaId) {
        // Update existing CBA
        response = await updateCba(payload);
        console.log("🔍 DEBUG: CBA Update Response:", response);
        toast.success("Successfully updated CBA.");
      } else {
        // Create new CBA
        response = await createCba(payload);
        console.log("🔍 DEBUG: CBA Create Response:", response);
        toast.success("Successfully created CBA.");
      }

      // Route to CBA details page if we have the CBA ID, otherwise go to CBA list
      if (isEditMode && cbaId) {
        router.push(`/dashboard/procurement/competitive-bid-analysis/${cbaId}`);
      } else if (response?.id) {
        router.push(`/dashboard/procurement/competitive-bid-analysis/${response.id}`);
      } else if (response?.data?.id) {
        router.push(`/dashboard/procurement/competitive-bid-analysis/${response.data.id}`);
      } else {
        // Fallback to CBA list page
        router.push(RouteEnum.COMPETITIVE_BID_ANALYSIS);
      }
    } catch (error) {
      toast.error(isEditMode ? "Failed to update CBA" : "Failed to create CBA");
      console.log(error);
    }
  };

  // Show loading state while fetching CBA data in edit mode
  if (isEditMode && cbaDataLoading) {
    return (
      <div className="bg-white p-4 h-full flex items-center justify-center">
        <LoadingSpinner />
        <p className="ml-2">Loading CBA data...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 h-full">
      <h4 className="font-semibold text-lg pb-5">{isEditMode ? "Edit CBA" : "Create CBA"}</h4>

      {/* Edit Mode Banner */}
      {isEditMode && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2">
            <Edit size={16} />
            <p className="text-amber-800 text-sm">
              <strong>Edit Mode:</strong> You are editing an existing CBA. The form has been populated with the current data.
              {cbaId && <span className="ml-2 font-mono text-xs">CBA ID: {cbaId}</span>}
            </p>
          </div>
        </div>
      )}

      {eoiId && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-blue-800 text-sm">
            <strong>Creating CBA from EOI:</strong> Please select the RFQ that
            was created for this Expression of Interest. Look for the most
            recently created RFQ.
          </p>
        </div>
      )}

      {/* RFQ Information Section */}
      {selectedRFQ && (
        <div className="space-y-6 mb-8">
          {/* RFQ Items */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <ClipboardList size={16} />
              <h3 className="text-lg font-semibold text-blue-900">
                RFQ Items - {selectedRFQ.rfq_id}
              </h3>
            </div>
            <p className="text-sm text-blue-700 mb-4">
              <strong>Title:</strong> {selectedRFQ.title}
            </p>

            {selectedRFQ.solicitation_items && selectedRFQ.solicitation_items.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedRFQ.solicitation_items.map((item: any, index: number) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-blue-100">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-gray-900">
                          {item?.item_detail?.name || item?.description || `Item ${index + 1}`}
                        </h4>
                        <span className="text-sm font-medium text-blue-600">
                          Qty: {item?.quantity || 'N/A'}
                        </span>
                      </div>
                      {item?.item_detail?.description && (
                        <p className="text-sm text-gray-600">
                          {item.item_detail.description}
                        </p>
                      )}
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>UOM: {item?.item_detail?.uom || item?.unit || 'N/A'}</span>
                        <span>Lot: {item?.lot_detail?.name || item?.lot || 'No Lot'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-blue-600">
                No items found for this RFQ
              </div>
            )}
          </div>

          {/* Vendor Bid Submissions */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Building size={16} />
              <h3 className="text-lg font-semibold text-green-900">
                Vendor Bid Submissions
              </h3>
            </div>

            {vendorSubmissionsLoading ? (
              <div className="text-center py-4">
                <LoadingSpinner />
                <p className="text-sm text-green-600 mt-2">Loading vendor submissions...</p>
              </div>
            ) : (
              <>
                {(() => {
                  const submissions = vendorSubmissions?.data?.data?.results ||
                                   vendorSubmissions?.data?.results ||
                                   (Array.isArray(vendorSubmissions?.data) ? vendorSubmissions.data : []);

                  return submissions && submissions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {submissions.map((submission: any, index: number) => (
                        <div key={index} className="bg-white rounded-lg p-4 border border-green-100">
                          <div className="space-y-2">
                            <h4 className="font-medium text-gray-900">
                              {submission?.vendor?.company_name || `Vendor ${index + 1}`}
                            </h4>
                            <div className="text-sm text-gray-600 space-y-1">
                              <div>Type: {submission?.vendor?.type_of_business || 'N/A'}</div>
                              <div>Email: {submission?.vendor?.email || 'N/A'}</div>
                              <div className="flex items-center gap-2">
                                <span>Status:</span>
                                <Badge className={cn(
                                  "px-2 py-1 text-xs",
                                  submission?.bid_details?.status === "PASSED" && "bg-green-100 text-green-700",
                                  submission?.bid_details?.status === "FAIL" && "bg-red-100 text-red-700",
                                  submission?.bid_details?.status === "PENDING" && "bg-yellow-100 text-yellow-700"
                                )}>
                                  {submission?.bid_details?.status || 'PENDING'}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-green-600">
                      <Inbox size={16} />
                      <p>No vendor submissions found for this RFQ</p>
                      <p className="text-xs text-green-500 mt-1">
                        Vendors can still submit bids after CBA is created
                      </p>
                    </div>
                  );
                })()}
              </>
            )}
          </div>
        </div>
      )}

      <Form {...form}>
        {/* @ts-ignore */}
        <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
          <FormSelect name="solicitation" label="RFQ">
            <SelectContent>
              {isLoading && <LoadingSpinner />}
              {!isLoading && (!rfqData?.data?.results || rfqData?.data?.results?.length === 0) && (
                <div className="p-2 text-gray-500">No RFQs available</div>
              )}
              {rfqData?.data?.results?.map((rfq) => {
                console.log("🔍 DEBUG: Rendering RFQ in dropdown:", { id: rfq.id, rfq_id: rfq.rfq_id, title: rfq.title });
                return (
                  <SelectItem key={rfq?.id} value={rfq?.id}>
                    {rfq?.rfq_id} - {rfq?.title}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </FormSelect>
          <div className="grid grid-cols-1 gap-4 w-full md:grid-cols-3">
            <FormSelect name="cba_type" label="CBA type">
              <SelectContent>
                {["COMMITTEE", "NON COMMITTEE"].map(
                  (value: string, index: number) => (
                    <SelectItem key={index} value={value}>
                      {value}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </FormSelect>

            <FormSelect name="lot" label="Lot">
              <SelectContent>
                {lotIsLoading && <LoadingSpinner />}
                {/* @ts-ignore */}
                {lots?.data?.results?.map((lot: LotsResultsData) => (
                  <SelectItem key={lot?.id} value={String(lot?.id)}>
                    {lot?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </FormSelect>

            <FormInput name="cba_date" type="date" label="CBA Date" />
          </div>

          {watch("cba_type") === "COMMITTEE" && (
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                {matchedUsers?.map((user) => (
                  <Badge
                    key={user?.id}
                    className="py-2 rounded-lg bg-[#EBE8E1] text-black"
                  >
                    {user?.first_name} {user?.last_name}
                  </Badge>
                ))}
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
                      <Image
                        src={logoPng}
                        alt="logo"
                        className="mx-auto"
                        width={150}
                      />
                      <DialogTitle className="text-2xl text-center">
                        Team Members
                      </DialogTitle>
                      <DialogDescription className="text-center">
                        Please select all AHNI team members needed to make up the
                        committee. Only internal staff (AHNI_STAFF and ADMIN) are eligible.
                      </DialogDescription>
                    </DialogHeader>
                    {/* Info Banner */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mx-6">
                      <div className="flex items-center gap-2">
                        <Info size={16} />
                        <p className="text-xs text-blue-800">
                          <strong>Note:</strong> Only internal AHNI staff members (AHNI_STAFF and ADMIN) are displayed.
                          Vendors and external consultants are automatically excluded from committee selection.
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <div className="flex items-center w-1/2 px-4 py-2 border rounded-lg">
                        <Input
                          placeholder="Search AHNI team members"
                          //   value={categorySearchParams}
                          //   onChange={(e) => setCategorySearchParams(e.target.value)}
                          type="search"
                          className="h-6 border-none bg-none"
                        />
                        <Search size={16} />
                      </div>
                    </div>

                    <div className="space-y-5 ">
                      {usersLoading ? (
                        <LoadingSpinner />
                      ) : (
                        <>
                          {/* Select All / Clear All Controls */}
                          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm text-gray-700">
                                Bulk Actions:
                              </span>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const allInternalUserIds = internalUsers?.map(user => user?.id) || [];
                                  form.setValue("committee_members", allInternalUserIds);
                                }}
                                className="text-xs"
                              >
                                <CheckCircle size={16} />
                                Select All
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  form.setValue("committee_members", []);
                                }}
                                className="text-xs"
                              >
                                <XCircle size={16} />
                                Clear All
                              </Button>
                            </div>
                            <div className="text-sm text-gray-600">
                              <span className="font-medium text-primary">{watch("committee_members")?.length || 0}</span> of {internalUsers?.length || 0} AHNI staff selected
                            </div>
                          </div>

                          <FormField
                          control={form.control}
                          name="committee_members"
                          render={() => (
                            <FormItem className="grid grid-cols-1 gap-6 bg-gray-100 mt-10 p-5 rounded-lg shadow-inner md:grid-cols-2 lg:grid-cols-3">
                              {internalUsers?.map((user) => (
                                <FormField
                                  key={user?.id}
                                  control={form.control}
                                  name="committee_members"
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={user.id}
                                        className="space-y-3 bg-white rounded-lg text-xs p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(
                                              // @ts-ignore
                                              user?.id
                                            )}
                                            onCheckedChange={(checked) => {
                                              return checked
                                                ? field.onChange([
                                                    ...field.value,
                                                    user?.id,
                                                  ])
                                                : field.onChange(
                                                    field.value?.filter(
                                                      (value) =>
                                                        value !== user?.id
                                                    )
                                                  );
                                            }}
                                          />
                                        </FormControl>
                                        <div className="space-y-3">
                                          <div className="flex items-start">
                                            <h6 className="w-20 text-xs font-medium text-gray-500">Name:</h6>
                                            <h6 className="flex-1 text-xs font-medium">
                                              {user?.first_name} {user?.last_name}
                                            </h6>
                                          </div>
                                          <div className="flex items-start">
                                            <h6 className="w-20 text-xs font-medium text-gray-500">Position:</h6>
                                            <h6 className="flex-1 text-xs">
                                              {typeof user?.designation === 'string'
                                                ? user.designation
                                                : typeof user?.designation === 'object' && user?.designation?.name
                                                ? user.designation.name
                                                : typeof user?.position === 'string'
                                                ? user.position
                                                : typeof user?.position === 'object' && user?.position?.name
                                                ? user.position.name
                                                : 'N/A'}
                                            </h6>
                                          </div>
                                          <div className="flex items-start">
                                            <h6 className="w-20 text-xs font-medium text-gray-500">Department:</h6>
                                            <h6 className="flex-1 text-xs">
                                              {typeof user?.department === 'string'
                                                ? user.department
                                                : typeof user?.department === 'object' && user?.department?.name
                                                ? user.department.name
                                                : 'N/A'}
                                            </h6>
                                          </div>
                                          <div className="flex items-start">
                                            <h6 className="w-20 text-xs font-medium text-gray-500">Mobile:</h6>
                                            <h6 className="flex-1 text-xs">{user?.mobile_number || user?.phone_number || 'N/A'}</h6>
                                          </div>
                                          <div className="flex items-start">
                                            <h6 className="w-20 text-xs font-medium text-gray-500">Email:</h6>
                                            <h6 className="flex-1 text-xs break-all">{user?.email || 'N/A'}</h6>
                                          </div>
                                          <div className="flex items-start">
                                            <h6 className="w-20 text-xs font-medium text-gray-500">Location:</h6>
                                            <h6 className="flex-1 text-xs">
                                              {typeof user?.location === 'string'
                                                ? user.location
                                                : typeof user?.location === 'object' && user?.location?.name
                                                ? user.location.name
                                                : typeof user?.state === 'string'
                                                ? user.state
                                                : typeof user?.state === 'object' && user?.state?.name
                                                ? user.state.name
                                                : 'N/A'}
                                            </h6>
                                          </div>
                                          <div className="flex items-start">
                                            <h6 className="w-20 text-xs font-medium text-gray-500">User Type:</h6>
                                            <h6 className="flex-1 text-xs">
                                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                user?.user_type === 'ADMIN'
                                                  ? 'bg-purple-100 text-purple-700'
                                                  : 'bg-blue-100 text-blue-700'
                                              }`}>
                                                {user?.user_type || 'N/A'}
                                              </span>
                                            </h6>
                                          </div>
                                          {user?.roles && user.roles.length > 0 && (
                                            <div className="flex items-start">
                                              <h6 className="w-20 text-xs font-medium text-gray-500">Roles:</h6>
                                              <div className="flex-1">
                                                <div className="flex flex-wrap gap-1">
                                                  {user.roles.map((role: any, roleIndex: number) => (
                                                    <span
                                                      key={roleIndex}
                                                      className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded"
                                                    >
                                                      {typeof role === 'string' ? role : role?.name || 'Role'}
                                                    </span>
                                                  ))}
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </FormItem>
                                    );
                                  }}
                                />
                              ))}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        </>
                      )}

                      <div className="flex justify-end">
                        <div className="flex gap-4 items-center">
                          <h6 className="text-primary">
                            {watch("committee_members")?.length} members
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
            </div>
          )}

          <FormSelect name="assignee" label="Assignee (Procurement Officer)">
            <SelectContent>
              {usersLoading && <LoadingSpinner />}
              {!usersLoading && procurementOfficers.length === 0 && (
                <div className="p-2 text-gray-500 text-sm">No AHNI staff found</div>
              )}
              {procurementOfficers?.map((user) => (
                <SelectItem key={user?.id} value={user?.id}>
                  {user?.first_name} {user?.last_name}
                </SelectItem>
              ))}
            </SelectContent>
          </FormSelect>

          {/* Approval Flow Section */}
          <div className="space-y-6">
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Approval Workflow
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Select multiple users for each approval stage. At least one person must be assigned to each stage.
              </p>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Reviewers */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Reviewers</h4>
                      <p className="text-xs text-gray-500">
                        {form.watch("reviewers")?.length || 0} selected
                      </p>
                    </div>
                  </div>
                  <div className="border rounded-lg p-3 bg-gray-50 max-h-64 overflow-y-auto">
                    {usersLoading ? (
                      <LoadingSpinner />
                    ) : internalUsers.length === 0 ? (
                      <p className="text-sm text-gray-500">No AHNI staff found</p>
                    ) : (
                      <FormField
                        control={form.control}
                        name="reviewers"
                        render={() => (
                          <FormItem className="space-y-2">
                            {internalUsers.map((user) => (
                              <FormField
                                key={user.id}
                                control={form.control}
                                name="reviewers"
                                render={({ field }) => (
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(user.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, user.id])
                                            : field.onChange(
                                                field.value?.filter((value) => value !== user.id)
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <div className="text-sm leading-none">
                                      <span className="font-medium">{user.first_name} {user.last_name}</span>
                                      <span className="text-gray-500 ml-1 text-xs">
                                        {typeof user.designation === 'string' ? user.designation : ''}
                                      </span>
                                    </div>
                                  </FormItem>
                                )}
                              />
                            ))}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </div>

                {/* Authorisers */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Authorisers</h4>
                      <p className="text-xs text-gray-500">
                        {form.watch("authorisers")?.length || 0} selected
                      </p>
                    </div>
                  </div>
                  <div className="border rounded-lg p-3 bg-gray-50 max-h-64 overflow-y-auto">
                    {usersLoading ? (
                      <LoadingSpinner />
                    ) : internalUsers.length === 0 ? (
                      <p className="text-sm text-gray-500">No AHNI staff found</p>
                    ) : (
                      <FormField
                        control={form.control}
                        name="authorisers"
                        render={() => (
                          <FormItem className="space-y-2">
                            {internalUsers.map((user) => (
                              <FormField
                                key={user.id}
                                control={form.control}
                                name="authorisers"
                                render={({ field }) => (
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(user.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, user.id])
                                            : field.onChange(
                                                field.value?.filter((value) => value !== user.id)
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <div className="text-sm leading-none">
                                      <span className="font-medium">{user.first_name} {user.last_name}</span>
                                      <span className="text-gray-500 ml-1 text-xs">
                                        {typeof user.designation === 'string' ? user.designation : ''}
                                      </span>
                                    </div>
                                  </FormItem>
                                )}
                              />
                            ))}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </div>

                {/* Approvers */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Approvers</h4>
                      <p className="text-xs text-gray-500">
                        {form.watch("approvers")?.length || 0} selected
                      </p>
                    </div>
                  </div>
                  <div className="border rounded-lg p-3 bg-gray-50 max-h-64 overflow-y-auto">
                    {usersLoading ? (
                      <LoadingSpinner />
                    ) : internalUsers.length === 0 ? (
                      <p className="text-sm text-gray-500">No AHNI staff found</p>
                    ) : (
                      <FormField
                        control={form.control}
                        name="approvers"
                        render={() => (
                          <FormItem className="space-y-2">
                            {internalUsers.map((user) => (
                              <FormField
                                key={user.id}
                                control={form.control}
                                name="approvers"
                                render={({ field }) => (
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(user.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, user.id])
                                            : field.onChange(
                                                field.value?.filter((value) => value !== user.id)
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <div className="text-sm leading-none">
                                      <span className="font-medium">{user.first_name} {user.last_name}</span>
                                      <span className="text-gray-500 ml-1 text-xs">
                                        {typeof user.designation === 'string' ? user.designation : ''}
                                      </span>
                                    </div>
                                  </FormItem>
                                )}
                              />
                            ))}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-16">
            <Button
              onClick={() => router.back()}
              type="button"
              className="bg-[#FFF2F2] text-primary dark:text-gray-500"
            >
              Cancel
            </Button>
            <FormButton
              type="submit"
              loading={isEditMode ? updateCbaIsLoading : createCbaIsLoading}
              disabled={isEditMode ? updateCbaIsLoading : createCbaIsLoading}
            >
              {isEditMode ? "Update CBA" : "Create CBA"}
            </FormButton>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateCBA;
