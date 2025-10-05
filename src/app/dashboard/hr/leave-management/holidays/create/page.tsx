"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const HolidayForm = dynamic(
  () => import("@/features/hr/components/leave-management/HolidayForm"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function CreateHolidayPage() {
  return <HolidayForm />;
}
