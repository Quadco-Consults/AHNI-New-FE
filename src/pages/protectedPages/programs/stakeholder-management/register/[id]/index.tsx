import { skipToken } from "@reduxjs/toolkit/query/react";
import LongArrowLeft from "components/icons/LongArrowLeft";
import BreadcrumbCard, { TBreadcrumbList } from "components/shared/Breadcrumb";
import Card from "components/shared/Card";
import { LoadingSpinner } from "components/shared/Loading";
import { useNavigate, useParams } from "react-router-dom";
import { useGetSingleStakeholderRegisterQuery } from "services/programsApi/stakeholder";

const breadcrumbs: TBreadcrumbList[] = [
    { name: "Programs", icon: true },
    { name: "Stakeholder Management", icon: true },
    { name: "Stakeholder Register", icon: true },
    { name: "Details", icon: false },
];

const RegisterDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const { data, isLoading } = useGetSingleStakeholderRegisterQuery(
        id ?? skipToken
    );

    const goBack = () => {
        navigate(-1);
    };

    return (
        <div className="space-y-6 min-h-screen">
            <BreadcrumbCard list={breadcrumbs} />

            <button
                onClick={goBack}
                className="w-[3rem] aspect-square rounded-full drop-shadow-md bg-white flex items-center justify-center"
            >
                <LongArrowLeft />
            </button>

            <Card className="space-y-6">
                {isLoading ? (
                    <LoadingSpinner />
                ) : (
                    <>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <h4 className="font-semibold">
                                    Stakeholder Name
                                </h4>
                                <p className="font-extralight">
                                    {data?.data.name}
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold">
                                    Institution/Organization:
                                </h4>
                                <p>{data?.data.organization}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <h4 className="font-semibold">
                                    Physical Office Address:
                                </h4>
                                <p>{data?.data.office_address}</p>
                            </div>

                            <div>
                                <h4 className="font-semibold">State:</h4>
                                <p>{data?.data.state}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <h4 className="font-semibold">Designation:</h4>
                                <p>{data?.data.designation}</p>
                            </div>

                            <div>
                                <h4 className="font-semibold">Phone Number:</h4>
                                <p>{data?.data.phone_number}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <h4 className="font-semibold">E-mail:</h4>
                                <p>{data?.data.email}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold">Project Role:</h4>
                                <p>{data?.data.project_role}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <h4 className="font-semibold">Importance:</h4>
                                <p>{data?.data.importance}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold">Influence:</h4>
                                <p>{data?.data.influence}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <h4 className="font-semibold">Score:</h4>
                                <p>{data?.data.score}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold">
                                    Major Concerns:
                                </h4>
                                <p>{data?.data.major_concerns}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <h4 className="font-semibold">
                                    Relationship Owner:
                                </h4>
                                <p>{data?.data.relationship_owner}</p>
                            </div>
                        </div>
                    </>
                )}
            </Card>
        </div>
    );
};

export default RegisterDetails;
