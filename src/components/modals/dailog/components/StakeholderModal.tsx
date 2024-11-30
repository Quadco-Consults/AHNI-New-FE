import logoPng from "assets/imgs/logo.png";
import { ScrollArea } from "components/ui/scroll-area";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Search } from "lucide-react";
import { Checkbox } from "components/ui/checkbox";
import { useGetAllStakeholderRegisterQuery } from "services/programsApi/stakeholder";
import { LoadingSpinner } from "components/shared/Loading";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import _, { values } from "lodash";
import { addStakeholders } from "store/formData/stakeholders";
import { CheckedState } from "@radix-ui/react-checkbox";
import { useState } from "react";
import { closeDialog } from "store/ui";
import { TStakeholderRegisterResponse } from "definations/program-validator";

const StakeholderModal = () => {
    const { selectedStakeholders } = useAppSelector(
        (state) => state.stakeholder
    );

    const [stakeholders, setStakeholders] =
        useState<TStakeholderRegisterResponse[]>(selectedStakeholders);

    const { data, isLoading } = useGetAllStakeholderRegisterQuery({
        no_paginate: false,
    });

    const dispatch = useAppDispatch();

    const handleCheckChange = (
        value: CheckedState,
        stakeholder: TStakeholderRegisterResponse
    ) => {
        if (value) {
            setStakeholders([...stakeholders, stakeholder]);
        } else {
            setStakeholders(
                stakeholders.filter((holder) => stakeholder.id !== holder.id)
            );
        }
    };

    const onSubmit = () => {
        dispatch(addStakeholders(stakeholders));
        dispatch(closeDialog());
    };

    return (
        <div className="flex flex-col mt-5 items-center justify-center w-full h-[80vh] ">
            <ScrollArea className="h-[90%]">
                {isLoading ? (
                    <LoadingSpinner />
                ) : (
                    <>
                        <div className="flex flex-col items-center justify-between">
                            <div>
                                <img src={logoPng} alt="logo" width={150} />
                            </div>
                            <h4 className="mt-8 text-lg font-bold">
                                Stakeholders Register
                            </h4>
                            <p className="mt-5 text-muted-foreground">
                                You can search with name, institution
                            </p>

                            <div className="relative flex items-center my-5 text-[#20293A] w-full max-w-md">
                                <Input
                                    className="w-full py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 dark:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                    placeholder="Search Stakeholders"
                                    type="search"
                                />

                                <Search className="absolute right-2  " />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-5 bg-gray-100 p-5 rounded-lg shadow-inner md:grid-cols-3">
                            {data?.data.results.map((stakeholder) => {
                                const isChecked = stakeholders.some(
                                    (holder) => holder.id === stakeholder.id
                                );

                                return (
                                    <div
                                        key={stakeholder.id}
                                        className="flex flex-col p-5 bg-white border rounded-lg gap-4"
                                    >
                                        <div className="flex gap-2 items-center">
                                            <Checkbox
                                                checked={isChecked}
                                                onCheckedChange={(value) =>
                                                    handleCheckChange(
                                                        value,
                                                        stakeholder
                                                    )
                                                }
                                            />
                                            <h4 className="font-semibold text-yellow-600">
                                                {stakeholder.name}
                                            </h4>
                                        </div>

                                        <div className="text-sm">
                                            <h4 className="font-semibold">
                                                Institution/Organization:
                                            </h4>
                                            <p>{stakeholder.organization}</p>
                                        </div>

                                        <div className="grid text-xs grid-cols-2 gap-3">
                                            <div>
                                                <h4 className="font-semibold">
                                                    Project Role:
                                                </h4>
                                                <p>
                                                    {stakeholder.project_role}
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold">
                                                    Designation:
                                                </h4>
                                                <p>{stakeholder.designation}</p>
                                            </div>
                                        </div>

                                        <div className="grid text-sm grid-cols-2 gap-3">
                                            <div>
                                                <h4 className="font-semibold">
                                                    Phone Number:
                                                </h4>
                                                <p>
                                                    {stakeholder.phone_number}
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold">
                                                    E-mail:
                                                </h4>
                                                <p>{stakeholder.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </ScrollArea>

            <div className="flex justify-end w-full my-5">
                <div className="flex items-center gap-x-4">
                    <p className="text-sm font-medium text-primary">
                        {stakeholders.length} Criteria Selected
                    </p>
                    <Button onClick={onSubmit}>Save & Continue</Button>
                </div>
            </div>
        </div>
    );
};

export default StakeholderModal;
