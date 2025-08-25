"use client";

import FormButton from "@/components/FormButton";
import BreadcrumbCard from "components/Breadcrumb";
import Card from "components/Card";
import GoBack from "components/GoBack";
import { LoadingSpinner } from "components/Loading";
import DataTable from "components/Table/DataTable";
import { Checkbox } from "components/ui/checkbox";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "components/ui/table";
import { Textarea } from "components/ui/textarea";
import { RouteEnum } from "constants/RouterConstants";
import {
  SubmissionData,
  VendorSubmissionData,
} from "definations/procurement-types/cba";
import { ChangeEvent, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import CbaAPI from "@/features/procurement/controllers/cbaController";
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
  const router = useRouter();
  const [selectedVendors, setSelectedVendors] = useState<FormData>({});
  const [remarks, setRemarks] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSelectedVendors({
      ...selectedVendors,
      [name]: value,
    });
  };

  const { data, isLoading } = CbaAPI.useGetCba({
    path: { id: id as string },
  });

  const { createSubmitCbaMutation, isLoading: createSubmitCbaIsLoading } =
    CbaAPI.useCreateSubmitCba();

  // const uniqueSubmissions = data?.vendor_submissions[0]?.submissions;

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
      await createSubmitCbaMutation(formData)();
      toast.success("Successfully created.");
      router.push(`/dashboard/procurement/competitive-bid-analysis/${id}`);
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  };

  return (
    <div className='space-y-5'>
      <BreadcrumbCard list={breadcrumbs} />

      <GoBack />

      <Card className='overflow-x-auto'>
        {isLoading && <LoadingSpinner />}
        <div className='overflow-auto'>
          {/* Headers */}
          <div className='flex divide-x-2 devide-y-2 border-y-destructive-foreground'>
            <div className='flex basis-2/3 min-w-[30rem] items-end justify-end w-full border-b-4 '>
              <div className='grid w-full grid-cols-7 py-2'>
                <div className='col-span-1 '>
                  <p className='text-sm text-[#DEA004]'>S/N</p>
                </div>
                <div className='col-span-5 '>
                  <p className='text-sm text-[#DEA004]'>Description</p>
                </div>
                <div className='col-span-1'>
                  <p className='text-sm text-[#DEA004]'>QTY</p>
                </div>
              </div>
            </div>
            {/* vendors */}
            {/* {uniqueSubmissions?.map(
                            (submission: SubmissionData, index: number) => (
                                <div
                                    key={index}
                                    className="flex basis-2/5 min-w-96 flex-col items-end justify-end px-2 border-b-2 g"
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
                                        <div className="col-span-1">
                                            <p className="text-sm text-[#DEA004]">
                                                Unit Price
                                            </p>
                                        </div>
                                        <div className="col-span-1">
                                            <p className="text-sm text-[#DEA004]">
                                                Total
                                            </p>
                                        </div>

                                        <div className="col-span-1">
                                            <p className="text-sm text-[#DEA004]">
                                                Grand Total
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )
                        )} */}
          </div>
          {/* Body */}

          <div className=''>
            {data?.vendor_submissions?.map(
              (item: VendorSubmissionData, index: number) => {
                return (
                  <div
                    key={index}
                    className='flex divide-x-2 divide-y-2 border-y-destructive-foreground '
                  >
                    <div className='flex items-end basis-2/3 justify-end min-w-[30rem] py-3 border-b '>
                      <div className='grid w-full  py-2 grid-cols-7 h-[60px]'>
                        <div className='col-span-1 '>
                          <p className='text-sm '>{index + 1}</p>
                        </div>
                        <div className='col-span-5 space-y-1 '>
                          <p className='text-sm font-semibold line-clamp-1 '>
                            {item?.item.name}
                          </p>
                          <p className='text-xs '>{item?.item?.description}</p>
                        </div>
                        <div className='col-span-1'>
                          <p className='text-sm '>{item?.item?.quantity}</p>
                        </div>
                      </div>
                    </div>
                    {item?.submissions?.map(
                      (submission: SubmissionData, index: number) => (
                        <div
                          key={index}
                          className='flex basis-2/5 items-end justify-end min-w-96 py-3 border-b '
                        >
                          <div className='grid w-full items-center py-2 grid-cols-5 px-2 h-[60px] '>
                            <div className='col-span-1 '>
                              <input
                                type='radio'
                                value={submission?.id}
                                name={`submission${item?.item?.name}`}
                                onChange={handleInputChange}
                              />
                            </div>
                            <div className='col-span-1 space-y-1 '>
                              <p>{submission?.unit_price}</p>
                            </div>
                            <div className='col-span-1'>
                              <p className='text-sm '>
                                ₦{submission?.sub_total.toLocaleString()}
                              </p>
                            </div>

                            <div className='col-span-1'>
                              <p className='text-sm '>
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
      <div className='flex justify-end w-full py-4 my-6 border-t-2 border-b-2 border-yellow-500'>
        <div className='mr-10'>
          <p className='flex justify-between w-[300px] rounded border border-red-500 p-4 text-red-500 font-semibold'>
            <span>Total:</span>
            <span>22,970.660.55</span>
          </p>
        </div>
      </div>

      <div className='py-5'>
        <Label>Remarks</Label>
        <Textarea
          value={remarks}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setRemarks(e.target.value)
          }
        />
      </div>
      <div className='overflow-x-auto '>
        <div className='grid gap-x-4 justify-center grid-cols-4 w-[1700px] '>
          <div>Brand</div>
          <div>
            <Textarea
              className='placeholder:text-xs'
              placeholder='Enter list of brands'
            />
          </div>
          <div>
            <Textarea
              className='placeholder:text-xs'
              placeholder='Enter list of brands'
            />
          </div>
          <div>
            <Textarea
              className='placeholder:text-xs'
              placeholder='Enter list of brands'
            />
          </div>
        </div>
      </div>

      {/* <DataTable columns={} data={} isLoading={false} /> */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead></TableHead>
            <TableHead>Date & Sign</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableHead>Remarks</TableHead>
            <TableCell>
              Meet listed Specification All Quoted Line Items
            </TableCell>
          </TableRow>

          <TableRow>
            <TableHead>Variance</TableHead>
            <TableCell>N/A</TableCell>
          </TableRow>

          <TableRow>
            <TableHead>Delivery Timeframe</TableHead>
            <TableCell>2-3 weeks</TableCell>
          </TableRow>
          <TableRow>
            <TableHead>Payment Terms</TableHead>
            <TableCell>100% Payment After Delivery</TableCell>
          </TableRow>
          <TableRow>
            <TableHead>Tax Identification Number (TIN)</TableHead>
            <TableCell>0336185-0001</TableCell>
          </TableRow>
          <TableRow>
            <TableHead>Validity Period of Quote</TableHead>
            <TableCell>
              1 Week Exchange Rate due to Volatility in Currency
            </TableCell>
          </TableRow>

          <TableRow>
            <TableHead>Bank Account</TableHead>
            <TableCell>YES</TableCell>
          </TableRow>

          <TableRow>
            <TableHead>Registration With C.A.C</TableHead>
            <TableCell>YES</TableCell>
          </TableRow>

          <TableRow>
            <TableHead>Previous Work Experience With AHNI?</TableHead>
            <TableCell>YES</TableCell>
          </TableRow>

          <TableRow>
            <TableHead>Currency For Payment</TableHead>
            <TableCell>Naira</TableCell>
          </TableRow>

          <TableRow>
            <TableHead>Warranty</TableHead>
            <TableCell>OEM Warranty Applicable</TableCell>
          </TableRow>

          <TableRow>
            <TableHead>Recommendation Notes</TableHead>
            <TableCell>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem
              velit a totam error dicta officia sed? Rerum porro excepturi totam
              nulla asperiores, temporibus officia, ipsam quo, repudiandae eum
              nemo? Mollitia.
            </TableCell>
          </TableRow>

          <TableRow>
            <TableHead>Prepared By</TableHead>
            <TableCell>Jennifer Onubi</TableCell>
            <TableCell>23/04/2024</TableCell>
          </TableRow>

          <TableRow>
            <TableHead>Reviewed By</TableHead>
            <TableCell>Kingsley James</TableCell>
            <TableCell>23/04/2024</TableCell>
          </TableRow>

          <TableRow>
            <TableHead>Procurement Committee</TableHead>
            <TableCell>Hassan Ehase</TableCell>
            <TableCell>23/04/2024</TableCell>
          </TableRow>

          <TableRow>
            <TableHead>Procurement Committee</TableHead>
            <TableCell>Friday Eguavoen</TableCell>
            <TableCell>23/04/2024</TableCell>
          </TableRow>

          <TableRow>
            <TableHead>Procurement Committee</TableHead>
            <TableCell>Kazeem Oluwanisola</TableCell>
            <TableCell>23/04/2024</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <div className='flex justify-end mt-16'>
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
