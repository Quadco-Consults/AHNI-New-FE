import logoPng from "assets/imgs/logo.png";
import { ScrollArea } from "components/ui/scroll-area";
import { Button } from "components/ui/button";
import { Checkbox } from "components/ui/checkbox";
import { MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import { useDispatch } from "react-redux";
import { addPartner } from "store/formData/project-values";
import { closeDialog } from "store/ui";
import { nigerianStates } from "lib/index";
import { useGetAllPartnersManager } from "@/features/modules/controllers/project/partnerController";
import { useState } from "react";
import { TPartnerData } from "@/features/projects/types/project/partners";
import { useAppSelector } from "hooks/useStore";
import Pagination from "components/Pagination";
import { LoadingSpinner } from "components/Loading";

export default function ConsortiumPartnerModal() {
  const [state, setState] = useState("");

  const { consortiumPartners } = useAppSelector(
    (state) => state.consortiumPartner
  );

  const [partners, setPartners] = useState<TPartnerData[]>([
    ...consortiumPartners,
  ]);

  const handleTogglePartner = (value: boolean, partner: TPartnerData) => {
    if (value) {
      setPartners([...partners, partner]);
    } else {
      setPartners(partners.filter((_partner) => _partner.id !== partner.id));
    }
  };

  const dispatch = useDispatch();

  const [page, setPage] = useState(1);

  const { data: partner, isLoading: isFetching } = useGetAllPartnersManager({
    page,
    size: 12,
    search: "",
    state,
  });

  const onSubmit = () => {
    dispatch(addPartner(partners));

    dispatch(closeDialog());
  };

  return (
    <div className='flex flex-col mt-5 items-center justify-center w-full h-[80vh] '>
      <ScrollArea className='h-[90%] space-y-5 pb-5'>
        <div className='flex flex-col items-center justify-between'>
          <div>
            <img src={logoPng} alt='logo' width={150} />
          </div>
          <h4 className='mt-5 text-lg font-bold'>Select Consortium partners</h4>
          <p className='mt-5 text-muted-foreground'>
            You can search for partners based on their name and location
          </p>

          <div className='flex overflow-auto gap-2 mt-6 items-center w-full max-w-sm'>
            <Select onValueChange={(value) => setState(value)}>
              <SelectTrigger>
                <SelectValue placeholder='Select State' />
              </SelectTrigger>

              <SelectContent>
                {nigerianStates?.map((partner: string, index: number) => (
                  <SelectItem key={index} value={partner}>
                    {partner}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant='ghost' onClick={() => setState("")}>
              Clear Filter
            </Button>
          </div>
        </div>

        <div>
          {isFetching ? (
            <LoadingSpinner />
          ) : partner?.data.results.length === 0 ? (
            <div className='space-y-3 mt-10 text-center'>
              <h3 className='font-bold text-lg'>No Partners Found</h3>
              <p className='text-gray-500'>
                No partners found at the moment. When you create <br />
                and add partners, they will be displayed here.
              </p>
            </div>
          ) : (
            <div className='flex overflow-auto max-w-[450px]  gap-5 bg-gray-100 mt-10 p-5 rounded-lg shadow-inne'>
              {partner?.data.results.map(({ id, name, state, ...rest }) => {
                const checked = partners.findIndex((item) => item.id === id);

                return (
                  <div className='flex p-5 bg-white border rounded-lg gap-5 items-center w-fit '>
                    <Checkbox
                      checked={checked > -1 ? true : false}
                      onCheckedChange={(value: boolean) =>
                        handleTogglePartner(value, {
                          id,
                          name,
                          state,
                          ...rest,
                        })
                      }
                    />

                    <div className='text-sm space-y-1'>
                      <h4>{name}</h4>
                      <p className='flex items-center gap-1 w-full whitespace-nowrap'>
                        <span>
                          <MapPin size={15} />
                        </span>
                        {state}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <Pagination
          total={partner?.data.pagination.count ?? 0}
          itemsPerPage={partner?.data.pagination.page_size ?? 0}
          onChange={(page: number) => setPage(page)}
        />
      </ScrollArea>
      <div className='flex justify-end w-full my-5'>
        <div className='flex items-center gap-x-4'>
          <p className='text-sm font-medium text-primary'>
            {partners.length} Criteria Selected
          </p>
          <Button type='button' onClick={onSubmit}>
            Save & Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
