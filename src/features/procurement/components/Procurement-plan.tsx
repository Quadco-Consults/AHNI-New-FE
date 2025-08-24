"use client";

import { Button } from "components/ui/button";
import Card from "components/Card";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "components/ui/form";
import { Switch } from "components/ui/switch";
import { Label } from "components/ui/label";
import { Checkbox } from "components/ui/checkbox";
import IconButton from "components/IconButton";
import { Icon } from "@iconify/react";
import { Input } from "components/ui/input";
import { FormDescription } from "components/ui/form";
import { useForm } from "react-hook-form";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "components/Table/DataTable";

type Data = {
  plan: string;
  size: string;
  upload_on: string;
  isSelected: boolean;
};
const ProcurementPlan = () => {
  const formHook = useForm({
    defaultValues: {
      background: "",
      reference: "",
    },
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <div className='space-y-10'>
      <div>
        <h4 className='text-base font-bold'>Procurement Plan</h4>
        <h6>
          Procurement -{" "}
          <span className='font-medium text-black dark:text-grey-dark'>
            Procurement Plan
          </span>
        </h6>
      </div>

      <div className='flex items-center justify-end gap-4'>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant='ghost'>
              <span>
                <svg
                  width='19'
                  height='16'
                  viewBox='0 0 19 16'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M2.39409 5.77515L3.39282 6.81348L6.38513 2.13904H3.31121C2.95499 2.13904 2.65187 2.26413 2.40187 2.51432C2.15186 2.7645 2.02686 3.06783 2.02686 3.42432V4.87293C2.02686 4.87293 2.02686 4.87746 2.02686 4.88654C2.02686 5.06024 2.05859 5.22422 2.12207 5.37848C2.18554 5.53404 2.27621 5.66626 2.39409 5.77515Z'
                    fill='#99A1B7'
                  />
                  <g opacity='0.3'>
                    <path
                      d='M10.7432 2.13904H7.42255L4.02026 7.42987L4.60707 8.01709C4.80785 8.21802 4.96524 8.45265 5.07923 8.72098C5.19322 8.99061 5.25022 9.28033 5.25022 9.59015V12.639C5.25022 12.6481 5.25022 12.6572 5.25022 12.6663C5.25022 12.6753 5.25022 12.6844 5.25022 12.6935C5.25022 13.0124 5.36421 13.2859 5.5922 13.514C5.82018 13.7409 6.09804 13.8543 6.42577 13.8543C6.55271 13.8543 6.67772 13.8342 6.80078 13.794C6.92384 13.7526 7.03524 13.691 7.13498 13.6093V13.6229L7.92775 13.0357C8.07412 12.9346 8.19006 12.8043 8.27556 12.6449C8.36235 12.4854 8.40574 12.3098 8.40574 12.1179V9.67182C8.40574 9.66274 8.40574 9.65561 8.40574 9.65043C8.40574 9.64654 8.40574 9.64006 8.40574 9.63098C8.40574 9.30302 8.46986 8.99774 8.5981 8.71515C8.72505 8.43256 8.90251 8.18626 9.1305 7.97626L11.6021 5.77515C11.7303 5.65719 11.8333 5.51589 11.911 5.35126C11.9874 5.18663 12.0257 5.00904 12.0257 4.81848C12.0257 4.81848 12.0257 4.81395 12.0257 4.80487V3.42432C12.0257 3.06783 11.9006 2.7645 11.6506 2.51432C11.4006 2.26413 11.0982 2.13904 10.7432 2.13904Z'
                      fill='#99A1B7'
                    />
                  </g>
                </svg>
              </span>
              Filter
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-64'>
            <h4 className='p-5 text-base font-medium'>Filter Options</h4>
            <hr />

            <div className='p-5 space-y-5'>
              <div className='space-y-1'>
                <h4 className='font-medium'>Status:</h4>
                <Select>
                  <SelectTrigger className='w-[200px]'>
                    <SelectValue placeholder='Select Status' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {/* <SelectLabel>Fruits</SelectLabel> */}
                      <SelectItem value='apple'>Approved</SelectItem>
                      <SelectItem value='banana'>Pending</SelectItem>
                      <SelectItem value='blueberry'>In Progress</SelectItem>
                      <SelectItem value='grapes'>Rejected</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-1'>
                <h4 className='font-medium'>Member Type:</h4>
                <div className='flex items-center gap-3'>
                  <div className='flex items-center gap-1'>
                    <Checkbox /> <h6 className='text-grey-light'>Author</h6>
                  </div>
                  <div className='flex items-center gap-1'>
                    <Checkbox checked />{" "}
                    <h6 className='text-grey-light'>Customer</h6>
                  </div>
                </div>
              </div>
              <div className='space-y-1'>
                <h4 className='font-medium'>Notifications:</h4>
                <div className='flex items-center space-x-2'>
                  <Switch id='notifications-mode' checked />
                  <Label htmlFor='notifications-mode'>Enabled</Label>
                </div>
              </div>

              <div className='flex justify-end gap-4'>
                <Button variant='ghost'>Reset</Button>
                <Button>Apply</Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Button>Create</Button>
      </div>

      <Card className='flex items-center gap-4 py-10'>
        <div className='p-2 border-2 border-dashed rounded-full'>
          <svg
            width='27'
            height='27'
            viewBox='0 0 27 27'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M4.41353 16.6169L6.03854 13.8002C6.20705 13.5113 6.43937 13.2778 6.73548 13.0997C7.034 12.9215 7.3602 12.8325 7.71409 12.8325C8.07039 12.8325 8.39659 12.9215 8.6927 13.0997C8.98881 13.2778 9.2127 13.5113 9.36437 13.8002H9.38965L11.0146 16.6169L12.6396 19.4336C12.7239 19.5876 12.7925 19.7453 12.8455 19.9066C12.896 20.0655 12.9213 20.2388 12.9213 20.4266C12.9213 20.9514 12.7299 21.404 12.3471 21.7844C11.9668 22.1648 11.5142 22.355 10.9894 22.355C10.9894 22.355 10.9858 22.355 10.9785 22.355C10.9689 22.355 10.9641 22.355 10.9641 22.355H4.46409C3.93928 22.355 3.4915 22.1648 3.12076 21.7844C2.74761 21.404 2.56104 20.9514 2.56104 20.4266C2.56104 20.2388 2.5815 20.0655 2.62242 19.9066C2.66576 19.7453 2.72955 19.5876 2.81381 19.4336V19.4625L4.41353 16.6169Z'
              fill='#FD4A36'
            />
            <g opacity='0.3'>
              <path
                d='M8.19804 12.4027L12.2353 5.34301C12.4038 5.05653 12.6361 4.82422 12.9322 4.64607C13.2283 4.46792 13.5545 4.37885 13.9108 4.37885C14.2647 4.37885 14.5909 4.46792 14.8894 4.64607C15.1855 4.82422 15.4179 5.05653 15.5864 5.34301L19.6489 12.4027L23.7114 19.4625C23.7956 19.5973 23.8594 19.7453 23.9028 19.9066C23.9437 20.0655 23.9641 20.2388 23.9641 20.4266C23.9641 20.9514 23.7788 21.404 23.408 21.7844C23.0349 22.1648 22.5775 22.355 22.0358 22.355H5.78582C5.261 22.355 4.81202 22.1648 4.43887 21.7844C4.06572 21.404 3.87915 20.9514 3.87915 20.4266C3.87915 20.2388 3.90082 20.0655 3.94415 19.9066C3.98748 19.7453 4.05128 19.5876 4.13554 19.4336V19.4625L8.19804 12.4027Z'
                fill='#FD4A36'
              />
            </g>
          </svg>
        </div>
        <div>
          <h4 className='text-lg font-bold'>Procurement Plan</h4>
          <div className='flex items-center gap-2 font-medium'>
            <h6 className='text-primary'>AHNI</h6>
            <h6>|</h6>
            <h6 className='text-primary'>Uploaded Plans</h6>
            <h6>|</h6>
            <h6>X plans</h6>
          </div>
        </div>
      </Card>

      <Card className='space-y-5'>
        <div className='flex items-center justify-end gap-4'>
          <Dialog>
            <DialogTrigger>
              <Button>
                <span>
                  <svg
                    width='25'
                    height='20'
                    viewBox='0 0 25 20'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M13.7957 5.2405H11.3582C10.914 5.2405 10.5177 5.11999 10.1692 4.87897C9.81893 4.63796 9.56796 4.33184 9.4163 3.96064V3.94217L9.15088 3.27453C8.99741 2.89101 8.74282 2.58138 8.38713 2.34564C8.03324 2.11166 7.63963 1.98851 7.2063 1.9762H5.57046C5.05046 1.9762 4.56748 2.07471 4.1215 2.27175C3.6647 2.45823 3.26838 2.71509 2.93255 3.04231C2.59671 3.36953 2.3331 3.75569 2.14171 4.20078C1.93949 4.63532 1.83838 5.10592 1.83838 5.61259V13.6269C1.83838 13.6269 1.83838 13.6304 1.83838 13.6374C1.83838 13.6427 1.83838 13.6454 1.83838 13.6454C1.83838 14.2154 1.95213 14.7537 2.17963 15.2604C2.40893 15.767 2.71678 16.2095 3.10317 16.5877C3.49136 16.9642 3.94546 17.2642 4.46546 17.4876C4.98546 17.7093 5.53796 17.8201 6.12296 17.8201C6.12296 17.8201 6.12567 17.8201 6.13109 17.8201C6.13831 17.8201 6.14192 17.8201 6.14192 17.8201H13.7957C13.7957 17.8201 13.7993 17.8201 13.8065 17.8201C13.8119 17.8201 13.8146 17.8201 13.8146 17.8201C14.3996 17.8201 14.9521 17.7093 15.4721 17.4876C15.9921 17.2642 16.4462 16.9642 16.8344 16.5877C17.2208 16.2095 17.5287 15.767 17.758 15.2604C17.9855 14.7537 18.0992 14.2154 18.0992 13.6454C18.0992 13.6454 18.0992 13.6427 18.0992 13.6374C18.0992 13.6304 18.0992 13.6269 18.0992 13.6269V9.41522C18.0992 8.83467 17.9855 8.29018 17.758 7.78175C17.5287 7.27509 17.2208 6.83351 16.8344 6.45703C16.4462 6.07879 15.9921 5.77884 15.4721 5.55717C14.9521 5.34606 14.3933 5.2405 13.7957 5.2405ZM12.883 10.9563C12.8198 11.0179 12.7494 11.0672 12.6717 11.1041C12.5959 11.1411 12.5074 11.1595 12.4063 11.1595C12.3305 11.1595 12.2609 11.1472 12.1978 11.1226C12.1346 11.098 12.0705 11.0672 12.0055 11.0302H12.0244L10.7109 9.93509V13.8881C10.7109 14.0605 10.654 14.2022 10.5403 14.313C10.4265 14.4256 10.2803 14.4819 10.1015 14.4819C9.9372 14.4819 9.79456 14.4256 9.67359 14.313C9.55261 14.2022 9.49213 14.0605 9.49213 13.8881V9.89814L7.989 11.0302C7.93845 11.0795 7.87796 11.1199 7.80755 11.1516C7.73713 11.1815 7.65768 11.1965 7.56921 11.1965C7.40491 11.1965 7.26227 11.1375 7.14129 11.0197C7.02032 10.9036 6.95984 10.7646 6.95984 10.6027C6.95984 10.5042 6.98511 10.4118 7.03567 10.3256C7.08623 10.2394 7.15664 10.1708 7.24692 10.1198L9.15088 8.65522L9.70338 8.22772C9.76657 8.17846 9.83248 8.14152 9.90109 8.11689C9.9715 8.09226 10.0509 8.07995 10.1394 8.07995C10.2153 8.07995 10.292 8.09226 10.3696 8.11689C10.4455 8.14152 10.515 8.17846 10.5782 8.22772L12.845 10.1198C12.9082 10.1708 12.9588 10.2333 12.9967 10.3072C13.0346 10.3811 13.0536 10.4611 13.0536 10.5473C13.0536 10.6335 13.0373 10.7109 13.0048 10.7795C12.9741 10.8481 12.9335 10.9071 12.883 10.9563Z'
                      fill='white'
                    />
                    <g opacity='0.3'>
                      <path
                        d='M9.03442 3.4408L9.30255 4.01607C9.45422 4.39959 9.7079 4.71186 10.0636 4.95288C10.4193 5.1939 10.8192 5.31441 11.2634 5.31441H13.7009C14.5007 5.32672 15.2311 5.53431 15.8919 5.93718C16.551 6.3383 17.0583 6.8608 17.414 7.50468L17.433 7.52316C17.3951 6.95492 17.2497 6.42274 16.9969 5.92663C16.755 5.41996 16.4336 4.98455 16.0328 4.62038C15.6337 4.25445 15.1679 3.96681 14.6353 3.75746C14.1135 3.54635 13.5546 3.4408 12.9588 3.4408H9.03442Z'
                        fill='white'
                      />
                    </g>
                  </svg>
                </span>{" "}
                Upload Files
              </Button>
            </DialogTrigger>
            <DialogContent>
              <div className='pb-5 space-y-5'>
                <DialogTitle className='py-5 '>Upload files</DialogTitle>

                <hr />
                <Form {...formHook}>
                  <form
                    onSubmit={formHook.handleSubmit(onSubmit)}
                    className='space-y-5'
                  >
                    <FormField
                      control={formHook.control}
                      name='background'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Background</FormLabel>
                          <FormControl>
                            <Input type='file' {...field} />
                          </FormControl>
                          <FormDescription>
                            Max file size is 1MB per file.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className='flex justify-end gap-5'>
                      <DialogClose asChild>
                        <Button variant='ghost'>Close</Button>
                      </DialogClose>
                      <Button type='submit'>Save Changes</Button>
                    </div>
                  </form>
                </Form>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <DataTable columns={columns} data={data} />
      </Card>
    </div>
  );
};

export default ProcurementPlan;

const columns: ColumnDef<Data>[] = [
  {
    id: "select",
    size: 50,
    header: ({ table }) => {
      return (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
          }}
        />
      );
    },
    cell: ({ row }) => {
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
          }}
        />
      );
    },
  },
  {
    header: "Plan",
    accessorKey: "plan",
    size: 200,
    cell: ({ getValue }) => {
      return (
        <div className='flex items-center gap-3'>
          <svg
            width='27'
            height='27'
            viewBox='0 0 27 27'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M12.6887 5.60098L12.3096 4.68737C12.1049 4.16256 11.7655 3.73885 11.2912 3.41626C10.8194 3.09608 10.2946 2.92756 9.71679 2.91071H7.53568C6.84235 2.91071 6.19837 3.04552 5.60374 3.31515C4.99466 3.57034 4.46624 3.92182 4.01846 4.36959C3.57068 4.81737 3.2192 5.3458 2.96401 5.95487C2.69439 6.5495 2.55957 7.19348 2.55957 7.88682V18.8538C2.55957 18.8538 2.55957 18.8586 2.55957 18.8682C2.55957 18.8754 2.55957 18.879 2.55957 18.879C2.55957 19.659 2.71124 20.3957 3.01457 21.089C3.32031 21.7824 3.73077 22.3878 4.24596 22.9054C4.76355 23.4206 5.36901 23.8311 6.06235 24.1368C6.75568 24.4402 7.49235 24.5918 8.27235 24.5918C8.27235 24.5918 8.27596 24.5918 8.28318 24.5918C8.29281 24.5918 8.29763 24.5918 8.29763 24.5918H18.5026C18.5026 24.5918 18.5074 24.5918 18.5171 24.5918C18.5243 24.5918 18.5279 24.5918 18.5279 24.5918C19.3079 24.5918 20.0446 24.4402 20.7379 24.1368C21.4312 23.8311 22.0367 23.4206 22.5543 22.9054C23.0695 22.3878 23.4799 21.7824 23.7857 21.089C24.089 20.3957 24.2407 19.659 24.2407 18.879C24.2407 18.879 24.2407 18.8754 24.2407 18.8682C24.2407 18.8586 24.2407 18.8538 24.2407 18.8538V13.0904C24.2407 12.296 24.089 11.5509 23.7857 10.8551C23.4799 10.1618 23.0695 9.55756 22.5543 9.04237C22.0367 8.52478 21.4312 8.11432 20.7379 7.81098C20.0446 7.52209 19.2995 7.37765 18.5026 7.37765H15.2526C14.6773 7.3608 14.1609 7.19228 13.7035 6.87209C13.2485 6.5495 12.9186 6.13422 12.714 5.62626L12.6887 5.60098Z'
              fill='#FD4A36'
            />
            <g opacity='0.3'>
              <path
                d='M12.3096 4.73798L12.6887 5.60103C12.9102 6.12585 13.2533 6.55316 13.7179 6.88298C14.1825 7.21279 14.711 7.3777 15.3032 7.3777H18.5532C19.6365 7.3777 20.6187 7.64853 21.4998 8.1902C22.381 8.73186 23.0671 9.43483 23.5582 10.2991L23.5835 10.3496C23.5305 9.55279 23.3355 8.81612 22.9985 8.13964C22.6759 7.46316 22.2486 6.87455 21.7165 6.37381C21.1821 5.87548 20.5598 5.48187 19.8496 5.19298C19.1562 4.90649 18.4111 4.75483 17.6143 4.73798H12.3096Z'
                fill='#FD4A36'
              />
            </g>
          </svg>
          <h6>{getValue() as string}</h6>
        </div>
      );
    },
  },
  {
    header: "Size",
    accessorKey: "size",
    size: 250,
  },
  {
    header: "Upload On",
    accessorKey: "upload_on",
    size: 250,
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => <ActionListAction data={row.original} />,
  },
];

const ActionListAction = ({ data }: any) => {
  console.log(data);
  return (
    <div className='flex items-center gap-2'>
      <IconButton className='bg-[#F9F9F9] hover:text-primary'>
        <Icon icon='pepicons-print:chain' fontSize={15} />
      </IconButton>
      <IconButton className='bg-[#F9F9F9] hover:text-primary'>
        <Icon icon='ph:dots-three-duotone' fontSize={15} />
      </IconButton>
    </div>
  );
};

const data: Data[] = [
  {
    plan: "AHNI 2023",
    size: "-",
    upload_on: "",
    isSelected: false,
  },
  {
    plan: "AHNI 2022",
    size: "-",
    upload_on: "",
    isSelected: false,
  },
  {
    plan: "AHNI 2021",
    size: "-",
    upload_on: "",
    isSelected: false,
  },
  {
    plan: "AHNI 2020",
    size: "-",
    upload_on: "",
    isSelected: false,
  },
  {
    plan: "AHNI 2023",
    size: "-",
    upload_on: "",
    isSelected: false,
  },
];
