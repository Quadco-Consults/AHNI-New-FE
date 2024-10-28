import CheckIcon from "assets/svgs/CheckIcon";
import { HrRoutes } from "constants/RouterConstants";
import { Link } from "react-router-dom";

const Onboarding = () => {
  return (
    <div className="space-y-10 max-w-2xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-medium">New Staff!</h2>
        <p className="text-small">
          Complete the following steps to fully onboard this staff.
        </p>
      </div>
      <div className="space-y-6 divide-y">
        {STEPS.map(({ label, description, isCompleted, path }, index) => (
          <Link
            to={path}
            key={index}
            className="flex items-center pt-5 gap-x-4"
          >
            {isCompleted ? (
              <CheckIcon />
            ) : (
              <div className="size-10 rounded-full bg-gray-100 grid place-content-center">
                <p>{index + 1}</p>
              </div>
            )}
            <div>
              <h4 className="text-lg font-medium">{label}</h4>
              <p className="text-small">{description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Onboarding;

const STEPS = [
  {
    label: "Employee Information",
    description: "Fill the employee information form",
    isCompleted: true,
    path: HrRoutes.ONBOARDING_ADD_EMPLOYEE_INFO,
  },
  {
    label: "Additional Information",
    description: "Fill this form to provide additional information",
    isCompleted: false,
    path: HrRoutes.ONBOARDING_ADD_EMPLOYEE_ADD,
  },
  {
    label: "Beneficiary",
    description: "Fill the beneficiary designation form",
    isCompleted: false,
    path: HrRoutes.ONBOARDING_ADD_EMPLOYEE_BENEFICIARY,
  },
  {
    label: "ID Card",
    description: "Generate and print ID card",
    isCompleted: false,
    path: HrRoutes.ONBOARDING_ADD_EMPLOYEE_ID_CARD,
  },
  {
    label: "AHNi Salary account Details",
    description: "Provide your salary account details",
    isCompleted: false,
    path: HrRoutes.ONBOARDING_ADD_EMPLOYEE_SALARY,
  },
  {
    label: "Pension Reform",
    description: "Fill the pension reform scheme form",
    isCompleted: false,
    path: HrRoutes.ONBOARDING_ADD_EMPLOYEE_PENSION,
  },
];
