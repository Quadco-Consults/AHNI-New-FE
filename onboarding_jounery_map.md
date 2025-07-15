# Onboarding Journey Map

This document outlines the high-level function and data flow for onboarding an applicant in the project.

---

## ASCII Diagram: Onboarding Flow

```
+---------------------+
|  Onboarding Page    |  (src/pages/protectedPages/hr/onboarding/start-onboarding/Onboarding.tsx)
+---------------------+
           |
           v
+---------------------+
|   useSelector Hook  |  (Reads onboarding steps from Redux store)
+---------------------+
           |
           v
+---------------------+
|   Redux Store       |  (steps.steps state)
+---------------------+
           ^
           |
+---------------------+
|  Thunk/Saga/Effect  |  (e.g., fetchOnboardingSteps thunk)
+---------------------+
           |
           v
+---------------------+
|  Service Function   |  (src/services/onboardingService.ts)
|  getOnboardingSteps |
+---------------------+
           |
           v
+---------------------+
|   Backend API       |  (e.g., /api/onboarding/steps)
+---------------------+
```

---

## Function Relationships

| Function/Component      | Input          | Output               | Calls/Uses       |
| ----------------------- | -------------- | -------------------- | ---------------- |
| Onboarding (component)  | id?: string    | JSX UI               | useSelector      |
| useSelector (hook)      | Redux state    | steps array          | Redux store      |
| Redux thunk/saga/effect | staff id, etc. | dispatches steps     | service function |
| Service function        | staff id, etc. | API response (steps) | backend API      |

---

## Notes

- API calls are centralized in src/services/onboardingService.ts.
- Data is fetched via Redux logic (thunks/sagas) and stored in the Redux store.
- UI components read from the store and display onboarding steps.
- Reusable components (e.g., Button, Input) are used for form steps.
- Error handling and additional logic may be abstracted in hooks or utils.

---
