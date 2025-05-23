import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "atoms/FormInput";
import FormButton from "atoms/FormButton";
import { Label } from "components/ui/label";
import { toast } from "sonner";
import {
    ConsultancyManagementDetailSchema,
    TConsultantanagementDetailsFormData,
} from "definations/c&g/contract-management/consultancy-management/consultancy-management";
import { Button } from "components/ui/button";
import FormTextArea from "atoms/FormTextArea";
import { FormField, FormItem, Form, FormControl } from "components/ui/form";
import MultiSelectFormField from "components/ui/multiselect";
import { useGetAllLocationsQuery } from "services/modules/config/location";
import { useEffect, useMemo } from "react";
import { useGetAllUsersQuery } from "services/auth/user";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { CG_ROUTES, ProgramRoutes } from "constants/RouterConstants";
import { fileToBase64 } from "utils/fileToBase64";
import { useGetSingleConsultantManagementQuery } from "services/c&g/contract-management/consultancy-management/consultant-management";
import { skipToken } from "@reduxjs/toolkit/query";
import FormSelect from "atoms/FormSelect";

export default function ApplicationDetails() {
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const consultantId = searchParams.get("id");

    const form = useForm<TConsultantanagementDetailsFormData>({
        resolver: zodResolver(ConsultancyManagementDetailSchema),
        defaultValues: {
            title: "",
            locations: [],
            commencement_date: "",
            end_date: "",
            consultants_number: "",
            background: "",
        },
    });

    const { pathname } = useLocation();

    const {
        formState: { errors },
    } = form;

    const { data: location } = useGetAllLocationsQuery({
        page: 1,
        size: 2000000,
    });

    const locationOptions = location?.data.results;

    const { data: user } = useGetAllUsersQuery({ page: 1, size: 2000000 });

    const onSubmit: SubmitHandler<TConsultantanagementDetailsFormData> = async (
        data
    ) => {
        try {
            const payload = {
                ...data,
            };

            sessionStorage.setItem(
                "consultantManagementFormData",
                JSON.stringify(payload)
            );

            const searchUrl = `${consultantId ? `?id=${consultantId}` : ""}`;

            if (pathname.includes("adhoc-management")) {
                navigate({
                    pathname: ProgramRoutes.CREATE_ADHOC_WORK_SCOPE,
                    search: searchUrl,
                });
            } else {
                navigate({
                    pathname: CG_ROUTES.CREATE_CONSULTANCY_WORK_SCOPE,
                    search: searchUrl,
                });
            }
        } catch (error: any) {
            toast.error(error?.data.message ?? "Something went wrong");
        }
    };

    const { data } = useGetSingleConsultantManagementQuery(
        consultantId ?? skipToken
    );

    useEffect(() => {
        if (data) {
            const { locations, consultants_number, advertisement_document } =
                data.data;

            form.reset({
                ...data.data,
                locations: locations.map(({ id }) => id),
                consultants_number: String(consultants_number),
            });
        }
    }, [data, user]);

    return (
        <main className="w-full flex flex-col items-center justify-center gap-y-[2.5rem] bg-white p-[1.25rem] pt-[2rem]  rounded-2xl">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full space-y-8"
                >
                    <FormInput
                        label="Title of Consultancy"
                        name="title"
                        placeholder="Enter Title"
                        required
                    />

                    <FormSelect
                        label="Contract Request"
                        name="contract_request"
                        placeholder="Select Contract Request"
                        required
                    />

                    <FormTextArea
                        label="Job Description"
                        name="description"
                        placeholder="Enter Background"
                        required
                    />

                    <div>
                        <Label className="font-semibold">Locations</Label>

                        <FormField
                            control={form.control}
                            name="locations"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <MultiSelectFormField
                                            options={locationOptions || []}
                                            defaultValue={field.value}
                                            onValueChange={field.onChange}
                                            placeholder="Select Locations"
                                            variant="inverted"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        {errors.locations && (
                            <span className="text-sm text-red-500 font-medium">
                                {errors?.locations?.message as string}
                            </span>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <FormInput
                            type="date"
                            label="Commencement Date"
                            name="commencement_date"
                            required
                        />

                        <FormInput
                            type="date"
                            label="Effective End Date"
                            name="end_date"
                            required
                        />
                    </div>

                    <FormInput
                        label="Number of Consultants"
                        name="consultants_number"
                        type="number"
                        placeholder="Enter Number of Consultants"
                        required
                    />

                    {/* <div className="flex flex-col gap-y-[1rem]">
                            <Label className="font-semibold">
                                Upload Complete Advertisement Document
                            </Label>

                            <div className="flex items-center w-full gap-x-[1rem]">
                                <label
                                    className="cursor-pointer shrink-0 border flex items-center gap-x-[1rem] w-fit rounded-lg border-[#DBDFE9] py-[.875rem] px-[1.125rem]"
                                    htmlFor="file"
                                >
                                    <UploadFileSvg />
                                    Select file
                                </label>
                                <input
                                    type="file"
                                    name="file"
                                    hidden
                                    id="file"
                                    onChange={handleFileChange}
                                />
                                <p className="border flex items-center w-full gap-x-[1rem] rounded-lg border-[#DBDFE9] px-[1.125rem] h-[3.5rem]">
                                    {fileName ||
                                        data?.data.advertisement_document}
                                </p>
                            </div>

                            {errors.advertisement_document && (
                                <span className="text-sm text-red-500 font-medium">
                                    {
                                        errors?.advertisement_document
                                            ?.message as string
                                    }
                                </span>
                            )}
                        </div> */}

                    <div className="flex justify-end items-center gap-5">
                        <Button type="button" variant="outline" size="lg">
                            Cancel
                        </Button>

                        <FormButton size="lg">Next</FormButton>
                    </div>
                </form>
            </Form>
        </main>
    );
}
