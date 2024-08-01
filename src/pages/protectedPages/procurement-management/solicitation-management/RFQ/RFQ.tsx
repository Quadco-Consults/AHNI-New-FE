import { Button } from "components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "components/ui/dialog";
import { Input } from "components/ui/input";
import { DialogClose } from "@radix-ui/react-dialog";
import { Textarea } from "components/ui/textarea";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";

import eoiPng from "assets/imgs/rfq.png";
import Card from "components/shared/Card";
import { Icon } from "@iconify/react";
import { Link, generatePath } from "react-router-dom";
import { RouteEnum } from "constants/RouterConstants";

const RFQ = () => {
  const formHook = useForm({
    defaultValues: {
      description: "",
      vendor_category: [],
      tender_type: "",
      document: "",
      vendor: "",
    },
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <div className="space-y-10">
      <div>
        <h4 className="text-lg font-bold">Request For Quotations</h4>
        <h6>
          Procurement -{" "}
          <span className="font-medium text-black dark:text-grey-dark">
            Request For Quotations
          </span>
        </h6>
      </div>

      <div className="space-y-10 p-10 bg-white shadow-sm rounded-2xl dark:bg-[hsl(15,13%,6%)]">
        <div className="flex items-center justify-end">
          <Link to={RouteEnum.RFQ_CREATE_QUOTATION}>
            <Button>
              <span>
                <Plus size={15} />
              </span>
              Create New
            </Button>
          </Link>
          {/* <div>
            <Dialog>
              <DialogTrigger>
                <div className="flex items-center px-4 py-3 text-sm font-medium rounded-md bg-primary text-primary-foreground h-11 hover:bg-primary/90">
                  <span>
                    <Plus size={15} />
                  </span>
                  Create New
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[650px]">
                <div className="pb-5 space-y-5">
                  <DialogTitle className="py-5 ">
                    Initiate New Request for Quotation
                  </DialogTitle>

                  <hr />
                  <Form {...formHook}>
                    <form
                      onSubmit={formHook.handleSubmit(onSubmit)}
                      className="space-y-5"
                    >
                      <FormField
                        control={formHook.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              RFQ Title/ID
                              <span className="text-primary">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={formHook.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Background</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Type your background here."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={formHook.control}
                        name="tender_type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Tender Type<span className="text-primary">*</span>
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectItem value="Single Source">
                                    Single Source
                                  </SelectItem>
                                  <SelectItem value="Open Tender">
                                    Open Tender
                                  </SelectItem>
                                  <SelectItem value="National Open Tender">
                                    National Open Tender
                                  </SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <FormField
                          control={formHook.control}
                          name="tender_type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Request Type
                                <span className="text-primary">*</span>
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select Type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectItem value="Single Source">
                                      Single Source
                                    </SelectItem>
                                    <SelectItem value="Open Tender">
                                      Open Tender
                                    </SelectItem>
                                    <SelectItem value="National Open Tender">
                                      National Open Tender
                                    </SelectItem>
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={formHook.control}
                          name="tender_type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Procurement Type
                                <span className="text-primary">*</span>
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select Type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectItem value="Single Source">
                                      Single Source
                                    </SelectItem>
                                    <SelectItem value="Open Tender">
                                      Open Tender
                                    </SelectItem>
                                    <SelectItem value="National Open Tender">
                                      National Open Tender
                                    </SelectItem>
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </div>

                     

                      <div className="flex justify-end gap-5">
                        <DialogClose asChild>
                          <Button variant="ghost">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Save Changes</Button>
                      </div>
                    </form>
                  </Form>
                </div>
              </DialogContent>
            </Dialog>
          </div> */}
        </div>

        <div className="grid grid-cols-2 gap-5">
          {Array(6)
            .fill({
              title: "Call for expression of interest",
              ref: "GF-RFQ-AHNi-10-2023",
              description:
                "Achieving Health Nigeria Initiative (AHNi) is an indigenous non-governmental organization that promotes socio-economic development by supporting a broad range of global health interventions, education, and economic initiatives in Nigeria.",
              location: "Head Office, Abuja",
              source: "Single Sourcing",
            })
            .map(({ title, description, ref, location, source }, index) => (
              <Card key={index} className="space-y-4">
                <img src={eoiPng} alt="eoi" />
                <h2 className="text-lg font-bold">{title}</h2>

                <div className="flex items-center gap-3">
                  <Icon icon="ooui:reference" fontSize={18} /> <h6>{ref}</h6>
                </div>
                <div className="flex items-center gap-3">
                  <Icon icon="iconamoon:location-pin-duotone" fontSize={18} />
                  <h6>{location}</h6>
                </div>
                <div className="flex items-center gap-3">
                  <Icon
                    icon="solar:case-minimalistic-bold-duotone"
                    fontSize={18}
                  />
                  <h6>{source}</h6>
                </div>

                <h6 className="line-clamp-3">{description}</h6>

                <div className="flex justify-center">
                  <Link to={generatePath(RouteEnum.RFQ_DETAILS, { id: "1" })}>
                    <Button variant="ghost" className="border text-primary">
                      Tap to View
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
};

export default RFQ;
