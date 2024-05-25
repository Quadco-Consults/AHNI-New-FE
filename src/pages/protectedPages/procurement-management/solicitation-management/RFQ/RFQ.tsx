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
import { zodResolver } from "@hookform/resolvers/zod";
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
import { EOIFormSchema } from "utils/Validator";
import eoiPng from "assets/imgs/rfq.png";
import Card from "components/shared/Card";
import { Icon } from "@iconify/react";
import { Link, generatePath } from "react-router-dom";
import { RouteEnum } from "constants/RouterConstants";

const RFQ = () => {
  const formHook = useForm({
    resolver: zodResolver(EOIFormSchema),
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
          <span className="text-black font-medium dark:text-grey-dark">
            Request For Quotations
          </span>
        </h6>
      </div>

      <div className="space-y-10 p-10 bg-white shadow-sm rounded-2xl dark:bg-[hsl(15,13%,6%)]">
        <div className="flex justify-end items-center">
          <div>
            <Dialog>
              <DialogTrigger>
                <div className="flex items-center bg-primary text-primary-foreground rounded-md text-sm font-medium h-11 px-4 py-3 hover:bg-primary/90">
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

                      {/* <div className="space-y-2">
                        <h4 className=" font-medium">Category</h4>
                        {category.length > 0 ? (
                          <Badge className="py-2 rounded-lg bg-[#EBE8E1] text-black">
                            Medical Laboratory Consumables
                          </Badge>
                        ) : (
                          <div>
                            <Dialog>
                              <DialogTrigger>
                                <div className="rounded-lg px-2 py-2 text-yellow-darker border">
                                  Click to select categories that applies
                                </div>
                              </DialogTrigger>
                              <DialogContent className="max-w-6xl max-h-[700px]">
                                <DialogHeader className="text-center mt-10 space-y-5">
                                  <img
                                    src={logoPng}
                                    alt="logo"
                                    className="mx-auto"
                                    width={150}
                                  />
                                  <DialogTitle className="text-2xl">
                                    Select your Category
                                  </DialogTitle>
                                  <DialogDescription>
                                    Select all categories that applies to you,
                                    you can also check other tabs for more
                                    categories
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="flex justify-center">
                                  <div className="border w-1/2 py-2 px-4 flex items-center rounded-lg">
                                    <Input
                                      placeholder="Search Category"
                                      type="search"
                                      className="h-6 border-none bg-none"
                                    />
                                    <Icon
                                      icon="iconamoon:search-light"
                                      fontSize={25}
                                    />
                                  </div>
                                </div>

                                <Tabs defaultValue="all">
                                  <TabsList>
                                    <TabsTrigger value="all">All</TabsTrigger>
                                    <TabsTrigger value="EOIAHNi10">
                                      EOIAHNi01 - EOIAHNi10
                                    </TabsTrigger>
                                    <TabsTrigger value="EOIAHNi20">
                                      EOIAHNi11 - EOIAHNi20
                                    </TabsTrigger>
                                    <TabsTrigger value="EOIAHNi30">
                                      EOIAHNi21 - EOIAHNi30
                                    </TabsTrigger>
                                    <TabsTrigger value="EOIAHNi34">
                                      EOIAHNi31 - EOIAHNi34
                                    </TabsTrigger>
                                  </TabsList>
                                  <div className=" bg-[#dbdfe92f] p-2 my-5">
                                    <TabsContent value="all">1</TabsContent>
                                    <TabsContent value="EOIAHNi10">
                                      2
                                    </TabsContent>
                                    <TabsContent value="EOIAHNi20">
                                      3
                                    </TabsContent>
                                    <TabsContent value="EOIAHNi30">
                                      3
                                    </TabsContent>
                                    <TabsContent value="EOIAHNi34">
                                      3
                                    </TabsContent>
                                  </div>
                                </Tabs>
                              </DialogContent>
                            </Dialog>
                          </div>
                        )}
                      </div> */}

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
          </div>
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

                <div className="flex gap-3 items-center">
                  <Icon icon="ooui:reference" fontSize={18} /> <h6>{ref}</h6>
                </div>
                <div className="flex gap-3 items-center">
                  <Icon icon="iconamoon:location-pin-duotone" fontSize={18} />
                  <h6>{location}</h6>
                </div>
                <div className="flex gap-3 items-center">
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
