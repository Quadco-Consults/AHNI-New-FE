import { useState } from "react";
import { Button } from "components/ui/button";
import { CG_ROUTES, ProgramRoutes } from "constants/RouterConstants";
import { Plus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import ConsultancyCard from "./ConsultantCard";
import { useGetAllConsultantManagementsQuery } from "services/c&g/contract-management/consultancy-management/consultant-management";
import { LoadingSpinner } from "components/shared/Loading";
import Pagination from "components/shared/Pagination";
import UserAdvertType from "hooks/useJobAdvertType";

export default function Consultancy() {
    const [page, setPage] = useState(1);

    const advertType = UserAdvertType();

    const { data, isFetching } = useGetAllConsultantManagementsQuery({
        page,
        size: 10,
        type: advertType.toUpperCase(),
    });

    const path =
        advertType === "adhoc"
            ? ProgramRoutes.CREATE_ADHOC_DETAILS
            : advertType === "facilitator"
            ? CG_ROUTES.CREATE_FACILITATOR_ADVERT_DETAILS
            : CG_ROUTES.CREATE_CONSULTANCY_DETAILS;

    const btnLabel =
        advertType === "adhoc"
            ? "Adhoc"
            : advertType === "consultant"
            ? "Consultant"
            : "Facilitator";

    return (
        <section className="space-y-5">
            <div className="flex justify-end">
                <Link to={path}>
                    <Button>
                        <Plus size={29} /> New {btnLabel}
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
