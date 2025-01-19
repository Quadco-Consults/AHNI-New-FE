import FormInput from "atoms/FormInput";
import FormRadio from "atoms/FormRadio";
import FormSelect from "atoms/FormSelect";
import Card from "components/shared/Card";
import GoBack from "components/shared/GoBack";
import { Label } from "components/ui/label";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
  DialogDescription,
  DialogClose,
} from "components/ui/dialog";
import logoPng from "assets/imgs/logo.png";
import { LoadingSpinner } from "components/shared/Loading";
import { Checkbox } from "components/ui/checkbox";
import { StakeholderResultsData } from "definations/program-types/stakeholder";
import FormButton from "atoms/FormButton";

const CreateTimesheet = () => {
  // const [matchedStakeholdersData, setMatchedStakeholdersData] = useState<
  //     StakeholderResultsData[]
  // >([]);

  const form = useForm<{ submitted_employees: string[] }>({
    defaultValues: {
      submitted_employees: [],
    },
  });

  // const { watch } = form;

  // useEffect(() => {
  //     const matchedStakeholders =
  //         employees?.filter((stakeholder: StakeholderResultsData) =>
  //             watch("submitted_employees").includes(stakeholder?.id)
  //         ) || [];
  //     setMatchedStakeholdersData(matchedStakeholders);
  // }, [watch("submitted_employees")]);

  // return <></>;

  return (
    <div className='space-y-4'>
      <GoBack />

      <Card className='space-y-8'>
        <h4 className='font-medium text-lg'>Create Timesheet</h4>

        <Form {...form}>
          <form className='space-y-10'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
              <FormInput name='name' label='Project Name' required />
              <FormSelect
                options={[]}
                name='activity_name'
                label='Activity Name'
                required
              />
              <FormSelect
                options={[]}
                name='activity_type'
                label='Type of Activity'
                required
              />
            </div>

            <FormRadio
              label='Applicable Employees'
              name='applicable_employee'
              options={[
                { label: "All Employees", value: "all" },
                {
                  label: "Selected Employees",
                  value: "selected",
                },
              ]}
            />

            <div className='space-y-4'>
              <Label>Select Applicable Employees</Label>

              {/* <div className="gap-4 grid grid-cols-1 md:grid-cols-3">
                                {matchedStakeholdersData.map(
                                    (employee, index) => (
                                        <div
                                            key={index}
                                            className="p-5 space-y-3 text-xs bg-[#F8F4EB] rounded-lg"
                                        >
                                            <h6 className="text-base text-yellow-600">
                                                {employee?.stakeholder_name}
                                            </h6>

                                            <div className="grid grid-cols-2 gap-3 text-xs">
                                                <div>
                                                    <h4 className="font-semibold">
                                                        Gender:
                                                    </h4>
                                                    <p>{employee?.gender}</p>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold">
                                                        Designation:
                                                    </h4>
                                                    <p>
                                                        {employee?.designation}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 text-xs">
                                                <div>
                                                    <h4 className="font-semibold">
                                                        Phone Number:
                                                    </h4>
                                                    <p>
                                                        {employee?.phone_number}
                                                    </p>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold">
                                                        E-mail:
                                                    </h4>
                                                    <p>{employee?.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div> */}

              <div>
                <Dialog>
                  <DialogTrigger>
                    <div className='text-[#DEA004] font-medium border shadow-sm py-2 px-5 rounded-lg text-sm'>
                      Click to add more employees
                    </div>
                  </DialogTrigger>
                  <DialogContent className='max-w-6xl max-h-[700px] overflow-auto'>
                    <DialogHeader className='mt-10 space-y-5 text-center'>
                      <img
                        src={logoPng}
                        alt='logo'
                        className='mx-auto'
                        width={150}
                      />
                      <DialogTitle className='text-2xl text-center'>
                        Select Employees
                      </DialogTitle>
                      <DialogDescription className='text-center'>
                        You can search with employee name
                      </DialogDescription>
                    </DialogHeader>
                    <div className='w-1/3 mx-auto'>
                      <FormInput
                        name='search'
                        type='search'
                        placeholder='Search employee'
                      />
                    </div>

                    {/* <div className="space-y-5 ">
                                            {stakeholderQueryResult?.isLoading ? (
                                                <LoadingSpinner />
                                            ) : (
                                                <FormField
                                                    control={form.control}
                                                    name="submitted_employees"
                                                    render={() => (
                                                        <FormItem className="grid grid-cols-2 gap-5 p-5 mt-10 bg-gray-100 rounded-lg shadow-inner md:grid-cols-3">
                                                            {employees?.map(
                                                                (
                                                                    stakeholder: StakeholderResultsData
                                                                ) => (
                                                                    <FormField
                                                                        key={
                                                                            stakeholder?.id
                                                                        }
                                                                        control={
                                                                            form.control
                                                                        }
                                                                        name="submitted_employees"
                                                                        render={({
                                                                            field,
                                                                        }) => {
                                                                            return (
                                                                                <FormItem
                                                                                    key={
                                                                                        stakeholder.id
                                                                                    }
                                                                                    className="p-5 space-y-3 text-xs bg-white rounded-lg"
                                                                                >
                                                                                    <div className="flex items-center gap-4">
                                                                                        <FormControl>
                                                                                            <Checkbox
                                                                                                checked={field.value?.includes(
                                                                                                    stakeholder?.id
                                                                                                )}
                                                                                                onCheckedChange={(
                                                                                                    checked
                                                                                                ) => {
                                                                                                    return checked
                                                                                                        ? field.onChange(
                                                                                                              [
                                                                                                                  ...field.value,
                                                                                                                  stakeholder?.id,
                                                                                                              ]
                                                                                                          )
                                                                                                        : field.onChange(
                                                                                                              field.value?.filter(
                                                                                                                  (
                                                                                                                      value
                                                                                                                  ) =>
                                                                                                                      value !==
                                                                                                                      stakeholder?.id
                                                                                                              )
                                                                                                          );
                                                                                                }}
                                                                                            />
                                                                                        </FormControl>
                                                                                        <h6 className="text-base text-yellow-600">
                                                                                            {
                                                                                                stakeholder?.stakeholder_name
                                                                                            }
                                                                                        </h6>
                                                                                    </div>
                                                                                    <div className="text-sm">
                                                                                        <h4 className="font-semibold">
                                                                                            Institution/Organization:
                                                                                        </h4>
                                                                                        <p>
                                                                                            {
                                                                                                stakeholder?.institution_organization
                                                                                            }
                                                                                        </p>
                                                                                    </div>

                                                                                    <div className="grid grid-cols-2 gap-3 text-xs">
                                                                                        <div>
                                                                                            <h4 className="font-semibold">
                                                                                                Gender:
                                                                                            </h4>
                                                                                            <p>
                                                                                                {
                                                                                                    stakeholder?.gender
                                                                                                }
                                                                                            </p>
                                                                                        </div>
                                                                                        <div>
                                                                                            <h4 className="font-semibold">
                                                                                                Designation:
                                                                                            </h4>
                                                                                            <p>
                                                                                                {
                                                                                                    stakeholder?.designation
                                                                                                }
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className="grid grid-cols-2 gap-3 text-xs">
                                                                                        <div>
                                                                                            <h4 className="font-semibold">
                                                                                                Phone
                                                                                                Number:
                                                                                            </h4>
                                                                                            <p>
                                                                                                {
                                                                                                    stakeholder?.phone_number
                                                                                                }
                                                                                            </p>
                                                                                        </div>
                                                                                        <div>
                                                                                            <h4 className="font-semibold">
                                                                                                E-mail:
                                                                                            </h4>
                                                                                            <p>
                                                                                                {
                                                                                                    stakeholder?.email
                                                                                                }
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                </FormItem>
                                                                            );
                                                                        }}
                                                                    />
                                                                )
                                                            )}
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            )}

                                            <div className="flex justify-end">
                                                <div className="flex items-center gap-4">
                                                    <h6 className="text-primary">
                                                        {
                                                            watch(
                                                                "submitted_employees"
                                                            )?.length
                                                        }{" "}
                                                        categories Selected
                                                    </h6>
                                                    <DialogClose>
                                                        <div className="flex items-center px-4 py-3 text-sm font-medium rounded-md bg-primary text-primary-foreground h-11 hover:opacity-60">
                                                            Save & Continue
                                                        </div>
                                                    </DialogClose>
                                                </div>
                                            </div>
                                        </div> */}
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
              <FormRadio
                label='Date'
                name='date'
                options={[
                  { label: "Single Date", value: "all" },
                  { label: "Date Range", value: "selected" },
                ]}
              />
              <FormInput
                name='start_date'
                type='date'
                label='Start Date'
                required
              />
              <FormInput
                name='end_date'
                type='date'
                label='End Date'
                required
              />
            </div>
            <div className='flex justify-between gap-5 py-5'>
              <FormButton
                // onClick={goBack}
                type='button'
                className='bg-[#FFF2F2] text-primary dark:text-gray-500'
              >
                Cancel
              </FormButton>

              <FormButton>Create</FormButton>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default CreateTimesheet;
