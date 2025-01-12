import { Button } from "components/ui/button";
import { Plus } from "lucide-react";
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
import Card from "components/shared/Card";
import { Icon } from "@iconify/react";
import { Badge } from "components/ui/badge";
import { Link, generatePath } from "react-router-dom";
import { RouteEnum } from "constants/RouterConstants";
import FormTextArea from "atoms/FormTextArea";
import FormInput from "atoms/FormInput";
import React, { useMemo, useState } from "react";
import { Label } from "components/ui/label";
import { Upload as UploadFile } from "lucide-react";
import CategoryAPI from "services/configs/category";
import { Checkbox } from "components/ui/checkbox";
import { CategoryResultsData } from "definations/configs/category";
import { EOISchema } from "definations/procurement-validator";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loading, LoadingSpinner } from "components/shared/Loading";
import EoiAPI from "services/procurementApi/eoi";
import { toast } from "sonner";
import FormButton from "atoms/FormButton";
import { EOIResultsData } from "definations/procurement-types/eoi";
import FormSelect from "atoms/FormSelectField";
import { SelectContent, SelectItem } from "components/ui/select";
import { FinancialYearResultsData } from "definations/configs/financial-year";
import FinancialAPI from "services/configs/financial-year";
import DeleteIcon from "components/icons/DeleteIcon";

const EOI = () => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [file, setFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const [categorySearchParams, setCategorySearchParams] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };
  const { data, isLoading } = EoiAPI.useGetEoisQuery(
    useMemo(() => ({ params: {} }), [])
  );

  const [createEoiMutation, { isLoading: createEoiLoading }] =
    EoiAPI.useCreateEoiMutation();
  const [deleteEoiMutation] = EoiAPI.useDeleteEoiMutation();

  const { data: financialYear, isLoading: financialYearLoading } =
    FinancialAPI.useGetFinancialYearsQuery({ params: { no_paginate: true } });

  const categoryQueryResult = CategoryAPI.useGetCategoriesQuery(
    useMemo(
      () => ({ params: { no_paginate: true, search: categorySearchParams } }),
      [categorySearchParams]
    )
  );

  // @ts-ignore
  const categories = categoryQueryResult?.data?.data?.results;

  const form = useForm<z.infer<typeof EOISchema>>({
    resolver: zodResolver(EOISchema),
    defaultValues: {
      name: "",
      description: "",
      // status: "",
      categories: [],
    },
  });

  const matchedCategories =
    categories?.filter((category: CategoryResultsData) =>
      form.watch("categories").includes(category?.id)
    ) || [];

  const onSubmit = async (data: z.infer<typeof EOISchema>) => {
    if (!file) {
      toast.error("No file selected");
      return;
    }
    const opening_date = startDate ? format(startDate, "yyy-MM-dd") : "";
    const closing_date = endDate ? format(endDate, "yyy-MM-dd") : "";

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("financial_year", data.financial_year);
    formData.append("status", "OPEN");
    formData.append("opening_date", opening_date);
    formData.append("closing_date", closing_date);
    formData.append("document", file);
    data.categories.forEach((item) => formData.append("categories", item));

    try {
      await createEoiMutation(formData).unwrap();
      toast.success("Successfully Created.");
      setOpen(false);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const deleteEOIHandler = async (id: string) => {
    try {
      await deleteEoiMutation({ path: { id: id } }).unwrap();
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

  // console.log({ categories, matchedCategories, data, financialYear });

  return (
    <div className='space-y-10'>
      <div>
        <h4 className='text-lg font-bold'>EOI</h4>
        <h6>
          Procurement -{" "}
          <span className='font-medium text-black dark:text-grey-dark'>
            Expression of Interests
          </span>
        </h6>
      </div>

      <div className='space-y-10 p-10 bg-white shadow-sm rounded-2xl dark:bg-[hsl(15,13%,6%)]'>
        <div className='flex items-center justify-end'>
          <div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger>
                <div className='flex items-center px-4 py-3 text-sm font-medium rounded-md bg-primary text-primary-foreground h-11 hover:opacity-50'>
                  <span>
                    <Plus size={15} />
                  </span>
                  Create New
                </div>
              </DialogTrigger>
              <DialogContent className='max-w-4xl max-h-[650px]'>
                <div className='pb-5 space-y-5'>
                  <DialogTitle className='py-5 '>
                    Initiate New Expression of Interest
                  </DialogTitle>

                  <hr />
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className='space-y-5'
                    >
                      <FormInput name='name' label='Title' />
                      <FormTextArea
                        name='description'
                        label='Background'
                        rows={8}
                      />
                      <div className='grid grid-cols-1 gap-5 items-center md:grid-cols-3'>
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
                                <CalendarIcon className='mr-2 h-4 w-4' />
                                {startDate ? (
                                  format(startDate, "yyy-MM-dd")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className='w-auto p-0'>
                              <Calendar
                                mode='single'
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
                                <CalendarIcon className='mr-2 h-4 w-4' />
                                {endDate ? (
                                  format(endDate, "yyy-MM-dd")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className='w-auto p-0'>
                              <Calendar
                                mode='single'
                                selected={endDate}
                                onSelect={setEndDate}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div>
                          <FormSelect
                            name='financial_year'
                            label='Financial Year'
                            placeholder='Select year'
                            required
                          >
                            <SelectContent>
                              {financialYearLoading ? (
                                <LoadingSpinner />
                              ) : (
                                // @ts-ignore
                                financialYear?.data?.results?.map(
                                  (value: FinancialYearResultsData) => (
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
                      </div>

                      <div className='space-y-2'>
                        <h4 className='font-medium '>Category</h4>
                        <div className='flex items-center gap-2 flex-wrap'>
                          <div className='flex items-center gap-2 flex-wrap'>
                            {matchedCategories?.map(
                              (category: CategoryResultsData) => (
                                <Badge
                                  key={category?.id}
                                  className='py-2 rounded-lg bg-[#EBE8E1] text-black'
                                >
                                  {category?.name}
                                </Badge>
                              )
                            )}
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
                                    Select all categories that applies to you,
                                    you can also check other tabs for more
                                    categories
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
                                    <Icon
                                      icon='iconamoon:search-light'
                                      fontSize={25}
                                    />
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

                                  <div className='flex justify-end'>
                                    <div className='flex gap-4 items-center'>
                                      <h6 className='text-primary'>
                                        {form.watch("categories").length}{" "}
                                        categories Selected
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

                      <div className='w-full relative gap-x-3 h-[52px] rounded-[16.2px] border flex justify-center items-center'>
                        <UploadFile size={20} />
                        <div>
                          <Input
                            type='file'
                            onChange={handleFileChange}
                            className='bg-inherit border-none cursor-pointer '
                          />
                        </div>
                      </div>

                      <div className='flex justify-end gap-5'>
                        <DialogClose asChild>
                          <Button variant='ghost'>Cancel</Button>
                        </DialogClose>

                        <FormButton
                          loading={createEoiLoading}
                          disabled={createEoiLoading}
                          type='submit'
                        >
                          Create
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
          <div className='grid grid-cols-2 gap-5 md:grid-cols-3'>
            {/*  @ts-ignore */}
            {data?.data?.results?.map((eoi: EOIResultsData) => (
              <Card
                key={eoi.id}
                className='space-y-4 flex flex-col justify-between'
              >
                <div className='space-y-4'>
                  <div className='flex justify-between'>
                    <img src={eoiPng} alt='eoi' />
                    <div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant='outline' size='icon'>
                            <DeleteIcon />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className='w-80 p-5'>
                          <div className='grid gap-4'>
                            <div className='space-y-2'>
                              <h4 className='font-medium leading-none'>
                                Are you absolutely sure?
                              </h4>
                              <p className='text-sm text-muted-foreground'>
                                This action cannot be undone. This will
                                permanently delete this data from our servers.
                              </p>
                            </div>
                            <Button onClick={() => deleteEOIHandler(eoi.id)}>
                              Confirm
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <h2 className='text-lg font-bold'>{eoi.name}</h2>

                  <h6 className='line-clamp-5'>{eoi.description}</h6>
                </div>

                <div className='flex justify-center'>
                  <Link to={generatePath(RouteEnum.EOI_VIEW, { id: eoi.id })}>
                    <Button variant='ghost' className='border text-primary'>
                      Tap to View
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p className='text-center'>No Data</p>
        )}
      </div>
    </div>
  );
};

export default EOI;
