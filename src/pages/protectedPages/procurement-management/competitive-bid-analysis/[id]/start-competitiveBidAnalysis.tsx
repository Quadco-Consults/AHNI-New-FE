import FormButton from "atoms/FormButton";
import BreadcrumbCard from "components/shared/Breadcrumb";
import Card from "components/shared/Card";
import GoBack from "components/shared/GoBack";
import { LoadingSpinner } from "components/shared/Loading";
import { Checkbox } from "components/ui/checkbox";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { Textarea } from "components/ui/textarea";
import { RouteEnum } from "constants/RouterConstants";
import {
  SubmissionData,
  VendorSubmissionData,
} from "definations/procurement-types/cba";
import { ChangeEvent, useState } from "react";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import CbaAPI from "services/procurementApi/cba";
import { toast } from "sonner";

const breadcrumbs = [
  { name: "Procurement", icon: true },
  { name: "Competitive Bid Analysis", icon: true },
  { name: "Detail", icon: true },
  { name: "Start CBA", icon: false },
];

type FormData = {
  [key: string]: string;
};

const CompetittveBidAnalysis = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedVendors, setSelectedVendors] = useState<FormData>({});
  const [remarks, setRemarks] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSelectedVendors({
      ...selectedVendors,
      [name]: value,
    });
  };

  const { data, isLoading } = CbaAPI.useGetCbaQuery({
    path: { id: id as string },
  });

  const [createSubmitCbaMutation, { isLoading: createSubmitCbaIsLoading }] =
    CbaAPI.useCreateSubmitCbaMutation();

  const uniqueSubmissions = data?.vendor_submissions[0]?.submissions;

  const submitCbaHandler = async () => {
    const formData = {
      path: { id: id as string },
      body: {
        submission_ids: Object.values(selectedVendors),
        remarks: remarks,
      },
    };
    console.log(formData);

    try {
      await createSubmitCbaMutation(formData).unwrap();
      toast.success("Successfully created.");
      navigate(
        generatePath(RouteEnum.COMPETITIVE_BID_ANALYSIS_DETAILS, {
          id: id as string,
        })
      );
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  };

  return (
    <div className="space-y-5">
      <BreadcrumbCard list={breadcrumbs} />

      <GoBack />

      <Card className="overflow-x-auto">
        {isLoading && <LoadingSpinner />}
        <div className="overflow-auto">
          {/* Headers */}
          <div className="flex divide-x-2 devide-y-2 border-y-destructive-foreground">
            <div className="flex basis-2/3 min-w-[30rem] items-end justify-end w-full border-b-4 ">
              <div className="grid w-full grid-cols-7 py-2">
                <div className="col-span-1 ">
                  <p className="text-sm text-[#DEA004]">S/N</p>
                </div>
                <div className="col-span-5 ">
                  <p className="text-sm text-[#DEA004]">Description</p>
                </div>
                <div className="col-span-1">
                  <p className="text-sm text-[#DEA004]">QTY</p>
                </div>
              </div>
            </div>
            {/* vendors */}
            {uniqueSubmissions?.map(
              (submission: SubmissionData, index: number) => (
                <div
                  key={index}
                  className="flex basis-2/5 min-w-96 flex-col items-end justify-end px-2 border-b-2"
                >
                  <div className="w-full my-2 font-semibold text-center">
                    {submission?.vendor}
                  </div>
                  <div className="grid w-full grid-cols-5 py-2">
                    <div className="col-span-1 ">
                      <p className="text-sm text-[#DEA004]">
                        <Checkbox />
                      </p>
                    </div>
                    <div className="col-span-3 ">
                      <p className="text-sm text-[#DEA004]">Unit Price</p>
                    </div>
                    <div className="col-span-1">
                      <p className="text-sm text-[#DEA004]">Total</p>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
          {/* Body */}

          <div className="">
            {data?.vendor_submissions?.map(
              (item: VendorSubmissionData, index: number) => {
                return (
                  <div
                    key={index}
                    className="flex divide-x-2 divide-y-2 border-y-destructive-foreground "
                  >
                    <div className="flex items-end basis-2/3 justify-end min-w-[30rem] py-3 border-b ">
                      <div className="grid w-full  py-2 grid-cols-7 h-[60px]">
                        <div className="col-span-1 ">
                          <p className="text-sm ">{index + 1}</p>
                        </div>
                        <div className="col-span-5 space-y-1 ">
                          <p className="text-sm font-semibold line-clamp-1 ">
                            {item?.item.name}
                          </p>
                          <p className="text-xs ">{item?.item?.description}</p>
                        </div>
                        <div className="col-span-1">
                          <p className="text-sm ">{item?.item?.quantity}</p>
                        </div>
                      </div>
                    </div>
                    {item?.submissions?.map(
                      (submission: SubmissionData, index: number) => (
                        <div
                          key={index}
                          className="flex basis-2/5 items-end justify-end min-w-96 py-3 border-b "
                        >
                          <div className="grid w-full items-center py-2 grid-cols-5 px-2 h-[60px] ">
                            <div className="col-span-1 ">
                              <input
                                type="radio"
                                value={submission?.id}
                                name={`submission${item?.item?.name}`}
                                onChange={handleInputChange}
                              />
                            </div>
                            <div className="col-span-3 space-y-1 ">
                              <p>{submission?.unit_price}</p>
                            </div>
                            <div className="col-span-1">
                              <p className="text-sm ">
                                ₦{submission?.sub_total.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                );
              }
            )}
          </div>
        </div>
      </Card>
      <div className="flex justify-end w-full py-4 my-6 border-t-2 border-b-2 border-yellow-500">
        <div className="mr-10">
          <p className="flex justify-between w-[300px] rounded border border-red-500 p-4 text-red-500 font-semibold">
            <span>Total:</span>
            <span>22,970.660.55</span>
          </p>
        </div>
      </div>

      <div className="py-5">
        <Label>Remarks</Label>
        <Textarea
          value={remarks}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setRemarks(e.target.value)
          }
        />
      </div>
      <div className="overflow-x-auto ">
        <div className="grid gap-x-4 justify-center grid-cols-4 w-[1700px] ">
          <div>Brand</div>
          <div>
            <Textarea
              className="placeholder:text-xs"
              placeholder="Enter list of brands"
            />
          </div>
          <div>
            <Textarea
              className="placeholder:text-xs"
              placeholder="Enter list of brands"
            />
          </div>
          <div>
            <Textarea
              className="placeholder:text-xs"
              placeholder="Enter list of brands"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-16">
        <FormButton
          onClick={submitCbaHandler}
          loading={createSubmitCbaIsLoading}
          disabled={createSubmitCbaIsLoading}
        >
          Submit
        </FormButton>
      </div>
    </div>
  );
};

export default CompetittveBidAnalysis;
