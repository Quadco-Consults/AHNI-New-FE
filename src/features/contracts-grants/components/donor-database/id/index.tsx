import { skipToken } from "@reduxjs/toolkit/query";
import BackNavigation from "components/atoms/BackNavigation";
import Card from "components/Card";
import DescriptionCard from "components/DescriptionCard";
import { LoadingSpinner } from "components/Loading";
import { projectColumns } from "components/Table/columns/project/project-columns";
import DataTable from "components/Table/DataTable";
import { Separator } from "components/ui/separator";
import { useParams } from "next/navigation";
import { useGetSingleFundingSource } from "@/features/modules/controllers/project/funding-source";

export default function DonorDatabaseDetails() {
    const { id } = useParams();

    const { data, isLoading } = useGetSingleFundingSource(
        id ? id : skipToken
    );

    return (
        <section className="space-y-5">
            <BackNavigation extraText="Donor Information" />

            {isLoading ? (
                <LoadingSpinner />
            ) : (
                data && (
                    <Card className="space-y-10">
                        <div className="grid grid-cols-3 gap-10">
                            <DescriptionCard
                                label="Donor Name"
                                description={data?.data.name}
                            />

                            <DescriptionCard
                                label="Donor Email"
                                description={"N/A"}
                            />

                            <DescriptionCard
                                label="Donor Address"
                                description={"N/A"}
                            />

                            <DescriptionCard
                                label="Contact Person Name"
                                description={"N/A"}
                            />

                            <DescriptionCard
                                label="Contact Person Email"
                                description={"N/A"}
                            />

                            <DescriptionCard
                                label="Contact Person Phone Number"
                                description={"N/A"}
                            />
                        </div>

                        <Separator />

                        <section className="space-y-5">
                            <h2 className="font-bold text-lg">
                                Projects by {data?.data.name}
                            </h2>

                            <DataTable
                                columns={projectColumns}
                                data={[]}
                                isLoading={false}
                            />
                        </section>
                    </Card>
                )
            )}
        </section>
    );
}
