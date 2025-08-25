// import logoPng from "assets/svgs/logo-bg-svg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
//@ts-ignore
import logoPng from "assets/imgs/logo.png";
import { Input } from "components/ui/input";
import { ScrollArea } from "components/ui/scroll-area";
import { Button } from "components/ui/button";
import { Checkbox } from "components/ui/checkbox";

const Display = () => {
  return (
    <div className="grid grid-cols-4 p-4 bg-gray-100 gap-x-4">
      <div className="flex flex-col p-5 bg-white border rounded-lg gap-y-4 ">
        <Checkbox />
        <p className="text-sm">EOIAHNi01</p>
        <p className="text-sm font-semibold ">Medical Laboratory Consumables</p>
        <p className="text-sm">
          General, Viral Load, Diagnostic, OSS, and PCR Lab consumables
        </p>
      </div>

      <div className="flex flex-col p-5 bg-white border rounded-lg gap-y-4 ">
        <Checkbox />
        <p className="text-sm">EOIAHNi01</p>
        <p className="text-sm font-semibold ">Medical Laboratory Consumables</p>
        <p className="text-sm">
          General, Viral Load, Diagnostic, OSS, and PCR Lab consumables
        </p>
      </div>

      <div className="flex flex-col p-5 bg-white border rounded-lg gap-y-4 ">
        <Checkbox />
        <p className="text-sm">EOIAHNi01</p>
        <p className="text-sm font-semibold ">Medical Laboratory Consumables</p>
        <p className="text-sm">
          General, Viral Load, Diagnostic, OSS, and PCR Lab consumables
        </p>
      </div>

      <div className="flex flex-col p-5 bg-white border rounded-lg gap-y-4 ">
        <Checkbox />
        <p className="text-sm">EOIAHNi01</p>
        <p className="text-sm font-semibold ">Medical Laboratory Consumables</p>
        <p className="text-sm">
          General, Viral Load, Diagnostic, OSS, and PCR Lab consumables
        </p>
      </div>
    </div>
  );
};

const tabList = [
  {
    name: "All",
    tag: "all",
    element: <Display />,
  },
  {
    name: "EOIAHNi01 - EOIAHNi10",
    tag: "EOIAHNi01 - EOIAHNi10",
    element: <Display />,
  },
  {
    name: "EOIAHNi11 - EOIAHNi20",
    tag: "EOIAHNi11 - EOIAHNi20",
    element: <Display />,
  },
  {
    name: "EOIAHNi21 - EOIAHNi30",
    tag: "EOIAHNi21 - EOIAHNi30",
    element: <Display />,
  },
  {
    name: "EOIAHNi31 - EOIAHNi34",
    tag: "EOIAHNi31 - EOIAHNi34",
    element: <Display />,
  },
];

const CategoriesModal = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-[80vh] ">
      <ScrollArea className="h-[90%]">
        <div className="flex flex-col items-center justify-between">
          <div>
            <img src={logoPng} alt="logo" width={200} />
          </div>
          <h4 className="mt-8 text-lg font-bold">Select your Category</h4>
          <p className="mt-5 text-muted-foreground">
            Select all categories that applies to you, you can also check other
            tabs for more categories
          </p>

          <div className="w-8/12 mt-6">
            <Input
              type="search"
              placeholder="Search Categories"
              className="w-full"
            />
          </div>
        </div>

        <div className="w-full mt-16">
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

            {/* <TabsContent value="rfq-details">
            <div>one</div>
          </TabsContent>
          <TabsContent value="vendor-submission">
            <div>two</div>
          </TabsContent> */}
          </Tabs>
        </div>
      </ScrollArea>
      <div className="flex justify-end w-full my-5">
        <div className="flex items-center gap-x-4">
          <p className="text-sm font-medium text-primary">
            2 categories Selected
          </p>
          <Button>Save & Continue</Button>
        </div>
      </div>
    </div>
  );
};

export default CategoriesModal;