"use client";

import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelectField";
// import GoBack from "components/GoBack";
import { Button } from "components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "components/ui/form";
import { SelectContent, SelectItem } from "components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
  DialogDescription,
  DialogClose,
} from "components/ui/dialog";
import { useForm } from "react-hook-form";

import logoPng from "assets/imgs/logo.png";
import { Input } from "components/ui/input";
import { Icon } from "@iconify/react";
import { LoadingSpinner } from "components/Loading";
import { Checkbox } from "components/ui/checkbox";

import { z } from "zod";
// import { CbaSchema } from "definations/procurement-validator";
// import { TUser } from "features/auth/types/user";
// import CbaAPI from "@/features/procurementApi/cbaController";
import { toast } from "sonner";
import { RouteEnum } from "constants/RouterConstants";
import { Badge } from "components/ui/badge";
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
} from "@/features/procurement/controllers";
import { useGetAllUsers } from "@/features/auth/controllers";
import { useRouter, useSearchParams } from "next/navigation";
import { CbaSchema } from "@/features/procurement/types/procurement-validator";
import { LotsResultsData } from "@/features/procurement/types/lots";
import Image from "next/image";
const CreateCBA = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rfqId = searchParams?.get("id");
  const eoiId = searchParams?.get("eoi_id");
  const solicitationId = searchParams?.get("solicitation_id");
  // const name = searchParams.get("name");

  console.log({ rfqId, eoiId, solicitationId });

  const { data: rfqData, isLoading } = useGetAllSolicitations({
    // page,
    size: 2000000,
  });

  // const query = useQuery();
  // const rfqId = query.get("id");

  const { data: users } = useGetAllUsers({
    page: 1,
    size: 2000000,
  });

  const { data: lots, isLoading: lotIsLoading } = useGetLotList({
    params: { no_paginate: true },
  });
  const { createCba, isLoading: createCbaIsLoading } = useCreateCba();

  const form = useForm<z.infer<typeof CbaSchema>>({
    resolver: zodResolver(CbaSchema),
    defaultValues: {
      solicitation: solicitationId || rfqId!,
      lot: undefined,
      cba_type: "",
      cba_date: "",
      assignee: "",
      committee_members: [],
    },
  });
  const { handleSubmit, watch } = form;

  useEffect(() => {
    if (rfqId) {
      form.setValue("solicitation", rfqId);
    }
  }, [rfqId, form]);

  const matchedUsers =
    users?.data?.results?.filter((user) =>
      // @ts-ignore
      form.watch("committee_members").includes(user?.id)
    ) || [];

  const onSubmit = async (data: z.infer<typeof CbaSchema>) => {
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
    };

    try {
      await createCba(payload);
      toast.success("Successfully created.");
      // router.push(RouteEnum.COMPETITIVE_BID_ANALYSIS);
      router.push(
        RouteEnum.RFQ_DETAILS.replace(":id", data?.solicitation as string)
      );
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  };

  return (
    <div className="bg-white p-4 h-full">
      <h4 className="font-semibold text-lg pb-5">Create CBA</h4>
      {eoiId && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-blue-800 text-sm">
            <strong>Creating CBA from EOI:</strong> Please select the RFQ that
            was created for this Expression of Interest. Look for the most
            recently created RFQ.
          </p>
        </div>
      )}

      <Form {...form}>
        {/* @ts-ignore */}
        <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
          <FormSelect name="solicitation" label="RFQ">
            <SelectContent>
              {isLoading && <LoadingSpinner />}
              {rfqData?.data?.results?.map((rfq) => (
                <SelectItem key={rfq?.id} value={rfq?.id}>
                  {/* {rfq?.first_name} {rfq?.last_name} */}
                  {rfq?.rfq_id}
                </SelectItem>
              ))}
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
                        Please select all team members needed to make up the
                        committee
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-center">
                      <div className="flex items-center w-1/2 px-4 py-2 border rounded-lg">
                        <Input
                          placeholder="Search team members"
                          //   value={categorySearchParams}
                          //   onChange={(e) => setCategorySearchParams(e.target.value)}
                          type="search"
                          className="h-6 border-none bg-none"
                        />
                        <Icon icon="iconamoon:search-light" fontSize={25} />
                      </div>
                    </div>

                    <div className="space-y-5 ">
                      {isLoading ? (
                        <LoadingSpinner />
                      ) : (
                        <FormField
                          control={form.control}
                          name="committee_members"
                          render={() => (
                            <FormItem className="grid grid-cols-2 gap-5 bg-gray-100 mt-10 p-5 rounded-lg shadow-inner md:grid-cols-4">
                              {users?.data?.results?.map((user) => (
                                <FormField
                                  key={user?.id}
                                  control={form.control}
                                  name="committee_members"
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={user.id}
                                        className="space-y-3 bg-white rounded-lg text-xs p-5"
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
                                        <div className="space-y-4">
                                          <div className="flex items-center">
                                            <h6 className="w-24">Name:</h6>
                                            <h6>
                                              {user?.first_name}{" "}
                                              {user?.last_name}
                                            </h6>
                                          </div>
                                          <div className="flex items-center">
                                            <h6 className="w-24">Position:</h6>
                                            <h6>{user?.designation}</h6>
                                          </div>
                                          <div className="flex items-center">
                                            <h6 className="w-24">Tel:</h6>
                                            {/* @ts-ignore */}
                                            <h6>{user?.phone_number}</h6>
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

          <FormSelect name="assignee" label="Assignee">
            <SelectContent>
              {isLoading && <LoadingSpinner />}
              {users?.data?.results?.map((user) => (
                <SelectItem key={user?.id} value={user?.id}>
                  {user?.first_name} {user?.last_name}
                </SelectItem>
              ))}
            </SelectContent>
          </FormSelect>

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
              loading={createCbaIsLoading}
              disabled={createCbaIsLoading}
            >
              Create CBA
            </FormButton>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateCBA;
