import Card from "components/shared/Card";
import { Button } from "components/ui/button";
import { RouteEnum } from "constants/RouterConstants";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "components/ui/breadcrumb";
import { Icon } from "@iconify/react";
import SupportiveSupervisionAPI from "services/programsApi/suportive-supervision";
import { Criteria } from "definations/program-types/supportive-supervision";
import { Input } from "components/ui/input";
import { Upload as UploadFile } from "lucide-react";
import FormButton from "atoms/FormButton";
import { ChangeEvent, FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { supportiveSupervisionActions } from "store/formData/ssp-values";
import { Loading } from "components/shared/Loading";
import { toast } from "sonner";
import { RootState } from "store/index";

type FormData = {
  [key: string]: string;
};

const CoreManagementSystems = () => {
  const [formData, setFormData] = useState<FormData>({});
  const [page, setPage] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const responses = useSelector((state: RootState) => state.ssp.items);
  const combinedArray = [].concat(...responses);

  const [
    uploadSupportiveSupervisionResponseDocumentMutation,
    { isLoading: loading },
  ] =
    SupportiveSupervisionAPI.useCreateSupportiveSupervisionResponseDocumentMutation();
  const [createSupportiveSupervisionResponseDataMutation, { isLoading: load }] =
    SupportiveSupervisionAPI.useCreateSupportiveSupervisionResponseDataMutation();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleUploads = async (response_id: string) => {
    if (!file) {
      console.error("No file selected");
      return;
    }

    const uploadData = new FormData();
    uploadData.append("supporting_document", file);

    try {
      await uploadSupportiveSupervisionResponseDocumentMutation({
        path: { id: response_id },
        body: uploadData,
      }).unwrap();
      toast.success("Document upload successfully.");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
    setFile(null);
  };

  const { data, isLoading } =
    SupportiveSupervisionAPI.useGetSupportiveSupervisionCriteriaQuery({
      path: { id: id as string },
    });

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const prevPage = () => {
    setPage((prev) => (prev === 0 ? 0 : prev - 1));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    // Process data to form an array of objects
    if (data) {
      const result = data[page]?.criteria?.map((criterion: Criteria) => ({
        response_id: criterion.response_id,
        comments: formData[criterion.response_id] || "",
        supervision_response: formData[criterion.name] || "",
      }));

      dispatch(supportiveSupervisionActions.addSupportiveSupervision(result));
      console.log(result);

      setPage((prev) =>
        prev === data?.length - 1 ? data?.length - 1 : prev + 1
      );
    }
  };

  const onSubmit = async () => {
    console.log(combinedArray);
    try {
      await createSupportiveSupervisionResponseDataMutation({
        responses: combinedArray,
      }).unwrap();
      toast.success("Document upload successfully.");
      dispatch(supportiveSupervisionActions.clearSupportiveSupervision());
      navigate(RouteEnum.PROGRAM_SUPPORTIVE_SUPERVISION);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Programs</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Icon icon="iconoir:slash" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Plans</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Icon icon="iconoir:slash" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href={RouteEnum.PROGRAM_SUPPORTIVE_SUPERVISION}>
              Supportive Supervision Plan
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Icon icon="iconoir:slash" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Details</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Icon icon="iconoir:slash" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Core Management Systems</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex justify-end">
        <div className="py-2 px-4 rounded-lg border text-green-500 border-green-500 bg-green-50">
          Page {page + 1}/{data?.length}
        </div>
      </div>

      <Card>
        <form className="space-y-3">
          <h4 className="font-semibold">
            Integrated Facility Visit Checklist for Comprehensive Sites
          </h4>
          <hr />
          {data && (
            <Card className="space-y-3">
              <h4 className="font-semibold text-red-600">{data[page]?.name}</h4>
              <h6 className="font-light">{data[page]?.description}</h6>

              {data[page]?.criteria?.map((criteria: Criteria) => (
                <Card key={criteria.id} className="space-y-3 border-yellow-600">
                  <h4 className="text-semibold text-yellow-600">
                    {criteria.name}
                  </h4>

                  <div className="flex justify-between pb-3 gap-5">
                    <div className="">
                      <h2>{criteria.description}</h2>
                    </div>
                    <div className="flex gap-5 justify-between w-1/5">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={criteria.response_id}
                          value="yes"
                          name={criteria.name}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="yes">Yes</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={criteria.response_id}
                          value="no"
                          name={criteria.name}
                          className=" text-primary"
                          onChange={handleInputChange}
                        />
                        <label htmlFor="no">No</label>
                      </div>
                    </div>
                  </div>

                  <input
                    className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-gray-100 dark:bg-background"
                    id={criteria.response_id}
                    type="text"
                    placeholder="Comment..."
                    name={criteria.response_id}
                    value={formData[criteria.response_id] || ""}
                    onChange={handleInputChange}
                    // required
                  />
                  {criteria.requires_document && (
                    <div className="flex gap-2">
                      <div className="w-full relative gap-x-3 h-[40px] rounded-[16.2px] border flex justify-center items-center">
                        <UploadFile size={20} />
                        <div>
                          <Input
                            type="file"
                            onChange={handleFileChange}
                            className="bg-inherit border-none cursor-pointer "
                          />
                        </div>
                      </div>
                      <FormButton
                        loading={loading}
                        disabled={loading}
                        type="button"
                        onClick={() => handleUploads(criteria?.response_id)}
                      >
                        Upload
                      </FormButton>
                    </div>
                  )}

                  <hr className="" />
                </Card>
              ))}
            </Card>
          )}
        </form>
      </Card>

      <div className="flex justify-between">
        {data && page > 0 ? (
          <Button
            onClick={prevPage}
            variant="outline"
            className="flex gap-4 items-center text-primary border-primary hover:bg-red-50 hover:text-red-500"
          >
            <ArrowLeft size={15} /> Back
          </Button>
        ) : (
          <div />
        )}

        <Button onClick={handleSubmit} className="px-8">
          Next
        </Button>
        {data && page === data?.length - 1 && (
          <FormButton
            loading={load}
            disabled={load}
            onClick={onSubmit}
            className="px-8"
            variant="secondary"
          >
            Submit
          </FormButton>
        )}
      </div>
    </div>
  );
};

export default CoreManagementSystems;
