import Card from "components/shared/Card";
import GoBack from "components/shared/GoBack";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { Separator } from "components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "components/ui/table";
import { Textarea } from "components/ui/textarea";
import { useForm } from "react-hook-form";

const InterviewForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    console.log("Submitted Data:", data);
  };

  const ratingSections = [
    {
      title: "Appearance/Corporate Poise",
      description:
        "Appearance and composure in conformity with acceptable standards of the position",
    },
    {
      title: "Oral Communication",
      description:
        "Ability to speak articulately and with clarity displaying good pronunciation and grammar",
    },
    {
      title: "Supervisory Experience and/or Teamwork",
      description: "Ability to supervise and/or work as a team member",
    },
    {
      title: "Work Ethics",
      description:
        "Ability/tendency to maintain AHNI values (excellence, integrity, responsiveness, respect and dedication) and use judgment to execute duties and responsibilities.",
    },
    {
      title: "Analytical thinking",
      description:
        "Capacity to examine and evaluate situations in a logical and rational approach",
    },
    {
      title:
        "Knowledge of international/regional NGO or local organization issues",
      description:
        "Displayed knowledge/understanding of political, social and ethical issues surrounding health related matters and knowledge of and experience with NGO’s interventions.",
    },
    {
      title: "Quality/Relevance of Experience ",
      description:
        "Determined by the length, variety of positions held, quality of experience, industry type and size relevant to position.",
    },
  ];

  return (
    <div className='flex flex-col gap-4'>
      <GoBack />

      <Card>
        <div className='grid grid-cols-2 gap-4'>
          <div className='flex flex-col gap-3'>
            <h2 className='font-semibold'>Name of Candidate</h2>
            <p>James Septimus</p>
          </div>
          <div className='flex flex-col gap-3'>
            <h2 className='font-semibold'>Position Applied</h2>
            <p>STO-PCT Borno</p>
          </div>
          <div className='flex flex-col gap-3'>
            <h2 className='font-semibold'>Name of Interviewer</h2>
            <p>Ali N. Pollock</p>
          </div>
          <div className='flex flex-col gap-3'>
            <h2 className='font-semibold'>Date of Interview</h2>
            <p>24th April, 2024</p>
          </div>
        </div>

        <Separator className='my-6' />
        <div className=''>
          <h2 className='font-semibold'>Key Rating</h2>
        </div>
        <Card className='mt-4'>
          <Table>
            <TableHeader>
              <TableRow className='border-none'>
                <TableCell>Below Average</TableCell>
                <TableCell>Average</TableCell>
                <TableCell>Good</TableCell>
                <TableCell>Very Good</TableCell>
                <TableCell>Outstanding</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className='border-white border-t border-t-gray-200'>
                {[1, 2, 3, 4, 5].map((rating, idx) => (
                  <TableCell key={idx}>
                    <Badge
                      className={`rounded-sm text-black px-12 py-2 bg-[${getColor(
                        rating
                      )}]`}
                    >
                      {rating}
                    </Badge>
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </Card>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className='mt-8 flex flex-col gap-8'
        >
          {ratingSections.map((section, index) => (
            <Card key={index} className='flex flex-col gap-4'>
              <div className='flex flex-col gap-3'>
                <h2 className='font-semibold'>{section.title}</h2>
                <p>{section.description}</p>
              </div>
              <div className=''>
                <p className='text-primary text-sm'>Tick as appropriate</p>
                <div className='flex gap-4 w-full'>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Button
                      key={value}
                      type='button'
                      onClick={() => setValue(`rating-${index}`, value)}
                      className={`px-4 py-2 border w-full ${
                        watch(`rating-${index}`) === value
                          ? "bg-primary text-white"
                          : "bg-gray-200 text-black"
                      }`}
                    >
                      {value}
                    </Button>
                  ))}
                </div>
                {errors[`rating-${index}`] && (
                  <p className='text-red-500 text-sm mt-2'>
                    {/* @ts-ignore */}
                    {errors[`rating-${index}`]?.message}
                  </p>
                )}
              </div>
              <div className=''>
                <label htmlFor={`comments-${index}`} className='font-semibold'>
                  Comments
                </label>
                <Textarea
                  id={`comments-${index}`}
                  {...register(`comments-${index}`, {
                    required: "Comments are required",
                  })}
                  rows={6}
                  className='mt-2'
                />
              </div>
            </Card>
          ))}
          <div className=''>
            <label htmlFor={`recommendations`} className='font-semibold'>
              Recommendations
            </label>
            <Textarea
              id={`recommendations`}
              {...register(`recommendations`, {
                required: "Comments are required",
              })}
              rows={6}
              className='mt-2'
            />
          </div>
          <div className=''>
            <label htmlFor={`preference`} className='flex items-center gap-2'>
              <input
                type='checkbox'
                id={`preference`}
                {...register(`preference`)}
              />
              Mark as Preferred
            </label>
          </div>
          <div className='flex w-full justify-end mt-4'>
            <Button
              type='submit'
              className='bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary transition duration-300 ease-in-out'
            >
              Complete Interview
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

const getColor = (rating: number) => {
  switch (rating) {
    case 1:
      return "#FECDCA";
    case 2:
      return "#F5DEA2";
    case 3:
      return "#F2BB31";
    case 4:
      return "#BCFBAE";
    case 5:
      return "#8DF384";
    default:
      return "#CCC";
  }
};

export default InterviewForm;
