import BackNavigation from "atoms/BackNavigation";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelect";
import Card from "components/shared/Card";
import { UserCircle } from "lucide-react";
import { useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useGetAllUsersQuery } from "services/auth/user";
import { useGetAllDepartmentsQuery } from "services/modules/config/department";
import { useGetAllLocationsQuery } from "services/modules/config/location";
import { useGetAllFCONumbersQuery } from "services/modules/finance/fco-number";

export default function CreateContractRequest() {
    const form = useForm();

    const { data: department } = useGetAllDepartmentsQuery({
        page: 1,
        size: 2000000,
    });

    const departmentOptions = useMemo(
        () =>
            department?.data.results.map(({ name, id }) => ({
                label: name,
                value: id,
            })),
        [department]
    );

    const { data: location } = useGetAllLocationsQuery({
        page: 1,
        size: 2000000,
    });

    const locationOptions = useMemo(
        () =>
            location?.data.results.map(({ name, id }) => ({
                label: name,
                value: id,
            })),
        [location]
    );

    const { data: fco } = useGetAllFCONumbersQuery({
        page: 1,
        size: 2000000,
    });

    const fcoOptions = useMemo(
        () =>
            fco?.data.results.map(({ name, id }) => ({
                label: name,
                value: id,
            })),
        [fco]
    );

    const { data: user } = useGetAllUsersQuery({
        page: 1,
        size: 2000000,
    });

    const userOptions = useMemo(
        () =>
            user?.data.results.map(({ first_name, last_name, id }) => ({
                label: `${first_name} ${last_name}`,
                value: id,
            })),
        [UserCircle]
    );

    return (
        <section>
            <BackNavigation />

            <Card>
                <FormProvider {...form}>
                    <form className="grid grid-cols-2 gap-10">
                        <FormInput
                            label="Request Title"
                            name="_"
                            placeholder="Enter title"
                            required
                        />

                        <FormSelect
                            label="Request Type"
                            name="_"
                            placeholder="Select type"
                            required
                            options={[
                                { label: "SERVICE", value: "SERVICE" },
                                { label: "CONSULTANT", value: "CONSULTANT" },
                                { label: "ADHOC", value: "ADHOC" },
                                { label: "FACILITATOR", value: "FACILITATOR" },
                            ]}
                        />

                        <FormSelect
                            label="Requesting Department"
                            name="_"
                            placeholder="Select department"
                            required
                            options={departmentOptions}
                        />

                        <FormInput
                            type="number"
                            label="No of Consultants"
                            name="_"
                            placeholder="Enter consultants number"
                            required
                        />

                        <FormSelect
                            label="Location"
                            name="_"
                            placeholder="Select location"
                            required
                            options={locationOptions}
                        />

                        <FormSelect
                            label="FCO"
                            name="_"
                            placeholder="Select FCO"
                            required
                            options={fcoOptions}
                        />

                        <FormSelect
                            label="Technical Monitor"
                            name="_"
                            placeholder="Select technical monitor"
                            required
                            options={userOptions}
                        />

                        <FormInput
                            type="email"
                            label="Email"
                            name="_"
                            placeholder="Enter email"
                            required
                        />

                        <FormInput
                            type="number"
                            label="Phone Number"
                            name="_"
                            placeholder="Enter phone number"
                            required
                        />

                        <FormSelect
                            label="Reviewer"
                            name="_"
                            placeholder="Select reviewer"
                            required
                            options={userOptions}
                        />

                        <FormSelect
                            label="Authorizer"
                            name="_"
                            placeholder="Select authorizer"
                            required
                            options={userOptions}
                        />

                        <FormSelect
                            label="Approver"
                            name="_"
                            placeholder="Select approver"
                            required
                            options={userOptions}
                        />
                    </form>
                </FormProvider>
            </Card>
        </section>
    );
}
