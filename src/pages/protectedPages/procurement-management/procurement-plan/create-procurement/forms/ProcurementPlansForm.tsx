import { Button } from "components/ui/button";
import { Input } from "components/ui/input-2";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

type Props = {
  handleNext: () => void;
};

const ProcurementPlansForm = ({ handleNext }: Props) => {
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<any>();
  return (
    <section className="w-full space-y-8">
      <h3 className="text-lg font-bold">New Procurement Plan</h3>
      <form className="space-y-6 " onSubmit={(e): void => e.preventDefault()}>
        <fieldset className="flex flex-col gap-6">
          <Input
            name="workplan_activity_reference"
            label="Workplan Activity Reference"
            placeholder=""
            register={register}
            error={errors.workplan_activity_reference}
            type="text"
          />
          <span>
            <label
              htmlFor="description_of_procurement_activities"
              className="block mb-1 font-semibold text-gray-700 text-sm"
            >
              Description of procurement activities
            </label>
            <textarea
              className="w-full p-2 border-2 border-gray-300 rounded-md caret-black text-small focus:outline-none bg-gray-100 text-gray-600"
              id="description_of_procurement_activities"
              {...register("description_of_procurement_activities", {
                required: true,
                maxLength: 30,
              })}
            />
            {errors.description_of_procurement_activities &&
              errors.description_of_procurement_activities.type ===
                "required" && (
                <span className="text-red-400 font-semibold text-xs">
                  This field is required
                </span>
              )}
            {errors.description_of_procurement_activities &&
              errors.description_of_procurement_activities.type ===
                "maxLength" && (
                <span className="text-red-400 font-semibold text-xs">
                  Max length exceeded
                </span>
              )}
          </span>
          <div>
            <label
              htmlFor=""
              className="block mb-1 font-semibold text-gray-700 text-sm"
            >
              Budget Allocation & Quantity Target
            </label>
            <div className="grid grid-cols-3 gap-10">
              <div className="col-span-1">
                <label
                  htmlFor=""
                  className="block -mb-1 font-semibold text-gray-700 text-sm"
                >
                  Year 1
                </label>
                <span className="grid grid-cols-3 gap-2">
                  <Input
                    name="year_one"
                    label=""
                    placeholder="YYYY"
                    register={register}
                    error={errors.year_one}
                    type="text"
                  />
                  <Input
                    name="year_one_amount"
                    label=""
                    placeholder="$0.00"
                    register={register}
                    error={errors.year_one_amount}
                    type="text"
                  />
                  <Input
                    name="year_one_target"
                    label=""
                    placeholder="Target"
                    register={register}
                    error={errors.year_one_target}
                    type="text"
                  />
                </span>
              </div>
              <div className="col-span-1">
                <label
                  htmlFor=""
                  className="block -mb-1 font-semibold text-gray-700 text-sm"
                >
                  Year 2
                </label>
                <span className="grid grid-cols-3 gap-2">
                  <Input
                    name="year_two"
                    label=""
                    placeholder="YYYY"
                    register={register}
                    error={errors.year_two}
                    type="text"
                  />
                  <Input
                    name="year_two_amount"
                    label=""
                    placeholder="$0.00"
                    register={register}
                    error={errors.year_two_amount}
                    type="text"
                  />
                  <Input
                    name="year_two_target"
                    label=""
                    placeholder="Target"
                    register={register}
                    error={errors.year_two_target}
                    type="text"
                  />
                </span>
              </div>
              <div className="col-span-1">
                <label
                  htmlFor=""
                  className="block -mb-1 font-semibold text-gray-700 text-sm"
                >
                  Year 3
                </label>
                <span className="grid grid-cols-3 gap-2">
                  <Input
                    name="year_three"
                    label=""
                    placeholder="YYYY"
                    register={register}
                    error={errors.year_three}
                    type="text"
                  />
                  <Input
                    name="year_three_amount"
                    label=""
                    placeholder="$0.00"
                    register={register}
                    error={errors.year_three_amount}
                    type="text"
                  />
                  <Input
                    name="year_three_target"
                    label=""
                    placeholder="Target"
                    register={register}
                    error={errors.year_three_target}
                    type="text"
                  />
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <Input
              name="approved_budget_amt"
              label="Approved Budget Amount - USD"
              placeholder=""
              register={register}
              error={errors.approved_budget_amt}
              type="text"
            />
            <Input
              name="total_quantity "
              label="Total Quantity "
              placeholder=""
              register={register}
              error={errors.total_quantity}
              type="text"
            />
          </div>
          <div className="grid grid-cols-2 gap-5">
            <Input
              name="responsible_pr_staff"
              label="Responsible PR Staff"
              placeholder=""
              register={register}
              error={errors.responsible_pr_staff}
              type="text"
            />
            <Input
              name="mode_of_procurement"
              label="Mode Of Procurement"
              placeholder=""
              register={register}
              error={errors.mode_of_procurement}
              type="text"
            />
          </div>
          <div className="grid grid-cols-2 gap-5">
            <Input
              name="procurement_committee_review"
              label="Procurement Committee Review  (Yes - existing, new; No)"
              placeholder=""
              register={register}
              error={errors.procurement_committee_review}
              type="text"
            />
            <Input
              name="selected_supplier"
              label="Selected Supplier"
              placeholder=""
              register={register}
              error={errors.selected_supplier}
              type="text"
            />
          </div>
          <Input
            name="precurement_process"
            label="PROCUREMENT PROCESS (EOI, RFP, RFQ, Minimum Quotes, Open or Limited Bidding etc. as per organizational Procurement Policy, refer relevant section)"
            placeholder=""
            register={register}
            error={errors.procurement_process}
            type="text"
          />
          <div className="grid grid-cols-3 gap-5">
            <Input
              name="start_date"
              label="Start Date (at least week of the month)"
              placeholder=""
              register={register}
              error={errors.start_date}
              type="text"
            />
            <Input
              name="edd_1"
              label="Expected Delivery Date 1"
              placeholder=""
              register={register}
              error={errors.edd_1}
              type="text"
            />
            <Input
              name="edd_2"
              label="Expected Delivery Date 2"
              placeholder=""
              register={register}
              error={errors.edd_2}
              type="text"
            />
          </div>
          <Input
            name="delivery_to"
            label="DELIVERY TO (Central warehouse, State warehouse, treatment site, SR)"
            placeholder=""
            register={register}
            error={errors.delivery_to}
            type="text"
          />
          <div className="grid grid-cols-2 gap-5">
            <Input
              name="donor_remarks"
              label="Donor Remarks"
              placeholder=""
              register={register}
              error={errors.donor_remarks}
              type="text"
            />
            <Input
              name="implementer_remarks"
              label="Implementer Remarks"
              placeholder=""
              register={register}
              error={errors.implementer_remarks}
              type="text"
            />
          </div>
        </fieldset>
        <span className="w-full flex items-center justify-end gap-5">
          <Button
            type="button"
            className="bg-[#FFF2F2] text-primary dark:text-gray-500"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button onClick={handleNext}>Next</Button>
        </span>
      </form>
    </section>
  );
};

export default ProcurementPlansForm;
