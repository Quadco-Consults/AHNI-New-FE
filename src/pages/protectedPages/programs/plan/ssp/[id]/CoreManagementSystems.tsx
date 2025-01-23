import Card from "components/shared/Card";
import { Button } from "components/ui/button";
import { RouteEnum } from "constants/RouterConstants";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import SupportiveSupervisionAPI from "services/programsApi/suportive-supervision";
import { Criteria } from "definations/program-types/supportive-supervision";
import { Input } from "components/ui/input";
import { Upload as UploadFile } from "lucide-react";
import FormButton from "atoms/FormButton";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { supportiveSupervisionActions } from "store/formData/ssp-values";
import { Loading } from "components/shared/Loading";
import { toast } from "sonner";
import { RootState } from "store/index";
import { useGetSingleSupervisionPlanQuery } from "services/program/plan/supervision-plan";
import { skipToken } from "@reduxjs/toolkit/query/react";
import BreadcrumbCard from "components/shared/Breadcrumb";
import BackNavigation from "atoms/BackNavigation";
import {
    TSupervisionPlanObjective,
    TSupervisionPlanSingleData,
} from "definations/program/plan/supervision-plan";
import { entries } from "lodash";

type FormData = {
    [key: string]: string;
};

const breadcrumbs = [
    { name: "Programs", icon: true },
    { name: "Plans", icon: true },
    { name: "Supportive Supervision Plan", icon: true },
    { name: "Details", icon: true },
    { name: "Evaluation", icon: false },
];

type GroupedData = {
    [categoryName: string]: TSupervisionPlanObjective[];
};

const groupByCategoryName = (
    array: TSupervisionPlanObjective[]
): GroupedData => {
    return array?.reduce((acc, item) => {
        // @ts-ignore
        const categoryName = item.evaluation_category.name;

        if (!acc[categoryName]) {
            acc[categoryName] = [];
        }

        acc[categoryName].push(item);
        return acc;
    }, {} as GroupedData);
};

const CoreManagementSystems = () => {
    const { id } = useParams();

    const [page, setPage] = useState(1);

    const { data: supervisionPlan } = useGetSingleSupervisionPlanQuery(
        id ?? skipToken
    );

    const [groupedCriteria, setGroupedCriteria] = useState<GroupedData>();

    useEffect(() => {
        if (supervisionPlan) {
            setGroupedCriteria(
                groupByCategoryName(supervisionPlan?.data.objectives)
            );
        }
    }, [supervisionPlan]);

    // console.log(page);

    // console.log(groupedCriteria && groupedCriteria['Core Management Systems']);
    console.log(Object.entries(groupedCriteria || {}).slice());

    return (
        <div className="space-y-5">
            <BreadcrumbCard list={breadcrumbs} />

            <BackNavigation />

            <div className="flex justify-end">
                <div className="py-2 px-4 rounded-lg border text-green-500 border-green-500 bg-green-50">
                    Page {page}/{Object.keys(groupedCriteria || {}).length + 1}
                </div>
            </div>

            <Card>
                <form className="space-y-3">
                    <h4 className="font-semibold">
                        Integrated Facility Visit Checklist for Comprehensive
                        Sites
                    </h4>
                    <hr />

                    {groupedCriteria &&
                        Object.entries(groupedCriteria)
                            .slice(page - 1, page)
                            .map(([category, items]) => {
                                return (
                                    <Card className="space-y-3">
                                        <h4 className="font-semibold text-red-600">
                                            {category}
                                        </h4>
                                        <h6 className="font-light text-gray-500">
                                            Verify the following
                                        </h6>

                                        {items.map((criteria) => (
                                            <Card className="space-y-3 border-yellow-600">
                                                <h4 className="text-semibold text-yellow-600">
                                                {/* @ts-ignore */}
                                                    {criteria.name}
                                                </h4>

                                                <div className="flex justify-between pb-3 gap-5">
                                                    <div className="">
                                                        <h2>
                                                            {/* @ts-ignore */}
                                                            {criteria.description}
                                                        </h2>
                                                    </div>
                                                    <div className="flex gap-5 justify-between">
                                                        <div className="flex items-stretch space-x-2">
                                                            <input
                                                                type="radio"
                                                                className="border-green-500"
                                                                name={
                                                                    // @ts-ignore
                                                                    criteria.name
                                                                }
                                                                value="yes"
                                                            />
                                                            <label
                                                                htmlFor="yes"
                                                                className="text-green-500"
                                                            >
                                                                Yes
                                                            </label>
                                                        </div>
                                                        <div className="flex items-stretch space-x-2">
                                                            <input
                                                                type="radio"
                                                                value="no"
                                                                name={
                                                                    // @ts-ignore
                                                                    criteria.name
                                                                }
                                                                className="border-primary"
                                                            />
                                                            <label
                                                                htmlFor="no"
                                                                className="text-primary"
                                                            >
                                                                No
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>

                                                <input
                                                    className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-gray-100 dark:bg-background"
                                                    // id={criteria.response_id}
                                                    type="text"
                                                    placeholder="Comment..."
                                                    // name={criteria.response_id}
                                                    // value={formData[criteria.response_id] || ""}
                                                    // onChange={handleInputChange}
                                                    // required
                                                />
                                                {/* <div className="flex gap-2">
                                        <div className="w-full relative gap-x-3 h-[40px] rounded-[16.2px] border flex justify-center items-center">
                                            <UploadFile size={20} />
                                            <div>
                                                <Input
                                                    type="file"
                                                    // onChange={handleFileChange}
                                                    className="bg-inherit border-none cursor-pointer "
                                                />
                                            </div>
                                        </div>
                                        <FormButton
                                            // loading={loading}
                                            // disabled={loading}
                                            type="button"
                                            // onClick={() =>
                                            //     handleUploads(criteria?.response_id)
                                            // }
                                        >
                                            Upload
                                        </FormButton>
                                    </div> */}

                                                <hr className="" />
                                            </Card>
                                        ))}
                                    </Card>
                                );
                            })}
                </form>
            </Card>

            <div className="flex justify-between">
                <Button
                    variant="outline"
                    className="flex gap-4 items-center text-primary border-primary hover:bg-red-50 hover:text-red-500"
                    onClick={() => setPage(page - 1)}
                >
                    <ArrowLeft size={15} /> Back
                </Button>

                {page === Object.keys(groupedCriteria || {}).length + 1 ? (
                    <Button className="px-8">Finish</Button>
                ) : (
                    <Button className="px-8" onClick={() => setPage(page + 1)}>
                        Next
                    </Button>
                )}
            </div>
        </div>
    );
};

export default CoreManagementSystems;
