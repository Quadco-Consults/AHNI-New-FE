"use client";

import { Button } from "components/ui/button";

import Card from "components/Card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "components/ui/accordion";
import { Form } from "components/ui/form";
import FormRadio from "components/atoms/FormRadio";
import { useForm } from "react-hook-form";
import { Switch } from "components/ui/switch";
import EditIcon from "components/icons/EditIcon";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";

export default function LeaveSettings() {
  const form = useForm<{ submitted_employees: string[] }>({
    defaultValues: {
      submitted_employees: [],
    },
  });
  const dispatch = useAppDispatch();

  return (
    <div>
      <div className='flex items-center justify-end py-6 mb-6'>
        <Button
          type='button'
          onClick={() =>
            dispatch(
              openDialog({
                type: DialogType.NewLeave,
                dialogProps: {
                  header: "Add New Leave Package",
                },
              })
            )
          }
          variant='outline'
          className='gap-x-2 shadow-[0px_3px_8px_rgba(0,0,0,0.07)] bg-primary text-white border-[1px] border-[#C7CBD5]'
          size='sm'
        >
          Add New Leave Package
        </Button>
      </div>
      <Card>
        <Accordion type='single' collapsible className='w-full'>
          <AccordionItem value={"1"}>
            <AccordionTrigger>Annual Leave</AccordionTrigger>
            <AccordionContent>
              <Form {...form}>
                <form className='space-y-10'>
                  <div className='w-full'>
                    <p>Number of Days</p>
                    <div className='flex w-full gap-3 mt-2'>
                      <div className=' bg-gray-100 flex items-center p-2 w-full rounded-md'>
                        hello
                      </div>
                      <Button
                        type='button'
                        className='bg-alternate text-primary'
                        onClick={() =>
                          dispatch(
                            openDialog({
                              type: DialogType.EditValue,
                              dialogProps: {
                                header: "Edit Leave Days",
                              },
                            })
                          )
                        }
                      >
                        <EditIcon /> Edit
                      </Button>
                    </div>
                  </div>
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <FormRadio
                      label='Carry Forward'
                      name='carry_forward'
                      options={[
                        {
                          label: "No",
                          value: "no",
                        },
                        { label: "Yes", value: "yes" },
                      ]}
                    />
                    <div className='w-full'>
                      <p>Maximum Leave Days</p>
                      <div className='flex w-full gap-3 mt-2'>
                        <div className='flex items-center p-2 w-full rounded-md border bg-gray-100'>
                          hello
                        </div>
                        <Button
                          type='button'
                          className='bg-alternate text-primary'
                          onClick={() =>
                            dispatch(
                              openDialog({
                                type: DialogType.EditValue,
                                dialogProps: {
                                  header: "Edit Maximum Leave Days ",
                                },
                              })
                            )
                          }
                        >
                          <EditIcon /> Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <FormRadio
                      label='Allow Conversion of Leave days to compensation'
                      name='leave_conversion'
                      options={[
                        {
                          label: "No",
                          value: "no",
                        },
                        { label: "Yes", value: "yes" },
                      ]}
                    />
                    <div className='w-full'>
                      <p>Value of a Leave Day</p>
                      <div className='flex w-full gap-3 mt-2'>
                        <div className='flex items-center p-2 w-full rounded-md border bg-gray-100'>
                          hello
                        </div>
                        <Button
                          type='button'
                          className='bg-alternate text-primary'
                          onClick={() =>
                            dispatch(
                              openDialog({
                                type: DialogType.EditValue,
                                dialogProps: {
                                  header: "Edit Value of a Leave Day",
                                },
                              })
                            )
                          }
                        >
                          <EditIcon /> Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center gap-5 py-5'>
                    <Button
                      // onClick={goBack}
                      type='button'
                      className='bg-white text-primary dark:text-gray-500 border-primary border'
                    >
                      Delete Package
                    </Button>

                    <Switch id='notifications-mode' />
                  </div>
                </form>
              </Form>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
    </div>
  );
}
