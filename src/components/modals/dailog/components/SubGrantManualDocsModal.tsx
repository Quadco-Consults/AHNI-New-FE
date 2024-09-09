import { UploadFileSvg } from "assets/svgs/CAndGSvgs";
import FormButton from "atoms/FormButton";
import { Form } from "components/ui/form";
import { DocumentPayload } from "pages/protectedPages/candg/subGrant/ManualSubmissionDocumentUpload";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const SubGrantManualDocsModal = ({ setModalOpen, setDocs }: { setModalOpen: React.Dispatch<React.SetStateAction<boolean>>; setDocs: React.Dispatch<React.SetStateAction<DocumentPayload[]>> }) => {
  const [modalDocs, setModalDocs] = useState<File>();
  const [modalDocsName, setModalDocsName] = useState<string>();
  const form = useForm<z.infer<any>>({
    // resolver: zodResolver(ConsunltancyApplicationDetails),
  });
  const onSubmit: SubmitHandler<z.infer<any>> = async (data) => {
    // console.log({ ...data, modalDocs, document_name: modalDocsName });
    if (modalDocs !== null && modalDocsName !== null) {
      setDocs((prev) => [...prev, { ...data, document_file: modalDocs, document_name: modalDocsName }]);
      setModalOpen(false);
    }
  };
  return (
    <div className="fixed w-full h-full flex flex-col justify-center items-center top-0 left-0 z-[99999] text-[#1A0000]">
      <div
        className="w-full flex flex-col h-full absolute top-0 left-0 bg-black/50"
        onClick={() => {
          setModalOpen(false);
        }}
      ></div>
      <div className="w-full md:w-[781px] rounded-3xl p-[2rem] flex flex-col items-center justify-center text-center gap-y-[1rem] z-[99] bg-white">
        <p className="text-2xl font-semibold">Upload New Document</p>{" "}
        <Form {...form}>
          <form action="" onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-y-[1rem]">
            <div className="flex flex-col gap-y-3 w-full items-start">
              <label htmlFor="" className="text-sm font-semibold">
                Select Document Name{" "}
              </label>
              <select
                className="border border-[#DBDFE9] py-3 px-4 bg-white w-full rounded-[6px]"
                required
                name="document_name"
                onChange={(e) => {
                  setModalDocsName(e.target.value);
                }}
              >
                <option value=""></option>
                {[
                  { label: "Sample DOc", value: "Sample-doc" },
                  { label: "Sample DOc1", value: "Sample-doc1" },
                  { label: "Sample DOc2", value: "Sample-doc2" },
                ].map((item, index) => {
                  return (
                    <option value={item.value} key={index}>
                      {item.label}
                    </option>
                  );
                })}
                .
              </select>
              {/* <FormSelect
                name="document_name"
                label="Select Document Name"
                options={[
                  { label: "Sample DOc", value: "Sample-doc" },
                  { label: "Sample DOc1", value: "Sample-doc1" },
                  { label: "Sample DOc2", value: "Sample-doc2" },
                ]}
                required
                className="w-full"
              /> */}
            </div>
            <div className="flex items-start w-full gap-x-[1rem]">
              <label className="cursor-pointer shrink-0 border flex items-center gap-x-[1rem] w-fit rounded-lg border-[#DBDFE9] py-[.875rem] px-[1.125rem]" htmlFor="file">
                <UploadFileSvg />
                Select file
              </label>
              <input
                type="file"
                // name="file"
                hidden
                id="file"
                accept=".pdf, .txt"
                onChange={(e) => {
                  if (e.target.files) {
                    setModalDocs(e.target.files?.[0]);
                  }
                }}
              />
              <p className="border flex items-center w-full gap-x-[1rem] rounded-lg border-[#DBDFE9] px-[1.125rem] h-[3.5rem]">{modalDocs?.name}</p>
            </div>
            <div className="w-full flex flex-col justify-center items-center">
              <div className="w-fit">
                <FormButton type="submit">
                  <p>Upload</p>
                </FormButton>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SubGrantManualDocsModal;
