import { Button } from "components/ui/button";
import BreadcrumbCard from "components/shared/Breadcrumb";
import ProcurementTrackerAPI from "services/procurementApi/procurement-tracker";
import TabState from "components/ui/TabState";
import { useMemo, useState } from "react";
import { FileDown } from "lucide-react";
import { Loading } from "components/shared/Loading";
import SummaryCard from "./SummaryCard";
import DeliveryStageCard from "./DeliveryStageCard";
import ProcurementProcessCard from "./ProcurementProcessCard";
import { useLocation } from "react-router-dom";

function ProcurementTracker() {
    const { pathname } = useLocation();

    const isAdminTracker = pathname.includes("admin-tracker");

    const breadcrumbs = useMemo(
        () =>
            isAdminTracker
                ? [
                      { name: "Admin", icon: true },
                      { name: "Admin Tracker", icon: false },
                  ]
                : [
                      { name: "Procurement", icon: true },
                      { name: "Procurement Tracker", icon: false },
                  ],
        [isAdminTracker]
    );

    const { isLoading } = ProcurementTrackerAPI.useGetProcurementTrackersQuery(
        {}
    );

    const tabDetails = [
        {
            id: 1,
            state: "summary",
            name: "Summary",

            tabComponent: <SummaryCard />,
        },
        {
            id: 2,
            state: "procurement_process_stage",
            name: "Procurement Process Stage",
            tabComponent: <ProcurementProcessCard />,
        },

        {
            id: 1,
            state: "delivery_stage_and_vendor_performance_mangement",
            name: "Delivery Stage and Vendor Performance Mangement",
            tabComponent: <DeliveryStageCard />,
        },
    ];
    const [tabState, setTabState] = useState<string | number>(
        tabDetails[0].state
    );

    return (
        <main className="min-h-screen space-y-8">
            <BreadcrumbCard list={breadcrumbs} />
            <section className="w-full flex items-center justify-between">
                <div className="w-auto flex gap-x-[1.25rem] items-center justify-start">
                    <TabState
                        tabArray={tabDetails}
                        setState={setTabState}
                        tabState={tabState}
                    />
                </div>
                <div className="flex items-center gap-x-3">
                    <Button variant="default">
                        <span>
                            <FileDown size={18} />
                        </span>
                        Download xlsx
                    </Button>
                </div>
            </section>
            {isLoading ? (
                <Loading />
            ) : (
                <section className="w-full">
                    {tabDetails.map((item, index) => {
                        return (
                            tabState === item.state && (
                                <div key={index}>{item.tabComponent}</div>
                            )
                        );
                    })}
                </section>
            )}
        </main>
    );
}

export default ProcurementTracker;
