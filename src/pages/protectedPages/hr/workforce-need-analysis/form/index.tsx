// import { zodResolver } from "@hookform/resolvers/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelectField";
import Card from "components/shared/Card";
// import AddSquareIcon from "components/icons/AddSquareIcon";
import GoBack from "components/shared/GoBack";
import { LoadingSpinner } from "components/shared/Loading";

// import { Button } from "components/ui/button";
import { Form } from "components/ui/form";
import { SelectContent, SelectItem } from "components/ui/select";
import { Separator } from "components/ui/separator";
import { HrRoutes } from "constants/RouterConstants";
import { LocationResultsData } from "definations/configs/location";
import { PositionsResultsData } from "definations/configs/positions";
import { workforceNeedAnalysisSchema } from "definations/hr-validator";

import { UploadIcon } from "lucide-react";
// import { ItemsResultsData } from "definations/configs/itmes";
// import { SampleMemoSchema } from "definations/procurement-validator";
// import { MinusCircle } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useGetDepartmentPaginateQuery } from "services/configs/departments";
import { useGetLocationListQuery } from "services/configs/locationApi";
import { useGetPositionPaginateQuery } from "services/configs/positions"; 
import { useCreateWorkforceNeedAnalysisMutation } from "services/hrApi/hr-workforce-need-analysis";
import { z } from "zod";

export type TFormValues = z.infer<typeof workforceNeedAnalysisSchema>;
const CreateActivityMemo = () => {
  const form = useForm<TFormValues>({
      resolver: zodResolver(workforceNeedAnalysisSchema),
      defaultValues: {
        current_staff_count: 0,
        wisn_required_staff_count: 0, 
        shortage_excess_count: 0, 
        workforce_problem: "", 
        wisn_ratio: "", 
        workload_problem: "", 
        position: "", 
        location: "", 
      },
    });
    const [createWorkforceNeedAnalysis, {isLoading: isCreatingLoading}] = useCreateWorkforceNeedAnalysisMutation()
  const navigate = useNavigate();
 
  const { data: locations, isLoading: locationIsLoading } =
    useGetLocationListQuery({ 
    }); 
  const {data: positions, isLoading: positionIsLoading} = useGetPositionPaginateQuery({})
  const { handleSubmit } = form;
 

  const onSubmit: SubmitHandler<TFormValues> = async (data: any) => {
     
    await createWorkforceNeedAnalysis(data).unwrap();
    navigate(HrRoutes.WORKFORCE_NEED_ANALYSIS); 
  }; 

  const problemTypes = [
    {value: "SHORTAGE", label: "Shortage"},
    {value: "EXCESS", label: "Excess"},
  ]
  const loadProblemTypes = [
    {value: "HIGH", label: "High"},
    {value: "BALANCE", label: "Balance"},
    {value: "NONE", label: "None"},
  ]
  return (
    <div className=''>
      <GoBack />

      <div className='pt-20'>
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col gap-6'
          >
            <div className='grid gap-5'>
              <FormSelect label='Position' name='position' required>
                <SelectContent>
                  {positionIsLoading ? (
                    <LoadingSpinner />
                  ) : (
                    positions?.data?.results?.map(
                      (position: PositionsResultsData) => (
                        <SelectItem key={position?.id} value={position?.id}>
                          {position?.name}
                        </SelectItem>
                      )
                    )
                  )}  
                </SelectContent>
              </FormSelect>{" "}
              <FormSelect label='Location' name='location' required>
                <SelectContent>
                   {locationIsLoading ? (
                    <LoadingSpinner />
                  ) : (
                    locations?.data?.results?.map(
                      (location: LocationResultsData) => (
                        <SelectItem key={location?.id} value={location?.id}>
                          {location?.name}
                        </SelectItem>
                      )
                    )
                  )}  
                </SelectContent>
              </FormSelect>{" "}
            </div>
            <Card>
              <span className='text-p'>Staff Information</span>
              <div className='grid grid-cols-3 gap-5'>
                <FormInput
                  label='Current Staff Count'
                  name='current_staff_count'
                  type='number'
                  required
                />
                <FormInput
                  label='Required Staff Based on WISN'
                  name='wisn_required_staff_count'
                  type='number'
                  required
                />
                <FormInput
                  label='Shortage or excess count'
                  name='shortage_excess_count'
                  type='number'
                  required
                />
              </div>
              <div className='grid grid-cols-3 gap-5 mt-8'>
                <FormSelect 
                  label='Workforce Problem'
                  name="workforce_problem"
                  options={problemTypes}
                />
                 
                <FormInput
                  label='WISN Ratio'
                  name='wisn_ratio'
                  type='text'
                  required
                />
                <FormSelect 
                  label='Workload Problem'
                  name="workload_problem"
                  options={loadProblemTypes}
                />
              </div>
            </Card>

            <Separator className='my-4' />
            <div className='flex justify-end'>
              <FormButton
                // loading={isLoading}
                // disabled={isLoading}
                type='submit'
                className='flex items-center justify-center gap-2'
              >
                <UploadIcon />
                Submit
              </FormButton>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateActivityMemo;
