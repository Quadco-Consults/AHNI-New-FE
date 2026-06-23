import { StepperHeading } from "@/components/StepperHeading";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { RouteEnum } from "@/constants/RouterConstants";
import { Icon } from "@iconify/react";
import { FC, ReactNode } from "react";

type IPageProps = {
  children: ReactNode;
};

const vendorSteps = [
  { step: 1, stepName: "Vendor Registration", route: "vendor-registration" },
  { step: 2, stepName: "Branch Offices", route: "the-company" },
  { step: 3, stepName: "Reference", route: "reference" },
  { step: 4, stepName: "Upload", route: "upload" },
  { step: 5, stepName: "Attestation", route: "attestation" },
];

const VendorRegistationLayout: FC<IPageProps> = ({ children }) => {
  const breadcrumbs = (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbPage>Procurement</BreadcrumbPage>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Icon icon='iconoir:slash' />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink href={RouteEnum.VENDOR_MANAGEMENT}>
            Prequalification
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Icon icon='iconoir:slash' />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>Create Vendor</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );

  return (
    <div>
      <StepperHeading
        steps={vendorSteps}
        storageKey="vendorRegistrationCompletedSteps"
        breadcrumbs={breadcrumbs}
        showGoBack={true}
        variant="vertical"
        width="full"
        showActiveHighlight={true}
      />
      <div className="px-4 py-8 bg-white">{children}</div>
    </div>
  );
};

export default VendorRegistationLayout;
