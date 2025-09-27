"use client";

import { Button } from "components/ui/button";
import { AdminRoutes } from "constants/RouterConstants";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import VehicleFuelRequest from "./_components/VehicleFuelRequest";
import VendorFuelRequest from "./_components/VendorFuelRequest";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function FuelConsumptionHomePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Get the type from URL parameters, default to 'vehicle'
  const typeParam = searchParams?.get('type');
  const [activeTab, setActiveTab] = useState(typeParam === 'vendor' ? 'vendor' : 'vehicle');

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const newSearchParams = new URLSearchParams(searchParams?.toString() || '');
    if (value === 'vehicle') {
      newSearchParams.delete('type'); // Remove type param for default vehicle tab
    } else {
      newSearchParams.set('type', value);
    }

    const newUrl = newSearchParams.toString()
      ? `${pathname}?${newSearchParams.toString()}`
      : pathname;

    router.replace(newUrl, { scroll: false });
  };

  // Update tab when URL changes
  useEffect(() => {
    const newTypeParam = searchParams?.get('type');
    setActiveTab(newTypeParam === 'vendor' ? 'vendor' : 'vehicle');
  }, [searchParams]);

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <TabsList>
        <TabsTrigger value='vehicle'>By Vehicles</TabsTrigger>
        <TabsTrigger value='vendor'>By Vendors</TabsTrigger>
      </TabsList>

      <div className='flex justify-end'>
        <Link href={AdminRoutes.CREATE_FUEL_CONSUMPTION}>
          <Button size='lg'>
            <Plus size={20} />
            Request Fuel
          </Button>
        </Link>
      </div>

      <TabsContent value='vehicle'>
        <VehicleFuelRequest />
      </TabsContent>
      <TabsContent value='vendor'>
        <VendorFuelRequest />
      </TabsContent>
    </Tabs>
  );
}
