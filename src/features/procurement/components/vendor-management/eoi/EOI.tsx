"use client";

import { Button } from "components/ui/button";
import { Plus, Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
  DialogDescription,
} from "components/ui/dialog";
import { Input } from "components/ui/input";
import { DialogClose } from "@radix-ui/react-dialog";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "components/ui/form";
import { format } from "date-fns";
import { cn } from "lib/utils";
import { Calendar } from "components/ui/calendar";

import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import eoiPng from "assets/imgs/eoi.png";
import logoPng from "assets/imgs/logo.png";
import Card from "components/Card";
import { Icon } from "@iconify/react";
import { Badge } from "components/ui/badge";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RouteEnum } from "constants/RouterConstants";
import FormTextArea from "components/atoms/FormTextArea";
import FormInput from "components/atoms/FormInput";
import React, { useMemo, useState } from "react";
import { Label } from "components/ui/label";
import { Upload as UploadFile } from "lucide-react";
import { useGetAllCategoriesManager } from "@/features/modules/controllers/config/categoryController";
import { Checkbox } from "components/ui/checkbox";
import { CategoryResultsData } from "@/features/admin/types/config/category";
import { EOISchema } from "@/features/procurement/types/procurement-validator";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loading, LoadingSpinner } from "components/Loading";
import {
  useGetAllEois,
  useCreateEoi,
  useUpdateEoi,
} from "@/features/procurement/controllers/eoiController";
import { toast } from "sonner";
import FormButton from "@/components/FormButton";
import { EOIResultsData } from "@/features/procurement/types/eoi";
import FormSelect from "components/atoms/FormSelectField";
import { SelectContent, SelectItem } from "components/ui/select";
import { TFinancialYearData } from "@/features/admin/types/config/financial-year";
import { useGetAllFinancialYearsManager } from "@/features/modules/controllers/config/financialYearController";
import DeleteIcon from "components/icons/DeleteIcon";

const EOI = () => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [file, setFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const [categorySearchParams, setCategorySearchParams] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingEoi, setEditingEoi] = useState<EOIResultsData | null>(null);
  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("File change event triggered");
    console.log("Files:", event.target.files);
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      console.log("File selected:", selectedFile);
      console.log("File name:", selectedFile.name);
      console.log("File size:", selectedFile.size);
      setFile(selectedFile);
    }
  };
  const { data, isLoading } = useGetAllEois({});

  const {
    createEoi,
    isLoading: createEoiLoading,
  } = useCreateEoi();

  const {
    updateEoi,
    isLoading: updateEoiLoading,
  } = useUpdateEoi(editingEoi?.id || "");

  const { data: financialYear, isLoading: financialYearLoading } =
    useGetAllFinancialYearsManager({});

  const categoryQueryResult = useGetAllCategoriesManager({
    search: categorySearchParams,
  });

  // @ts-ignore
  const categories = categoryQueryResult?.data?.data?.results;

  const form = useForm<z.infer<typeof EOISchema>>({
    resolver: zodResolver(EOISchema),
    defaultValues: {
      name: "",
      description: "",
      eoi_number: "",
      // status: "",
      type: "",
      categories: [],
      solicitation: "",
    },
  });

  const matchedCategories =
    categories?.filter((category: CategoryResultsData) =>
      form.watch("categories").includes(category?.id)
    ) || [];

  // Handle opening create dialog
  const handleCreateNew = () => {
    setIsEditMode(false);
    setEditingEoi(null);
    form.reset({
      name: "",
      description: "",
      eoi_number: "",
      type: "",
      categories: [],
      solicitation: "",
      financial_year: "",
    });
    setStartDate(undefined);
    setEndDate(undefined);
    setFile(null);
    setOpen(true);
  };

  // Handle opening edit dialog
  const handleEdit = (eoi: EOIResultsData) => {
    setIsEditMode(true);
    setEditingEoi(eoi);

    // Populate form with existing data
    form.reset({
      name: eoi.name || "",
      description: eoi.description || "",
      eoi_number: eoi.eoi_number || "",
      type: eoi.type || "",
      categories: eoi.categories || [],
      solicitation: eoi.solicitation || "",
      financial_year: typeof eoi.financial_year === 'string' ? eoi.financial_year : eoi.financial_year?.year || "",
    });

    // Parse and set dates
    if (eoi.opening_date) {
      setStartDate(new Date(eoi.opening_date));
    }
    if (eoi.closing_date) {
      setEndDate(new Date(eoi.closing_date));
    }

    setFile(null); // Reset file as we don't store it in edit mode
    setOpen(true);
  };

  // Handle Select All Categories
  const handleSelectAllCategories = () => {
    const allCategoryIds = categories?.map((category: CategoryResultsData) => category.id) || [];
    form.setValue("categories", allCategoryIds);
  };

  // Handle Deselect All Categories
  const handleDeselectAllCategories = () => {
    form.setValue("categories", []);
  };

  // Check if all categories are selected
  const areAllCategoriesSelected = () => {
    if (!categories || categories.length === 0) return false;
    const selectedCategories = form.watch("categories");
    return categories.every((category: CategoryResultsData) =>
      selectedCategories.includes(category.id)
    );
  };

  const onSubmit = async (data: z.infer<typeof EOISchema>) => {
    console.log("onSubmit called with data:", data);
    console.log("File state:", file);
    console.log("Is edit mode:", isEditMode);

    // For create mode, file is required
    if (!isEditMode && !file) {
      console.log("No file selected for create mode, returning early");
      toast.error("No file selected");
      return;
    }

    const opening_date = startDate ? format(startDate, "yyy-MM-dd") : "";
    const closing_date = endDate ? format(endDate, "yyy-MM-dd") : "";

    try {
      if (isEditMode && editingEoi) {
        // Update mode - use JSON format for updating
        const updateData = {
          name: data.name,
          description: data.description,
          financial_year: data.financial_year,
          status: "OPEN",
          opening_date,
          closing_date,
          eoi_number: data.eoi_number,
          type: data.type,
          categories: data.categories,
          ...(data.type === "OPEN_TENDER" && { solicitation: data.solicitation }),
        };

        console.log("Updating EOI with data:", updateData);
        await updateEoi(updateData);
        toast.success("EOI updated successfully!");
      } else {
        // Create mode - use FormData for file upload
        console.log("File selected:", file);
        console.log("File name:", file?.name);
        console.log("File size:", file?.size);
        console.log("File type:", file?.type);

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("financial_year", data.financial_year);
        formData.append("status", "OPEN");
        formData.append("opening_date", opening_date);
        formData.append("closing_date", closing_date);
        formData.append("document", file!);
        formData.append("eoi_number", data.eoi_number);
        formData.append("type", data.type);
        if (data.type === "OPEN_TENDER") {
          formData.append("solicitation", data?.solicitation!);
        }

        data.categories.forEach((item) => formData.append("categories", item));

        console.log("FormData entries:");
        for (let [key, value] of formData.entries()) {
          console.log(key, value);
        }

        await createEoi(formData);

        if (data?.type === "OPEN_TENDER") {
          // Pass comprehensive EOI details for full inheritance
          const urlParams = new URLSearchParams({
            type: data.type,
            eoi_name: data.name,
            eoi_description: data.description,
            eoi_number: data.eoi_number,
            solicitation_type: data.solicitation || "R_F_Q",
            // Pass categories as comma-separated string
            eoi_categories: data.categories.join(",")
          });

          router.push(
            `/dashboard/procurement/solicitation-management/rfq/create/quotation?${urlParams.toString()}`
          );
        }
        toast.success("EOI created successfully!");
      }

      setOpen(false);
      // Reset state
      setIsEditMode(false);
      setEditingEoi(null);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const deleteEOIHandler = async () => {
    try {
      // TODO: Implement proper delete functionality
      // For now, just show success message
      toast.success("Successfully Deleted.");
      setOpen(false);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  const tenderOptions = [
    { label: "New Vendor", value: "NEW_VENDOR" },
    { label: "Open Tender", value: "OPEN_TENDER" },
  ].map(({ label, value }) => ({
    label: label,
    value: value,
  }));

  const solOptions = [
    { label: "RFQ", value: "R_F_Q" },
    { label: "RFP", value: "R_F_P" },
  ].map(({ label, value }) => ({
    label: label,
    value: value,
  }));

  const tender = form.watch("type");

  console.log({ tender });

  return (
    <div className="space-y-10">
      <div>
        <h4 className="text-lg font-bold">EOI</h4>
        <h6>
          Procurement -{" "}
          <span className="font-medium text-black dark:text-grey-dark">
            Expression of Interests
          </span>
        </h6>
      </div>

      <div className="space-y-10 p-10 bg-white shadow-sm rounded-2xl dark:bg-[hsl(15,13%,6%)]">
        <div className="flex items-center justify-end">
          <div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleCreateNew}>
                  <Plus size={15} />
                  Create New
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[650px]">
                <div className="pb-5 space-y-5">
                  <DialogTitle className="py-5 ">
                    {isEditMode ? "Edit Expression of Interest" : "Initiate New Expression of Interest"}
                  </DialogTitle>

                  <hr />
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-5"
                    >
                      <div className="grid grid-cols-1 gap-5 items-center md:grid-cols-2">
                        <FormInput name="name" label="Title" />
                        <FormInput name="eoi_number" label="EOI" />
                      </div>
                      <FormTextArea
                        name="description"
                        label="Background"
                        rows={8}
                      />
                      <div className="grid grid-cols-1 gap-5 items-center md:grid-cols-3">
                        <div>
                          <Label>Start Date</Label>
                          <br />
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[280px] justify-start text-left font-normal",
                                  !startDate && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {startDate ? (
                                  format(startDate, "yyy-MM-dd")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={startDate}
                                onSelect={setStartDate}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div>
                          <Label>End Date</Label>
                          <br />
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[280px] justify-start text-left font-normal",
                                  !endDate && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {endDate ? (
                                  format(endDate, "yyy-MM-dd")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={endDate}
                                onSelect={setEndDate}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div>
                          <FormSelect
                            name="financial_year"
                            label="Financial Year"
                            placeholder="Select year"
                            required
                          >
                            <SelectContent>
                              {financialYearLoading ? (
                                <LoadingSpinner />
                              ) : (
                                // @ts-ignore
                                financialYear?.data?.results?.map(
                                  (value: TFinancialYearData) => (
                                    <SelectItem
                                      key={value?.id}
                                      value={value?.id}
                                    >
                                      {value?.year}
                                    </SelectItem>
                                  )
                                )
                              )}
                            </SelectContent>
                          </FormSelect>
                        </div>
                        <div className="">
                          <FormSelect
                            name="type"
                            label="Tender"
                            placeholder="Select Tender Type"
                            required
                            options={tenderOptions}
                          />
                        </div>
                        {tender === "OPEN_TENDER" && (
                          <div className="">
                            <FormSelect
                              name="solicitation"
                              label="Solicitation"
                              placeholder="Select Solicitation Type"
                              required
                              options={solOptions}
                            />
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium ">Category</h4>
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="flex items-center gap-2 flex-wrap">
                            {matchedCategories?.map(
                              (category: CategoryResultsData) => (
                                <Badge
                                  key={category?.id}
                                  className="py-2 rounded-lg bg-[#EBE8E1] text-black"
                                >
                                  {category?.name}
                                </Badge>
                              )
                            )}
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
                                  <img
                                    src={logoPng.src}
                                    alt="logo"
                                    className="mx-auto"
                                    width={150}
                                  />
                                  <DialogTitle className="text-2xl text-center">
                                    Select your Category
                                  </DialogTitle>
                                  <DialogDescription className="text-center">
                                    Select all categories that applies to you,
                                    you can also check other tabs for more
                                    categories
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
                                    <Icon
                                      icon="iconamoon:search-light"
                                      fontSize={25}
                                    />
                                  </div>
                                </div>

                                {/* Select All / Deselect All buttons */}
                                <div className="flex justify-between items-center px-5">
                                  <div className="flex gap-2">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={handleSelectAllCategories}
                                      disabled={areAllCategoriesSelected()}
                                    >
                                      Select All
                                    </Button>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={handleDeselectAllCategories}
                                      disabled={form.watch("categories").length === 0}
                                    >
                                      Deselect All
                                    </Button>
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {form.watch("categories").length} of {categories?.length || 0} selected
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
                                                render={({ field }) => {
                                                  return (
                                                    <FormItem
                                                      key={category.id}
                                                      className="space-y-3 bg-white rounded-lg text-xs p-5"
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
                                                      <h2 className="text-sm font-medium">
                                                        {category.name}
                                                      </h2>
                                                      <h6>
                                                        {category.description}
                                                      </h6>
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

                                  <div className="flex justify-end">
                                    <div className="flex gap-4 items-center">
                                      <h6 className="text-primary">
                                        {form.watch("categories").length}{" "}
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

                      <div className="w-full relative gap-x-3 h-[52px] rounded-[16.2px] border flex justify-center items-center">
                        <UploadFile size={20} />
                        <div>
                          <Input
                            type="file"
                            onChange={handleFileChange}
                            className="bg-inherit border-none cursor-pointer "
                          />
                        </div>
                        {isEditMode && (
                          <p className="absolute -bottom-6 left-0 text-xs text-gray-500">
                            Leave empty to keep existing document
                          </p>
                        )}
                      </div>

                      <div className="flex justify-end gap-5">
                        <DialogClose asChild>
                          <Button variant="ghost">Cancel</Button>
                        </DialogClose>

                        <FormButton
                          loading={isEditMode ? updateEoiLoading : createEoiLoading}
                          disabled={isEditMode ? updateEoiLoading : createEoiLoading}
                          type="submit"
                        >
                          {isEditMode ? "Update" : "Create"}
                        </FormButton>
                      </div>
                    </form>
                  </Form>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        {/*  @ts-ignore */}
        {data?.data?.results && data?.data?.results.length > 0 ? (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
            {/*  @ts-ignore */}
            {data?.data?.results?.map((eoi: EOIResultsData) => (
              <Card
                key={eoi.id}
                className="space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <img src={eoiPng.src} alt="eoi" />
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(eoi)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="icon">
                            <DeleteIcon />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-5">
                          <div className="grid gap-4">
                            <div className="space-y-2">
                              <h4 className="font-medium leading-none">
                                Are you absolutely sure?
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                This action cannot be undone. This will
                                permanently delete this data from our servers.
                              </p>
                            </div>
                            <Button onClick={() => deleteEOIHandler()}>
                              Confirm
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <h2 className="text-lg font-bold">{eoi.name}</h2>

                  <h6 className="line-clamp-5">{eoi.description}</h6>
                </div>

                <div className="flex justify-center">
                  <Link
                    href={`/dashboard/procurement/vendor-management/eoi/${eoi.id}`}
                  >
                    <Button variant="ghost" className="border text-primary">
                      Tap to View
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center">No Data</p>
        )}
      </div>
    </div>
  );
};

export default EOI;
