import FormButton from "atoms/FormButton";
import FormCheckBox from "atoms/FormCheckBox";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelect";
import FormTextArea from "atoms/FormTextArea";
import AddSquareIcon from "components/icons/AddSquareIcon";
import Card from "components/shared/Card";
import GoBack from "components/shared/GoBack";
import { Button } from "components/ui/button";
import { Form } from "components/ui/form";
import { Label } from "components/ui/label";
import { useFieldArray, useForm } from "react-hook-form";
import FormRadio from "atoms/FormRadio";

const ExpenseAuthorizationCreate = () => {
    const form = useForm({
        defaultValues: {
            destinations: [{ name: "" }],
        },
    });
    const { control } = form;

    const { fields, append } = useFieldArray({
        name: "destinations",
        control,
    });

    // const { data: departments } = DepartmentsAPI.useGetDepartmentPaginateQuery({
    //     params: { no_paginate: true },
    // });

    // const departmentData = useMemo(() => {
    //     return departments?.map((item) => ({
    //         label: item.name,
    //         value: item.id,
    //     }));
    // }, [departments]);

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-x-5">
                <GoBack />
                <h4 className="text-xl font-bold">
                    Expense Authorization Form
                </h4>
            </div>
            <Card>
                <Form {...form}>
                    <form className="space-y-8">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <FormInput name="name" label="Full Name" />
                            <FormInput name="" label="Address" />
                            <FormInput name="" label="Phone Number" />
                            <FormInput name="" label="Email" />
                            <FormInput name="" label="TA Number" />
                            <FormInput name="" label="Project Name" />
                            <FormSelect
                                name=""
                                label="Department"
                                // options={departmentData}
                            />
                            <FormInput name="" label="FCO" />
                            <FormInput name="" label="City" />
                            <FormInput name="" label="Arrival Date" />
                            <FormInput name="" label="Departure Date" />
                            <FormInput name="" label="Project Number" />
                        </div>

                        <FormCheckBox
                            name=""
                            label="Managing Director Notified?"
                        />

                        <div className="space-y-4">
                            <Label className="text-lg">Special Requests:</Label>

                            <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                                <FormRadio
                                    name=""
                                    label="Travel advances are based on current State Department per diem rates which are updated on a monthly basis or approved local rates for the projects"
                                    options={[
                                        { label: "Yes", value: "yes" },
                                        { label: "No", value: "no" },
                                    ]}
                                />
                                <FormRadio
                                    name=""
                                    label="Documents Needed more than 3 days prior to departure?"
                                    options={[
                                        { label: "Yes", value: "yes" },
                                        { label: "No", value: "no" },
                                    ]}
                                />
                                <FormRadio
                                    name=""
                                    label="Car Rental?  If yes, attach approved per diem variance memo to Travel Manager"
                                    options={[
                                        { label: "Yes", value: "yes" },
                                        { label: "No", value: "no" },
                                    ]}
                                />
                                <FormRadio
                                    name=""
                                    label="Hotel Reservations?  If yes, specify dates in/out and hotel(s) if known."
                                    options={[
                                        { label: "Yes", value: "yes" },
                                        { label: "No", value: "no" },
                                    ]}
                                />
                                <FormRadio
                                    name=""
                                    label="Hotel transfer/taxi/other transportation needed (International travel only)"
                                    options={[
                                        { label: "Yes", value: "yes" },
                                        { label: "No", value: "no" },
                                    ]}
                                />
                            </div>
                        </div>

                        <FormTextArea name="" label="Justification" />
                        <div>
                            <Label className="font-medium">Destination</Label>
                            {fields.map((field, index) => (
                                <FormTextArea
                                    key={field.id}
                                    name={`destinations.${index}.name`}
                                />
                            ))}
                            <div className="flex justify-end mt-2">
                                <Button
                                    type="button"
                                    className="text-primary bg-[#FFF2F2] flex gap-2 items-center justify-center"
                                    onClick={() =>
                                        append({
                                            name: "",
                                        })
                                    }
                                >
                                    <AddSquareIcon />
                                    Add
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Label className="text-lg">
                                Travel Office Use:
                            </Label>

                            <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
                                <FormInput name="" label="Lodging" />
                                <FormInput name="" label="Meals" />
                                <FormInput name="" label="Total" />
                                <FormInput name="" label="Number of Night" />
                                <FormInput name="" label="Interstate" />
                                <FormInput name="" label="Airport Taxi" />
                                <FormInput name="" label="Car Hire" />
                            </div>

                            <div className="max-w-md text-red-500 space-y-4">
                                <div className="flex gap-x-6 items-center justify-between">
                                    <h4 className="font-medium">Total:</h4>
                                    <p className="font-semibold">N1200</p>
                                </div>
                                <div className="flex gap-x-6 items-center justify-between">
                                    <h4 className="font-medium">Advance %:</h4>
                                    <p className="font-semibold">N/A</p>
                                </div>
                                <div className="flex gap-x-6 items-center justify-between">
                                    <h4 className="font-medium">
                                        Total Advance:
                                    </h4>
                                    <p className="font-semibold">N/A</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <FormButton>Submit</FormButton>
                        </div>
                    </form>
                </Form>
            </Card>
        </div>
    );
};

export default ExpenseAuthorizationCreate;
