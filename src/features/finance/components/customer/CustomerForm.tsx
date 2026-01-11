"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Building2, User } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CustomerFormData, CustomerType } from "../../types/customer.types";

const addressSchema = z.object({
  line1: z.string().min(1, "Address line 1 is required"),
  line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postal_code: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
});

const customerFormSchema = z.object({
  customer_type: z.enum(["INDIVIDUAL", "COMPANY"]),
  company_name: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  display_name: z.string().min(1, "Display name is required"),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  billing_address: addressSchema,
  shipping_address: addressSchema.optional(),
  same_as_billing: z.boolean(),
  payment_terms: z.string().optional(),
  credit_limit: z.number().min(0, "Credit limit must be positive").optional(),
  tax_rate: z.number().min(0, "Tax rate must be positive").max(100, "Tax rate cannot exceed 100%").optional(),
  currency: z.string().min(1, "Currency is required"),
  is_active: z.boolean(),
  is_taxable: z.boolean(),
  send_statements: z.boolean(),
  notes: z.string().optional(),
}).refine((data) => {
  if (data.customer_type === "COMPANY") {
    return data.company_name && data.company_name.length > 0;
  } else {
    return data.first_name && data.first_name.length > 0 && data.last_name && data.last_name.length > 0;
  }
}, {
  message: "Company name is required for companies, first and last name are required for individuals",
  path: ["customer_type"],
});

interface CustomerFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CustomerFormData) => Promise<void>;
  loading?: boolean;
  initialData?: CustomerFormData;
}

export default function CustomerForm({
  open,
  onOpenChange,
  onSubmit,
  loading = false,
  initialData,
}: CustomerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: initialData || {
      customer_type: "INDIVIDUAL",
      company_name: "",
      first_name: "",
      last_name: "",
      display_name: "",
      email: "",
      phone: "",
      mobile: "",
      website: "",
      billing_address: {
        line1: "",
        line2: "",
        city: "",
        state: "",
        postal_code: "",
        country: "US",
      },
      shipping_address: {
        line1: "",
        line2: "",
        city: "",
        state: "",
        postal_code: "",
        country: "US",
      },
      same_as_billing: true,
      payment_terms: "",
      credit_limit: 0,
      tax_rate: 0,
      currency: "USD",
      is_active: true,
      is_taxable: true,
      send_statements: true,
      notes: "",
    },
  });

  // Reset form when initialData changes (for editing)
  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    } else {
      form.reset({
        customer_type: "INDIVIDUAL",
        company_name: "",
        first_name: "",
        last_name: "",
        display_name: "",
        email: "",
        phone: "",
        mobile: "",
        website: "",
        billing_address: {
          line1: "",
          line2: "",
          city: "",
          state: "",
          postal_code: "",
          country: "US",
        },
        shipping_address: {
          line1: "",
          line2: "",
          city: "",
          state: "",
          postal_code: "",
          country: "US",
        },
        same_as_billing: true,
        payment_terms: "",
        credit_limit: 0,
        tax_rate: 0,
        currency: "USD",
        is_active: true,
        is_taxable: true,
        send_statements: true,
        notes: "",
      });
    }
  }, [initialData]);

  const watchedCustomerType = form.watch("customer_type");
  const watchedSameAsBilling = form.watch("same_as_billing");
  const watchedFirstName = form.watch("first_name");
  const watchedLastName = form.watch("last_name");
  const watchedCompanyName = form.watch("company_name");

  // Auto-generate display name
  useEffect(() => {
    if (watchedCustomerType === "INDIVIDUAL" && watchedFirstName && watchedLastName) {
      form.setValue("display_name", `${watchedFirstName} ${watchedLastName}`);
    } else if (watchedCustomerType === "COMPANY" && watchedCompanyName) {
      form.setValue("display_name", watchedCompanyName);
    }
  }, [watchedCustomerType, watchedFirstName, watchedLastName, watchedCompanyName]);

  // Copy billing address to shipping when same_as_billing is true
  useEffect(() => {
    if (watchedSameAsBilling) {
      const billingAddress = form.getValues("billing_address");
      form.setValue("shipping_address", billingAddress);
    }
  }, [watchedSameAsBilling]);

  const handleSubmit = async (data: CustomerFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      form.reset();
      onOpenChange(false);
      toast.success(initialData ? "Customer updated successfully" : "Customer created successfully");
    } catch (error: any) {
      toast.error(error?.message || "Failed to save customer");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currencies = [
    { value: "USD", label: "USD - US Dollar" },
    { value: "EUR", label: "EUR - Euro" },
    { value: "GBP", label: "GBP - British Pound" },
    { value: "CAD", label: "CAD - Canadian Dollar" },
  ];

  const paymentTermsOptions = [
    { value: "NET_15", label: "Net 15" },
    { value: "NET_30", label: "Net 30" },
    { value: "NET_45", label: "Net 45" },
    { value: "NET_60", label: "Net 60" },
    { value: "COD", label: "Cash on Delivery" },
    { value: "PREPAID", label: "Prepaid" },
  ];

  const usStates = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Customer" : "Create Customer"}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? "Update customer information and settings."
              : "Add a new customer to your system with billing and contact details."
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Customer Type */}
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">Customer Type</h3>
              <FormField
                control={form.control}
                name="customer_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isSubmitting || loading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select customer type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="INDIVIDUAL">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span>Individual</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="COMPANY">
                          <div className="flex items-center space-x-2">
                            <Building2 className="w-4 h-4" />
                            <span>Company</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Card>

            {/* Basic Information */}
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {watchedCustomerType === "COMPANY" ? (
                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="company_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter company name"
                              {...field}
                              disabled={isSubmitting || loading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ) : (
                  <>
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter first name"
                              {...field}
                              disabled={isSubmitting || loading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter last name"
                              {...field}
                              disabled={isSubmitting || loading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                <FormField
                  control={form.control}
                  name="display_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter display name"
                          {...field}
                          disabled={isSubmitting || loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter email address"
                          {...field}
                          disabled={isSubmitting || loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter phone number"
                          {...field}
                          disabled={isSubmitting || loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter mobile number"
                          {...field}
                          disabled={isSubmitting || loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com"
                          {...field}
                          disabled={isSubmitting || loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>

            {/* Billing Address */}
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">Billing Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="billing_address.line1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Line 1 *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter street address"
                            {...field}
                            disabled={isSubmitting || loading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="billing_address.line2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Line 2</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter apartment, suite, etc."
                            {...field}
                            disabled={isSubmitting || loading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="billing_address.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter city"
                          {...field}
                          disabled={isSubmitting || loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="billing_address.state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isSubmitting || loading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {usStates.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="billing_address.postal_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Code *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter postal code"
                          {...field}
                          disabled={isSubmitting || loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="billing_address.country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter country"
                          {...field}
                          disabled={isSubmitting || loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>

            {/* Shipping Address */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Shipping Address</h3>
                <FormField
                  control={form.control}
                  name="same_as_billing"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isSubmitting || loading}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Same as billing address</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              {!watchedSameAsBilling && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="shipping_address.line1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address Line 1</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter street address"
                              {...field}
                              disabled={isSubmitting || loading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="shipping_address.line2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address Line 2</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter apartment, suite, etc."
                              {...field}
                              disabled={isSubmitting || loading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="shipping_address.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter city"
                            {...field}
                            disabled={isSubmitting || loading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="shipping_address.state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isSubmitting || loading}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {usStates.map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="shipping_address.postal_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter postal code"
                            {...field}
                            disabled={isSubmitting || loading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="shipping_address.country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter country"
                            {...field}
                            disabled={isSubmitting || loading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </Card>

            {/* Financial Settings */}
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">Financial Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="payment_terms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Terms</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isSubmitting || loading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment terms" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {paymentTermsOptions.map((term) => (
                            <SelectItem key={term.value} value={term.value}>
                              {term.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isSubmitting || loading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {currencies.map((currency) => (
                            <SelectItem key={currency.value} value={currency.value}>
                              {currency.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="credit_limit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Credit Limit</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          disabled={isSubmitting || loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tax_rate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax Rate (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          disabled={isSubmitting || loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>

            {/* Settings */}
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">Settings</h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isSubmitting || loading}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Active Customer</FormLabel>
                        <p className="text-sm text-gray-600">
                          Inactive customers will not appear in dropdowns
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_taxable"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isSubmitting || loading}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Taxable Customer</FormLabel>
                        <p className="text-sm text-gray-600">
                          Apply taxes to sales for this customer
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="send_statements"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isSubmitting || loading}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Send Statements</FormLabel>
                        <p className="text-sm text-gray-600">
                          Include this customer in statement mailings
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </Card>

            {/* Notes */}
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">Notes</h3>
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Internal Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter any internal notes about this customer..."
                        {...field}
                        disabled={isSubmitting || loading}
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Card>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting || loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || loading}
              >
                {isSubmitting || loading
                  ? (initialData ? "Updating..." : "Creating...")
                  : (initialData ? "Update Customer" : "Create Customer")
                }
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}