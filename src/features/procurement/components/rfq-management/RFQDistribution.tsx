"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Send,
  Users,
  Filter,
  CheckCircle,
  AlertCircle,
  Mail,
  Bell,
  Target,
  Zap,
  RefreshCw,
  FileText,
  Eye,
  Settings
} from "lucide-react";
import {
  useAnalyzeVendorEligibility,
  useDistributeRFQ,
  usePrequalifiedVendors,
  useVendorCategories,
  RFQDistributionUtils
} from "../../controllers/rfqDistributionController";
import {
  RFQDistributionCriteria,
  RFQSolicitationType,
  VendorEligibility,
  RFQAdvertisement
} from "../../types/rfq-distribution";
import { LoadingSpinner } from "@/components/Loading";
import { toast } from "sonner";

const DistributionCriteriaSchema = z.object({
  solicitation_type: z.enum(['LIMITED_SOLICITATION', 'CLOSED_SOLICITATION', 'SINGLE_SOURCING', 'NATIONAL_OPEN_TENDER']),
  categories: z.array(z.string()).min(1, "At least one category is required"),
  selected_vendors: z.array(z.string()).optional(),
  min_qualification_score: z.number().min(0).max(100).optional(),
  geographical_restrictions: z.array(z.string()).optional(),
  exclude_vendors: z.array(z.string()).optional(),
  require_certifications: z.array(z.string()).optional(),
});

const AdvertisementSchema = z.object({
  title: z.string().min(1, "RFQ title is required"),
  description: z.string().min(1, "Description is required"),
  technical_requirements_summary: z.string().min(1, "Technical requirements summary is required"),
  estimated_value: z.number().optional(),
  submission_deadline: z.string().min(1, "Submission deadline is required"),
  opening_date: z.string().min(1, "Opening date is required"),
  contact_person_name: z.string().min(1, "Contact person name is required"),
  contact_person_email: z.string().email("Valid email is required"),
  contact_person_phone: z.string().optional(),
  documents_available: z.boolean(),
  pre_bid_meeting_date: z.string().optional(),
  pre_bid_meeting_location: z.string().optional(),
  pre_bid_meeting_mandatory: z.boolean().optional(),
});

type DistributionFormData = z.infer<typeof DistributionCriteriaSchema>;
type AdvertisementFormData = z.infer<typeof AdvertisementSchema>;

interface RFQDistributionProps {
  rfq_id: string;
  existing_criteria?: RFQDistributionCriteria;
  existing_advertisement?: RFQAdvertisement;
  onDistributionComplete?: (result: any) => void;
}

const RFQDistribution: React.FC<RFQDistributionProps> = ({
  rfq_id,
  existing_criteria,
  existing_advertisement,
  onDistributionComplete
}) => {
  const [activeTab, setActiveTab] = useState("criteria");
  const [eligibleVendors, setEligibleVendors] = useState<VendorEligibility[]>([]);
  const [selectedVendorIds, setSelectedVendorIds] = useState<string[]>([]);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  // Queries and mutations
  const { data: vendorCategories } = useVendorCategories();
  const { data: prequalifiedVendors } = usePrequalifiedVendors();
  const { mutate: analyzeEligibility, isPending: isAnalyzing } = useAnalyzeVendorEligibility();
  const { mutate: distributeRFQ, isPending: isDistributing } = useDistributeRFQ();

  // Forms
  const criteriaForm = useForm<DistributionFormData>({
    resolver: zodResolver(DistributionCriteriaSchema),
    defaultValues: {
      solicitation_type: existing_criteria?.solicitation_type || 'LIMITED_SOLICITATION',
      categories: existing_criteria?.categories || [],
      selected_vendors: existing_criteria?.selected_vendors || [],
      min_qualification_score: existing_criteria?.min_qualification_score || 60,
      geographical_restrictions: existing_criteria?.geographical_restrictions || [],
      exclude_vendors: existing_criteria?.exclude_vendors || [],
      require_certifications: existing_criteria?.require_certifications || [],
    },
  });

  const advertisementForm = useForm<AdvertisementFormData>({
    resolver: zodResolver(AdvertisementSchema),
    defaultValues: {
      title: existing_advertisement?.title || "",
      description: existing_advertisement?.description || "",
      technical_requirements_summary: existing_advertisement?.technical_requirements_summary || "",
      estimated_value: existing_advertisement?.estimated_value || undefined,
      submission_deadline: existing_advertisement?.submission_deadline || "",
      opening_date: existing_advertisement?.opening_date || "",
      contact_person_name: existing_advertisement?.contact_person?.name || "",
      contact_person_email: existing_advertisement?.contact_person?.email || "",
      contact_person_phone: existing_advertisement?.contact_person?.phone || "",
      documents_available: existing_advertisement?.documents_available || true,
      pre_bid_meeting_date: existing_advertisement?.pre_bid_meeting?.date || "",
      pre_bid_meeting_location: existing_advertisement?.pre_bid_meeting?.location || "",
      pre_bid_meeting_mandatory: existing_advertisement?.pre_bid_meeting?.is_mandatory || false,
    },
  });

  const solicitationType = criteriaForm.watch("solicitation_type");
  const selectedCategories = criteriaForm.watch("categories");

  useEffect(() => {
    if (existing_criteria?.selected_vendors) {
      setSelectedVendorIds(existing_criteria.selected_vendors);
    }
  }, [existing_criteria]);

  const handleAnalyzeEligibility = () => {
    const criteria = criteriaForm.getValues();
    const validationErrors = RFQDistributionUtils.validateDistributionCriteria(criteria);

    if (validationErrors.length > 0) {
      toast.error(validationErrors.join(', '));
      return;
    }

    analyzeEligibility(criteria, {
      onSuccess: (vendors) => {
        setEligibleVendors(vendors);
        toast.success(`Found ${vendors.length} eligible vendors`);
        setActiveTab("vendors");
      },
      onError: (error) => {
        toast.error("Failed to analyze vendor eligibility");
        console.error(error);
      }
    });
  };

  const handleDistributeRFQ = () => {
    const criteria = criteriaForm.getValues();
    const advertisement = advertisementForm.getValues();

    // Update criteria with selected vendors if needed
    if (solicitationType === 'CLOSED_SOLICITATION' || solicitationType === 'SINGLE_SOURCING') {
      criteria.selected_vendors = selectedVendorIds;
    }

    const advertisementData: RFQAdvertisement = {
      rfq_id,
      title: advertisement.title,
      description: advertisement.description,
      categories: criteria.categories,
      estimated_value: advertisement.estimated_value,
      submission_deadline: advertisement.submission_deadline,
      opening_date: advertisement.opening_date,
      solicitation_type: criteria.solicitation_type,
      technical_requirements_summary: advertisement.technical_requirements_summary,
      contact_person: {
        name: advertisement.contact_person_name,
        email: advertisement.contact_person_email,
        phone: advertisement.contact_person_phone,
      },
      documents_available: advertisement.documents_available,
      pre_bid_meeting: advertisement.pre_bid_meeting_date ? {
        date: advertisement.pre_bid_meeting_date,
        location: advertisement.pre_bid_meeting_location || "",
        is_mandatory: advertisement.pre_bid_meeting_mandatory || false,
      } : undefined,
    };

    distributeRFQ({
      rfq_id,
      distribution_criteria: criteria,
      advertisement_data: advertisementData,
      send_email: true,
      send_portal_notification: true,
    }, {
      onSuccess: (result) => {
        toast.success(`RFQ distributed to ${result.notifications_sent} vendors successfully!`);
        onDistributionComplete?.(result);
      },
      onError: (error) => {
        toast.error("Failed to distribute RFQ");
        console.error(error);
      }
    });
  };

  const filteredVendors = RFQDistributionUtils.filterVendorsBySolicitation(
    eligibleVendors,
    solicitationType,
    selectedVendorIds
  );

  const solicitationTypeDescriptions = {
    LIMITED_SOLICITATION: "All prequalified vendors in the selected categories will receive this RFQ",
    CLOSED_SOLICITATION: "Only selected prequalified vendors will receive this RFQ",
    SINGLE_SOURCING: "One specific prequalified vendor will receive this RFQ",
    NATIONAL_OPEN_TENDER: "This will create a public EOI instead of direct vendor distribution"
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            RFQ Distribution Management
          </CardTitle>
          <CardDescription>
            Configure and distribute RFQ advertisements to eligible vendors based on solicitation type and categories
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="criteria">Distribution Criteria</TabsTrigger>
          <TabsTrigger value="vendors">Eligible Vendors</TabsTrigger>
          <TabsTrigger value="advertisement">Advertisement</TabsTrigger>
          <TabsTrigger value="distribute">Distribute</TabsTrigger>
        </TabsList>

        <TabsContent value="criteria" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Solicitation Type & Criteria</CardTitle>
              <CardDescription>
                Define how this RFQ should be distributed to vendors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...criteriaForm}>
                <div className="space-y-6">
                  {/* Solicitation Type */}
                  <FormField
                    control={criteriaForm.control}
                    name="solicitation_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Solicitation Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select solicitation type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="LIMITED_SOLICITATION">Limited Solicitation</SelectItem>
                            <SelectItem value="CLOSED_SOLICITATION">Closed Solicitation</SelectItem>
                            <SelectItem value="SINGLE_SOURCING">Single Sourcing</SelectItem>
                            <SelectItem value="NATIONAL_OPEN_TENDER">National Open Tender</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>{RFQDistributionUtils.getSolicitationTypeDisplayName(solicitationType)}:</strong>{" "}
                      {solicitationTypeDescriptions[solicitationType]}
                    </AlertDescription>
                  </Alert>

                  {/* Categories */}
                  <FormField
                    control={criteriaForm.control}
                    name="categories"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categories</FormLabel>
                        <FormControl>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {vendorCategories?.map((category) => (
                              <div key={category.category} className="flex items-center space-x-2">
                                <Checkbox
                                  id={category.category}
                                  checked={field.value?.includes(category.category)}
                                  onCheckedChange={(checked) => {
                                    const updatedCategories = checked
                                      ? [...(field.value || []), category.category]
                                      : field.value?.filter((c) => c !== category.category) || [];
                                    field.onChange(updatedCategories);
                                  }}
                                />
                                <label htmlFor={category.category} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                  {category.category}
                                  <span className="text-xs text-gray-500 ml-1">
                                    ({category.prequalified_vendors} vendors)
                                  </span>
                                </label>
                              </div>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Advanced Options */}
                  <div className="space-y-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      {showAdvancedOptions ? 'Hide' : 'Show'} Advanced Options
                    </Button>

                    {showAdvancedOptions && (
                      <div className="space-y-4 pl-4 border-l-2 border-gray-200">
                        <FormField
                          control={criteriaForm.control}
                          name="min_qualification_score"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Minimum Qualification Score</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={criteriaForm.control}
                          name="geographical_restrictions"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Geographical Restrictions (Optional)</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter regions separated by commas"
                                  value={field.value?.join(', ') || ''}
                                  onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={criteriaForm.control}
                          name="require_certifications"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Required Certifications (Optional)</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter required certifications separated by commas"
                                  value={field.value?.join(', ') || ''}
                                  onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={handleAnalyzeEligibility}
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? (
                        <>
                          <LoadingSpinner />
                          <span className="ml-2">Analyzing...</span>
                        </>
                      ) : (
                        <>
                          <Filter className="h-4 w-4 mr-2" />
                          Analyze Eligible Vendors
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Eligible Vendors ({filteredVendors.length})
              </CardTitle>
              <CardDescription>
                Vendors who will receive this RFQ based on your criteria
              </CardDescription>
            </CardHeader>
            <CardContent>
              {eligibleVendors.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">
                    No vendor analysis performed yet. Please configure criteria and analyze vendors first.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Vendor Selection for Closed Solicitation and Single Sourcing */}
                  {(solicitationType === 'CLOSED_SOLICITATION' || solicitationType === 'SINGLE_SOURCING') && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Select {solicitationType === 'SINGLE_SOURCING' ? 'one vendor' : 'vendors'} to receive this RFQ:
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {eligibleVendors.map((vendor) => (
                      <Card key={vendor.vendor_id} className={`${
                        (solicitationType === 'CLOSED_SOLICITATION' || solicitationType === 'SINGLE_SOURCING') &&
                        selectedVendorIds.includes(vendor.vendor_id) ? 'border-blue-500 bg-blue-50' : ''
                      }`}>
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {(solicitationType === 'CLOSED_SOLICITATION' || solicitationType === 'SINGLE_SOURCING') && (
                                  <Checkbox
                                    checked={selectedVendorIds.includes(vendor.vendor_id)}
                                    onCheckedChange={(checked) => {
                                      if (solicitationType === 'SINGLE_SOURCING') {
                                        setSelectedVendorIds(checked ? [vendor.vendor_id] : []);
                                      } else {
                                        setSelectedVendorIds(prev =>
                                          checked
                                            ? [...prev, vendor.vendor_id]
                                            : prev.filter(id => id !== vendor.vendor_id)
                                        );
                                      }
                                    }}
                                  />
                                )}
                                <h4 className="font-semibold text-gray-900">{vendor.company_name}</h4>
                              </div>
                              <div className="space-y-1 text-sm text-gray-600">
                                <p>Email: {vendor.email}</p>
                                <p>Score: {vendor.qualification_score || 'N/A'}/100</p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {vendor.approved_categories.slice(0, 3).map((category, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {category}
                                    </Badge>
                                  ))}
                                  {vendor.approved_categories.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{vendor.approved_categories.length - 3} more
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <Badge variant={vendor.is_eligible ? "default" : "secondary"}>
                              {vendor.qualification_status}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Summary */}
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-blue-600">{eligibleVendors.length}</p>
                          <p className="text-sm text-blue-800">Total Eligible</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-green-600">{filteredVendors.length}</p>
                          <p className="text-sm text-green-800">Will Receive RFQ</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-purple-600">{selectedCategories.length}</p>
                          <p className="text-sm text-purple-800">Categories</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-orange-600">
                            {eligibleVendors.filter(v => v.qualification_score && v.qualification_score >= 80).length}
                          </p>
                          <p className="text-sm text-orange-800">High Performers</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advertisement" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>RFQ Advertisement Details</CardTitle>
              <CardDescription>
                Configure the advertisement that will be sent to vendors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...advertisementForm}>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={advertisementForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>RFQ Title</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter RFQ title" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={advertisementForm.control}
                      name="estimated_value"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estimated Value (USD)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                              placeholder="Enter estimated value"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={advertisementForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Provide a detailed description of the RFQ"
                            rows={4}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={advertisementForm.control}
                    name="technical_requirements_summary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Technical Requirements Summary</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Summarize the key technical requirements"
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={advertisementForm.control}
                      name="opening_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Opening Date</FormLabel>
                          <FormControl>
                            <Input type="datetime-local" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={advertisementForm.control}
                      name="submission_deadline"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Submission Deadline</FormLabel>
                          <FormControl>
                            <Input type="datetime-local" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Contact Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={advertisementForm.control}
                        name="contact_person_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Person</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Contact person name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={advertisementForm.control}
                        name="contact_person_email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Email</FormLabel>
                            <FormControl>
                              <Input type="email" {...field} placeholder="contact@example.com" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={advertisementForm.control}
                        name="contact_person_phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Phone (Optional)</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Phone number" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Additional Options */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Additional Options</h4>

                    <FormField
                      control={advertisementForm.control}
                      name="documents_available"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Documents Available for Download</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={advertisementForm.control}
                        name="pre_bid_meeting_date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pre-bid Meeting Date (Optional)</FormLabel>
                            <FormControl>
                              <Input type="datetime-local" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={advertisementForm.control}
                        name="pre_bid_meeting_location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pre-bid Meeting Location (Optional)</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Meeting location or online link" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={advertisementForm.control}
                      name="pre_bid_meeting_mandatory"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Pre-bid Meeting is Mandatory</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribute" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Ready to Distribute
              </CardTitle>
              <CardDescription>
                Review and confirm RFQ distribution settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="pt-4 text-center">
                      <Mail className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                      <p className="text-2xl font-bold text-blue-600">{filteredVendors.length}</p>
                      <p className="text-sm text-blue-800">Vendors to Notify</p>
                    </CardContent>
                  </Card>

                  <Card className="border-green-200 bg-green-50">
                    <CardContent className="pt-4 text-center">
                      <Bell className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <p className="text-2xl font-bold text-green-600">2</p>
                      <p className="text-sm text-green-800">Notification Methods</p>
                      <p className="text-xs text-green-700">Email + Portal</p>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-200 bg-purple-50">
                    <CardContent className="pt-4 text-center">
                      <Zap className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                      <p className="text-lg font-bold text-purple-600">{RFQDistributionUtils.getSolicitationTypeDisplayName(solicitationType)}</p>
                      <p className="text-sm text-purple-800">Solicitation Type</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Distribution Confirmation */}
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Ready to distribute:</strong> This RFQ will be sent to {filteredVendors.length} eligible vendors
                    via email notification and vendor portal alerts. Vendors will be able to view requirements,
                    download documents, and submit their bids through the portal.
                  </AlertDescription>
                </Alert>

                {/* National Open Tender Warning */}
                {solicitationType === 'NATIONAL_OPEN_TENDER' && (
                  <Alert className="border-orange-200 bg-orange-50">
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                    <AlertDescription className="text-orange-800">
                      <strong>National Open Tender:</strong> This will create a public EOI instead of direct vendor distribution.
                      The EOI will be accessible to all potential vendors, including those not yet registered with AHNI.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("vendors")}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Review Vendors
                  </Button>

                  <Button
                    onClick={handleDistributeRFQ}
                    disabled={isDistributing || filteredVendors.length === 0}
                    size="lg"
                  >
                    {isDistributing ? (
                      <>
                        <LoadingSpinner />
                        <span className="ml-2">Distributing...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Distribute RFQ
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RFQDistribution;