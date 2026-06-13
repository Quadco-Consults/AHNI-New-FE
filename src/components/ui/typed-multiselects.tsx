import React from "react";
import { UnifiedMultiSelect, MultiSelectOption } from "./unified-multiselect";
import { SolicitationCriteriaResultsData } from "definitions/procurement-types/solicitation-criteria";

// Generic option interface (already in unified-multiselect)
interface BasicOption extends MultiSelectOption {
  id: string;
  name: string;
}

// User interface (for SSP MultiSelect)
interface IUser {
  id: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  email?: string;
  [key: string]: any;
}

// Props for Basic MultiSelect
interface BasicMultiSelectProps {
  options: BasicOption[];
  defaultValue?: string[];
  disabled?: boolean;
  placeholder: string;
  className?: string;
  onValueChange: (ids: string[]) => void;
  variant?: "default" | "secondary" | "destructive" | "inverted";
}

// Props for RFQ MultiSelect
interface RFQMultiSelectProps {
  options: SolicitationCriteriaResultsData[];
  defaultValue?: string[];
  disabled?: boolean;
  placeholder: string;
  className?: string;
  onValueChange: (ids: string[]) => void;
  variant?: "default" | "secondary" | "destructive" | "inverted";
}

// Props for SSP MultiSelect (Users)
interface SSPMultiSelectProps {
  options: IUser[];
  defaultValue?: string[];
  disabled?: boolean;
  placeholder: string;
  className?: string;
  onValueChange: (ids: string[]) => void;
  variant?: "default" | "secondary" | "destructive" | "inverted";
}

// Basic MultiSelect (for generic { id, name } objects)
export const MultiSelectFormField = React.forwardRef<HTMLButtonElement, BasicMultiSelectProps>(
  (props, ref) => (
    <UnifiedMultiSelect
      ref={ref}
      {...props}
      getLabel={(option) => option.name}
      getValue={(option) => option.id}
    />
  )
);
MultiSelectFormField.displayName = "MultiSelectFormField";

// RFQ MultiSelect (for SolicitationCriteriaResultsData)
export const RFQMultiSelectFormField = React.forwardRef<HTMLButtonElement, RFQMultiSelectProps>(
  (props, ref) => (
    <UnifiedMultiSelect
      ref={ref}
      {...props}
      getLabel={(option) => option.name}
      getValue={(option) => option.id}
    />
  )
);
RFQMultiSelectFormField.displayName = "RFQMultiSelectFormField";

// SSP MultiSelect (for IUser objects)
export const SSPMultiSelectFormField = React.forwardRef<HTMLButtonElement, SSPMultiSelectProps>(
  (props, ref) => (
    <UnifiedMultiSelect
      ref={ref}
      {...props}
      getLabel={(option) => {
        // Handle different user name formats
        return option.full_name ||
               `${option.first_name || ''} ${option.last_name || ''}`.trim() ||
               option.email ||
               `User ${option.id}`;
      }}
      getValue={(option) => option.id}
    />
  )
);
SSPMultiSelectFormField.displayName = "SSPMultiSelectFormField";

// Export the unified component for new implementations
export { UnifiedMultiSelect } from "./unified-multiselect";