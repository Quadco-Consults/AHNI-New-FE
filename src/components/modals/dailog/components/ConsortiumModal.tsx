// import logoPng from "assets/svgs/logo-bg-svg";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
//@ts-ignore
import logoPng from "assets/imgs/logo.png";
import { ScrollArea } from "components/ui/scroll-area";
import { Button } from "components/ui/button";
import { Checkbox } from "components/ui/checkbox";
import { MapPin, Search } from "lucide-react";
import { Input } from "components/ui/input";
import fhiIcon from "assets/imgs/fhi.png";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";

const ConsortiumModal = () => {
  return (
    <div className="flex flex-col mt-10 items-center justify-center w-full h-[80vh] ">
      <ScrollArea className="h-[90%] space-y-5 pb-5">
        <div className="flex flex-col items-center justify-between">
          <div>
            <img src={logoPng} alt="logo" width={150} />
          </div>
          <h4 className="mt-8 text-lg font-bold">Select Consortium partners</h4>
          <p className="mt-5 text-muted-foreground">
            You can search for partners based on their name and location
          </p>

          <div className="flex border rounded-lg mt-6 items-center text-[#20293A] w-full max-w-lg">
            <div className="ml-2">
              <Search />
            </div>
            <Input
              className="w-full border-none py-2 text-sm bg-white border border-gray-300 rounded-none focus:outline-none focus:ring-blue-500 dark:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="Search name"
              type="search"
            />
            <p>|</p>
            <Select>
              <SelectTrigger className="border-none rounded-none">
                <SelectValue placeholder="Location" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="m@example.com">m@example.com</SelectItem>
                <SelectItem value="m@google.com">m@google.com</SelectItem>
                <SelectItem value="m@support.com">m@support.com</SelectItem>
              </SelectContent>
            </Select>
            <Button>Search</Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5 bg-gray-100 mt-10 p-5 rounded-lg shadow-inner md:grid-cols-3">
          {Array(6)
            .fill({
              icon: fhiIcon,
              name: "Family Health International (FHI 360)",
              location: "Adamawa",
            })
            .map((option: any, index: number) => (
              <div
                key={index}
                className="flex p-5 bg-white border rounded-lg gap-1 items-center "
              >
                <Checkbox />
                <img src={fhiIcon} alt="" width={100} />
                <div className="text-sm space-y-1">
                  <h4>{option.name}</h4>
                  <p className="flex items-center gap-1">
                    <span>
                      <MapPin size={15} />
                    </span>
                    {option.location}
                  </p>
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

export default ConsortiumModal;
