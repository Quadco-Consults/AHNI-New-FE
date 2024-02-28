import { useCallback, useState } from "react";

export type Stepper = {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  nextStep: () => void;
  prevStep: () => void;
};

function useStep(initialStep = 0): Stepper {
  const [step, setStep] = useState(initialStep);

  const nextStep = useCallback(() => {
    setStep((p) => p + 1);
  }, []);

  const prevStep = useCallback(() => {
    setStep((p) => p - 1);
  }, []);

  return { step, setStep, nextStep, prevStep };
}

export default useStep;
