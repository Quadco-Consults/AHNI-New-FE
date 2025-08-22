/* eslint-disable no-unused-vars */
import React from "react";
import Card from "components/Card";
import { Badge } from "components/ui/badge";
import GoBack from "components/GoBack";
import { cn } from "lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import LeaveHistory from "./LeaveHistory";
import { Button } from "components/ui/button";
import { ChevronDown } from "lucide-react";

const LeaveManagement: React.FC = () => {
  const status = "Approved";
  const TABS = [
    {
      label: "Leave Details",
      value: "details",
      // @ts-ignore
      children: (
        <>
          <div className='flex w-full'>
            <h3 className='text-2xl font-bold mb-5 text-start'>
              ISAAC OLUGBENLE
            </h3>
          </div>

          <Card>
            <div className='grid grid-cols-2 gap-x-2 gap-y-8'>
              <section>
                <h4 className='font-bold mb-3 text-start'>Type</h4>
                <p className='text-sm'>Medical Leave</p>
              </section>

              <section>
                <h4 className='font-bold mb-3 text-start'>No of Days</h4>
                <p className='text-sm'>30</p>
              </section>
              <section>
                <h4 className='font-bold mb-3 text-start'>Balance of Leave</h4>
                <p className='text-sm'>130</p>
              </section>

              <section>
                <h4 className='font-bold mb-3 text-start'>From</h4>
                <p className='text-sm'>05-05-2025</p>
              </section>

              <section>
                <h4 className='font-bold mb-3 text-start'>To</h4>
                <p className='text-sm'>05-06-2025</p>
              </section>

              <section className='col-span-2'>
                <h4 className='font-bold mb-5 text-start'>Reason</h4>
                <p className='text-sm'>
                  I am writing to report a serious issue that I believe requires
                  immediate attention. Over the past six months, I have observed
                  what appears to be a misuse of company funds by a senior
                  manager in our department. Specifically, this individual has
                  been submitting fraudulent expense reports for personal
                  expenses, which are then reimbursed by the company as business
                  expenses.
                </p>
              </section>
            </div>
          </Card>

          <Card className='mt-4'>
            <h4 className='font-bold mb-3 text-start'>Leave Approval Status</h4>
            <div className='w-full flex gap-2 align-center'>
              <Badge
                variant='default'
                className={cn(
                  "p-1 rounded-lg",
                  status === "Approved"
                    ? "bg-green-200 text-green-500"
                    : status === "Rejected"
                    ? "bg-red-200 text-red-500"
                    : status === "Pending"
                    ? "bg-yellow-200 text-yellow-500"
                    : status === "On Hold" && "text-grey-200 bg-grey-500"
                )}
              >
                {status}
              </Badge>

              <div className='flex items-center'>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant='ghost' className='flex gap-1 px-2 py-2'>
                      <ChevronDown />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className=' w-fit'>
                    <div className='flex flex-col items-start justify-between gap-1'>
                      <Button
                        className='w-full flex items-center justify-start gap-2'
                        variant='ghost'
                        disabled={status === "Approved"}
                      >
                        {/* <ApproveIcon /> */}
                        Approve
                      </Button>

                      <Button
                        className='w-full flex items-center justify-start gap-2'
                        variant='ghost'
                        disabled={status === "Rejected"}
                      >
                        Reject
                      </Button>

                      <Button
                        className='w-full flex items-center justify-start gap-2'
                        variant='ghost'
                        disabled={status === "Pending"}
                      >
                        Pending
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </Card>
        </>
      ),
    },
    {
      label: "Leave History",
      value: "history",
      // @ts-ignore
      children: (
        <>
          <div className='flex w-full'>
            <h3 className='text-2xl font-bold mb-5 text-start'>
              ISAAC OLUGBENLE
            </h3>
          </div>

          <LeaveHistory />
        </>
      ),
    },
  ];

  return (
    <div className='flex flex-col justify-center gap-y-[1rem]'>
      <div className='w-full flex gap-4 items-center mb-2'>
        <GoBack />
        {/* <div className='flex items-center'>
          <Link
            href={generatePath(HrRoutes.LEAVE_MANAGEMENT_REQUEST_LEAVE, {
              id: 1,
              appID: 2,
            })}
          >
            <FormButton>
              <AddSquareIcon />
              <p>Add Leave</p>
            </FormButton>
          </Link>
        </div> */}
      </div>

      <Tabs defaultValue='details'>
        <TabsList>
          {TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <Card className='px-6'>{tab.children}</Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default LeaveManagement;
