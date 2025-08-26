"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const CreateOnboardingProcess = dynamic(
  () =>
    import(
      "@/features/hr/components/onboarding/add-employee/EmployeeRegistrationLayout"
    ),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function CreateOnboardingProcessPage() {
  return <CreateOnboardingProcess />;
}
