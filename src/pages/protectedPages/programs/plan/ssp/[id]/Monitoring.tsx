import Card from "components/shared/Card";
import { Button } from "components/ui/button";
import { RouteEnum } from "constants/RouterConstants";
import { ArrowLeft } from "lucide-react";
import { Upload as UploadFile } from "lucide-react";
import { Link, generatePath, useNavigate, useParams } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "components/ui/breadcrumb";
import { Icon } from "@iconify/react";
import { useDispatch } from "react-redux";
import { useState } from "react";
import SupportiveSupervisionAPI from "services/programsApi/suportive-supervision";
import { Criteria } from "definations/program-types/supportive-supervision";
// import { supportiveSupervisionActions } from "store/formData/ssp-values";
import { Input } from "components/ui/input";
import FormButton from "atoms/FormButton";
import { Label } from "components/ui/label";
import { RadioGroup, RadioGroupItem } from "components/ui/radio-group";

type FormData = {
  [key: string]: string;
};

const Monitoring = () => {
  const [formData, setFormData] = useState<FormData>({});

  const { id } = useParams();

  const navigate = useNavigate();
  // const dispatch = useDispatch();

  const goBack = () => {
    navigate(-1);
  };

  const { data } =
    SupportiveSupervisionAPI.useGetSupportiveSupervisionCriteriaQuery({
      path: { id: id as string },
    });

  const handleInputChange = (
    event: React.FormEventHandler<HTMLButtonElement>
  ) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Process data to form an array of objects
    if (data) {
      const result = data[2]?.criteria?.map((criterion: Criteria) => ({
        id: criterion.id,
        inputValue: formData[criterion.id] || "",
        radioValue: formData[criterion.name] || "",
      }));

      // dispatch(
      //   supportiveSupervisionActions.addSupportiveSupervision({
      //     management_system: result,
      //   })
      // );

      console.log({
        compliance: result,
      });
    }
  };

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
          Page 3/7
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
              <h4 className="font-semibold text-red-600">{data[2]?.name}</h4>
              <h6 className="font-light">{data[2]?.description}</h6>

              {data[2]?.criteria?.map((criteria: Criteria) => (
                <Card key={criteria.id} className="space-y-3 border-yellow-600">
                  <h4 className="text-semibold text-yellow-600">
                    {criteria.name}
                  </h4>

                  <div className="flex justify-between pb-3 gap-5">
                    <div className="">
                      <h2>{criteria.description}</h2>
                    </div>
                    <RadioGroup defaultValue="comfortable">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          id={criteria.id}
                          value="yes"
                          name={criteria.name}
                          onChange={handleInputChange}
                        />
                        <Label htmlFor={criteria.id}>Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          id={criteria.id}
                          value="no"
                          name={criteria.name}
                          onChange={handleInputChange}
                        />
                        <Label htmlFor={criteria.id}>No</Label>
                      </div>
                    </RadioGroup>
                    {/* <div className="flex gap-5 justify-between w-1/5">
                      <div className="flex items-center space-x-2">
                        <input
                          className="aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          type="radio"
                          id={criteria.id}
                          value="yes"
                          name={criteria.name}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="yes">Yes</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={criteria.id}
                          value="no"
                          name={criteria.name}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="no">No</label>
                      </div>
                    </div> */}
                  </div>

                  {criteria.requires_document ? (
                    <input
                      className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-gray-100 dark:bg-background"
                      id={criteria.id}
                      type="text"
                      name={criteria.id}
                      value={formData[criteria.id] || ""}
                      onChange={handleInputChange}
                      // required
                    />
                  ) : (
                    <div className="flex gap-2">
                      <div className="w-full relative gap-x-3 h-[40px] rounded-[16.2px] border flex justify-center items-center">
                        <UploadFile size={20} />
                        <div>
                          <Input
                            type="file"
                            // onChange={handleFileChange}
                            className="bg-inherit border-none cursor-pointer "
                          />
                        </div>
                      </div>
                      <FormButton
                        // loading={isLoading}
                        // disabled={isLoading}
                        type="button"
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
        <Button
          onClick={goBack}
          variant="outline"
          className="flex gap-4 items-center text-primary border-primary hover:bg-red-50 hover:text-red-500"
        >
          <ArrowLeft size={15} /> Back
        </Button>
        <Button className="px-8">
          <Link
            to={generatePath(RouteEnum.PROGRAM_SUPPORTIVE_SUPERVISION_ASSESS, {
              id: id as string,
            })}
          >
            Next
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Monitoring;
