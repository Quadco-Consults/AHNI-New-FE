import { Button } from "components/ui/button";
import { CG_ROUTES } from "constants/RouterConstants";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import ConsultancyCard from "./ConsultantCard";
import { useGetAllConsultantManagementsQuery } from "services/c&g/contract-management/consultant-management";
import { useState } from "react";
import { LoadingSpinner } from "components/shared/Loading";
import Pagination from "components/shared/Pagination";

export default function FacilitatorManagement() {
    const [page, setPage] = useState(1);

    const { data, isFetching } = useGetAllConsultantManagementsQuery({
        page,
        size: 10,
    });

    return (
        <section className="space-y-5">
            <div className="flex justify-end">
                <Link to={CG_ROUTES.CREATE_FACILITATOR_DETAILS}>
                    <Button>
                        <Plus size={29} /> New Facilitator
                    </Button>
                </Link>
            </div>
            {isFetching ? (
                <LoadingSpinner />
            ) : (
                data && (
                    <div className="w-full flex flex-wrap justify-between items-start gap-y-[1rem]">
                        {data.data.results.map((consultant) => (
                            <ConsultancyCard
                                key={consultant.id}
                                {...consultant}
                            />
                        ))}
                    </div>
                )
            )}

            {data && (
                <Pagination
                    total={data.data.pagination.count}
                    itemsPerPage={data.data.pagination.page_size}
                    onChange={(page) => setPage(page)}
                />
            )}
        </section>
    );
}
