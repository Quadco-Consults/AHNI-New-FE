"use client";

import React, { useEffect, useMemo, useState } from "react";
import RfqLayout from "./RfpLayout";
import FormSelect from "components/atoms/FormSelectField";
import { SelectContent, SelectItem } from "components/ui/select";
import FormInput from "components/atoms/FormInput";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { generatePath, useNavigate, useParams } 
import { Upload as UploadFile } from "lucide-react";
import DeleteIcon from "components/icons/DeleteIcon";
import { Button } from "components/ui/button";
import FormButton from "@/components/FormButton";
import { LoadingSpinner } from "components/Loading";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
  DialogDescription,
} from "components/ui/dialog";
import { Badge } from "components/ui/badge";
import logoPng from "assets/imgs/logo.png";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "components/ui/form";
import { Checkbox } from "components/ui/checkbox";

import {
  SolicitationProposalSchema,
  TSolicitationProposalFormData,
} from "definations/procurement-validator";
import FormTextArea from "components/atoms/FormTextArea";
import EoiAPI from "@/features/procurement/controllers/eoiController";
import { VendorsResultsData } from "definations/procurement-types/vendors";
import VendorsAPI from "@/features/procurement/controllers/vendorsController";
import CategoryAPI from "@/features/modules/controllers/config/categoryController";
import { CategoryResultsData } from "definations/configs/category";
import { Input } from "components/ui/input";
import { Icon } from "@iconify/react";
import { DialogClose } from "@radix-ui/react-dialog";
import { RouteEnum } from "constants/RouterConstants";
import FadedButton from "components/atoms/FadedButton";
import AddSquareIcon from "components/icons/AddSquareIcon";

const Proposal = () => {
  const [categorySearchParams, setCategorySearchParams] = useState("");

  const router = useRouter();
  const { id } = useParams();

  const { data: vendors, isLoading: vendorsIsLoading } =
    VendorsAPI.useGetVendorList({
      params: { status: "Approved" },
    });

  const { data: eoiData } = EoiAPI.useGetEois(
    useMemo(() => ({ params: { type: "OPEN_TENDER" } }), [])
  );

  const categoryQueryResult = CategoryAPI.useGetCategories(
    useMemo(
      () => ({ params: { no_paginate: true, search: categorySearchParams } }),
      [categorySearchParams]
    )
  );

  const eoiOptions = useMemo(
    () =>
      // @ts-ignore
      eoiData?.data.results.map(({ name, id }) => ({
        label: name,
        value: id,
      })),
    [eoiData]
  );

  const form = useForm<TSolicitationProposalFormData>({
    resolver: zodResolver(SolicitationProposalSchema),
    defaultValues: {
      title: "",
      rfp_id: "",
      background: "",
      tender_type: "",
      eoi_tender: "",
      categories: [],
      documents: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "documents",
    control: form.control,
  });

  // After eoiOptions
  useEffect(() => {
    if (!id || !eoiOptions?.length) return;

    // @ts-ignore
    const matchedEoi = eoiOptions?.find((option) => option?.value === id);

    if (matchedEoi) {
      form.setValue("eoi_tender", matchedEoi.value); // set EOI
      form.setValue("tender_type", "NATIONAL OPEN TENDER"); // set Tender Type
    }
  }, [id, eoiOptions, form]);

  // @ts-ignore
  const categories = categoryQueryResult?.data?.data?.results;

  const matchedCategories =
    categories?.filter((category: CategoryResultsData) =>
      form.watch("categories").includes(category?.id)
    ) || [];

  const onSubmit: SubmitHandler<TSolicitationProposalFormData> = (data) => {
    sessionStorage.setItem("rfpProposalFormData", JSON.stringify(data));

    router.push(generatePath(RouteEnum.RFP));
  };

  const tender_type = form.watch("tender_type");

  const currentValues = form.getValues();

  const handleInputChange = (
    field: string,
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    const currentValues = form.getValues();

    // @ts-ignore
    if (Array.isArray(currentValues[field])) {
      // For arrays like "files" or "references"
      // @ts-ignore
      const updatedFiles = [...currentValues[field]];

      updatedFiles[index] = { ...updatedFiles[index], description: value };

      // @ts-ignore
      form.setValue(field, updatedFiles);
    } else {
      // For objects like "supportingDocument"

      // @ts-ignore
      form.setValue(field, { ...currentValues[field], description: value });
    }
  };

  const handleFileChange = (
    field: string,
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
    document_type?: string
    // eslint-disable-next-line no-unused-vars
  ) => {
    const fileArray = Array.from(e?.target.files || []);
    const file = e?.target.files?.[0]!;

    // @ts-ignore
    if (Array.isArray(currentValues[field])) {
      // For arrays like "files" or "references"
      // @ts-ignore
      const updatedFiles = [...currentValues[field]];
      updatedFiles[index] = {
        ...updatedFiles[index],
        file: fileArray,
        document_type,
        title: file?.name || "",
      };

      // @ts-ignore
      form.setValue(field, updatedFiles);
      // Update uploadedFiles state for UI display
    } else {
      // For objects like "supportingDocument"

      // @ts-ignore
      form.setValue(field, {
        // @ts-ignore
        ...currentValues[field],
        file: fileArray,
        document_type,
        title: file?.name || "",
      });
    }
  };
  const renderFileUploadRow = (
    // fileName: any,
    field: string,
    label: string,
    index: number,
    placeholder?: string,
    title?: string,
    document_type?: string,
    multiple?: boolean
  ) => {
    // const isLoading = fileStatuses[field]?.[index] || false;
    // const hasError = fileErrors[field]?.[index] || false;
    // const currentValues = formx.getValues();

    // const fileName = currentValues[field]?.[index] || ""; // Get the file name for display

    // @ts-ignore
    const files = form.watch(field);

    // @ts-ignore
    const fileName = files?.[index]?.title || files?.title || "";
    // const fileNamex =
    //   files?.[index]?.file?.map(
    //     (
    //       file: {
    //         name:
    //           | string
    //           | number
    //           | boolean
    //           | React.ReactElement<
    //               any,
    //               string | React.JSXElementConstructor<any>
    //             >
    //           | Iterable<React.ReactNode>
    //           | React.ReactPortal
    //           | null
    //           | undefined;
    //       },
    //       i: React.Key | null | undefined
    //     ) => {
    //       return (
    //         <Badge key={i} className='py-2 rounded-lg bg-[#EBE8E1] text-black'>
    //           {file.name}
    //         </Badge>
    //       );
    //     }
    //   ) ||
    //   // @ts-ignore
    //   files?.title ||
    //   "";

    return (
      <div key={index} className='mb-4 w-full'>
        <h5 className='font-bold text-[12px] mb-2'>{label}</h5>
        <div className='flex items-center w-full gap-2 h-[50px]'>
          <div className='w-full max-w-[142px] h-[52px] rounded-[8px] border flex justify-center items-center text-gray-800'>
            <>
              <input
                // id={`fileInput-${index}`}
                id={`fileInput-${field}-${index}`}
                type='file'
                multiple={multiple}
                onChange={(e) =>
                  handleFileChange(field, index, e || null, document_type)
                }
                className='hidden'
                name={`fileInput-${field}-${index}`}
              />
              <motion.label
                htmlFor={`fileInput-${field}-${index}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className='cursor-pointer flex gap-4 text-sm px-1 py-2 rounded'
              >
                {fileName ? (
                  <div className='overflow-hidden max-w-[120px]  w-full'>
                    <span className=' ml-2 text-sm text-gray-500 whitespace-nowrap'>
                      {fileName}
                    </span>
                  </div>
                ) : (
                  <div className='px-3 flex gap-4 w-full '>
                    <UploadFile size={20} />
                    Select File
                  </div>
                )}
              </motion.label>
            </>
          </div>

          <Input
            type='text'
            name={`${field}-${index}-description`}
            // {...register(`${field}.${index}.description`)}
            placeholder={placeholder || "Enter description (if any)"}
            className='h-[52px] rounded-[8px] bg-white relative top-[1px]'
            onChange={(e) => handleInputChange(field, index, e)}
          />

          {/* {isLoading && <span className='loader'>Uploading...</span>} */}
          {/* {hasError && !isLoading && <span className='error'>Failed</span>} */}
        </div>
        {multiple && (
          // {fileNamex && multiple && (
          <div className='  w-full'>
            {/* <span className=' ml-2 text-sm text-gray-500 whitespace-nowrap'> */}
            <div className='flex items-center gap-2 flex-wrap mt-2'>
              {/* {fileNamex} */}
            </div>
            {/* </span> */}
          </div>
        )}
      </div>
    );
  };

  return (
    <RfqLayout>
      <div className='p-5'>
        <h4 className='font-semibold text-lg'>
          Initiate New Request for Proposal
        </h4>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-5 mt-10'
          >
            <div className='grid grid-cols-2 gap-5'>
              <FormInput name='title' label='RFP Title' required />

              <FormInput name='rfp_id' label='RFP ID' required />
            </div>

            <FormTextArea name='background' label='Background' required />
            <div className='grid grid-cols-2 gap-6'>
              <FormSelect name='tender_type' label='Tender Type'>
                <SelectContent>
                  {["OPENED SOURCE", "LIMITED SOLICITATION"].map(
                    (value: string, index: number) => (
                      <SelectItem key={index} value={value}>
                        {value}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </FormSelect>
              <FormSelect
                label='EOI'
                name='eoi_tender'
                placeholder='Select EOI'
                options={eoiOptions}
              />
            </div>
            <div className='grid grid-cols-2 gap-6'>
              {["CLOSED SOURCE", "SINGLE SOURCE"].includes(tender_type) && (
                <FormSelect name='vendor' label='Vendor' required>
                  <SelectContent>
                    {vendorsIsLoading && <LoadingSpinner />}
                    {/* @ts-ignore */}
                    {vendors?.data?.results?.map(
                      (vendor: VendorsResultsData) => (
                        <SelectItem key={vendor?.id} value={String(vendor?.id)}>
                          {vendor?.company_name}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </FormSelect>
              )}

              {/* <FormSelect name='request_type' label='Request type'>
                <SelectContent>
                  {[
                    "REQUEST FOR QUOTATION",
                    "REQUEST FOR PROPOSAL",
                    "INVITATION TO TENDER",
                  ].map((value: string, index: number) => (
                    <SelectItem key={index} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </FormSelect> */}
            </div>

            {["LIMITED SOLICITATION"].includes(tender_type) && (
              <div className='space-y-2'>
                <h4 className='font-medium '>Job Category</h4>
                <div className='flex items-center gap-2 flex-wrap'>
                  <div className='flex items-center gap-2 flex-wrap'>
                    {matchedCategories?.map((category: CategoryResultsData) => (
                      <Badge
                        key={category?.id}
                        className='py-2 rounded-lg bg-[#EBE8E1] text-black'
                      >
                        {category?.name}
                      </Badge>
                    ))}
                  </div>
                  <div>
                    <Dialog>
                      <DialogTrigger>
                        <div className='text-[#DEA004] font-medium border shadow-sm py-2 px-5 rounded-lg text-sm'>
                          Click to select categories that applies
                        </div>
                      </DialogTrigger>
                      <DialogContent className='max-w-6xl max-h-[700px] overflow-auto'>
                        <DialogHeader className='mt-10 space-y-5 text-center'>
                          <img
                            src={logoPng}
                            alt='logo'
                            className='mx-auto'
                            width={150}
                          />
                          <DialogTitle className='text-2xl text-center'>
                            Select your Category
                          </DialogTitle>
                          <DialogDescription className='text-center'>
                            Select all categories that applies to you, you can
                            also check other tabs for more categories
                          </DialogDescription>
                        </DialogHeader>
                        <div className='flex justify-center'>
                          <div className='flex items-center w-1/2 px-4 py-2 border rounded-lg'>
                            <Input
                              placeholder='Search Category'
                              value={categorySearchParams}
                              onChange={(e) =>
                                setCategorySearchParams(e.target.value)
                              }
                              type='search'
                              className='h-6 border-none bg-none'
                            />
                            <Icon icon='iconamoon:search-light' fontSize={25} />
                          </div>
                        </div>

                        <div className='space-y-5 '>
                          {categoryQueryResult?.isLoading ? (
                            <LoadingSpinner />
                          ) : (
                            <FormField
                              control={form.control}
                              name='categories'
                              render={() => (
                                <FormItem className='grid grid-cols-2 gap-5 bg-gray-100 mt-10 p-5 rounded-lg shadow-inner md:grid-cols-4'>
                                  {categories?.map(
                                    (category: CategoryResultsData) => (
                                      <FormField
                                        key={category?.id}
                                        control={form.control}
                                        name='categories'
                                        render={({ field }) => {
                                          return (
                                            <FormItem
                                              key={category.id}
                                              className='space-y-3 bg-white rounded-lg text-xs p-5'
                                            >
                                              <FormControl>
                                                <Checkbox
                                                  checked={field.value?.includes(
                                                    category?.id
                                                  )}
                                                  onCheckedChange={(
                                                    checked
                                                  ) => {
                                                    return checked
                                                      ? field.onChange([
                                                          ...field.value,
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
                                              <h2 className='text-sm font-medium'>
                                                {category.name}
                                              </h2>
                                              <h6>{category.description}</h6>
                                            </FormItem>
                                          );
                                        }}
                                      />
                                    )
                                  )}
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}

                          <div className='flex justify-end'>
                            <div className='flex gap-4 items-center'>
                              <h6 className='text-primary'>
                                {form.watch("categories").length} categories
                                Selected
                              </h6>
                              <DialogClose>
                                <div className='flex items-center bg-primary text-primary-foreground rounded-md text-sm font-medium h-11 px-4 py-3 hover:bg-primary/90'>
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

            {fields.map((field, index) => (
              <div key={field.id} className='flex flex-col items-start'>
                {/* Supporting Documents Section */}
                <h5 className='font-semibold text-[14px] mb-2'>Document</h5>
                <div className='flex items-center gap-3 w-full'>
                  {renderFileUploadRow(
                    // form,
                    "documents",
                    "",
                    0,
                    "",
                    "label",
                    "Other Documents"
                  )}
                  <Button
                    type='button'
                    variant='ghost'
                    onClick={() => remove(index)}
                  >
                    <DeleteIcon />
                  </Button>
                </div>
              </div>
            ))}

            <FadedButton
              type='button'
              className='text-primary w-fit'
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
            <div className='flex justify-between mt-16'>
              <Button
                onClick={() => router.back()}
                type='button'
                className='bg-[#FFF2F2] text-primary dark:text-gray-500'
              >
                Cancel
              </Button>
              <FormButton type='submit'>Submit</FormButton>
            </div>
          </form>
        </Form>
      </div>
    </RfqLayout>
  );
};

export default Proposal;
