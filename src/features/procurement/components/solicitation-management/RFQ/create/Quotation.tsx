"use client";

import React, { useEffect, useMemo, useState } from "react";
import RfqLayout from "./RfqLayout";
import FormSelect from "@/components/atoms/FormSelectField";
import { SelectContent, SelectItem } from "@/components/ui/select";
import FormInput from "@/components/atoms/FormInput";
import {
  SubmitHandler,
  useFieldArray,
  useForm,
  Controller,
} from "react-hook-form";
import {
  useRouter,
  useParams,
  usePathname,
  useSearchParams,
} from "next/navigation";
import { Button } from "@/components/ui/button";
import FormButton from "@/components/FormButton";
import { LoadingSpinner } from "@/components/Loading";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetPurchaseRequests } from "@/features/procurement/controllers/purchaseRequestController";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import logoPng from "assets/imgs/logo.png";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

import {
  SolicitationQuotationSchema,
  TSolicitationQuotationFormData,
} from "@/features/procurement/types/procurement-validator";
import FormTextArea from "@/components/atoms/FormTextArea";
import { VendorsResultsData } from "@/features/procurement/types/vendors";
import { useGetVendors } from "@/features/procurement/controllers/vendorsController";
import { useGetAllCategories } from "@/features/modules/controllers/config/categoryController";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/react";
import { DialogClose } from "@radix-ui/react-dialog";
import AddSquareIcon from "@/components/icons/AddSquareIcon";
import FadedButton from "@/components/atoms/FadedButton";
import DeleteIcon from "@/components/icons/DeleteIcon";
import { motion } from "framer-motion";
import { Upload as UploadFile, Search } from 'lucide-react';
import { CategoryResultsData } from "@/features/admin/types/configs-types/category";
import Image from "next/image";

const Quotation = () => {
  const [categorySearchParams, setCategorySearchParams] = useState("");

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id } = useParams();

  const { data: vendors, isLoading: vendorsIsLoading } = useGetVendors({
    status: "Approved",
  });

  const eoiType = searchParams.get("type");
  const eoiId = searchParams.get("eoi_id") || (id !== "create" ? id : null);
  const eoiName = searchParams.get("eoi_name");
  const eoiDescription = searchParams.get("eoi_description");
  const eoiNumber = searchParams.get("eoi_number");
  const solicitationType = searchParams.get("solicitation_type");
  const eoiCategories = searchParams.get("eoi_categories");

  const categoryQueryResult = useGetAllCategories(
    useMemo(
      () => ({ no_paginate: true, search: categorySearchParams }),
      [categorySearchParams]
    )
  );

  const form = useForm<TSolicitationQuotationFormData>({
    resolver: zodResolver(SolicitationQuotationSchema),
    defaultValues: {
      title: "",
      rfq_id: "",
      background: "",
      request_type: "",
      tender_type: "",
      job_category: "SERVICES",
      selected_vendors: [], // Changed from vendor to selected_vendors (array)
      purchase_request: "",
      eoi_tender: "",
      categories: [],
      documents: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "documents",
    control: form.control,
  });

  // Auto-set tender type and inherit all EOI details when coming from EOI
  useEffect(() => {
    if (eoiType === "OPEN_TENDER") {
      console.log("🔍 Inheriting EOI Details:", {
        eoiName,
        eoiDescription,
        eoiNumber,
        solicitationType,
        eoiCategories
      });

      // Set basic tender configuration
      // Use shouldValidate: true to trigger validation immediately
      form.setValue("tender_type", "NATIONAL OPEN TENDER", { shouldValidate: true, shouldDirty: true });

      // Set request type based on EOI solicitation type
      if (solicitationType === "R_F_Q") {
        form.setValue("request_type", "REQUEST FOR QUOTATION", { shouldValidate: true, shouldDirty: true });
      } else if (solicitationType === "R_F_P") {
        form.setValue("request_type", "REQUEST FOR PROPOSAL", { shouldValidate: true, shouldDirty: true });
      } else {
        form.setValue("request_type", "REQUEST FOR QUOTATION", { shouldValidate: true, shouldDirty: true }); // default
      }

      // Inherit EOI details
      if (eoiName) {
        form.setValue("title", decodeURIComponent(eoiName), { shouldValidate: true });
        console.log("✅ EOI Title inherited:", decodeURIComponent(eoiName));
      }

      if (eoiDescription) {
        form.setValue("background", decodeURIComponent(eoiDescription), { shouldValidate: true });
        console.log("✅ EOI Background inherited:", decodeURIComponent(eoiDescription));
      }

      if (eoiNumber) {
        // Generate RFQ ID based on EOI number
        const rfqId = `RFQ-${eoiNumber}-${new Date().getFullYear()}`;
        form.setValue("rfq_id", rfqId, { shouldValidate: true });
        console.log("✅ RFQ ID generated from EOI:", rfqId);
      }

      // Inherit categories if provided
      if (eoiCategories) {
        const categoryIds = eoiCategories.split(",").filter(Boolean);
        form.setValue("categories", categoryIds);
        console.log("✅ EOI Categories inherited:", categoryIds);
      }

      // Set the EOI field if we have an ID (for form submission purposes)
      if (eoiId) {
        form.setValue("eoi_tender", eoiId);
        console.log("✅ EOI field set for form submission:", eoiId);
      }

      // Log the current form values after setting
      console.log("✅ Form values after EOI inheritance:", {
        tender_type: form.getValues("tender_type"),
        request_type: form.getValues("request_type"),
        title: form.getValues("title"),
        rfq_id: form.getValues("rfq_id")
      });
    }
  }, [eoiType, eoiName, eoiDescription, eoiNumber, solicitationType, eoiCategories, eoiId, form]);


  const { data: purchaseRequest, isLoading: isPurchaseRequestLoading } =
    useGetPurchaseRequests({});

  const purchaseRequestOptions = useMemo(
    () =>
      purchaseRequest?.data.results.map(({ ref_number, id }) => ({
        label: ref_number,
        value: id,
      })),
    [purchaseRequest]
  );

  // @ts-ignore
  const categories = categoryQueryResult?.data?.data?.results;

  const matchedCategories =
    categories?.filter((category: CategoryResultsData) =>
      form.watch("categories")?.includes(category?.id)
    ) || [];

  const onSubmit: SubmitHandler<TSolicitationQuotationFormData> = (data) => {
    // Add EOI ID to the data if it exists (coming from EOI flow)
    const dataWithEoi = eoiId ? { ...data, eoi_id: eoiId } : data;
    sessionStorage.setItem("rfqQuotationFormData", JSON.stringify(dataWithEoi));

    console.log("📝 RFQ Quotation Data Saved:", dataWithEoi);
    console.log("🔍 Selected vendors field specifically:", {
      selected_vendors: data.selected_vendors,
      tender_type: data.tender_type,
      vendorCount: data.selected_vendors?.length || 0,
      allFields: Object.keys(data)
    });

    // Navigate to items page - replace quotation with items in the path
    let path = pathname?.replace("/quotation", "/items") || "";
    if (eoiId && id !== "create") {
      // Remove the ID from the end if present
      path = path.substring(0, path.lastIndexOf("/"));
    }

    // Preserve search parameters (like type=OPEN_TENDER) in the redirect
    const currentParams = searchParams?.toString() || "";
    const finalPath = currentParams ? `${path}?${currentParams}` : path;

    console.log("🔗 Navigating to:", finalPath);
    router.push(finalPath);
  };

  const tender_type = form.watch("tender_type");
  const currentValues = form.getValues();

  const handleFileChange = (
    field: string,
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
    document_type?: string
  ) => {
    const fileArray = Array.from(e?.target.files || []);
    const file = e?.target.files?.[0]!;

    if (field === "documents" && Array.isArray(currentValues.documents)) {
      const updatedFiles = [...currentValues.documents];
      updatedFiles[index] = {
        ...updatedFiles[index],
        // @ts-ignore - extending the document type for file handling
        file: fileArray,
        document_type,
        title: file?.name || "",
      };

      form.setValue("documents", updatedFiles);
    }
  };

  const renderFileUploadRow = (
    field: string,
    label: string,
    index: number,
    placeholder?: string,
    _title?: string,
    document_type?: string,
    multiple?: boolean
  ) => {
    const files = form.watch("documents");
    // @ts-ignore - accessing extended document properties
    const fileName = files?.[index]?.title || "";

    return (
      <div key={index} className="mb-4 w-full">
        <h5 className="font-bold text-[12px] mb-2">{label}</h5>
        <div className="flex items-center w-full gap-2 h-[50px]">
          {/* File Upload */}
          <div className="w-full max-w-[142px] h-[52px] rounded-[8px] border flex justify-center items-center text-gray-800">
            <>
              <input
                id={`fileInput-${field}-${index}`}
                type="file"
                multiple={multiple}
                onChange={(e) =>
                  handleFileChange(field, index, e || null, document_type)
                }
                className="hidden"
                name={`fileInput-${field}-${index}`}
              />
              <motion.label
                htmlFor={`fileInput-${field}-${index}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="cursor-pointer flex gap-4 text-sm px-1 py-2 rounded"
              >
                {fileName ? (
                  <div className="overflow-hidden max-w-[120px]  w-full">
                    <span className=" ml-2 text-sm text-gray-500 whitespace-nowrap">
                      {fileName}
                    </span>
                  </div>
                ) : (
                  <div className="px-3 flex gap-4 w-full ">
                    <UploadFile size={20} />
                    Select File
                  </div>
                )}
              </motion.label>
            </>
          </div>

          {/* ✅ Hook Form Controlled Input for Description */}
          <Controller
            control={form.control}
            name={`documents.${index}.description` as any}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                placeholder={placeholder || "Enter description (if any)"}
                className="h-[52px] rounded-[8px] bg-white relative top-[1px]"
                value={field.value || ""}
              />
            )}
          />
        </div>
      </div>
    );
  };

  return (
    <RfqLayout>
      <div className="p-5">
        <div className="flex items-center gap-4 mb-4">
          <Button
            onClick={() => router.back()}
            type="button"
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
          >
            <Icon icon="mdi:arrow-left" className="w-5 h-5" />
            Back
          </Button>
        </div>
        <h4 className="font-semibold text-lg">
          Initiate New Request for Quotation
        </h4>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 mt-10"
          >
            <div className="grid grid-cols-2 gap-5">
              <FormInput name="title" label="RFQ Title" required />
              <FormInput name="rfq_id" label="RFQ ID" required />
            </div>

            <FormTextArea name="background" label="Background" required />

            <div className="grid grid-cols-2 gap-6">
              {eoiType === "OPEN_TENDER" ? (
                // Show readonly input for tender type when coming from EOI
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Tender Type <span className="text-red-500">*</span>
                  </label>
                  <div className="p-3 bg-gray-50 border border-gray-300 rounded-md">
                    <p className="text-sm font-medium text-gray-900">
                      NATIONAL OPEN TENDER
                    </p>
                    <p className="text-xs text-gray-500">
                      Inherited from EOI
                    </p>
                  </div>
                  {/* Hidden input to ensure value is submitted */}
                  <input type="hidden" {...form.register("tender_type")} value="NATIONAL OPEN TENDER" />
                </div>
              ) : (
                <FormSelect
                  name="tender_type"
                  label="Tender Type"
                >
                  <SelectContent>
                    {[
                      "SINGLE SOURCE",
                      "CLOSED SOURCE",
                      "OPENED SOURCE",
                      "LIMITED SOLICITATION",
                      "NATIONAL OPEN TENDER",
                    ].map((value: string, index: number) => (
                      <SelectItem key={index} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </FormSelect>
              )}

              {/* Show EOI info when coming from EOI */}
              {eoiType === "OPEN_TENDER" && eoiName && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Source EOI</label>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm font-medium text-blue-800">
                      {decodeURIComponent(eoiName)}
                    </p>
                    <p className="text-xs text-blue-600">
                      RFQ inherited from this EOI
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6">
              {["CLOSED SOURCE", "SINGLE SOURCE"].includes(tender_type) && (
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="selected_vendors"
                    render={({ field }) => (
                      <FormItem>
                        <label className="text-sm font-medium">
                          Select Vendors <span className="text-red-500">*</span>
                        </label>
                        <FormControl>
                          <select
                            multiple
                            className="flex h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            value={field.value || []}
                            onChange={(e) => {
                              const selected = Array.from(
                                e.target.selectedOptions,
                                (option) => option.value
                              );
                              field.onChange(selected);
                            }}
                          >
                            {vendorsIsLoading && <option disabled>Loading vendors...</option>}
                            {/* @ts-ignore */}
                            {vendors?.data?.results?.map((vendor: VendorsResultsData) => (
                              <option key={vendor?.id} value={String(vendor?.id)}>
                                {vendor?.company_name}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <p className="text-xs text-muted-foreground">
                          Hold Ctrl/Cmd to select multiple vendors. Selected: {field.value?.length || 0}
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {eoiType === "OPEN_TENDER" ? (
                // Show readonly input for request type when coming from EOI
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Request Type <span className="text-red-500">*</span>
                  </label>
                  <div className="p-3 bg-gray-50 border border-gray-300 rounded-md">
                    <p className="text-sm font-medium text-gray-900">
                      {solicitationType === "R_F_P" ? "REQUEST FOR PROPOSAL" : "REQUEST FOR QUOTATION"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Inherited from EOI
                    </p>
                  </div>
                  {/* Hidden input to ensure value is submitted */}
                  <input
                    type="hidden"
                    {...form.register("request_type")}
                    value={solicitationType === "R_F_P" ? "REQUEST FOR PROPOSAL" : "REQUEST FOR QUOTATION"}
                  />
                </div>
              ) : (
                <FormSelect
                  name="request_type"
                  label="Request type"
                >
                  <SelectContent>
                    {[
                      "REQUEST FOR QUOTATION",
                      "INVITATION TO TENDER",
                    ].map((value: string, index: number) => (
                      <SelectItem key={index} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </FormSelect>
              )}

              <FormSelect name="purchase_request" label="Purchase Request">
                <SelectContent>
                  {isPurchaseRequestLoading && <LoadingSpinner />}
                  {purchaseRequestOptions?.map(({ label, value }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </FormSelect>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <FormSelect
                name="job_category"
                label="Job Category"
                required
              >
                <SelectContent>
                  <SelectItem value="GOODS">Goods</SelectItem>
                  <SelectItem value="SERVICES">Services</SelectItem>
                </SelectContent>
              </FormSelect>
            </div>


            {["LIMITED SOLICITATION"].includes(tender_type) && (
              <div className="space-y-2">
                <h4 className="font-medium">Job Category</h4>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    {matchedCategories?.map((category: CategoryResultsData) => (
                      <Badge
                        key={category?.id}
                        className="py-2 rounded-lg bg-[#EBE8E1] text-black"
                      >
                        {category?.name}
                      </Badge>
                    ))}
                  </div>
                  <div>
                    <Dialog>
                      <DialogTrigger>
                        <div className="text-[#DEA004] font-medium border shadow-sm py-2 px-5 rounded-lg text-sm">
                          Click to select categories that applies
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-6xl max-h-[700px] overflow-auto">
                        <DialogHeader className="mt-10 space-y-5 text-center">
                          <Image
                            src={logoPng}
                            alt="logo"
                            className="mx-auto"
                            width={150}
                            height={150}
                          />
                          <DialogTitle className="text-2xl text-center">
                            Select your Category
                          </DialogTitle>
                          <DialogDescription className="text-center">
                            Select all categories that applies to you, you can
                            also check other tabs for more categories
                          </DialogDescription>
                        </DialogHeader>

                        <div className="flex justify-center">
                          <div className="flex items-center w-1/2 px-4 py-2 border rounded-lg">
                            <Input
                              placeholder="Search Category"
                              value={categorySearchParams}
                              onChange={(e) =>
                                setCategorySearchParams(e.target.value)
                              }
                              type="search"
                              className="h-6 border-none bg-none"
                            />
                            <Search size={16} />
                          </div>
                        </div>

                        <div className="space-y-5 ">
                          {categoryQueryResult?.isLoading ? (
                            <LoadingSpinner />
                          ) : (
                            <FormField
                              control={form.control}
                              name="categories"
                              render={() => (
                                <FormItem className="grid grid-cols-2 gap-5 bg-gray-100 mt-10 p-5 rounded-lg shadow-inner md:grid-cols-4">
                                  {categories?.map(
                                    (category: CategoryResultsData) => (
                                      <FormField
                                        key={category?.id}
                                        control={form.control}
                                        name="categories"
                                        render={({ field }) => (
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
                                                        ...(field.value || []),
                                                        category?.id,
                                                      ])
                                                    : field.onChange(
                                                        field.value?.filter(
                                                          (value) =>
                                                            value !==
                                                            category?.id
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
                                        )}
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
                                {form.watch("categories")?.length || 0}{" "}
                                categories Selected
                              </h6>
                              <DialogClose>
                                <div className="flex items-center bg-primary text-primary-foreground rounded-md text-sm font-medium h-11 px-4 py-3 hover:bg-primary/90">
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
              </div>
            )}

            {/* Documents Section */}
            {fields.map((field, index) => (
              <div key={field.id} className="flex flex-col items-start">
                <h5 className="font-semibold text-[14px] mb-2">Document</h5>
                <div className="flex items-center gap-3 w-full">
                  {renderFileUploadRow(
                    "documents",
                    "",
                    index,
                    "",
                    "label",
                    "Other Documents"
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => remove(index)}
                  >
                    <DeleteIcon />
                  </Button>
                </div>
              </div>
            ))}

            <FadedButton
              type="button"
              className="text-primary w-fit"
              onClick={() =>
                append({
                  deliverable: "",
                  number_of_days: "",
                })
              }
            >
              <AddSquareIcon />
              Add Documents
            </FadedButton>

            <div className="flex justify-between mt-16">
              <Button
                onClick={() => router.back()}
                type="button"
                className="bg-[#FFF2F2] text-primary dark:text-gray-500"
              >
                Cancel
              </Button>
              <FormButton type="submit">Next</FormButton>
            </div>
          </form>
        </Form>
      </div>
    </RfqLayout>
  );
};

export default Quotation;
