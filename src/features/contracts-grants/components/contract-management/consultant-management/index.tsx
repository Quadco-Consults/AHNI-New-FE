"use client";

import { useState } from "react";
import { Button } from "components/ui/button";
import { CG_ROUTES, ProgramRoutes } from "constants/RouterConstants";
import { Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ConsultancyCard from "./ConsultantCard";
import { useGetAllConsultantManagements } from "@/features/contracts-grants/controllers/consultantManagementController";
import { LoadingSpinner } from "components/Loading";
import Pagination from "components/Pagination";
import UserAdvertType from "hooks/useJobAdvertType";

export default function Consultancy() {
  const [page, setPage] = useState(1);

  const advertType = UserAdvertType();

  const { data, isFetching } = useGetAllConsultantManagements({
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
    <section className='space-y-5'>
      <div className='flex justify-end'>
        <Link href={path}>
          <Button>
            <Plus size={29} /> New {btnLabel}
          </Button>
        </Link>
      </div>

      {isFetching ? (
        <LoadingSpinner />
      ) : (
        data && (
          <div className='w-full flex flex-wrap justify-between items-start gap-y-[1rem]'>
            {data.data.results.map((consultant) => (
              <ConsultancyCard key={consultant.id} {...consultant} />
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
