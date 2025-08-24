"use client";

export default function ProcurementPlansForm() {
    return <></>;
}

// import { Button } from "components/ui/button";
// import { useMemo } from "react";
// import { useLocation, useNavigate } 
// import { useFieldArray, useForm } from "react-hook-form";
// import WorkPlanAPi from "@/features/programs/controllers/work-planController";
// import FormSelect from "components/atoms/FormSelectField";
// import { SelectContent, SelectItem } from "components/ui/select";
// import { LoadingSpinner } from "components/Loading";
// import { WorkPlanResultsData } from "definations/program-types/program-workplan";
// import { Form, FormMessage } from "components/ui/form";
// import FormTextArea from "components/atoms/FormTextArea";
// import FormInput from "components/atoms/FormInput";
// import { z } from "zod";
// import { ProcurementPlanSchema } from "@/features/procurement/types/procurement-validator";
// import { zodResolver } from "@hookform/resolvers/zod";
// import VendorsAPI from "@/features/procurement/controllers/vendorsController";
// import { VendorsResultsData } from "definations/procurement-types/vendors";
// import FormButton from "@/components/FormButton";
// import { MinusCircle } from "lucide-react";
// import AddSquareIcon from "components/icons/AddSquareIcon";
// import ProcurementPlanLayout from "../ProcurementPlanLayout";

// const ProcurementPlansForm = () => {
//   const router = useRouter();
//   const { pathname } = useLocation();

//   const { data: workPlans, isLoading: workPlansIsLoading } =
//     WorkPlanAPi.useGetWorkPlans({});
//   const { data: vendors, isLoading: VendorsIsLoading } =
//     VendorsAPI.useGetVendorList({ params: { no_paginate: true } });

//   const form = useForm<z.infer<typeof ProcurementPlanSchema>>({
//     resolver: zodResolver(ProcurementPlanSchema),
//     defaultValues: {
//       description: "",
//       approved_budget: "",
//       pr_staff: "",
//       mode_of_procurement: "",
//       procurement_committee_review: "",
//       procurement_process: "",
//       donor_remarks: "",
//       implenter_remarks: "",
//       start_date: "",
//       expected_delivery_date_1: "",
//       expected_delivery_date_2: "",
//       ware_houses: "",
//       workplan_activity: "",
//       selected_supplier: "",
//       budget_allocation: [{ date_1: "", date_2: "", date_3: "" }],
//       total_quantity: "",
//     },
//   });

//   const { handleSubmit, watch, control } = form;

//   const { data: workPlansDetail, isLoading } = WorkPlanAPi.useGetWorkPlan(
//     useMemo(
//       () => ({
//         path: { id: watch("workplan_activity") },
//       }),
//       [watch("workplan_activity")]
//     )
//   );

//   const { fields, append, remove } = useFieldArray({
//     control: control,
//     name: "budget_allocation",
//   });

//   const onSubmit = (data: z.infer<typeof ProcurementPlanSchema>) => {
//     localStorage.setItem("procurementPlan", JSON.stringify(data));
//     let path = pathname;
//     path = path.substring(0, path.lastIndexOf("/"));
//     path += "/procurement-milestones";
//     router.push(path);
//   };

//   return (
//     <ProcurementPlanLayout>
//       <section className="w-full space-y-8">
//         <h3 className="text-lg font-bold">New Procurement Plan</h3>
//         <Form {...form}>
//           <form
//             onSubmit={handleSubmit(onSubmit)}
//             className="flex flex-col gap-10"
//           >
//             <FormSelect
//               name="workplan_activity"
//               label="Workplan Activity Reference"
//               placeholder="Select work plan"
//               required
//             >
//               <SelectContent>
//                 {workPlansIsLoading ? (
//                   <LoadingSpinner />
//                 ) : (
//                   workPlans?.results?.map((workplan: WorkPlanResultsData) => (
//                     <SelectItem key={workplan?.id} value={workplan?.id}>
//                       {workplan?.description}
//                     </SelectItem>
//                   ))
//                 )}
//               </SelectContent>
//             </FormSelect>

//             {workPlansDetail?.financial_year && (
//               <div className="space-y-4">
//                 {isLoading && <LoadingSpinner />}
//                 <label className="block mb-4 font-semibold text-yellow-500 text-sm">
//                   RSSH: Health Management Information Systems and M&E
//                 </label>

//                 <div className="text-sm">
//                   <label className="block mb-1 font-semibold text-gray-700">
//                     Financial Year
//                   </label>
//                   <p className="font-light">
//                     {workPlansDetail?.financial_year}
//                   </p>
//                 </div>
//               </div>
//             )}

//             <FormTextArea
//               name="description"
//               label="Description of procurement activities"
//               required
//             />
//             <div>
//               <label className="block mb-4 font-semibold text-yellow-500 text-sm">
//                 Budget Allocation & Quantity Target
//               </label>
//               <div className="space-y-4">
//                 {fields.map((field, index) => (
//                   <div key={index} className="col-span-1">
//                     <label
//                       htmlFor=""
//                       className="block -mb-1 font-semibold text-gray-700 text-sm"
//                     >
//                       Year {index + 1}
//                     </label>
//                     <div className="flex items-center gap-2 w-full">
//                       <div className="grid grid-cols-3 gap-2 w-full">
//                         <FormInput
//                           name={`budget_allocation.${index}.date_1`}
//                           placeholder="Select Project"
//                           type="date"
//                         />
//                         <FormInput
//                           name={`budget_allocation.${index}.date_2`}
//                           placeholder="Select Project"
//                           type="date"
//                         />
//                         <FormInput
//                           name={`budget_allocation.${index}.date_3`}
//                           placeholder="Select Project"
//                           type="date"
//                         />
//                       </div>
//                       <div className="flex items-center h-full pt-5">
//                         <MinusCircle
//                           onClick={() => remove(index)}
//                           className="cursor-pointer text-primary"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//                 <div className="flex justify-end mt-2">
//                   <Button
//                     type="button"
//                     className="text-primary bg-[#FFF2F2] mt-2 flex gap-2 items-center justify-center"
//                     onClick={() =>
//                       append({
//                         date_1: "",
//                         date_2: "",
//                         date_3: "",
//                       })
//                     }
//                   >
//                     <AddSquareIcon />
//                     Add
//                   </Button>
//                 </div>
//               </div>
//             </div>
//             <div className="grid grid-cols-2 gap-5">
//               <FormInput
//                 name="approved_budget"
//                 type="number"
//                 label="Approved Budget Amount - USD"
//                 placeholder=""
//               />
//               <FormInput
//                 name="total_quantity"
//                 type="number"
//                 label="Total Quantity "
//                 placeholder=""
//               />
//             </div>
//             <div className="grid grid-cols-2 gap-5">
//               <FormInput
//                 name="pr_staff"
//                 label="Responsible PR Staff"
//                 placeholder=""
//               />
//               <FormInput
//                 name="mode_of_procurement"
//                 label="Mode Of Procurement"
//                 placeholder=""
//               />
//             </div>
//             <div className="grid grid-cols-2 gap-5">
//               <FormInput
//                 name="procurement_committee_review"
//                 label="Procurement Committee Review  (Yes - existing, new; No)"
//                 placeholder=""
//               />
//               <FormSelect name="selected_supplier" label="Selected Supplier">
//                 <SelectContent>
//                   {VendorsIsLoading ? (
//                     <LoadingSpinner />
//                   ) : (
//                     vendors?.map((vendor: VendorsResultsData) => (
//                       <SelectItem key={vendor?.id} value={vendor?.id}>
//                         {vendor?.company_name}
//                       </SelectItem>
//                     ))
//                   )}
//                 </SelectContent>
//               </FormSelect>
//             </div>
//             <FormInput
//               name="procurement_process"
//               label="PROCUREMENT PROCESS (EOI, RFP, RFQ, Minimum Quotes, Open or Limited Bidding etc. as per organizational Procurement Policy, refer relevant section)"
//               placeholder=""
//             />
//             <div className="grid grid-cols-3 gap-5">
//               <FormInput
//                 name="start_date"
//                 type="date"
//                 label="Start Date (at least week of the month)"
//                 placeholder=""
//               />
//               <FormInput
//                 name="expected_delivery_date_1"
//                 type="date"
//                 label="Expected Delivery Date 1"
//                 placeholder=""
//               />
//               <FormInput
//                 name="expected_delivery_date_2"
//                 type="date"
//                 label="Expected Delivery Date 2"
//                 placeholder=""
//               />
//             </div>
//             <FormInput
//               name="ware_houses"
//               label="DELIVERY TO (Central warehouse, State warehouse, treatment site, SR)"
//               placeholder=""
//             />
//             <div className="grid grid-cols-2 gap-5">
//               <FormTextArea
//                 name="donor_remarks"
//                 label="Donor Remarks"
//                 placeholder=""
//               />
//               <FormTextArea
//                 name="implenter_remarks"
//                 label="Implementer Remarks"
//                 placeholder=""
//               />
//             </div>
//             <FormMessage />
//             <div className="w-full flex items-center justify-end gap-5">
//               <Button
//                 type="button"
//                 className="bg-[#FFF2F2] text-primary dark:text-gray-500"
//                 onClick={() => router.back()}
//               >
//                 Cancel
//               </Button>
//               <FormButton type="submit">Next</FormButton>
//             </div>
//           </form>
//         </Form>
//       </section>
//     </ProcurementPlanLayout>
//   );
// };

// export default ProcurementPlansForm;
