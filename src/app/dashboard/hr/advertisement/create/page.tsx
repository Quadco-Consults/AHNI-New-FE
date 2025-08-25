"use client";

import dynamic from "next/dynamic";

const AddAdvertisement = dynamic(() => import("@/features/hr/components/advertisement/AddAdvertisement"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function AdvertisementCreatePage() {
  return <AddAdvertisement />;
}