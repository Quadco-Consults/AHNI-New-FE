import Card from "components/shared/Card";

const SubmittedDocsUpload = () => {
  return (
    <div className="w-full flex flex-col text-[#1A0000] justify-center items-center">
      <p className="text-[1.25rem] font-semibold w-full px-[.625rem] py-5 border-b border-[#DBDFE9] mb-5">Uploaded Documents</p>
      <div className="w-full">
        <Card className="flex flex-col gap-y-[1.25rem] pb-[10rem]">
          <div></div>
        </Card>
      </div>
    </div>
  );
};

export default SubmittedDocsUpload;
