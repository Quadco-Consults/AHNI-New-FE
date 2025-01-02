import { zodResolver } from "@hookform/resolvers/zod";
import BackNavigation from "atoms/BackNavigation";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelectField";
import FormTextArea from "atoms/FormTextArea";
import { Card, CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { APPROVAL_PROCESS } from "../FacilitiesManagment/FacilitiesMaintanance";
import { Button } from "components/ui/button";

const schema = z.object({
    asset: z.string(),
    description_of_problem: z.string(),
    maintenance_type: z.string(),
});

const VehichleMaitanace = () => {
    // const onSubmit = async (data: CreateAssetMaintenanceRequestPayload) => {
    //     try {
    //         await assetMaintenacce({
    //             ...data,
    //             classification: "Vehicle",
    //         }).unwrap();
    //         toast.success("Maintenace ticket created successfully");
    //         form.reset();
    //     } catch (error) {
    //         toast.error("Failed to create");
    //     }
    // };
    return (
        <div>
            <BackNavigation extraText="Asset Maintenance Ticket" />
            <Card>
                <CardContent className="p-5">
                    {/* <Form> */}
                    <form
                        // onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col gap-y-8"
                    >
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <FormSelect
                                name="asset"
                                label="Asset"
                                options={[]}
                            />
                            <FormSelect
                                name="maintenance_type"
                                label="Maintenance Type"
                                options={[
                                    {
                                        label: "Preventive",
                                        value: "preventive",
                                    },
                                    {
                                        label: "Corrective",
                                        value: "corrective",
                                    },
                                ]}
                            />
                            <FormInput name="fco" label="FCO" />
                            <FormInput name="cost" label="Cost Estimate" />
                        </div>
                        <FormTextArea
                            name="description_of_problem"
                            label="Description of Problem"
                        />

                        {/* <Form> */}
                        <form className="space-y-4">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <FormTextArea
                                        name=""
                                        label="Justification for Disposal"
                                        placeholder="This can be repaired and we donate it to CBOs"
                                    />
                                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                                        <FormSelect
                                            name=""
                                            placeholder="Select approval"
                                            options={APPROVAL_PROCESS}
                                        />
                                        <FormSelect
                                            name=""
                                            placeholder="Select name"
                                            options={APPROVAL_PROCESS}
                                        />
                                    </div>
                                    <Button variant="custom" type="button">
                                        Approve
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    <FormTextArea
                                        name=""
                                        label="GT CT Approval"
                                        placeholder="This can be repaired and we donate it to CBOs"
                                    />
                                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                                        <FormSelect
                                            name=""
                                            placeholder="Select approval"
                                            options={APPROVAL_PROCESS}
                                        />
                                        <FormSelect
                                            name=""
                                            placeholder="Select name"
                                            options={APPROVAL_PROCESS}
                                        />
                                    </div>
                                    <Button variant="custom" type="button">
                                        Approve
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    <FormTextArea
                                        name=""
                                        label="CCM Approval"
                                        placeholder="This can be repaired and we donate it to CBOs"
                                    />
                                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                                        <FormSelect
                                            name=""
                                            placeholder="Select approval"
                                            options={APPROVAL_PROCESS}
                                        />
                                        <FormSelect
                                            name=""
                                            placeholder="Select name"
                                            options={APPROVAL_PROCESS}
                                        />
                                    </div>
                                    <Button variant="custom" type="button">
                                        Approve
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    <FormTextArea name="" label="Remarks" />
                                    <FormSelect
                                        name=""
                                        placeholder="Select approval"
                                        options={APPROVAL_PROCESS}
                                    />
                                    <Button variant="custom" type="button">
                                        Approve
                                    </Button>
                                </div>
                            </div>
                        </form>
                        {/* </Form> */}

                        <div className="flex justify-end">
                            <FormButton loading={false} className="w-32">
                                Raise Request
                            </FormButton>
                        </div>
                    </form>
                    {/* </Form> */}
                </CardContent>
            </Card>
        </div>
    );
};

export default VehichleMaitanace;
