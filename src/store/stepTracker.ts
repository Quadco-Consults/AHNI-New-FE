// stepsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HrRoutes } from "constants/RouterConstants";

interface Step {
  label: string;
  description: string;
  isCompleted: boolean;
  path: string;
}

interface StepsState {
  steps: Step[];
}

const initialState: StepsState = {
  steps: [
    {
      label: "Employee Information",
      description: "Fill the employee information form",
      isCompleted: false,
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
  ],
};

const stepsSlice = createSlice({
  name: "steps",
  initialState,
  reducers: {
    // updateStepCompletion(state, action: PayloadAction<{ path: string }>) {
    //   const step = state.steps.find((step) => {
    //     console.log("ddd>>>>>", { step, action });

    //     return step.path === action.payload.path;
    //   });

    //   if (step) {
    //     step.isCompleted = true;
    //   }
    // },
    updateStepCompletion(state, action: PayloadAction<{ path: string }>) {
      console.log("Initial Steps:", JSON.parse(JSON.stringify(state.steps)));
      console.log("Action Payload:", action.payload);

      const step = state.steps.find((step) => {
        console.log(
          "Checking step:",
          step.path,
          "against:",
          action.payload.path
        );
        return step.path === action.payload.path;
      });

      if (step) {
        console.log("Step Found:", JSON.parse(JSON.stringify(step)));
        step.isCompleted = true;
        console.log("Updated Step:", JSON.parse(JSON.stringify(step)));
      } else {
        console.log("No step found for path:", action.payload.path);
      }
    },
  },
});

export const { updateStepCompletion } = stepsSlice.actions;
export default stepsSlice.reducer;
