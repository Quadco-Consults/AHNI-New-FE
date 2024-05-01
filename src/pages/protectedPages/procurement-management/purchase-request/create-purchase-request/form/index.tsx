import FormInput from 'atoms/FormInput';
import FormSelect from 'atoms/FormSelect';
import AddSquareIcon from 'components/icons/AddSquareIcon';
import LongArrowRight from 'components/icons/LongArrowRight';
import { Button } from 'components/ui/button';
import { Form } from 'components/ui/form';
import { Label } from 'components/ui/label';
import { useFieldArray, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
const CreatePurchaseRequestForm = () => {
  const form = useForm({
    defaultValues: {
      title: [
        {
          descriptionOfItems: '',
          numberOfPersons: '',
          numberOfDays: '',
          fco: '',
          unitCost: '',
          total: '',
        },
      ],
    },
  });

  const navigate = useNavigate();

  const { control, handleSubmit } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'title',
  });

  // const {
  //   fields: keystaff,
  //   append: appendKeystaff,
  //   remove: removeKeystaff,
  // } = useFieldArray({
  //   control,
  //   name: "keystaff",
  // });



  const handleAppendForm = (data: any) => {
    console.table('>>>>>>>>>>>>>>>>', data);
  };
  const onSubmit = (data: any) => {
    console.table('>>>>>>>>>>>>>>>>', data);
    navigate(-1)
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-5">
            <FormInput
              label="Date of Request"
              name="dor"
              placeholder="01/01/2024"
            />
            <FormInput
              label="Dequired Date"
              name="rd"
              placeholder="01/01/2024"
            />
          </div>
          <div className="grid grid-cols-2 gap-5">
            <FormSelect label="Requesting Department" name="rdd" required />
            <FormSelect label="Deliver To" name="dt" required />
          </div>
          <table className="">
            <thead>
              <tr className="text-amber-500 whitespace-nowrap border-b-2 py-4 text-xs font-semibold">
                <th className='py-4'>S/N</th>
                <th className='py-4'>NO of Persons/Unit</th>
                <th className='py-4'>Description of items/services</th>
                <th className='py-4'>No of Days</th>
                <th className='py-4'>FCO</th>
                <th className='py-4'>Unit Cost</th>
                <th className='py-4'>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="w-full">
                <td className='w-fit text-center py-4 '><span className='p-2 px-4 text-xs bg-black text-white rounded'>1.</span></td>
                <td className='w-fit text-center py-4'>
                  <FormInput label="" name="dor" placeholder="Title" />
                </td>
                <td className='w-fit text-center py-4'></td>
                <td className='w-fit text-center py-4'></td>
                <td className='w-fit text-center py-4'></td>
                <td className='w-fit text-center py-4'></td>
                <td className='flex items-center justify-center text-center py-4'>
                  <Button
                    type="button"
                    className="text-primary bg-[#FFF2F2] flex gap-2 items-center justify-center"
                    onClick={handleAppendForm}
                  >
                    <AddSquareIcon />
                    Add
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="flex items-center justify-end">
            <div className="text-primary border-primary flex items-center justify-start gap-2 rounded border-2 px-6 py-3 text-base font-semibold">
              <span>Total:</span>
              <span>N0.00</span>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <Label className="text-red-500 text-lg font-semibold">
              Requested By
            </Label>
            <div className="grid grid-cols-2 gap-5">
              <FormInput label="Name" name="dor" placeholder="01/01/2024" />
              <FormInput label="Name" name="rd" placeholder="01/01/2024" />
            </div>
            <div className="grid grid-cols-2 gap-5">
              <FormSelect label="select" name="rdd" required />
              <FormSelect label="select" name="dt" required />
            </div>
          </div>
          <div className="flex items-center justify-end">
            <Button className="flex items-center justify-center gap-2">
              Submit
              <LongArrowRight />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreatePurchaseRequestForm;
