import Footer from "components/shared/Footer";
import Header from "components/shared/Header";
import Sidebar from "components/shared/Sidebar";
import Suspense from "components/shared/Suspense";

import { cn } from "lib/utils";
import { useMemo, useState } from "react";
import { useRoutes } from "react-router-dom";
import getRoutes from "../../routes/index";

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
