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
import { PartnerResultsData } from "definations/project-types/partners";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "components/ui/form";
import { PartnersFormSchema } from "definations/project-validator";
import { useDispatch } from "react-redux";
import { addPartners } from "store/formData/project-values";
import { LoadingSpinner } from "components/shared/Loading";
import { closeDialog } from "store/ui";
import { nigerianStates } from "lib/index";
import { usePartnersQuery } from "services/moduleProjects";
import { useAppSelector } from "hooks/useStore";

const ConsortiumModal = () => {
    const [locationValue, setLocationValue] = useState("");
    const dispatch = useDispatch();

    const handleLocation = (value: string) => {
        setLocationValue(value);
    };

    const { data: partners, isLoading } = usePartnersQuery({
        no_paginate: false,
    });

    const { dailog } = useAppSelector((state) => state.ui);

    const { partners: partnerIds } = useAppSelector(
        (state) => state.partnerLocation
    );

    const form = useForm<z.infer<typeof PartnersFormSchema>>({
        resolver: zodResolver(PartnersFormSchema),
        defaultValues: {
            items: partnerIds,
        },
    });

    const onSubmit = (data: z.infer<typeof PartnersFormSchema>) => {
        dispatch(addPartners(data.items));

        dispatch(closeDialog());
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col mt-5 items-center justify-center w-full h-[80vh] ">
                    <ScrollArea className="h-[90%] space-y-5 pb-5">
                        <div className="flex flex-col items-center justify-between">
                            <div>
                                <img src={logoPng} alt="logo" width={150} />
                            </div>
                            <h4 className="mt-5 text-lg font-bold">
                                Select Consortium partners
                            </h4>
                            <p className="mt-5 text-muted-foreground">
                                You can search for partners based on their name
                                and location
                            </p>

                            <div className="flex gap-2 mt-6 items-center w-full max-w-sm">
                                <Select onValueChange={handleLocation}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Location" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {nigerianStates?.map(
                                            (
                                                partner: string,
                                                index: number
                                            ) => (
                                                <SelectItem
                                                    key={index}
                                                    value={partner}
                                                >
                                                    {partner}
                                                </SelectItem>
                                            )
                                        )}
                                    </SelectContent>
                                </Select>
                                <Button>Search</Button>
                            </div>
                        </div>

                        {isLoading ? (
                            <LoadingSpinner />
                        ) : (
                            <FormField
                                control={form.control}
                                name="items"
                                render={() => (
                                    <FormItem className="grid grid-cols-2 gap-5 bg-gray-100 mt-10 p-5 rounded-lg shadow-inner md:grid-cols-3">
                                        {partners?.data?.results?.map(
                                            (item: PartnerResultsData) => (
                                                <FormField
                                                    key={item?.id}
                                                    control={form.control}
                                                    name="items"
                                                    render={({ field }) => {
                                                        return (
                                                            <FormItem
                                                                key={item.id}
                                                                className="flex p-5 bg-white border rounded-lg gap-3 items-center "
                                                            >
                                                                <FormControl>
                                                                    <Checkbox
                                                                        checked={field.value?.includes(
                                                                            item?.id
                                                                        )}
                                                                        onCheckedChange={(
                                                                            checked
                                                                        ) => {
                                                                            return checked
                                                                                ? field.onChange(
                                                                                      [
                                                                                          ...field.value,
                                                                                          item?.id,
                                                                                      ]
                                                                                  )
                                                                                : field.onChange(
                                                                                      field.value?.filter(
                                                                                          (
                                                                                              value
                                                                                          ) =>
                                                                                              value !==
                                                                                              item?.id
                                                                                      )
                                                                                  );
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                                <div>
                                                                    <img
                                                                        src={
                                                                            item.logo
                                                                        }
                                                                        alt=""
                                                                        width={
                                                                            80
                                                                        }
                                                                    />
                                                                </div>
                                                                <div className="text-sm space-y-1">
                                                                    <h4>
                                                                        {
                                                                            item.name
                                                                        }
                                                                    </h4>
                                                                    <p className="flex items-center gap-1">
                                                                        <span>
                                                                            <MapPin
                                                                                size={
                                                                                    15
                                                                                }
                                                                            />
                                                                        </span>
                                                                        {
                                                                            item.state
                                                                        }
                                                                    </p>
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
                    </ScrollArea>
                    <div className="flex justify-end w-full my-5">
                        <div className="flex items-center gap-x-4">
                            <p className="text-sm font-medium text-primary">
                                {form.watch("items").length} Criteria Selected
                            </p>
                            <Button type="submit">Save & Continue</Button>
                        </div>
                    </div>
                </div>
            </form>
        </Form>
    );
};

export default ConsortiumModal;
