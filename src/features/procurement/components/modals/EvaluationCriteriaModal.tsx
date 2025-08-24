import logoPng from "assets/imgs/logo.png";
import { ScrollArea } from "components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import { Checkbox } from "components/ui/checkbox";
import { useEffect, useMemo, useState } from "react";
import { LoadingSpinner } from "components/Loading";
import FormButton from "@/components/FormButton";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog } from "store/ui";
// import { useGetAllSupervisionCriteria } from "@/features/modules/controllers/program/supervision-criteria";
// import { useGetAllSupervisionCategory } from "@/features/modules/controllers/program/supervision-category";
import { Button } from "components/ui/button";
import Pagination from "components/Pagination";
import DeleteIcon from "components/icons/DeleteIcon";
import {
  useGetAllSupervisionCategory,
  useGetAllSupervisionCriteriaManager,
} from "@/features/modules/controllers";

export default function EvaluationCriteriaModal() {
  const [page, setPage] = useState(1);

  const [evaluationCategory, setEvaluationCategory] = useState("");

  const dialogProps = useAppSelector((state) => state.ui.dailog.dialogProps);

  const { data: category, isLoading: isCategoryLoading } =
    useGetAllSupervisionCategory({
      page: 1,
      size: 2000000,
    });

  const categoryOptions = useMemo(
    () =>
      category?.data.results.map(({ name, id }) => ({
        label: name,
        value: id,
      })),
    [category]
  );

  const { data: criteria, isFetching: isCriteriaLoading } =
    useGetAllSupervisionCriteriaManager({
      page,
      size: 12,
      evaluation_category: evaluationCategory,
    });

  const [chosenCriterias, setChosenCriterias] = useState<
    {
      id: string;
      name: string;
    }[]
  >([]);

  const dispatch = useAppDispatch();

  const handleChangeCheck = (
    checkedValue: boolean | string,
    name: string,
    id: string
  ) => {
    if (checkedValue) {
      setChosenCriterias([...chosenCriterias, { id, name }]);
    } else {
      setChosenCriterias(
        chosenCriterias.filter((criteria) => criteria.id !== id)
      );
    }
  };

  useEffect(() => {
    const prevFormData = JSON.parse(
      sessionStorage.getItem("compositionData") || "{}"
    );

    if (prevFormData) {
      setChosenCriterias(
        prevFormData.objectives || (dialogProps?.data as any) || []
      );
    }
  }, []);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const prevFormData = JSON.parse(
      sessionStorage.getItem("compositionData") || "{}"
    );

    const formData = {
      ...prevFormData,
      objectives: chosenCriterias,
    };

    sessionStorage.setItem("compositionData", JSON.stringify(formData));

    dispatch(closeDialog());
  };

  return (
    <form onSubmit={onSubmit}>
      <div className='flex flex-col mt-10 items-center justify-center w-full h-[80vh] '>
        <ScrollArea className='h-[90%]'>
          <div className='flex flex-col items-center justify-between'>
            <div>
              <img src={logoPng} alt='logo' width={150} />
            </div>
            <h4 className='mt-8 text-lg font-bold'>Evaluation Criteria</h4>
            <p className='mt-5 text-muted-foreground'>
              You can switch between evaluation categories and select all
              relevant questions
            </p>

            <div className='w-8/12 mt-6 flex items-center gap-2'>
              <Select
                onValueChange={(value) => {
                  setEvaluationCategory(value);
                }}
                value={evaluationCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select evaluation category' />
                </SelectTrigger>
                <SelectContent>
                  {isCategoryLoading ? (
                    <LoadingSpinner />
                  ) : (
                    categoryOptions?.map(({ label, value }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
                {evaluationCategory && (
                  <Button
                    variant='ghost'
                    onClick={() => setEvaluationCategory("")}
                  >
                    <DeleteIcon /> Clear Filter
                  </Button>
                )}
              </Select>
            </div>
          </div>

          <h2 className='text-center my-10 text-yellow-500'>
            Management System (Assess every 6 months; first visit at the
            beginning of the FY and first visit after SAPR)
          </h2>

          {isCriteriaLoading ? (
            <LoadingSpinner />
          ) : (
            <div className='grid grid-cols-3 gap-5 bg-gray-100 p-5 rounded-lg'>
              {criteria?.data.results.map(({ name, id }) => {
                const isChecked = chosenCriterias?.find(
                  (criteria) => criteria.id === id
                );

                return (
                  <div className='flex items-center gap-3 shadow-sm bg-white p-5 border rounded-lg'>
                    <Checkbox
                      checked={isChecked ? true : false}
                      onCheckedChange={(value) => {
                        handleChangeCheck(value, name, id);
                      }}
                      value={id}
                    />
                    <h4>{name}</h4>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        <Pagination
          total={criteria?.data.pagination.count ?? 0}
          itemsPerPage={criteria?.data.pagination.page_size ?? 0}
          onChange={(page: number) => setPage(page)}
        />

        <div className='flex justify-end w-full my-5'>
          <div className='flex items-center gap-x-4'>
            <p className='text-sm font-medium text-primary'>
              {/* {chosenCriterias?.length} Criteria Selected */}
            </p>
            <Button variant='ghost' onClick={() => dispatch(closeDialog())}>
              Cancel
            </Button>
            <FormButton type='submit'>Save & Continue</FormButton>
          </div>
        </div>
      </div>
    </form>
  );
}
