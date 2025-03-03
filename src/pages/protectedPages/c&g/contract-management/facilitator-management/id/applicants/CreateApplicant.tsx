import { UploadFileSvg } from "assets/svgs/CAndGSvgs";
import BackNavigation from "atoms/BackNavigation";
import FadedButton from "atoms/FadedButton";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelectField";
import Card from "components/shared/Card";
import DescriptionCard from "components/shared/DescriptionCard";
import { Button } from "components/ui/button";
import { Form } from "components/ui/form";
import { Label } from "components/ui/label";
import { Separator } from "components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AiFillPlusCircle } from "react-icons/ai";

export default function CreateApplicant() {
    const [tabValue, setTabValue] = useState("existing");
    const [showDocument, setShowDocument] = useState(false);

    const form = useForm();

    return (
        <section>
            <BackNavigation />

            <Tabs
                defaultValue="existing"
                value={tabValue}
                onValueChange={(value) => setTabValue(value)}
            >
                <TabsList>
                    <TabsTrigger value="existing">Select Existing</TabsTrigger>

                    <TabsTrigger value="new">Add New</TabsTrigger>
                </TabsList>

                <TabsContent value="existing"></TabsContent>
                <TabsContent value="new"></TabsContent>
            </Tabs>

            <Form {...form}>
                <Card>
                    <form className="space-y-8 mt-8">
                        {tabValue === "existing" ? (
                            <>
                                <FormSelect
                                    label="Consultant"
                                    name=""
                                    placeholder="Select Consultant"
                                    required
                                    options={[]}
                                />

                                <Separator />

                                <div>
                                    <h3 className="text-lg font-bold">
                                        Dave Wilson
                                    </h3>

                                    <div className="grid grid-cols-3 gap-10 mt-5">
                                        <DescriptionCard
                                            label="Employment Type"
                                            description="Contract"
                                        />
                                        <DescriptionCard
                                            label="Email"
                                            description="ubakawilson@gmail.com"
                                        />
                                        <DescriptionCard
                                            label="Phone Number"
                                            description="+2348104478624"
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="grid grid-cols-2 gap-10">
                                <FormInput
                                    label="Name"
                                    name="name"
                                    placeholder="Enter Name"
                                    required
                                />

                                <FormInput
                                    label="Email"
                                    name="email"
                                    placeholder="Enter Email"
                                    required
                                />

                                <FormInput
                                    label="Phone Number"
                                    name="phone_number"
                                    placeholder="Enter Phone Number"
                                    required
                                />

                                <FormSelect
                                    label="Employment Type"
                                    name="employment_type"
                                    placeholder="Select Employment Type"
                                    required
                                    options={[]}
                                />
                            </div>
                        )}

                        <div className="flex flex-col items-start gap-3">
                            <Label className="font-bold">Referee</Label>
                            <Button
                                type="button"
                                variant="ghost"
                                className="p-0 hover:bg-transparent"
                            >
                                <AiFillPlusCircle
                                    size={24}
                                    className="text-green-500"
                                />
                                Add Referee
                            </Button>
                        </div>

                        <div className="flex flex-col items-start gap-3">
                            <Label className="font-bold">
                                Document Uploads
                            </Label>
                            <Button
                                type="button"
                                variant="ghost"
                                className="p-0 hover:bg-transparent"
                                onClick={() => setShowDocument(!showDocument)}
                            >
                                <AiFillPlusCircle
                                    size={24}
                                    className="text-green-500"
                                />
                                Add Document
                            </Button>
                        </div>

                        {showDocument && (
                            <div className="grid grid-cols-2 gap-10">
                                <div className="flex flex-col gap-y-[1rem]">
                                    <Label className="font-bold">
                                        Upload Resume
                                    </Label>

                                    <div className="flex items-center w-full gap-x-[1rem]">
                                        <label
                                            className="cursor-pointer shrink-0 border flex items-center gap-x-[1rem] w-fit rounded-lg border-[#DBDFE9] py-[.875rem] px-[1.125rem]"
                                            htmlFor="file"
                                        >
                                            <UploadFileSvg />
                                            Select file
                                        </label>
                                        <input
                                            type="file"
                                            name="file"
                                            hidden
                                            id="file"
                                        />
                                        <p className="border flex items-center w-full gap-x-[1rem] rounded-lg border-[#DBDFE9] px-[1.125rem] h-[3.5rem]">
                                            {/* {file?.name} */}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-y-[1rem]">
                                    <Label className="font-bold">
                                        Upload Cover Letter
                                    </Label>

                                    <div className="flex items-center w-full gap-x-[1rem]">
                                        <label
                                            className="cursor-pointer shrink-0 border flex items-center gap-x-[1rem] w-fit rounded-lg border-[#DBDFE9] py-[.875rem] px-[1.125rem]"
                                            htmlFor="file"
                                        >
                                            <UploadFileSvg />
                                            Select file
                                        </label>
                                        <input
                                            type="file"
                                            name="file"
                                            hidden
                                            id="file"
                                        />
                                        <p className="border flex items-center w-full gap-x-[1rem] rounded-lg border-[#DBDFE9] px-[1.125rem] h-[3.5rem]">
                                            {/* {file?.name} */}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center justify-end gap-3">
                            <FadedButton size="lg" className="text-primary">
                                Cancel
                            </FadedButton>

                            <FormButton size="lg">Submit</FormButton>
                        </div>
                    </form>
                </Card>
            </Form>
        </section>
    );
}
