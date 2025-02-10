import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import { SolicitationSubmissionData } from "definations/procurement-types/solicitation";
import React from "react";

const VendorSelect = ({
  vendorId,
  setVendorId,
  data,
}: {
  vendorId: string;
  setVendorId: React.Dispatch<React.SetStateAction<string | undefined>>;
  data: SolicitationSubmissionData;
}) => {
  return (
    <Select value={vendorId} onValueChange={(e) => setVendorId(e)}>
      <SelectTrigger>
        <SelectValue placeholder='Select Company' />
      </SelectTrigger>
      <SelectContent>
        {data?.data?.results?.map(({ id, vendor }) => (
          <SelectItem key={vendor?.id} value={id}>
            {vendor?.company_name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default VendorSelect;
