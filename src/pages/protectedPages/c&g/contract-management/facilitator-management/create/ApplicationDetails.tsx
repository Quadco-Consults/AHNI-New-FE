import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "atoms/FormInput";
import FormButton from "atoms/FormButton";
import { Label } from "components/ui/label";
import { UploadFileSvg } from "assets/svgs/CAndGSvgs";
import { toast } from "sonner";
import { Button } from "components/ui/button";
import FormSelect from "atoms/FormSelect";
import FormTextArea from "atoms/FormTextArea";
import { FormField, FormItem, Form, FormControl } from "components/ui/form";
import MultiSelectFormField from "components/ui/multiselect";
import { useGetAllLocationsQuery } from "services/modules/config/location";
import { useMemo } from "react";
import { useGetAllUsersQuery } from "services/auth/user";
import { useNavigate } from "react-router-dom";
import { CG_ROUTES } from "constants/RouterConstants";
import { fileToBase64 } from "utils/fileToBase64";
import {
    FacilitatorManagementDetailSchema,
    TFacilitatorManagementDetailsFormData,
} from "definations/c&g/contract-management/facilitator-management";
import FacilitatorManagementLayout from "./Layout";

export default function CreateFacilitatorApplicationDetails() {
    const navigate = useNavigate();

    const form = useForm<TFacilitatorManagementDetailsFormData>({
        resolver: zodResolver(FacilitatorManagementDetailSchema),
        defaultValues: {
            title: "",
            grade_level: "",
            locations: [],
            duration: "",
            commencement_date: "",
            end_date: "",
            facilitaor_number: "",
            extra_info: "",
            background: "",
            evaluation_comments: "",
            supervisor: "",
        },
    });

    const {
        formState: { errors },
    } = form;

    const { data: location } = useGetAllLocationsQuery({
        page: 1,
        size: 2000000,
    });

    const locationOptions = location?.data.results;

    const { data: user } = useGetAllUsersQuery({ page: 1, size: 2000000 });

    const userOptions = useMemo(
        () =>
            user?.data.results.map(({ first_name, last_name, id }) => ({
                label: `${first_name} ${last_name}`,
                value: id,
            })),
        [user]
    );

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            form.setValue("advertisement_document", e.target.files);
        }
    };

    const onSubmit: SubmitHandler<
        TFacilitatorManagementDetailsFormData
    > = async (data) => {
        try {
            const payload = {
                ...data,
                advertisement_document: await fileToBase64(
                    data.advertisement_document[0]
                ),
            };

            sessionStorage.setItem(
                "facilitatorManagementFormData",
                JSON.stringify(payload)
            );

            navigate(CG_ROUTES.CREATE_FACILITATOR_WORK_SCOPE);
        } catch (error: any) {
            toast.error(error.data.message ?? "Something went wrong");
        }
    };

    return (
        <FacilitatorManagementLayout>
            <main className="w-full flex flex-col items-center justify-center gap-y-[2.5rem] bg-white p-[1.25rem] pt-[2rem]  rounded-2xl">
                <h2 className="font-semibold text-[1.25rem] w-full text-black">
                    Application Details
                </h2>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-full space-y-[1.25rem]"
                    >
                        <FormInput
                            label="Title"
                            name="title"
                            placeholder="Enter Title"
                            required
                        />

                        <FormInput
                            label="Grade Level"
                            name="grade_level"
                            placeholder="Enter Grade Level"
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

                            {errors.advertisement_document && (
                                <span className="text-sm text-red-500 font-medium">
                                    {
                                        errors?.advertisement_document
                                            ?.message as string
                                    }
                                </span>
                            )}
                        </div>

                        <FormInput
                            label="Duration"
                            name="duration"
                            placeholder="Enter Duration"
                            type="number"
                            required
                        />

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

                        <FormInput
                            label="Number of Facilitators"
                            name="facilitaor_number"
                            type="number"
                            placeholder="Enter Number of Facilitators"
                            required
                        />

                        <FormInput
                            label="Any other Info"
                            name="extra_info"
                            placeholder="Enter Any Other Info"
                            required
                        />

                        <FormTextArea
                            label="Background"
                            name="background"
                            placeholder="Enter Background"
                            required
                        />

                        <FormTextArea
                            label="Evaluation Comments"
                            name="evaluation_comments"
                            placeholder="Enter Evaluation Comments"
                            required
                        />

                        <FormSelect
                            label="Supervisor"
                            name="supervisor"
                            placeholder="Select supervisor"
                            options={userOptions}
                            required
                        />

                        <div className="flex flex-col gap-y-[1rem]">
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
                                    {/* {file?.name} */}
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-end items-center gap-5">
                            <Button type="button" variant="outline" size="lg">
                                Cancel
                            </Button>

                            <FormButton size="lg">Next</FormButton>
                        </div>
                    </form>
                </Form>
            </main>
        </FacilitatorManagementLayout>
    );
}
