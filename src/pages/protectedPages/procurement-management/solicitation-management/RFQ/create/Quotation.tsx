import React from "react";
import RfqLayout from "./RfqLayout";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "components/ui/form";
import FormSelect from "atoms/FormSelectField";
import { SelectContent, SelectItem } from "components/ui/select";
import FormInput from "atoms/FormInput";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "components/ui/button";
import FormButton from "atoms/FormButton";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
  DialogDescription,
  DialogClose,
} from "components/ui/dialog";
import logoPng from "assets/imgs/logo.png";
import { LoadingSpinner } from "components/shared/Loading";
import { Checkbox } from "components/ui/checkbox";
import FormTextArea from "atoms/FormTextArea";
import { z } from "zod";
import { SolicitationQuotationSchema } from "definations/procurement-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import PurchaseRequestAPI from "services/procurementApi/purchase-request";
import { PurchaseRequestResultsData } from "definations/procurement-types/purchase-request";
import { Input } from "components/ui/input";
import { Icon } from "@iconify/react";
import VendorsAPI from "services/procurementApi/vendors";
import { VendorsResultsData } from "definations/procurement-types/vendors";

const Quotation = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { data: purchaseRequests, isLoading } =
    PurchaseRequestAPI.useGetPurchaseRequestListQuery({
      params: { no_paginate: true },
    });
  const { data: vendors, isLoading: vendorIsLoading } =
    VendorsAPI.useGetVendorListQuery({
      params: { no_paginate: true },
    });

  // Initialize form state
  const form = useForm<z.infer<typeof SolicitationQuotationSchema>>({
    resolver: zodResolver(SolicitationQuotationSchema),
    defaultValues: {
      name: "",
      description: "",
      opening_date: "",
      closing_date: "",
      tender_type: "",
      request_type: "",
      limited_vendors: [],
      purchase_request: "",
    },
  });

  const { handleSubmit, watch } = form;

  const onSubmit = (data: z.infer<typeof SolicitationQuotationSchema>) => {
    localStorage.setItem("rfqQuotation", JSON.stringify(data));
    let path = pathname;

    // Remove the last segment of the path
    path = path.substring(0, path.lastIndexOf("/"));

    // Append the new segment to the path
    path += "/items";
    navigate(path);
  };

  return (
    <RfqLayout>
      <div className="p-5">
        <h4 className="font-semibold text-lg">
          Initiate New Request for Quotation
        </h4>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-10">
            <FormInput name="name" label="RFQ Title/ID" required />
            <FormTextArea name="description" label="Background" required />

            <div className="grid grid-cols-2 gap-6">
              <FormSelect name="request_type" label="Request type" required>
                <SelectContent>
                  {[
                    "INVITATION TO TENDER",
                    "REQUEST FOR PROPOSAL",
                    "REQUEST FOR QUOTATION",
                  ].map((value: string, index: number) => (
                    <SelectItem key={index} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </FormSelect>
              <FormSelect name="tender_type" label="Tender Type" required>
                <SelectContent>
                  {[
                    "CLOSED SOURCE",
                    "LIMITED SOLICITATION",
                    "NATIONAL OPEN TENDER",
                  ].map((value: string, index: number) => (
                    <SelectItem key={index} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </FormSelect>
            </div>

            {watch("tender_type") === "LIMITED SOLICITATION" && (
              <div>
                <Dialog>
                  <DialogTrigger>
                    <div className="text-[#DEA004] font-medium border shadow-sm py-2 px-5 rounded-lg text-sm">
                      Click to select vendors that applies
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
                        Vendors Register
                      </DialogTitle>
                      <DialogDescription className="text-center">
                        You can search with name, institution
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-center">
                      <div className="flex items-center w-1/2 px-4 py-2 border rounded-lg">
                        <Input
                          placeholder="Search vendor"
                          //   value={categorySearchParams}
                          //   onChange={(e) => setCategorySearchParams(e.target.value)}
                          type="search"
                          className="h-6 border-none bg-none"
                        />
                        <Icon icon="iconamoon:search-light" fontSize={25} />
                      </div>
                    </div>

                    <div className="space-y-5 ">
                      {vendorIsLoading ? (
                        <LoadingSpinner />
                      ) : (
                        <FormField
                          control={form.control}
                          name="limited_vendors"
                          render={() => (
                            <FormItem className="grid grid-cols-2 gap-5 p-5 mt-10 bg-gray-100 rounded-lg shadow-inner md:grid-cols-3">
                              {vendors?.map((vendor: VendorsResultsData) => (
                                <FormField
                                  key={vendor?.id}
                                  control={form.control}
                                  name="limited_vendors"
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={vendor.id}
                                        className="p-5 space-y-3 text-xs bg-white rounded-lg"
                                      >
                                        <div className="flex items-center gap-4">
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value?.includes(
                                                vendor?.id
                                              )}
                                              onCheckedChange={(checked) => {
                                                return checked
                                                  ? field.onChange([
                                                      ...field.value,
                                                      vendor?.id,
                                                    ])
                                                  : field.onChange(
                                                      field.value?.filter(
                                                        (value) =>
                                                          value !== vendor?.id
                                                      )
                                                    );
                                              }}
                                            />
                                          </FormControl>
                                          <h6 className="text-base text-yellow-600">
                                            {vendor?.company_name}
                                          </h6>
                                        </div>
                                        <div className="text-sm">
                                          <h4 className="font-semibold">
                                            RC Number:
                                          </h4>
                                          <p>
                                            {
                                              vendor?.company_registration_number
                                            }
                                          </p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 text-xs">
                                          <div>
                                            <h4 className="font-semibold">
                                              Phone Number:
                                            </h4>
                                            <p>{vendor?.phone_number}</p>
                                          </div>
                                          <div>
                                            <h4 className="font-semibold">
                                              E-mail:
                                            </h4>
                                            <p>{vendor?.email}</p>
                                          </div>
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
                      )}

                      <div className="flex justify-end">
                        <div className="flex items-center gap-4">
                          <h6 className="text-primary">
                            {watch("limited_vendors")?.length} vendors Selected
                          </h6>
                          <DialogClose>
                            <div className="flex items-center px-4 py-3 text-sm font-medium rounded-md bg-primary text-primary-foreground h-11 hover:opacity-60">
                              Save & Continue
                            </div>
                          </DialogClose>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}

            <div className="grid grid-cols-2 gap-6">
              <FormInput
                name="opening_date"
                label="Opening Date"
                type="date"
                required
              />
              <FormInput
                name="closing_date"
                label="Closing Date"
                type="datetime-local"
                required
              />
            </div>

            <FormSelect
              name="purchase_request"
              label="Purchase Request"
              required
            >
              <SelectContent>
                {isLoading && <LoadingSpinner />}
                {purchaseRequests?.map((value: PurchaseRequestResultsData) => (
                  <SelectItem key={value?.id} value={value?.id}>
                    {value?.title}
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
              <FormButton type="submit">Next</FormButton>
            </div>
          </form>
        </Form>
      </div>
    </RfqLayout>
  );
};

export default Quotation;
