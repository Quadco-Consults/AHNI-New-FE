// import logoPng from "assets/svgs/logo-bg-svg";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
//@ts-ignore
import logoPng from "assets/imgs/logo.png";
import { Checkbox } from "components/ui/checkbox";
import { ScrollArea } from "components/ui/scroll-area";
import { Button } from "components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";

// const Display = () => {
//   return (
//     <div className="grid grid-cols-4 p-4 bg-gray-100 gap-x-4">
//       <div className="flex flex-col p-5 bg-white border rounded-lg gap-y-4 ">
//         <Checkbox />
//         <p className="text-sm">EOIAHNi01</p>
//         <p className="text-sm font-semibold ">Medical Laboratory Consumables</p>
//         <p className="text-sm">
//           General, Viral Load, Diagnostic, OSS, and PCR Lab consumables
//         </p>
//       </div>

//       <div className="flex flex-col p-5 bg-white border rounded-lg gap-y-4 ">
//         <Checkbox />
//         <p className="text-sm">EOIAHNi01</p>
//         <p className="text-sm font-semibold ">Medical Laboratory Consumables</p>
//         <p className="text-sm">
//           General, Viral Load, Diagnostic, OSS, and PCR Lab consumables
//         </p>
//       </div>

//       <div className="flex flex-col p-5 bg-white border rounded-lg gap-y-4 ">
//         <Checkbox />
//         <p className="text-sm">EOIAHNi01</p>
//         <p className="text-sm font-semibold ">Medical Laboratory Consumables</p>
//         <p className="text-sm">
//           General, Viral Load, Diagnostic, OSS, and PCR Lab consumables
//         </p>
//       </div>

//       <div className="flex flex-col p-5 bg-white border rounded-lg gap-y-4 ">
//         <Checkbox />
//         <p className="text-sm">EOIAHNi01</p>
//         <p className="text-sm font-semibold ">Medical Laboratory Consumables</p>
//         <p className="text-sm">
//           General, Viral Load, Diagnostic, OSS, and PCR Lab consumables
//         </p>
//       </div>
//     </div>
//   );
// };

// const tabList = [
//   {
//     name: "All",
//     tag: "all",
//     element: <Display />,
//   },
//   {
//     name: "EOIAHNi01 - EOIAHNi10",
//     tag: "EOIAHNi01 - EOIAHNi10",
//     element: <Display />,
//   },
//   {
//     name: "EOIAHNi11 - EOIAHNi20",
//     tag: "EOIAHNi11 - EOIAHNi20",
//     element: <Display />,
//   },
//   {
//     name: "EOIAHNi21 - EOIAHNi30",
//     tag: "EOIAHNi21 - EOIAHNi30",
//     element: <Display />,
//   },
//   {
//     name: "EOIAHNi31 - EOIAHNi34",
//     tag: "EOIAHNi31 - EOIAHNi34",
//     element: <Display />,
//   },
// ];

const ChecklistModal = () => {
  return (
    <div className="flex flex-col mt-10 items-center justify-center w-full h-[80vh] ">
      <ScrollArea className="h-[90%]">
        <div className="flex flex-col items-center justify-between">
          <div>
            <img src={logoPng} alt="logo" width={150} />
          </div>
          <h4 className="mt-8 text-lg font-bold">Evaluation Criteria</h4>
          <p className="mt-5 text-muted-foreground">
            You can switch between evaluation categories and select all relevant
            questions
          </p>

          <div className="w-8/12 mt-6">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select evaluation category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="m@example.com">
                  Assess Once in a Financial Year (October – December in FY)
                </SelectItem>
                <SelectItem value="m@google.com">
                  Monitoring and Evaluation
                </SelectItem>
                <SelectItem value="m@support.com">Assess monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <h2 className="text-center my-10 text-yellow-500">
          Management System (Assess every 6 months; first visit at the beginning
          of the FY and first visit after SAPR)
        </h2>

        <div className="grid grid-cols-2 gap-5 bg-gray-100 p-5 rounded-lg shadow-inner">
          {[
            "Facility staff, including Adhoc understand the ACEBAY project. (Assess understanding of PEPFAR and USIAD role in funding)",
            "Staff can describe their roles and responsibilities (Also assess their weekly activity plan)",
            "Financial management- RFI/Monthly Fund Request",
            "ART Coordinator/Facility head knows what the facility is funded for and the amount",
            "Previous month’s RFI paid? If not, explore reasons and bottlenecks? Refer to programs team.",
          ].map((result: string, index: number) => (
            <div
              key={index}
              className="flex p-5 bg-white border rounded-lg gap-4 items-center "
            >
              <Checkbox />
              <h4 className="text-sm">{result}</h4>
            </div>
          ))}
        </div>

        {/* <div className="w-full mt-10">
          <Tabs defaultValue="all">
            <TabsList className="flex items-center justify-center space-x-5 text-center bg-white">
              {tabList.map((item) => {
                return (
                  <TabsTrigger
                    className="mx-4 bg-gray-300 "
                    key={item.tag}
                    value={item.tag}
                  >
                    {item.name}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {tabList.map((item) => {
              return (
                <TabsContent key={item.tag} value={item.tag}>
                  {item.element || <Display />}
                </TabsContent>
              );
            })}
          </Tabs>
        </div> */}
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

export default ChecklistModal;
