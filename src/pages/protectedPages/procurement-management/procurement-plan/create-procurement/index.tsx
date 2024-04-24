import React, { useState } from "react";
import StepHeader from "./StepHeader";
import ProcurementPlansForm from "./forms/ProcurementPlansForm";
import ProcurementMilestonesForm from "./forms/ProcurementMilestonesForm";
import SuccessModal from "./SuccessModal";

const CreateProcurement = () => {
  const [formData, setFormData] = useState<any>({});
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showModal, setShowModal] = useState<boolean>(false);

  // Function to handle form submission
  const handleSubmit = async () => {
    const endpoint = process.env.REACT_APP_SERVER_API + "/procurements/create";
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        console.log("Form submitted successfully.");
      } else {
        console.error("Failed to submit form.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handlePrev = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleNext = () => {
    if (currentStep === steps.length) {
      // handleSubmit();
      setShowModal(true);
    } else {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  const renderForm = (step: number) => {
    switch (step) {
      case 1:
        return <ProcurementPlansForm handleNext={handleNext} />;
      case 2:
        return (
          <>
            <ProcurementMilestonesForm
              handlePrev={handlePrev}
              handleNext={handleNext}
            />
          </>
        );
      default:
        return null;
    }
  };

  const steps = [
    { step: 1, stepName: "Procurement Plans" },
    { step: 2, stepName: "Procurement Milestones" },
  ];

  return (
    <section className="w-[95%] mx-auto min-h-screen relative">
      <StepHeader steps={steps} currentStep={currentStep} />
      <div>{renderForm(currentStep)}</div>
      {showModal && <SuccessModal isOpen={() => setShowModal(true)} onClose={() => setShowModal(false)} />}
    </section>
  );
};

export default CreateProcurement;
