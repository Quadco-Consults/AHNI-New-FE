"use client";

import { FC } from "react";
import { useFormContext } from "react-hook-form";

import { cn } from "lib/utils";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "components/ui/form";
import { RadioGroup, RadioGroupItem } from "components/ui/radio-group";
import { Card, CardContent } from "components/ui/card";
// import FormErrorMessage from "components/FormErrorMessage";

type PageProps = {
  options: {
    label: string;
    value: string | boolean;
    description?: string;
  }[];
  size?: string;
  label?: string;
  name: string;
  extraClass?: string;
  description?: string;
  onValueChange?: () => void;
  isCardLayout?: boolean;
};

const FormRadio: FC<PageProps> = ({
  options,
  name,
  label,
  extraClass,
  description,
  onValueChange,
  isCardLayout = false,
  size,
}) => {
  const {
    control,
    // formState: { errors },
  } = useFormContext();

  // console.log({ errors, name });

  return (
    <div className='space-y-4'>
      {label && <FormLabel>{label}</FormLabel>}
      <FormField
        control={control}
        name={name}
        render={({ field, fieldState: { error } }) => {
          return (
            <>
              <FormControl>
                <RadioGroup
                  onValueChange={onValueChange ?? field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                  className={cn("flex items-center gap-10", extraClass)}
                >
                  {options.map((option, i) => {
                    return isCardLayout ? (
                      <Card key={i}>
                        <CardContent
                          className={cn("space-y-2", size ? size : "py-8")}
                        >
                          <FormItem className='flex items-center space-x-3 space-y-0'>
                            <FormControl>
                              <RadioGroupItem value={option.value as string} />
                            </FormControl>
                            <FormLabel className='font-normal leading-6'>
                              {option.label}
                            </FormLabel>
                          </FormItem>
                          {(option.description || description) && (
                            <p className='text-sm font-light'>
                              {option.description || description}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ) : (
                      <div key={i}>
                        <FormItem className='flex items-center space-x-3 space-y-0'>
                          <FormControl>
                            <RadioGroupItem value={option.value as string} />
                          </FormControl>
                          <FormLabel className='font-normal'>
                            {option.label}
                          </FormLabel>
                        </FormItem>
                        {(option.description || description) && (
                          <p className='text-sm font-light'>
                            {option.description || description}
                          </p>
                        )}
                      </div>
                    );
                  })}

                  <p className='text-red-500'>{error?.message}</p>
                </RadioGroup>
              </FormControl>
            </>
          );
        }}
      />
    </div>
  );
};

export default FormRadio;
