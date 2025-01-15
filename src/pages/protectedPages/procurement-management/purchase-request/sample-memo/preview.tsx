import React from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "components/ui/separator";
import Card from "components/shared/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "components/ui/table";
import { Button } from "components/ui/button";
import { Save } from "lucide-react";
import { generatePath, Link } from "react-router-dom";
import { RouteEnum } from "constants/RouterConstants";

// Sample Checkbox component (replace with your actual Checkbox component)
const Checkbox = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => <input type='checkbox' {...props} ref={ref} />);

const checkboxesUSAID = [
  { name: "ab_a", label: "A/B and A" },
  { name: "art_drugs", label: "ART Drugs" },
  { name: "art_services", label: "ART Services" },
  { name: "blood_safety", label: "Blood Safety" },
  { name: "ct", label: "C&T" },
  { name: "injection_safety", label: "Injection Safety" },
  { name: "inst_cap_building", label: "Inst. Cap. Building" },
  { name: "lab", label: "Lab" },
  { name: "cba_2", label: "CBA 2" },
  { name: "other_prevention", label: "Other Prevention" },
  { name: "ovc", label: "OVC" },
  { name: "palliative_care", label: "Palliative Care" },
  { name: "pmtct", label: "PMTCT" },
  { name: "rh_hiv", label: "RH-HIV" },
  { name: "si", label: "SI" },
  { name: "tb_care_ap", label: "TB CARE (AP" },
  { name: "tb_hiv", label: "TB/HIV" },
  { name: "tb_pure", label: "TB Pure" },
];

const checkboxesSpecialProjects = [
  { name: "scharp_plus", label: "SCHARP Plus" },
  { name: "n_thrip", label: "N-THRIP" },
  { name: "malaria_crs", label: "Malaria (CRS)" },
  { name: "nidar_plus", label: "NiDAR Plus" },
  { name: "gf_nahi_project", label: "GF NAHI Project" },
];

// Define Zod Schema
const UploadSchema = z.object({
  USAID: z
    .array(
      z.object({
        name: z.string(),
        selected: z.boolean(),
      })
    )
    .nonempty(),
  specialProjects: z
    .array(
      z.object({
        name: z.string(),
        selected: z.boolean(),
      })
    )
    .nonempty(),
  integratedTraining: z.string().nonempty(), // For radio button selection
});

type FormData = z.infer<typeof UploadSchema>;

const CheckboxForm = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(UploadSchema),
    defaultValues: {
      USAID: checkboxesUSAID.map(({ name }) => ({
        name,
        selected: false,
      })),
      specialProjects: checkboxesSpecialProjects.map(({ name }) => ({
        name,
        selected: false,
      })),
      integratedTraining: "", // Default empty for radio button
    },
  });

  const { control, handleSubmit } = form;

  const onSubmit = (data: FormData) => {
    console.log("Form Data:", data);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-10'>
        <Card className='border-yellow-darker flex flex-col gap-2 justify-between'>
          <h2 className='font-semibold text-base'>Program Areas</h2>
          <div className='flex justify-between gap-2'>
            <p>
              Is the training an integrated training (contains more than one
              program area)?
            </p>
            <div className='flex gap-5 justify-between'>
              <div className='flex items-center space-x-2 justify-center'>
                <Controller
                  name='integratedTraining'
                  control={control}
                  render={({ field }) => (
                    <>
                      <input
                        type='radio'
                        value='true'
                        className='accent-purple-500 top-auto'
                        checked={field.value === "true"}
                        onChange={() => field.onChange("true")}
                      />
                      <label htmlFor='yes'>Yes</label>
                    </>
                  )}
                />
              </div>
              <div className='flex items-center space-x-2'>
                <Controller
                  name='integratedTraining'
                  control={control}
                  render={({ field }) => (
                    <>
                      <input
                        type='radio'
                        value='false'
                        className='accent-primary top-auto'
                        checked={field.value === "false"}
                        onChange={() => field.onChange("false")}
                      />
                      <label htmlFor='no'>No</label>
                    </>
                  )}
                />
              </div>
            </div>
          </div>
          <Separator className='my-4' />
          <div className='flex flex-col gap-5'>
            <h2 className='font-semibold text-base'>
              Please select Program Area(s):
            </h2>
            {/* USAID Section */}
            <div>
              <h2 className='font-semibold text-base my-3'>USAID</h2>
              <div className='grid grid-cols-4 gap-4'>
                {checkboxesUSAID.map(({ label, name }, index) => (
                  <div key={name} className='flex items-center gap-2'>
                    <Controller
                      name={`USAID.${index}.selected`}
                      control={control}
                      render={({ field }) => (
                        <>
                          <Checkbox
                            id={`usaid-${index}`}
                            checked={field.value} // Use checked to bind state
                            onChange={(e) => field.onChange(e.target.checked)} // Update field value on change
                          />
                          <label htmlFor={`usaid-${index}`}>{label}</label>
                        </>
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Special Projects Section */}
            <div>
              <h2 className='font-semibold text-base my-3'>SPECIAL PROJECTS</h2>
              <div className='grid grid-cols-5 gap-4'>
                {checkboxesSpecialProjects.map(({ label, name }, index) => (
                  <div key={name} className='flex items-center gap-2'>
                    <Controller
                      name={`specialProjects.${index}.selected`}
                      control={control}
                      render={({ field }) => (
                        <>
                          <Checkbox
                            id={`special-${index}`}
                            checked={field.value} // Use checked to bind state
                            onChange={(e) => field.onChange(e.target.checked)} // Update field value on change
                          />
                          <label htmlFor={`special-${index}`}>{label}</label>
                        </>
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Separator className='my-4' />
        </Card>
        <div className=''>
          <Table>
            {/* Main Table Header */}
            <TableHeader>
              <TableRow>
                <TableCell className='text-center'>Main Column 1 </TableCell>
                <TableCell className='text-center'>Main Column 2</TableCell>
              </TableRow>
            </TableHeader>

            {/* Main Table Body */}
            <TableBody>
              <TableRow>
                {/* First Column with Nested Table */}
                <TableCell className='p-0'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableCell>Child 1A</TableCell>
                        <TableCell>Child 1B</TableCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Row 1, Child 1A</TableCell>
                        <TableCell>Row 1, Child 1B</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Row 2, Child 1A</TableCell>
                        <TableCell>Row 2, Child 1B</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableCell>

                {/* Second Column with Nested Table */}
                <TableCell className='p-0'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableCell>Child 2A</TableCell>
                        <TableCell>Child 2B</TableCell>
                        <TableCell>Child 2C</TableCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Row 1, Child 2A</TableCell>
                        <TableCell>Row 1, Child 2B</TableCell>
                        <TableCell>Row 1, Child 2C</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Row 2, Child 2A</TableCell>
                        <TableCell>Row 2, Child 2B</TableCell>
                        <TableCell>Row 2, Child 2C</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className=''>
          <h2 className='font-semibold text-base my-3'>SPECIAL PROJECTS</h2>
          <Table>
            {/* Main Table Header */}
            <TableHeader>
              <TableRow>
                <TableCell className='text-center'>Main Column 1 </TableCell>
                <TableCell className='text-center'>Main Column 2</TableCell>
              </TableRow>
            </TableHeader>

            {/* Main Table Body */}
            <TableBody>
              <TableRow>
                {/* First Column with Nested Table */}
                <TableCell className='p-0'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableCell>Child 1A</TableCell>
                        <TableCell>Child 1B</TableCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Row 1, Child 1A</TableCell>
                        <TableCell>Row 1, Child 1B</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Row 2, Child 1A</TableCell>
                        <TableCell>Row 2, Child 1B</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableCell>

                {/* Second Column with Nested Table */}
                <TableCell className='p-0'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableCell>Child 2A</TableCell>
                        <TableCell>Child 2B</TableCell>
                        <TableCell>Child 2C</TableCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Row 1, Child 2A</TableCell>
                        <TableCell>Row 1, Child 2B</TableCell>
                        <TableCell>Row 1, Child 2C</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Row 2, Child 2A</TableCell>
                        <TableCell>Row 2, Child 2B</TableCell>
                        <TableCell>Row 2, Child 2C</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        {/* Submit Button */}
        <div className='w-full px-4'>
          <Link className='w-fit' to={generatePath(RouteEnum.PREVIEW_LETTER)}>
            <Button
              type='submit'
              className='mt-4 px-4 py-2 bg-alternate text-primary rounded w-full'
            >
              <Save size={20} />
              Save
            </Button>
          </Link>
        </div>
      </form>
      <Card className='border-yellow-darker space-y-3 mt-8 w-full max-w-[900px] mx-auto'>
        <div className='flex justify-between'>
          <div className='flex flex-col gap-3'>
            {" "}
            <div className='flex items-center gap-5'>
              <h4 className='w-full max-w-[151px] font-medium text-[14px]'>
                Signature
              </h4>
              <h4>{"equipment.name"}</h4>
            </div>
            <div className='flex items-center gap-5'>
              <h4 className='w-full max-w-[151px] font-medium text-[14px]'>
                Name of Programs Representative
              </h4>
              <h4>{"equipment.manufacturer"}</h4>
            </div>
            <div className='flex items-center gap-5'>
              <h4 className='w-full max-w-[151px] font-medium text-[14px]'>
                Date
              </h4>
              <h4>{"equipment.year"}</h4>
            </div>
          </div>{" "}
          <div className='flex flex-col gap-3'>
            {" "}
            <div className='flex items-center gap-5'>
              <h4 className='w-full max-w-[151px] font-medium text-[14px]'>
                Signature
              </h4>
              <h4>{"equipment.name"}</h4>
            </div>
            <div className='flex items-center gap-5'>
              <h4 className='w-full max-w-[151px] font-medium text-[14px]'>
                Name of Programs Representative
              </h4>
              <h4>{"equipment.manufacturer"}</h4>
            </div>
            <div className='flex items-center gap-5'>
              <h4 className='w-full max-w-[151px] font-medium text-[14px]'>
                Date
              </h4>
              <h4>{"equipment.year"}</h4>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default CheckboxForm;
