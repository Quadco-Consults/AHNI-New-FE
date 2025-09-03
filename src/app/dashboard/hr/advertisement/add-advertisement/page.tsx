"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const AddAdvertisement = dynamic(
  () => import("@/features/hr/components/advertisement/AddAdvertisement"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function AddAdvertisementPage() {
  return <AddAdvertisement />;
}