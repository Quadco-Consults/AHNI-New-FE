/* eslint-disable react/prop-types */
import { DialogClose } from "components/ui/dialog";
import TabsListCard from "./Tabs-list-card";

const EOITabsContent = ({ value }: any) => {
  return (
    <div className="space-y-5">
      <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
        {DATA.filter((val) => val.name === value).map((data, index) => (
          <TabsListCard key={index} data={data} />
        ))}
      </div>

      <div className="flex justify-end">
        <div className="flex gap-4 items-center">
          <h6 className="text-primary">2 categories Selected</h6>
          <DialogClose>
            <div className="flex items-center bg-primary text-primary-foreground rounded-md text-sm font-medium h-11 px-4 py-3 hover:bg-primary/90">
              Save & Continue
            </div>
          </DialogClose>
        </div>
      </div>
    </div>
  );
};

export default EOITabsContent;

const DATA = [
  {
    name: "EOIAHNi10",
    title: "Medical Laboratory Consumables",
    description:
      "General, Viral Load, Diagnostic, OSS, and PCR Lab consumables",
  },
  {
    name: "EOIAHNi34",
    title: "Office Furniture",
    description:
      "General, Viral Load, Diagnostic, OSS, and PCR Lab consumables",
  },
  {
    name: "EOIAHNi20",
    title: "Medical Laboratory Equipment (Hospital Equipment)",
    description:
      "General, Viral Load, Diagnostic, OSS, and PCR Lab consumables",
  },
  {
    name: "EOIAHNi10",
    title: "Medical Laboratory Consumables",
    description:
      "General, Viral Load, Diagnostic, OSS, and PCR Lab consumables",
  },
  {
    name: "EOIAHNi30",
    title: "Design and Printing",
    description:
      "General, Viral Load, Diagnostic, OSS, and PCR Lab consumables",
  },
  {
    name: "EOIAHNi34",
    title: "Office Furniture",
    description:
      "General, Viral Load, Diagnostic, OSS, and PCR Lab consumables",
  },
  {
    name: "EOIAHNi20",
    title: "Medical Laboratory Equipment (Hospital Equipment)",
    description:
      "General, Viral Load, Diagnostic, OSS, and PCR Lab consumables",
  },
  {
    name: "EOIAHNi10",
    title: "Medical Laboratory Consumables",
    description:
      "General, Viral Load, Diagnostic, OSS, and PCR Lab consumables",
  },
  {
    name: "EOIAHNi30",
    title: "Design and Printing",
    description:
      "General, Viral Load, Diagnostic, OSS, and PCR Lab consumables",
  },
  {
    name: "EOIAHNi34",
    title: "Office Furniture",
    description:
      "General, Viral Load, Diagnostic, OSS, and PCR Lab consumables",
  },
  {
    name: "EOIAHNi10",
    title: "Medical Laboratory Consumables",
    description:
      "General, Viral Load, Diagnostic, OSS, and PCR Lab consumables",
  },
  {
    name: "EOIAHNi20",
    title: "Medical Laboratory Equipment (Hospital Equipment)",
    description:
      "General, Viral Load, Diagnostic, OSS, and PCR Lab consumables",
  },
  {
    name: "EOIAHNi30",
    title: "Design and Printing",
    description:
      "General, Viral Load, Diagnostic, OSS, and PCR Lab consumables",
  },
  {
    name: "EOIAHNi34",
    title: "Office Furniture",
    description:
      "General, Viral Load, Diagnostic, OSS, and PCR Lab consumables",
  },
  {
    name: "EOIAHNi20",
    title: "Medical Laboratory Equipment (Hospital Equipment)",
    description:
      "General, Viral Load, Diagnostic, OSS, and PCR Lab consumables",
  },
  {
    name: "EOIAHNi30",
    title: "Design and Printing",
    description:
      "General, Viral Load, Diagnostic, OSS, and PCR Lab consumables",
  },
];
