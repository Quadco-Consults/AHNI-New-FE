"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const HolidaysList = dynamic(
  () => import("@/features/hr/components/leave-management/HolidaysList"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function HolidaysPage() {
  return <HolidaysList />;
}
