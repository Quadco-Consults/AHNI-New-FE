import { useEffect, useMemo, useState } from "react";
import RfqLayout from "./RfqLayout";
import FormSelect from "atoms/FormSelectField";
import { SelectContent, SelectItem } from "components/ui/select";
import FormInput from "atoms/FormInput";
import { SubmitHandler, useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "components/ui/button";
import FormButton from "atoms/FormButton";
import { LoadingSpinner } from "components/shared/Loading";
import { zodResolver } from "@hookform/resolvers/zod";
import PurchaseRequestAPI from "services/procurementApi/purchase-request";
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
  SolicitationQuotationSchema,
  TSolicitationQuotationFormData,
} from "definations/procurement-validator";
import FormTextArea from "atoms/FormTextArea";
import EoiAPI from "services/procurementApi/eoi";
import { VendorsResultsData } from "definations/procurement-types/vendors";
import VendorsAPI from "services/procurementApi/vendors";
import CategoryAPI from "services/configs/category";
import { CategoryResultsData } from "definations/configs/category";
import { Input } from "components/ui/input";
import { Icon } from "@iconify/react";
import { DialogClose } from "@radix-ui/react-dialog";

const Quotation = () => {
  const [categorySearchParams, setCategorySearchParams] = useState("");

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: vendors, isLoading: vendorsIsLoading } =
    VendorsAPI.useGetVendorListQuery({
      params: { status: "Approved" },
    });

  const { data: eoiData } = EoiAPI.useGetEoisQuery(
    useMemo(() => ({ params: { type: "OPEN_TENDER" } }), [])
  );

  const categoryQueryResult = CategoryAPI.useGetCategoriesQuery(
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

  const form = useForm<TSolicitationQuotationFormData>({
    resolver: zodResolver(SolicitationQuotationSchema),
    defaultValues: {
      title: "",
      rfq_id: "",
      background: "",
      request_type: "",
      tender_type: "",
      purchase_request: "",
      procurement_type: "",
      eoi_tender: "",
      categories: [],
    },
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

  const { data: purchaseRequest, isLoading: isPurchaseRequestLoading } =
    PurchaseRequestAPI.useGetPurchaseRequestsQuery({});

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
      form.watch("categories").includes(category?.id)
    ) || [];

  const onSubmit: SubmitHandler<TSolicitationQuotationFormData> = (data) => {
    sessionStorage.setItem("rfqQuotationFormData", JSON.stringify(data));
    let path = pathname;

    if (id) {
      // If there is an ID in the URL, remove the last two segments
      path = path.substring(0, path.lastIndexOf("/")); // remove /:id
      path = path.substring(0, path.lastIndexOf("/")); // remove /quotation
    } else {
      // Otherwise remove only the last segment
      path = path.substring(0, path.lastIndexOf("/"));
    }

    // Append the new segment to the path
    path += "/items";
    navigate(path);
  };

  const tender_type = form.watch("tender_type");

  return (
    <RfqLayout>
      <div className='p-5'>
        <h4 className='font-semibold text-lg'>
          Initiate New Request for Quotation
        </h4>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-5 mt-10'
          >
            <div className='grid grid-cols-2 gap-5'>
              <FormInput name='title' label='RFQ Title' required />

              <FormInput name='rfq_id' label='RFQ ID' required />
            </div>

            <FormTextArea name='background' label='Background' required />
            <div className='grid grid-cols-2 gap-6'>
              <FormSelect name='tender_type' label='Tender Type'>
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

              <FormSelect name='request_type' label='Request type'>
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
              </FormSelect>

              <FormSelect name='purchase_request' label='Purchase Request'>
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

            <FormInput
              label='Procurement Type'
              name='procurement_type'
              required
            />
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
            <div className='flex justify-between mt-16'>
              <Button
                onClick={() => navigate(-1)}
                type='button'
                className='bg-[#FFF2F2] text-primary dark:text-gray-500'
              >
                Cancel
              </Button>
              <FormButton type='submit'>Next</FormButton>
            </div>
          </form>
        </Form>
      </div>
    </RfqLayout>
  );
};

export default Quotation;
