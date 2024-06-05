// import logoPng from "assets/svgs/logo-bg-svg";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
//@ts-ignore
import logoPng from "assets/imgs/logo.png";
import { ScrollArea } from "components/ui/scroll-area";
import { Button } from "components/ui/button";
import { Checkbox } from "components/ui/checkbox";
import { Search } from "lucide-react";
import { Input } from "components/ui/input";

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

const StateModal = () => {
  return (
    <div className="flex flex-col mt-10 items-center justify-center w-full h-[80vh] ">
      <ScrollArea className="h-[90%] space-y-5">
        <div className="flex flex-col items-center justify-between">
          <div>
            <img src={logoPng} alt="logo" width={150} />
          </div>
          <h4 className="mt-8 text-lg font-bold">State Offices Involved</h4>
          <p className="mt-5 text-muted-foreground">
            You can select as many offices involved as possible
          </p>

          <div className="relative flex mt-6 items-center text-[#20293A] w-full max-w-md">
            <Input
              className="w-full py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 dark:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="Search"
              type="search"
            />
            <Search className="absolute right-2 text " />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5 bg-gray-100 mt-10 p-5 rounded-lg shadow-inner md:grid-cols-4">
          {[
            "Adamawa Office",
            "Borno",
            "Yobe",
            "Adamawa Office",
            "Borno",
            "Yobe",
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

export default StateModal;
