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
    IObjective,
    TSupervisionPlanObjective,
} from "definations/program/plan/supervision-plan";
import Upload from "components/shared/Upload";
import { Separator } from "components/ui/separator";
import { Textarea } from "components/ui/textarea";
import { FormProvider, useForm } from "react-hook-form";
import FormTextArea from "atoms/FormTextArea";
import AddSquareIcon from "components/icons/AddSquareIcon";

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
    [categoryName: string]: IObjective[];
};

const groupByCategoryName = (array: IObjective[]): GroupedData => {
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

interface IReview {
    is_selected: boolean;
    comment: string;
    supportive_supervision_review: string;
    objective: string;
}

const uploadsCriteria = [
    "CQI/TA form completed with summary of visit? (Attach copy for retirement)",
    "Observe post clinic review meeting? (Attach summary of visit, picture gallery)",
    "Debrief with facility/adhoc staff.",
];

const CoreManagementSystems = () => {
    const form = useForm();

    const { id } = useParams();

    const [page, setPage] = useState(1);

    const { data: supervisionPlan } = useGetSingleSupervisionPlanQuery(
        id ?? skipToken
    );

    const [reviews, setReviews] = useState<IReview[]>([]);

    const [groupedCriteria, setGroupedCriteria] = useState<GroupedData>();

    useEffect(() => {
        if (supervisionPlan) {
            setGroupedCriteria(
                groupByCategoryName(supervisionPlan?.data.objectives)
            );
        }
    }, [supervisionPlan]);

    const handlePrev = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    const handleNext = () => {
        setPage(page + 1);
    };

    const handleCheckboxChange = (
        checkedValue: string,
        criteria: IObjective
    ) => {
        if (reviews.find((review) => review.objective === criteria.id)) {
            // update
            return;
        }

        const newReview = {
            is_selected: Boolean(checkedValue),
            comment: "",
            supportive_supervision_review: "",
            objective: criteria.id,
        };

        setReviews([...reviews, newReview]);
    };

    const handleSubmit = async () => {
        try {
            // create the review
            console.log("Review Submitted");
        } catch (error: any) {
            toast.error(error.data.message ?? "Something went wrong");
        }
    };

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
                <FormProvider {...form}>
                    <form className="space-y-3">
                        <h4 className="font-semibold">
                            Integrated Facility Visit Checklist for
                            Comprehensive Sites
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
                                                        {criteria.name}
                                                    </h4>

                                                    <div className="flex justify-between pb-3 gap-5">
                                                        <div>
                                                            <h2>
                                                                {
                                                                    criteria.description
                                                                }
                                                            </h2>
                                                        </div>
                                                        <div className="flex gap-5 justify-between">
                                                            <div className="flex items-stretch space-x-2">
                                                                <input
                                                                    type="radio"
                                                                    className="border-green-500"
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        handleCheckboxChange(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                            criteria
                                                                        );
                                                                    }}
                                                                    name={
                                                                        criteria.name
                                                                    }
                                                                    value="true"
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
                                                                    value="false"
                                                                    name={
                                                                        criteria.name
                                                                    }
                                                                    className="border-primary"
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        handleCheckboxChange(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                            criteria
                                                                        );
                                                                    }}
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
                                                        type="text"
                                                        placeholder="Comment..."
                                                    />

                                                    <hr className="" />
                                                </Card>
                                            ))}
                                        </Card>
                                    );
                                })}

                        {page === 4 &&
                            uploadsCriteria.map((criteria) => (
                                <Card className="space-y-3">
                                    <h4 className="text-semibold font-light">
                                        {criteria}
                                    </h4>

                                    <div className="flex justify-between pb-3 gap-5">
                                        <h3 className="font-bold">
                                            Upload Attachment
                                        </h3>

                                        <div className="flex gap-5 justify-between">
                                            <div className="flex items-stretch space-x-2">
                                                <input
                                                    type="radio"
                                                    className="border-green-500"
                                                    value="true"
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
                                                    value="false"
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

                                    <Upload onChange={() => {}}>
                                        <Button
                                            type="button"
                                            className="bg-[#FFF2F2] text-primary dark:text-gray-500"
                                        >
                                            <AddSquareIcon />
                                            Upload New Document
                                        </Button>
                                    </Upload>

                                    <hr className="" />
                                </Card>
                            ))}

                        {page === 4 && (
                            <>
                                <Separator className="my-12" />

                                <FormTextArea
                                    label="Remediation plan and follow up actions"
                                    name="remediation_plan"
                                />

                                <Separator className="my-12" />

                                <div className="flex justify-between pb-3 gap-5">
                                    <h4 className="text-semibold font-light">
                                        Agree on visit date
                                    </h4>

                                    <div className="flex gap-5 justify-between">
                                        <div className="flex items-stretch space-x-2">
                                            <input
                                                type="radio"
                                                className="border-green-500"
                                                value="true"
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
                                                value="false"
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
                            </>
                        )}
                    </form>
                </FormProvider>
            </Card>

            <div className="flex justify-between">
                <Button
                    variant="outline"
                    className="flex gap-4 items-center text-primary border-primary hover:bg-red-50 hover:text-red-500"
                    onClick={handlePrev}
                >
                    <ArrowLeft size={15} /> Back
                </Button>

                {page === Object.keys(groupedCriteria || {}).length + 1 ? (
                    <Button className="px-8" onClick={handleSubmit}>
                        Finish
                    </Button>
                ) : (
                    <Button className="px-8" onClick={handleNext}>
                        Next
                    </Button>
                )}
            </div>
        </div>
    );
};

export default CoreManagementSystems;
