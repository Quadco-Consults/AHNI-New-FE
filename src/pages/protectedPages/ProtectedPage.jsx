import Footer from "components/shared/Footer";
import Header from "components/shared/Header";
import Sidebar from "components/shared/Sidebar";
import Suspense from "components/shared/Suspense";
import { RouteEnum } from "constants/RouterConstants";
import { cn } from "lib/utils";
import { lazy, useMemo, useState } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import { configureRoutes } from "utils/RouterUtils";

const ProtectedPage = () => {
  const routes = useRoutes(useMemo(() => getRoutes(), []));
  const [sidebarWidth, setSidebarWidth] = useState(false);
  return (
    <>
      <div className="flex">
        <div
          className={cn(
            "hidden md:block",
            sidebarWidth === false ? "w-[19%]" : "w-[5%]"
          )}
        >
          <Sidebar
            setSidebarWidth={setSidebarWidth}
            sidebarWidth={sidebarWidth}
          />
        </div>

        <div
          className={cn(
            "w-full",
            sidebarWidth === false ? "md:w-[81%]" : "md:w-[95%]"
          )}
        >
          <Header
            setSidebarWidth={setSidebarWidth}
            sidebarWidth={sidebarWidth}
          />
          <Suspense>
            <main className="p-5 mt-20">{routes}</main>
          </Suspense>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default ProtectedPage;

const getRoutes = function getRoutes() {
  return configureRoutes([
    {
      path: "*",
      element: <Navigate to={RouteEnum.DASHBOARD} />,
    },
    {
      path: RouteEnum.DASHBOARD,
      element: lazy(() => import("pages/protectedPages/dashboard/Dashboard")),
    },
    {
      path: RouteEnum.OVERVIEW,
      element: lazy(() =>
        import("pages/protectedPages/procurement-management/Overview")
      ),
    },
    {
      path: RouteEnum.COMPETITIVE_ANALYSIS,
      element: lazy(() =>
        import(
          "pages/protectedPages/procurement-management/Competitive-analysis"
        )
      ),
    },
    {
      path: RouteEnum.EOI_VENDOR,
      element: lazy(() =>
        import("pages/protectedPages/procurement-management/EOI-vendor")
      ),
    },
    {
      path: RouteEnum.EOI,
      element: lazy(() =>
        import("pages/protectedPages/procurement-management/EOI")
      ),
    },
    {
      path: RouteEnum.PAYMENT_REQUEST,
      element: lazy(() =>
        import("pages/protectedPages/procurement-management/Payment-request")
      ),
    },
    {
      path: RouteEnum.PROCUREMENT_PLAN,
      element: lazy(() =>
        import("pages/protectedPages/procurement-management/Procurement-plan")
      ),
    },
    {
      path: RouteEnum.PROCUREMENT_PLAN_TRACKER,
      element: lazy(() =>
        import(
          "pages/protectedPages/procurement-management/Procurement-plan-tracker"
        )
      ),
    },
    {
      path: RouteEnum.PURCHASE_REQUEST,
      element: lazy(() =>
        import("pages/protectedPages/procurement-management/Purchase-request")
      ),
    },
    {
      path: RouteEnum.REPORT,
      element: lazy(() =>
        import("pages/protectedPages/procurement-management/Report")
      ),
    },
    {
      path: RouteEnum.RFQ_VENDOR,
      element: lazy(() =>
        import("pages/protectedPages/procurement-management/RFQ-vendor")
      ),
    },
    {
      path: RouteEnum.RFQ,
      element: lazy(() =>
        import("pages/protectedPages/procurement-management/RFQ")
      ),
    },
    {
      path: RouteEnum.VENDOR_MANAGEMENT,
      element: lazy(() =>
        import(
          "pages/protectedPages/procurement-management/vendor-management/Prequalification"
        )
      ),
    },
  ]);
};
