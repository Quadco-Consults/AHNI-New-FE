// import logoPng from "assets/svgs/logo-bg-svg";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
//@ts-ignore
import logoPng from "assets/imgs/logo.png";
import { ScrollArea } from "components/ui/scroll-area";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Search } from "lucide-react";
import { Checkbox } from "components/ui/checkbox";
import StakeholderAPI from "services/programsApi/stakeholder";

const StakeholderModal = () => {
    const { data } = StakeholderAPI.useGetStakeholdersQuery({});
    console.log({ data });

    return (
        <div className="flex flex-col mt-5 items-center justify-center w-full h-[80vh] ">
            <ScrollArea className="h-[90%]">
                <div className="flex flex-col items-center justify-between">
                    <div>
                        <img src={logoPng} alt="logo" width={150} />
                    </div>
                    <h4 className="mt-8 text-lg font-bold">
                        Stakeholders Register
                    </h4>
                    <p className="mt-5 text-muted-foreground">
                        You can search with name, institution
                    </p>

                    <div className="relative flex items-center my-5 text-[#20293A] w-full max-w-md">
                        <Input
                            className="w-full py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 dark:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                            placeholder="Search office"
                            type="search"
                        />
                        <Search className="absolute right-2  " />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-5 bg-gray-100 p-5 rounded-lg shadow-inner md:grid-cols-3">
                    {Array(6)
                        .fill({
                            title: "Roger Dokidis",
                            org: "Borno State House of Assembly",
                            gender: "Male",
                            designation: "Medical Director",
                            phone: "09075364587",
                            mail: "rogerdokidis@gmail.com",
                        })
                        .map((result: any, index: number) => (
                            <div
                                key={index}
                                className="flex flex-col p-5 bg-white border rounded-lg gap-4"
                            >
                                <div className="flex gap-2 items-center">
                                    <Checkbox />
                                    <h4 className="font-semibold text-yellow-600">
                                        {result.title}
                                    </h4>
                                </div>

                                <div className="text-sm">
                                    <h4 className="font-semibold">
                                        Institution/Organization:
                                    </h4>
                                    <p>{result.org}</p>
                                </div>

                                <div className="grid text-xs grid-cols-2 gap-3">
                                    <div>
                                        <h4 className="font-semibold">
                                            Gender:
                                        </h4>
                                        <p>{result.gender}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">
                                            Designation:
                                        </h4>
                                        <p>{result.designation}</p>
                                    </div>
                                </div>

                                <div className="grid text-sm grid-cols-2 gap-3">
                                    <div>
                                        <h4 className="font-semibold">
                                            Phone Number:
                                        </h4>
                                        <p>{result.phone}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">
                                            E-mail:
                                        </h4>
                                        <p>{result.mail}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </ScrollArea>
            <div className="flex justify-end w-full my-5">
                <div className="flex items-center gap-x-4">
                    <p className="text-sm font-medium text-primary">
                        2 Criteria Selected
                    </p>
                    <Button>Save & Continue</Button>
                </div>
            </div>
        </div>
    );
};

export default StakeholderModal;
