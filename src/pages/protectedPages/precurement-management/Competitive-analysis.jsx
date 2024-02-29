import Card from "components/shared/Card";
import React from "react";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "components/ui/select";

const CompetitiveAnalysis = () => {
  return (
    <div className="space-y-10">
      <div>
        <h4 className="text-lg font-bold">Competitive Bid Analysis</h4>
        <h6>
          Precurement -{" "}
          <span className="text-black font-medium">
            Competitive Bid Analysis
          </span>
        </h6>
      </div>

      <Card>
        {/* <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Fruits</SelectLabel>
              <SelectItem value="apple">
                Lifespring Immunization Movement
              </SelectItem>
              <SelectItem value="banana">
                PureFlow Water Sanitation Drive
              </SelectItem>
              <SelectItem value="blueberry">Pathway to Prevention</SelectItem>
              <SelectItem value="grapes">Empower Nutrition Network</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select> */}
      </Card>
    </div>
  );
};

export default CompetitiveAnalysis;
