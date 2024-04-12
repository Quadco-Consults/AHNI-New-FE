import { Button } from "components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
  DialogDescription,
} from "components/ui/dialog";
import { Input } from "components/ui/input";
import { DialogClose } from "@radix-ui/react-dialog";
import { Textarea } from "components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "components/ui/form";
import { EOIFormSchema } from "utils/Validator";
import EoiApi from "apis/procurement/Eoi";
import eoiPng from "assets/imgs/eoi.png";
import logoPng from "assets/imgs/logo.png";
import Card from "components/shared/Card";
import { Icon } from "@iconify/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import EOITabsContent from "./eoi-tabs-contents/Tabs-content";
import EOIAllTabsContent from "./eoi-tabs-contents/All-content";
import { Badge } from "components/ui/badge";

const EOI = () => {
  const { data: eoiData } = EoiApi.useGetEoisQuery();
  console.log(eoiData);

  const category = [];

  const formHook = useForm({
    resolver: zodResolver(EOIFormSchema),
    defaultValues: {
      description: "",
      vendor_category: [],
      tender_type: "",
      document: "",
      vendor: "",
    },
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="space-y-10">
      <div>
        <h4 className="text-lg font-bold">EOI</h4>
        <h6>
          Procurement -{" "}
          <span className="text-black font-medium dark:text-grey-dark">
            Expression of Interests
          </span>
        </h6>
      </div>

      <div className="space-y-10 p-10 bg-white shadow-sm rounded-2xl dark:bg-[hsl(15,13%,6%)]">
        <div className="flex justify-end items-center">
          <div>
            <Dialog>
              <DialogTrigger>
                <div className="flex items-center bg-primary text-primary-foreground rounded-md text-sm font-medium h-11 px-4 py-3 hover:bg-primary/90">
                  <span>
                    <Plus size={15} />
                  </span>
                  Create New
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[650px]">
                <div className="pb-5 space-y-5">
                  <DialogTitle className="py-5 ">
                    Initiate New Expression of Interest
                  </DialogTitle>

                  <hr />
                  <Form {...formHook}>
                    <form
                      onSubmit={formHook.handleSubmit(onSubmit)}
                      className="space-y-5"
                    >
                      <FormField
                        control={formHook.control}
                        name="background"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Background</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Type your background here."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-2">
                        <h4 className=" font-medium">Category</h4>
                        {category.length > 0 ? (
                          <Badge className="py-2 rounded-lg bg-[#EBE8E1] text-black">
                            Medical Laboratory Consumables
                          </Badge>
                        ) : (
                          <div>
                            <Dialog>
                              <DialogTrigger>
                                <div className="rounded-lg px-2 py-2 text-yellow-darker border">
                                  Click to select categories that applies
                                </div>
                              </DialogTrigger>
                              <DialogContent className="max-w-6xl max-h-[700px]">
                                <DialogHeader className="text-center mt-10 space-y-5">
                                  <img
                                    src={logoPng}
                                    alt="logo"
                                    className="mx-auto"
                                    width={150}
                                  />
                                  <DialogTitle className="text-2xl">
                                    Select your Category
                                  </DialogTitle>
                                  <DialogDescription>
                                    Select all categories that applies to you,
                                    you can also check other tabs for more
                                    categories
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="flex justify-center">
                                  <div className="border w-1/2 py-2 px-4 flex items-center rounded-lg">
                                    <Input
                                      placeholder="Search Category"
                                      type="search"
                                      className="h-6 border-none bg-none"
                                    />
                                    <Icon
                                      icon="iconamoon:search-light"
                                      fontSize={25}
                                    />
                                  </div>
                                </div>

                                <Tabs defaultValue="all">
                                  <TabsList>
                                    <TabsTrigger value="all">All</TabsTrigger>
                                    <TabsTrigger value="EOIAHNi10">
                                      EOIAHNi01 - EOIAHNi10
                                    </TabsTrigger>
                                    <TabsTrigger value="EOIAHNi20">
                                      EOIAHNi11 - EOIAHNi20
                                    </TabsTrigger>
                                    <TabsTrigger value="EOIAHNi30">
                                      EOIAHNi21 - EOIAHNi30
                                    </TabsTrigger>
                                    <TabsTrigger value="EOIAHNi34">
                                      EOIAHNi31 - EOIAHNi34
                                    </TabsTrigger>
                                  </TabsList>
                                  <div className=" bg-[#dbdfe92f] p-2 my-5">
                                    <TabsContent value="all">
                                      <EOIAllTabsContent />
                                    </TabsContent>
                                    <TabsContent value="EOIAHNi10">
                                      <EOITabsContent value="EOIAHNi10" />
                                    </TabsContent>
                                    <TabsContent value="EOIAHNi20">
                                      <EOITabsContent value="EOIAHNi20" />
                                    </TabsContent>
                                    <TabsContent value="EOIAHNi30">
                                      <EOITabsContent value="EOIAHNi30" />
                                    </TabsContent>
                                    <TabsContent value="EOIAHNi34">
                                      <EOITabsContent value="EOIAHNi34" />
                                    </TabsContent>
                                  </div>
                                </Tabs>
                              </DialogContent>
                            </Dialog>
                          </div>
                        )}
                      </div>

                      <FormField
                        control={formHook.control}
                        name="document"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Upload Complete EOI Document</FormLabel>
                            <FormControl>
                              <Input
                                type="file"
                                className="w-full"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end gap-5">
                        <DialogClose asChild>
                          <Button variant="ghost">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Create</Button>
                      </div>
                    </form>
                  </Form>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        {/* 
        <Table
          instance={tableInstance}
          loading={customersQueryResult.isFetching}
          error={customersQueryResult.isError}
          onReload={customersQueryResult.refetch}
        /> */}

        <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
          {Array(6)
            .fill({
              title: "Call for expression of interest",
              description:
                "Achieving Health Nigeria Initiative (AHNi) is an indigenous non-governmental organization that promotes socio-economic development by supporting a broad range of global health interventions, education, and economic initiatives in Nigeria.",
            })
            .map(({ title, description }, index) => (
              <Card key={index} className="space-y-4">
                <img src={eoiPng} alt="eoi" />
                <h2 className="text-lg font-bold">{title}</h2>

                {description.length > 200 ? (
                  <h6>{description.substring(0, 200)}...</h6>
                ) : (
                  <h6>{description}</h6>
                )}

                <div className="flex justify-center">
                  <Button variant="ghost" className="border text-primary">
                    Tap to View
                  </Button>
                </div>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
};

export default EOI;
// const columns = [
//   {
//     id: "select",
//     size: 50,
//     header: ({ table }) => {
//       return (
//         <Checkbox
//           checked={table.getIsAllPageRowsSelected()}
//           onCheckedChange={(value) => {
//             table.toggleAllPageRowsSelected(!!value);
//           }}
//         />
//       );
//     },
//     cell: ({ row }) => {
//       return (
//         <Checkbox
//           checked={row.getIsSelected()}
//           onCheckedChange={(value) => {
//             row.toggleSelected(!!value);
//           }}
//         />
//       );
//     },
//   },
//   {
//     header: "Ref No",
//     accessorKey: "ref",
//   },
//   {
//     header: "Requisition Name",
//     accessorKey: "requisition",
//   },
//   {
//     header: "Requested Project",
//     accessorKey: "requested_project",
//   },
//   {
//     header: "Submission Deadline",
//     accessorKey: "submission_deadline",
//   },
//   {
//     header: "Status",
//     accessorKey: "status",
//     cell: ({ getValue }) => {
//       return (
//         <Badge
//           className={cn(
//             "p-1 rounded-lg",
//             getValue() === "Under Review"
//               ? "bg-green-light text-green-dark"
//               : "bg-red-light text-red-dark"
//           )}
//         >
//           {getValue()}
//         </Badge>
//       );
//     },
//   },
//   {
//     header: "Vendor Responses",
//     accessorKey: "vendor_responses",
//     cell: ({ getValue }) => <p className=" text-red-dark">{getValue()}</p>,
//   },
//   {
//     header: "Action Required",
//     accessorKey: "action_required",
//     cell: ({ getValue }) => {
//       return (
//         <Badge
//           className={cn(
//             "p-1 rounded-lg",
//             getValue() === "No Action Required" &&
//               "bg-green-light text-green-dark",
//             getValue() === "Approve/Reject" && "bg-red-light text-red-dark",
//             getValue() === "Review Pending" &&
//               "bg-yellow-light text-yellow-dark"
//           )}
//         >
//           {getValue()}
//         </Badge>
//       );
//     },
//   },
//   {
//     header: "Opening Date",
//     accessorKey: "date",
//   },
//   {
//     header: "Evaluation Status",
//     accessorKey: "evaluation_status",
//     cell: ({ getValue }) => {
//       return (
//         <Badge
//           className={cn(
//             "p-1 rounded-lg",
//             getValue() === "Completed"
//               ? "bg-green-light text-green-dark"
//               : "bg-purple-light text-purple-dark"
//           )}
//         >
//           {getValue()}
//         </Badge>
//       );
//     },
//   },
//   {
//     header: "Award Decision",
//     accessorKey: "award_decision",
//     cell: ({ getValue }) => {
//       return (
//         <Badge
//           className={cn(
//             "p-1 rounded-lg",
//             getValue() === "Awarded to Infosoft"
//               ? "bg-green-light text-green-dark"
//               : "bg-[#F9F9F9] text-grey-light"
//           )}
//         >
//           {getValue()}
//         </Badge>
//       );
//     },
//   },
//   {
//     header: "Contract Amount (₦)",
//     accessorKey: "amount",
//     cell: ({ getValue }) => {
//       return getValue() ? (
//         <p>{getValue()}</p>
//       ) : (
//         <p className="text-center">---</p>
//       );
//     },
//   },
//   {
//     header: "Vendor Awarded",
//     accessorKey: "vendor_awarded",
//   },

//   {
//     header: "Actions",
//     id: "actions",
//     cell: ({ row }) => <ActionListAction data={row.original} />,
//   },
// ];

// const ActionListAction = () => {
//   return (
//     <div className="flex gap-2">
//       <div>
//         <IconButton className="bg-[#F9F9F9] hover:text-primary">
//           <Icon icon="bi:toggles" fontSize={15} />
//         </IconButton>
//       </div>
//       <div className="flex gap-2 flex-col">
//         <IconButton className="bg-[#F9F9F9] hover:text-primary">
//           <Icon icon="solar:pen-bold-duotone" fontSize={15} />
//         </IconButton>
//         <IconButton className="bg-[#F9F9F9] hover:text-primary">
//           <Icon icon="ant-design:delete-twotone" fontSize={15} />
//         </IconButton>
//       </div>
//     </div>
//   );
// };

// const data = [
//   {
//     ref: "AHNI-T-001",
//     requisition: "Office Refurbishing",
//     requested_project: "Infrastructure Improvement",
//     submission_deadline: "12/12/2023",
//     status: "open",
//     vendor_responses: 3,
//     action_required: "Review Pending",
//     date: "	10/10/2023",
//     evaluation_status: "Not Started",
//     award_decision: "Not Yet Awarded",
//     amount: 1200000,
//     vendor_awarded: "Infosoft Ltd",
//   },
//   {
//     ref: "AHNI-T-002",
//     requisition: "Mobile Clinic Units",
//     requested_project: "Outreach Expansion",
//     submission_deadline: "04/11/2023",
//     status: "Under Review",
//     vendor_responses: 5,
//     action_required: "Approve/Reject",
//     date: "	09/01/2023",
//     evaluation_status: "Technical Evaluation",
//     award_decision: "Not Yet Awarded",
//     amount: null,
//     vendor_awarded: "",
//   },
//   {
//     ref: "AHNI-T-003",
//     requisition: "Data Management Systems",
//     requested_project: "IT Systems Upgrade",
//     submission_deadline: "12/12/2023",
//     status: "Closed",
//     vendor_responses: 10,
//     action_required: "No Action Required",
//     date: "10/10/2023",
//     evaluation_status: "Completed",
//     award_decision: "Awarded to Infosoft",
//     amount: 1800000,
//     vendor_awarded: "Infosoft Ltd",
//   },
// ];
