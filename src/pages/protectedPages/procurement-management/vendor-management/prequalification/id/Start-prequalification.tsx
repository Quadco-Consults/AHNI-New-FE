import Card from "components/shared/Card";
import { LoadingSpinner } from "components/shared/Loading";
import { Button } from "components/ui/button";
import { Checkbox } from "components/ui/checkbox";
import { RouteEnum } from "constants/RouterConstants";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import VendorPrequalificationAPI from "services/procurementApi/vendor-prequalification";
import { toast } from "sonner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "components/ui/breadcrumb";
import { Icon } from "@iconify/react";

type FormData = {
  [key: string]: string;
};

const StartPrequalification = () => {
  const [formData, setFormData] = useState<FormData>({});
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } =
    VendorPrequalificationAPI.useGetVendorPrequalificationsQuery({
      params: { vendor: id as string },
    });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    toast.success("Successfully submitted");
    navigate(RouteEnum.VENDOR_MANAGEMENT);
  };

  return (
    <div className="space-y-5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Procurement</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Icon icon="iconoir:slash" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbItem>Prequalification</BreadcrumbItem>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Icon icon="iconoir:slash" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Start Prequalification</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Button
        onClick={() => navigate(-1)}
        variant="outline"
        className="gap-2 text-primary border-primary"
      >
        <span>
          <ArrowLeft size={15} />
        </span>
        View Vendor info
      </Button>

      {isLoading && <LoadingSpinner />}

      {data?.categories?.map((category, index) => (
        <div
          key={index}
          className="bg-white border shadow-sm rounded-2xl dark:bg-[hsl(15,13%,6%)]"
        >
          <div className="p-5 ">
            <h4 className="font-bold text-lg">{category.name}</h4>
          </div>

          <hr />
          <div className="p-5">
            {category.criteria.map((criteria) => (
              <div key={criteria.id} className="py-2">
                <Card className="border-yellow-darker flex gap-2 justify-between">
                  <h2 className="font-semibold text-base">{criteria.name}</h2>
                  <div className="flex gap-5 justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={criteria.id}
                        value="true"
                        name={criteria.name}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="yes">Yes</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={criteria.id}
                        value="false"
                        name={criteria.name}
                        className=" text-primary"
                        onChange={handleInputChange}
                      />
                      <label htmlFor="no">No</label>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="bg-white border shadow-sm rounded-2xl dark:bg-[hsl(15,13%,6%)]">
        <div className="p-5 ">
          <h4 className="font-bold text-lg">Selected Category</h4>
        </div>

        <hr />

        <div className="p-5">
          <Card className="space-y-5 border-yellow-darker">
            {data?.vendor.submitted_categories.map((category) => (
              <div key={category.id} className="flex gap-2 justify-between">
                <div className="space-y-2">
                  <h2 className="font-semibold">{category.code}</h2>
                  <h6 className="font-light">{category.description}</h6>
                </div>
                <div className="flex gap-5 items-center">
                  {/* <div className="flex gap-2 items-center text-green-dark">
                    <Checkbox className="border-green-dark data-[state=checked]:bg-inherit data-[state=checked]:text-green-dark" />
                    <h6>Pass</h6>
                  </div> */}

                  <Checkbox />
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSubmit}>Finish</Button>
      </div>
    </div>
  );
};

export default StartPrequalification;
