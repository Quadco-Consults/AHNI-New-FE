"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Modal from "react-modal";
import { toast } from "sonner";

import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import FormSelect from "components/FormSelectField";
import { Button } from "components/ui/button";
import { Form } from "components/ui/form";
import { useCreateCompensationSpread } from "@/features/hr/controllers/hrCompensationSpreadController";
import { useGetAllPositionsManager } from "@/features/modules/controllers/config/positionController";
import { useGetAllGradesManager } from "@/features/modules/controllers/config/gradeController";
import { useGetAllLocationsManager } from "@/features/modules/controllers/config/locationController";
import { useGetCompensations } from "@/features/hr/controllers/compensationController";
import { useGetAllProjects } from "@/features/projects/controllers/projectController";

type PropsType = {
  isOpen: boolean;
  onCancel: () => void;
  onSuccess: () => void;
};

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "600px",
    width: "90%",
    maxHeight: "90vh",
    overflow: "auto",
  },
};

const FormSchema = z.object({
  employee: z.string().min(1, "Employee ID is required"),
  employee_number: z.string().min(1, "Employee number is required"),
  surname: z.string().min(1, "Surname is required"),
  firstname: z.string().min(1, "Firstname is required"),
  position: z.string().min(1, "Position is required"),
  grade: z.string().min(1, "Grade is required"),
  location: z.string().optional(),
  project: z.string().optional(),
  hire_date: z.string().min(1, "Hire date is required"),
  basic: z.string().optional(),
  housing: z.string().optional(),
  transport: z.string().optional(),
  meal: z.string().optional(),
  miscellaneous: z.string().optional(),
});

const CompensationSpreadModal = (props: PropsType) => {
  const { data: positions } = useGetAllPositionsManager({
    page: 1,
    size: 2000000,
  });

  const { data: grades } = useGetAllGradesManager({
    page: 1,
    size: 2000000,
  });

  const { data: locations } = useGetAllLocationsManager({
    page: 1,
    size: 2000000,
  });

  const { data: projects } = useGetAllProjects({
    page: 1,
    size: 2000000,
  });

  const { data: compensations } = useGetCompensations();

  const { createCompensationSpread, isLoading } = useCreateCompensationSpread();

  const positionOptions =
    positions?.data?.results?.map(({ name, id }: any) => ({
      label: name,
      value: String(id),
    })) || [];

  const gradeOptions =
    grades?.data?.results?.map(({ name, id }: any) => ({
      label: name,
      value: String(id),
    })) || [];

  const locationOptions =
    locations?.data?.results?.map(({ name, id }: any) => ({
      label: name,
      value: String(id),
    })) || [];

  const projectOptions =
    projects?.data?.results?.map(({ title, id }: any) => ({
      label: title,
      value: String(id),
    })) || [];

  // Filter compensations by type
  const getCompensationOptionsByType = (type: string) => {
    return (
      compensations?.data?.results
        ?.filter((comp: any) => comp.type?.toLowerCase() === type.toLowerCase())
        ?.map((comp: any) => ({
          label: `${comp.name} - ${comp.percentage ? `${comp.percentage}%` : comp.amount}`,
          value: String(comp.id),
        })) || []
    );
  };

  const basicOptions = getCompensationOptionsByType("basic");
  const housingOptions = getCompensationOptionsByType("housing");
  const transportOptions = getCompensationOptionsByType("transport");
  const mealOptions = getCompensationOptionsByType("meal");
  const miscellaneousOptions = getCompensationOptionsByType("miscellaneous");

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      employee: "",
      employee_number: "",
      surname: "",
      firstname: "",
      position: "",
      grade: "",
      location: "",
      project: "",
      hire_date: "",
      basic: "",
      housing: "",
      transport: "",
      meal: "",
      miscellaneous: "",
    },
  });

  const { handleSubmit, reset } = form;

  const onSubmit = async (data: any) => {
    try {
      // Get the actual compensation values from the selected IDs
      const getCompensationValue = (compensationId: string) => {
        if (!compensationId) return 0;
        const comp = compensations?.data?.results?.find((c: any) => String(c.id) === compensationId);
        if (!comp) return 0;
        return comp.amount || 0;
      };

      const basicValue = getCompensationValue(data.basic);
      const housingValue = getCompensationValue(data.housing);
      const transportValue = getCompensationValue(data.transport);
      const mealValue = getCompensationValue(data.meal);
      const miscellaneousValue = getCompensationValue(data.miscellaneous);

      // Calculate total_allowance and gross_total
      const total_allowance = housingValue + transportValue + mealValue + miscellaneousValue;
      const thirteenth_month = basicValue / 12; // 13th month is typically basic/12
      const gross_total = basicValue + total_allowance + thirteenth_month;

      // Prepare payload with all fields
      const payload = {
        employee: data.employee,
        employee_number: data.employee_number,
        surname: data.surname,
        firstname: data.firstname,
        position: data.position,
        grade: data.grade,
        location: data.location || undefined,
        project: data.project || undefined,
        hire_date: data.hire_date,
        basic: data.basic,
        housing: data.housing,
        transport: data.transport,
        meal: data.meal,
        miscellaneous: data.miscellaneous,
        total_allowance: total_allowance,
        thirteenth_month: thirteenth_month,
        gross_total: gross_total,
      };

      console.log("Submitting compensation spread:", payload);

      await createCompensationSpread(payload);
      toast.success("Compensation spread created successfully");
      reset();
      props.onSuccess();
      props.onCancel();
    } catch (error) {
      toast.error("Failed to create compensation spread");
      console.error("Compensation spread creation error:", error);
    }
  };

  return (
    <Modal
      isOpen={props.isOpen}
      onRequestClose={props.onCancel}
      style={customStyles}
    >
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2 className='font-bold text-[18px] text-center mb-5'>
            Create Compensation Spread
          </h2>

          <div className='flex flex-col gap-4'>
            <div className='grid grid-cols-2 gap-4'>
              <FormInput
                label='Employee ID'
                name='employee'
                required
                placeholder='Enter Employee ID'
              />
              <FormInput
                label='Employee Number'
                name='employee_number'
                required
                placeholder='Enter Employee Number'
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <FormInput
                label='Surname'
                name='surname'
                required
                placeholder='Enter Surname'
              />
              <FormInput
                label='Firstname'
                name='firstname'
                required
                placeholder='Enter Firstname'
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <FormSelect
                label='Position'
                name='position'
                required
                placeholder='Select Position'
                options={positionOptions}
              />
              <FormSelect
                label='Grade'
                name='grade'
                required
                placeholder='Select Grade'
                options={gradeOptions}
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <FormSelect
                label='Location'
                name='location'
                placeholder='Select Location'
                options={locationOptions}
              />
              <FormSelect
                label='Project'
                name='project'
                placeholder='Select Project'
                options={projectOptions}
              />
            </div>

            <FormInput
              label='Hire Date'
              name='hire_date'
              type='date'
              required
              placeholder='Select Hire Date'
            />

            <h3 className='font-semibold text-[16px] mt-2'>
              Compensation Details
            </h3>

            <div className='grid grid-cols-2 gap-4'>
              <FormSelect
                label='Basic Salary'
                name='basic'
                placeholder='Select Basic Compensation'
                options={basicOptions}
              />
              <FormSelect
                label='Housing Allowance'
                name='housing'
                placeholder='Select Housing Compensation'
                options={housingOptions}
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <FormSelect
                label='Transport Allowance'
                name='transport'
                placeholder='Select Transport Compensation'
                options={transportOptions}
              />
              <FormSelect
                label='Meal Allowance'
                name='meal'
                placeholder='Select Meal Compensation'
                options={mealOptions}
              />
            </div>

            <FormSelect
              label='Miscellaneous'
              name='miscellaneous'
              placeholder='Select Miscellaneous Compensation'
              options={miscellaneousOptions}
            />

            <div className='flex items-center justify-between mt-4'>
              <Button
                type='button'
                className='bg-[#FFF2F2] text-primary border-none'
                onClick={() => {
                  reset();
                  props.onCancel();
                }}
              >
                Cancel
              </Button>
              <FormButton loading={isLoading} disabled={isLoading}>
                Create
              </FormButton>
            </div>
          </div>
        </form>
      </Form>
    </Modal>
  );
};

export default CompensationSpreadModal;
