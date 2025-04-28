import { Button } from "components/ui/button";
import { CG_ROUTES, ProgramRoutes } from "constants/RouterConstants";
import { Plus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import ConsultancyCard from "./ConsultantCard";
import { useGetAllConsultantManagementsQuery } from "services/c&g/contract-management/consultancy-management/consultant-management";
import { useState } from "react";
import { LoadingSpinner } from "components/shared/Loading";
import Pagination from "components/shared/Pagination";

export default function Consultancy() {
    const [page, setPage] = useState(1);

    const { pathname } = useLocation();

    const type = pathname.includes("adhoc-management") ? "ADHOC" : "CONSULTANT";

    const { data, isFetching } = useGetAllConsultantManagementsQuery({
        page,
        size: 10,
        type,
    });

    const path =
        type === "ADHOC"
            ? ProgramRoutes.CREATE_ADHOC_DETAILS
            : CG_ROUTES.CREATE_CONSULTANCY_DETAILS;

    return (
        <section className="space-y-5">
            <div className="flex justify-end">
                <Link to={path}>
                    <Button>
                        <Plus size={29} /> New Consultant
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
