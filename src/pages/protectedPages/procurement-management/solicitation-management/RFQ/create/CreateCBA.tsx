import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelectField";
import GoBack from "components/shared/GoBack";
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
import { useNavigate, useParams } from "react-router-dom";
import logoPng from "assets/imgs/logo.png";
import { Input } from "components/ui/input";
import { Icon } from "@iconify/react";
import { LoadingSpinner } from "components/shared/Loading";
import { Checkbox } from "components/ui/checkbox";
import BreadcrumbCard from "components/shared/Breadcrumb";
import { z } from "zod";
import { CbaSchema } from "definations/procurement-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import usersAPI from "services/usersAPI";
import { TUser } from "definations/users";
import CbaAPI from "services/procurementApi/cba";
import { toast } from "sonner";
import { RouteEnum } from "constants/RouterConstants";
import { Badge } from "components/ui/badge";
import LotsAPI from "services/procurementApi/lots";
import { LotsResultsData } from "definations/procurement-types/lots";

const CreateCBA = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: users, isLoading } = usersAPI.useGetUsersQuery({
    params: { no_paginate: true },
  });
  const { data: lots, isLoading: lotIsLoading } = LotsAPI.useGetLotListQuery({
    params: { no_paginate: true },
  });
  const [createCbaMutation, { isLoading: createCbaIsLoading }] =
    CbaAPI.useCreateCbaMutation();

  const form = useForm<z.infer<typeof CbaSchema>>({
    resolver: zodResolver(CbaSchema),
    defaultValues: {
      cba_type: "",
      cba_date: "",
      remarks: "",
      solicitation: id,
      lot: "",
      assignee: "",
      committee_members: [],
    },
  });
  const { handleSubmit, watch } = form;

  const matchedUsers =
    users?.filter((user: TUser) =>
      form.watch("committee_members").includes(user?.id)
    ) || [];

  const onSubmit = async (data: z.infer<typeof CbaSchema>) => {
    try {
      await createCbaMutation(data).unwrap();
      toast.success("Successfully created.");
      navigate(RouteEnum.RFQ);
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  };

  const breadcrumbs = [
    { name: "Procurement", icon: true },
    { name: "Solicitation Management", icon: true },
    { name: "RFQ", icon: true },
    { name: "Detail", icon: true },
    { name: "Create CBA", icon: false },
  ];

  return (
    <div className="space-y-5">
      <BreadcrumbCard list={breadcrumbs} />

      <GoBack />

      <h4 className="font-semibold text-lg pb-5">Create CBA</h4>

      <Form {...form}>
        <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-4 w-full md:grid-cols-3">
            <FormSelect name="cba_type" label="CBA type" required>
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

            <FormSelect name="lot" label="Lot" required>
              <SelectContent>
                {lotIsLoading && <LoadingSpinner />}
                {lots?.map((lot: LotsResultsData) => (
                  <SelectItem key={lot?.id} value={String(lot?.packet_number)}>
                    {lot?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </FormSelect>

            <FormInput name="cba_date" type="date" label="CBA Date" required />
          </div>

          {watch("cba_type") === "COMMITTEE" && (
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                {matchedUsers?.map((user: TUser) => (
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
                      <img
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
                              {users?.map((user: TUser) => (
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

          <FormSelect name="assignee" label="Assignee" required>
            <SelectContent>
              {isLoading && <LoadingSpinner />}
              {users?.map((user: TUser) => (
                <SelectItem key={user?.id} value={user?.id}>
                  {user?.first_name} {user?.last_name}
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
