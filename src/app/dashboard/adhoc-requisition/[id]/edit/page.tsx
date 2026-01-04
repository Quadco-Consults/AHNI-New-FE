"use client";

export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "components/ui/button";
import { Card } from "components/ui/card";
import { Input } from "components/ui/input";
import { Textarea } from "components/ui/textarea";
import {

Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "components/ui/form";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { useGetSingleAdhocRequisition, useUpdateAdhocRequisition } from "@/controllers/adhocRequisitionController";
import { AdhocRequisitionSchema, TAdhocRequisitionFormData } from "@/types/adhoc-requisition";
import { ProgramRoutes } from "@/constants/RouterConstants";
import { cn } from "lib/utils";
import { useGetPositionPaginate } from "@/features/modules/controllers/config/positionController";
import { useGetDepartmentPaginate } from "@/features/modules/controllers/config/departmentController";
import { useGetLocationList } from "@/features/modules/controllers/config/locationController";
import { useGetAllUsers } from "@/features/auth/controllers/userController";
import { useGetAllProjects } from "@/features/projects/controllers/projectController";
import { useGetAllFCONumbersQuery } from "@/features/modules/controllers/finance/fcoNumberController";
import { useGetAllBudgetLinesQuery } from "@/features/modules/controllers/finance/budgetLineController";
import { useMemo } from "react";

const STEPS = [
  { id: 1, name: "Basic Information", description: "Position details and requirements" },
  { id: 2, name: "Duration & Budget", description: "Timeline and financial details" },
  { id: 3, name: "Requirements", description: "Qualifications and skills" },
  { id: 4, name: "Job Details", description: "Description and responsibilities" },
  { id: 5, name: "Justification & Approval", description: "Business case and approvers" },
];

export default function EditAdhocRequisitionPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [currentStep, setCurrentStep] = useState(1);

  const { data: requisitionData, isLoading: isLoadingRequisition } = useGetSingleAdhocRequisition(id);
  const { mutate: updateRequisition, isPending } = useUpdateAdhocRequisition(id);

  // Fetch real data for dropdowns
  const { data: positionsData, isLoading: positionsLoading } = useGetPositionPaginate({ page: 1, size: 1000, search: "" });
  const { data: departmentsData, isLoading: departmentsLoading } = useGetDepartmentPaginate({ page: 1, size: 1000, search: "" });
  const { data: locationsData, isLoading: locationsLoading } = useGetLocationList({ page: 1, size: 1000, search: "" });
  const { data: usersData, isLoading: usersLoading } = useGetAllUsers({ page: 1, size: 1000, search: "" });
  const { data: projectsData, isLoading: projectsLoading } = useGetAllProjects({ page: 1, size: 1000, search: "" });
  const { data: fcoData, isLoading: fcoLoading } = useGetAllFCONumbersQuery({ page: 1, size: 1000, search: "" });
  const { data: budgetLinesData, isLoading: budgetLinesLoading } = useGetAllBudgetLinesQuery({ page: 1, size: 1000, search: "" });

  // Transform data for dropdowns - handle both nested and flat response structures
  const positions = useMemo(() => {
    const results = (positionsData as any)?.data?.data?.results || (positionsData as any)?.data?.results || [];
    return results.map((p: any) => ({ id: p.id, name: p.name || p.title }));
  }, [positionsData]);

  const departments = useMemo(() => {
    const results = (departmentsData as any)?.data?.data?.results || (departmentsData as any)?.data?.results || [];
    return results.map((d: any) => ({ id: d.id, name: d.name }));
  }, [departmentsData]);

  const locations = useMemo(() => {
    const results = (locationsData as any)?.data?.data?.results || (locationsData as any)?.data?.results || [];
    return results.map((l: any) => ({ id: l.id, name: l.name || l.city }));
  }, [locationsData]);

  const users = useMemo(() => {
    const results = (usersData as any)?.data?.data?.results || (usersData as any)?.data?.results || [];
    return results.map((u: any) => ({
      id: u.id,
      name: `${u.first_name} ${u.last_name}`,
      email: u.email
    }));
  }, [usersData]);

  const projects = useMemo(() => {
    const results = (projectsData as any)?.data?.data?.results || (projectsData as any)?.data?.results || [];
    return results.map((p: any) => ({ id: p.id, name: p.name || p.title }));
  }, [projectsData]);

  const fcos = useMemo(() => {
    const results = (fcoData as any)?.data?.data?.results || (fcoData as any)?.data?.results || [];
    return results.map((f: any) => ({
      id: f.id,
      name: f.name || f.fco_number,
      code: f.code || f.fco_number
    }));
  }, [fcoData]);

  const budgetLines = useMemo(() => {
    const results = (budgetLinesData as any)?.data?.data?.results || (budgetLinesData as any)?.data?.results || [];
    return results.map((bl: any) => ({
      id: bl.id,
      name: bl.name || bl.budget_line_name,
      code: bl.code || bl.budget_line_code,
      description: bl.description
    }));
  }, [budgetLinesData]);

  const form = useForm<TAdhocRequisitionFormData>({
    resolver: zodResolver(AdhocRequisitionSchema),
    defaultValues: {
      priority: "MEDIUM",
      currency: "NGN",
      work_arrangement: "ON_SITE",
    },
  });

  // Load existing data into form
  useEffect(() => {
    if (requisitionData?.data) {
      const data = requisitionData.data;
      form.reset({
        position_title: data.position_title,
        requesting_department: data.requesting_department?.id || data.requesting_department,
        number_of_positions: data.number_of_positions?.toString(),
        priority: data.priority,
        start_date: data.start_date,
        end_date: data.end_date,
        proposed_salary: data.proposed_salary?.toString(),
        currency: data.currency || "NGN",
        project: data.project?.id || data.project,
        fco: data.fco?.id || data.fco,
        budget_line: data.budget_line?.id || data.budget_line,
        total_budget: data.total_budget?.toString(),
        qualifications: data.qualifications,
        skills_required: data.skills_required,
        experience_years: data.experience_years?.toString(),
        education_level: data.education_level,
        job_description: data.job_description,
        key_responsibilities: data.key_responsibilities,
        reporting_to: data.reporting_to?.id || data.reporting_to,
        location: data.location?.id || data.location,
        work_arrangement: data.work_arrangement || "ON_SITE",
        business_justification: data.business_justification,
        urgency_reason: data.urgency_reason,
        alternative_considered: data.alternative_considered,
        reviewer_id: data.reviewer?.id || data.reviewer_id,
        authorizer_id: data.authorizer?.id || data.authorizer_id,
        approver_id: data.approver?.id || data.approver_id,
        additional_notes: data.additional_notes,
      });
    }
  }, [requisitionData, form]);

  const onSubmit = (data: TAdhocRequisitionFormData) => {
    updateRequisition(data, {
      onSuccess: () => {
        router.push(`${ProgramRoutes.ADHOC_REQUISITION}/${id}`);
      },
    });
  };

  const nextStep = async () => {
    const fields = getStepFields(currentStep);
    const isValid = await form.trigger(fields);
    if (isValid && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepFields = (step: number): (keyof TAdhocRequisitionFormData)[] => {
    switch (step) {
      case 1:
        return ["position_title", "requesting_department", "number_of_positions", "priority"];
      case 2:
        return ["start_date", "end_date", "proposed_salary", "currency", "project", "fco", "budget_line"];
      case 3:
        return ["qualifications", "skills_required", "experience_years", "education_level"];
      case 4:
        return ["job_description", "key_responsibilities", "reporting_to", "location"];
      case 5:
        return ["business_justification", "reviewer_id", "authorizer_id", "approver_id"];
      default:
        return [];
    }
  };

  if (isLoadingRequisition) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading requisition...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Button
              variant="ghost"
              onClick={() => router.push(`${ProgramRoutes.ADHOC_REQUISITION}/${id}`)}
              className="mb-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Details
            </Button>
            <h1 className="text-2xl font-bold">Edit Adhoc Staff Requisition</h1>
            <p className="text-gray-600">Update requisition details</p>
          </div>
        </div>

        {/* Progress Steps */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors",
                      currentStep === step.id
                        ? "bg-primary text-white"
                        : currentStep > step.id
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    )}
                  >
                    {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
                  </div>
                  <div className="mt-2 text-center">
                    <div className="text-sm font-medium">{step.name}</div>
                    <div className="text-xs text-gray-500 hidden md:block">{step.description}</div>
                  </div>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "h-1 flex-1 mx-2 transition-colors",
                      currentStep > step.id ? "bg-green-500" : "bg-gray-200"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="position_title"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Position Title *</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "justify-between font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? positions.find((pos: any) => pos.name === field.value)?.name
                                  : positionsLoading ? "Loading positions..." : "Select position"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[400px] p-0" align="start">
                            <Command>
                              <CommandInput placeholder="Search positions..." />
                              <CommandEmpty>No position found.</CommandEmpty>
                              <CommandGroup className="max-h-64 overflow-auto">
                                {positions.map((pos: any) => (
                                  <CommandItem
                                    key={pos.id}
                                    value={pos.name}
                                    onSelect={() => {
                                      form.setValue("position_title", pos.name);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        field.value === pos.name ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    {pos.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="requesting_department"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Requesting Department *</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "justify-between font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? departments.find((dept: any) => dept.id === field.value)?.name
                                  : departmentsLoading ? "Loading departments..." : "Select department"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[400px] p-0" align="start">
                            <Command>
                              <CommandInput placeholder="Search departments..." />
                              <CommandEmpty>No department found.</CommandEmpty>
                              <CommandGroup className="max-h-64 overflow-auto">
                                {departments.map((dept: any) => (
                                  <CommandItem
                                    key={dept.id}
                                    value={dept.name}
                                    onSelect={() => {
                                      form.setValue("requesting_department", dept.id);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        field.value === dept.id ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    {dept.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="number_of_positions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Positions *</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" placeholder="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority Level *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="LOW">Low</SelectItem>
                            <SelectItem value="MEDIUM">Medium</SelectItem>
                            <SelectItem value="HIGH">High</SelectItem>
                            <SelectItem value="URGENT">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Card>
            )}

            {/* Step 2: Duration & Budget */}
            {currentStep === 2 && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Duration & Budget</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="start_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="end_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="proposed_salary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Proposed Salary (Monthly) *</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="500000" {...field} />
                        </FormControl>
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
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="NGN">NGN (₦)</SelectItem>
                            <SelectItem value="USD">USD ($)</SelectItem>
                            <SelectItem value="EUR">EUR (€)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="project"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Project *</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "justify-between font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? projects.find((proj: any) => proj.id === field.value)?.name
                                  : projectsLoading ? "Loading projects..." : "Select project"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[400px] p-0" align="start">
                            <Command>
                              <CommandInput placeholder="Search projects..." />
                              <CommandEmpty>No project found.</CommandEmpty>
                              <CommandGroup className="max-h-64 overflow-auto">
                                {projects.map((proj: any) => (
                                  <CommandItem
                                    key={proj.id}
                                    value={proj.name}
                                    onSelect={() => {
                                      form.setValue("project", proj.id);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        field.value === proj.id ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    {proj.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fco"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>FCO (Funding/Cost Object) *</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "justify-between font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? (() => {
                                      const selectedFco = fcos.find((f: any) => f.id === field.value);
                                      return selectedFco ? `${selectedFco.name} ${selectedFco.code ? `(${selectedFco.code})` : ''}` : field.value;
                                    })()
                                  : fcoLoading ? "Loading FCO..." : "Select FCO"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[400px] p-0" align="start">
                            <Command>
                              <CommandInput placeholder="Search FCO..." />
                              <CommandEmpty>No FCO found.</CommandEmpty>
                              <CommandGroup className="max-h-64 overflow-auto">
                                {fcos.map((fco: any) => (
                                  <CommandItem
                                    key={fco.id}
                                    value={`${fco.name} ${fco.code || ''}`}
                                    onSelect={() => {
                                      form.setValue("fco", fco.id);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        field.value === fco.id ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    {fco.name} {fco.code && `(${fco.code})`}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="budget_line"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Budget Line *</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "justify-between font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? (() => {
                                      const selectedBL = budgetLines.find((bl: any) => bl.id === field.value || bl.name === field.value);
                                      return selectedBL ? `${selectedBL.code ? `${selectedBL.code} - ` : ''}${selectedBL.name}` : field.value;
                                    })()
                                  : budgetLinesLoading ? "Loading budget lines..." : "Select budget line"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[400px] p-0" align="start">
                            <Command>
                              <CommandInput placeholder="Search budget lines..." />
                              <CommandEmpty>No budget line found.</CommandEmpty>
                              <CommandGroup className="max-h-64 overflow-auto">
                                {budgetLines.map((bl: any) => (
                                  <CommandItem
                                    key={bl.id}
                                    value={`${bl.code || ''} ${bl.name}`}
                                    onSelect={() => {
                                      form.setValue("budget_line", bl.id);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        field.value === bl.id ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    <div className="flex flex-col">
                                      <span className="font-medium">
                                        {bl.code && `${bl.code} - `}{bl.name}
                                      </span>
                                      {bl.description && (
                                        <span className="text-xs text-muted-foreground">{bl.description}</span>
                                      )}
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="total_budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Budget (Optional)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Calculated automatically" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Card>
            )}

            {/* Step 3: Requirements */}
            {currentStep === 3 && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Requirements & Qualifications</h2>
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="qualifications"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Required Qualifications *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., Bachelor's degree in Computer Science, Professional certifications..."
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="skills_required"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Required Skills *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., Data analysis, Python, SQL, Statistical modeling..."
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="experience_years"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Years of Experience *</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" placeholder="5" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="education_level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Education Level *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select education level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="High School">High School</SelectItem>
                              <SelectItem value="Bachelor's Degree">Bachelor&apos;s Degree</SelectItem>
                              <SelectItem value="Master's Degree">Master&apos;s Degree</SelectItem>
                              <SelectItem value="PhD">PhD</SelectItem>
                              <SelectItem value="Professional Certification">Professional Certification</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </Card>
            )}

            {/* Step 4: Job Details */}
            {currentStep === 4 && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Job Details</h2>
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="job_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Description *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the role, objectives, and context..."
                            rows={5}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="key_responsibilities"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Key Responsibilities *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="List main duties and responsibilities..."
                            rows={5}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="reporting_to"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Reporting To *</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    "justify-between font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value
                                    ? (() => {
                                        const selectedUser = users.find((u: any) => u.id === field.value);
                                        return selectedUser ? `${selectedUser.name} (${selectedUser.email})` : field.value;
                                      })()
                                    : usersLoading ? "Loading users..." : "Select manager"}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[400px] p-0" align="start">
                              <Command>
                                <CommandInput placeholder="Search users..." />
                                <CommandEmpty>No user found.</CommandEmpty>
                                <CommandGroup className="max-h-64 overflow-auto">
                                  {users.map((user: any) => (
                                    <CommandItem
                                      key={user.id}
                                      value={`${user.name} ${user.email}`}
                                      onSelect={() => {
                                        form.setValue("reporting_to", user.id);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          field.value === user.id ? "opacity-100" : "opacity-0"
                                        )}
                                      />
                                      {user.name} ({user.email})
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Work Location *</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    "justify-between font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value
                                    ? locations.find((loc: any) => loc.id === field.value)?.name
                                    : locationsLoading ? "Loading locations..." : "Select location"}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[400px] p-0" align="start">
                              <Command>
                                <CommandInput placeholder="Search locations..." />
                                <CommandEmpty>No location found.</CommandEmpty>
                                <CommandGroup className="max-h-64 overflow-auto">
                                  {locations.map((loc: any) => (
                                    <CommandItem
                                      key={loc.id}
                                      value={loc.name}
                                      onSelect={() => {
                                        form.setValue("location", loc.id);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          field.value === loc.id ? "opacity-100" : "opacity-0"
                                        )}
                                      />
                                      {loc.name}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="work_arrangement"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Work Arrangement</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select arrangement" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="ON_SITE">On-site</SelectItem>
                              <SelectItem value="REMOTE">Remote</SelectItem>
                              <SelectItem value="HYBRID">Hybrid</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </Card>
            )}

            {/* Step 5: Justification & Approval */}
            {currentStep === 5 && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Justification & Approval Workflow</h2>
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="business_justification"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Justification *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Explain why this position is needed and the expected impact..."
                            rows={5}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="urgency_reason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Urgency Reason (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="If urgent, explain why immediate action is needed..."
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="alternative_considered"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alternatives Considered (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="What other options were evaluated?"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="border-t pt-6 mt-6">
                    <h3 className="text-lg font-semibold mb-4">Approval Workflow</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="reviewer_id"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Reviewer *</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                      "justify-between font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value
                                      ? (() => {
                                          const selectedUser = users.find((u: any) => u.id === field.value);
                                          return selectedUser ? `${selectedUser.name}` : field.value;
                                        })()
                                      : usersLoading ? "Loading..." : "Select reviewer"}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-[300px] p-0" align="start">
                                <Command>
                                  <CommandInput placeholder="Search users..." />
                                  <CommandEmpty>No user found.</CommandEmpty>
                                  <CommandGroup className="max-h-64 overflow-auto">
                                    {users.map((user: any) => (
                                      <CommandItem
                                        key={user.id}
                                        value={`${user.name} ${user.email}`}
                                        onSelect={() => {
                                          form.setValue("reviewer_id", user.id);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            field.value === user.id ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                        <div className="flex flex-col">
                                          <span className="font-medium">{user.name}</span>
                                          <span className="text-xs text-muted-foreground">{user.email}</span>
                                        </div>
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </Command>
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="authorizer_id"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Authorizer *</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                      "justify-between font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value
                                      ? (() => {
                                          const selectedUser = users.find((u: any) => u.id === field.value);
                                          return selectedUser ? `${selectedUser.name}` : field.value;
                                        })()
                                      : usersLoading ? "Loading..." : "Select authorizer"}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-[300px] p-0" align="start">
                                <Command>
                                  <CommandInput placeholder="Search users..." />
                                  <CommandEmpty>No user found.</CommandEmpty>
                                  <CommandGroup className="max-h-64 overflow-auto">
                                    {users.map((user: any) => (
                                      <CommandItem
                                        key={user.id}
                                        value={`${user.name} ${user.email}`}
                                        onSelect={() => {
                                          form.setValue("authorizer_id", user.id);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            field.value === user.id ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                        <div className="flex flex-col">
                                          <span className="font-medium">{user.name}</span>
                                          <span className="text-xs text-muted-foreground">{user.email}</span>
                                        </div>
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </Command>
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="approver_id"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Final Approver *</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                      "justify-between font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value
                                      ? (() => {
                                          const selectedUser = users.find((u: any) => u.id === field.value);
                                          return selectedUser ? `${selectedUser.name}` : field.value;
                                        })()
                                      : usersLoading ? "Loading..." : "Select approver"}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-[300px] p-0" align="start">
                                <Command>
                                  <CommandInput placeholder="Search users..." />
                                  <CommandEmpty>No user found.</CommandEmpty>
                                  <CommandGroup className="max-h-64 overflow-auto">
                                    {users.map((user: any) => (
                                      <CommandItem
                                        key={user.id}
                                        value={`${user.name} ${user.email}`}
                                        onSelect={() => {
                                          form.setValue("approver_id", user.id);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            field.value === user.id ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                        <div className="flex flex-col">
                                          <span className="font-medium">{user.name}</span>
                                          <span className="text-xs text-muted-foreground">{user.email}</span>
                                        </div>
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </Command>
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="additional_notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any other information that may be relevant..."
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Card>
            )}

            {/* Navigation Buttons */}
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                <div className="text-sm text-gray-600">
                  Step {currentStep} of {STEPS.length}
                </div>

                {currentStep < STEPS.length ? (
                  <Button type="button" onClick={nextStep}>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={isPending}>
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Update Requisition
                      </>
                    )}
                  </Button>
                )}
              </div>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}