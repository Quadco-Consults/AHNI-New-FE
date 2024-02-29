import Footer from "components/shared/Footer";
import Header from "components/shared/Header";
import Sidebar from "components/shared/Sidebar";
import Suspense from "components/shared/Suspense";
import { RouteEnum } from "constants/RouterConstants";
import React, { lazy, useMemo } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import { configureRoutes } from "utils/RouterUtils";

const ProtectedPage = () => {
  const routes = useRoutes(useMemo(() => getRoutes(), []));
  return (
    <>
      <div className="flex">
        <div className="hidden sticky w-[19%] md:block">
          <Sidebar />
        </div>
        <div className="w-full md:w-[81%]">
          <Header />
          <Suspense>
            <main className="p-10">{routes}</main>
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
      element: lazy(() => import("pages/protectedPages/dashboard/Dasboard")),
    },
    {
      path: RouteEnum.OVERVIEW,
      element: lazy(() =>
        import("pages/protectedPages/precurement-management/Overview")
      ),
    },
    {
      path: RouteEnum.COMPETITIVE_ANALYSIS,
      element: lazy(() =>
        import(
          "pages/protectedPages/precurement-management/Competitive-analysis"
        )
      ),
    },
    {
      path: RouteEnum.EOI_VENDOR,
      element: lazy(() =>
        import("pages/protectedPages/precurement-management/EOI-vendor")
      ),
    },
    {
      path: RouteEnum.EOI,
      element: lazy(() =>
        import("pages/protectedPages/precurement-management/EOI")
      ),
    },
    {
      path: RouteEnum.PAYMENT_REQUEST,
      element: lazy(() =>
        import("pages/protectedPages/precurement-management/Payment-request")
      ),
    },
    {
      path: RouteEnum.PRECUREMENT_PLAN,
      element: lazy(() =>
        import("pages/protectedPages/precurement-management/Precurement-plan")
      ),
    },
    {
      path: RouteEnum.PRECUREMENT_PLAN_TRACKER,
      element: lazy(() =>
        import(
          "pages/protectedPages/precurement-management/Precurement-plan-tracker"
        )
      ),
    },
    {
      path: RouteEnum.PURCHASE_REQUEST,
      element: lazy(() =>
        import("pages/protectedPages/precurement-management/Purchase-request")
      ),
    },
    {
      path: RouteEnum.REPORT,
      element: lazy(() =>
        import("pages/protectedPages/precurement-management/Report")
      ),
    },
    {
      path: RouteEnum.RFQ_VENDOR,
      element: lazy(() =>
        import("pages/protectedPages/precurement-management/RFQ-vendor")
      ),
    },
    {
      path: RouteEnum.RFQ,
      element: lazy(() =>
        import("pages/protectedPages/precurement-management/RFQ")
      ),
    },
    {
      path: RouteEnum.VENDOR_MANAGEMENT,
      element: lazy(() =>
        import("pages/protectedPages/precurement-management/Vendor-management")
      ),
    },
  ]);
};
