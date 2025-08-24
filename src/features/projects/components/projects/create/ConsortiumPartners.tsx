"use client";

import { Label } from "components/ui/label";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import LocationSvg from "assets/svgs/LocationSvg";
import { Button } from "components/ui/button";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import { useFormContext } from "react-hook-form";

export default function ConsortiumPartners() {
  const dispatch = useAppDispatch();

  const { consortiumPartners } = useAppSelector(
    (state) => state.consortiumPartner
  );

  return (
    <div className='flex flex-col w-full mt-10 space-y-3'>
      <Label className='font-semibold'>Consortium partners</Label>
      <div className='flex flex-wrap gap-3'>
        {consortiumPartners?.map((partner) => (
          <div key={partner.id} className='border p-5 space-y-3 rounded-lg'>
            <div className='flex gap-3 items-center'>
              <h4 className='font-semibold'>{partner.name}</h4>
            </div>

            <div className='flex items-cemter gap-2'>
              <LocationSvg />
              {partner.state}
            </div>
          </div>
        ))}
        <Button
          type='button'
          variant='outline'
          className='text-[#DEA004]'
          onClick={() => {
            dispatch(
              openDialog({
                type: DialogType.ConsortiumModal,
                dialogProps: {
                  width: "max-w-6xl",
                },
              })
            );
          }}
        >
          Click to select consortium partners
        </Button>
      </div>

      {consortiumPartners.length === 0 && (
        <span className='text-sm text-red-500 font-medium'>
          Please select partners
        </span>
      )}
    </div>
  );
}
