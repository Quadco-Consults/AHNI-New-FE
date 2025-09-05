import { Button } from "components/ui/button";
import { AdminRoutes } from "constants/RouterConstants";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import VehicleFuelRequest from "./_components/VehicleFuelRequest";
import VendorFuelRequest from "./_components/VendorFuelRequest";

export default function FuelConsumptionHomePage() {
  return (
    <Tabs defaultValue='vehicle'>
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
