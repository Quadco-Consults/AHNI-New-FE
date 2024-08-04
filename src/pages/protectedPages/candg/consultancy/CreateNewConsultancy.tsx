import BackNavigation from "atoms/BackNavigation";
import ConsultancyStep from "./ConsultancyStep";

const CreateNewConsultancy = () => {
  return (
    <main className="w-full flex flex-col items-center justify-center gap-y-[1rem]">
      <div className="w-full">
        <BackNavigation />
      </div>
      <ConsultancyStep />
    </main>
  );
};

export default CreateNewConsultancy;
