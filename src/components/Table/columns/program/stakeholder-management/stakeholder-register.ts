import { ColumnDef } from "@tanstack/react-table";

export const stakeholderRegisterColumnss: ColumnDef<any>[] = [
  { accessorKey: "name", header: "Name", cell: info => info.getValue() },
  { accessorKey: "organization", header: "Organization", cell: info => info.getValue() },
  { accessorKey: "designation", header: "Designation", cell: info => info.getValue() },
  { accessorKey: "project_role", header: "Project Role", cell: info => info.getValue() },
  { accessorKey: "contact_person_name", header: "Contact Person Name", cell: info => info.getValue() },
  { accessorKey: "contact_person_email", header: "Contact Person Email", cell: info => info.getValue() },
  { accessorKey: "contact_person_phone_number", header: "Contact Person Phone Number", cell: info => info.getValue() },
  { accessorKey: "phone_number", header: "Phone Number", cell: info => info.getValue() },
  { accessorKey: "email", header: "Email", cell: info => info.getValue() },
  { accessorKey: "office_address", header: "Office Address", cell: info => info.getValue() },
  { accessorKey: "state", header: "State", cell: info => info.getValue() },
  { accessorKey: "importance", header: "Importance", cell: info => info.getValue() },
  { accessorKey: "influence", header: "Influence", cell: info => info.getValue() },
  { accessorKey: "score", header: "Score", cell: info => info.getValue() },
  { accessorKey: "major_concerns", header: "Major Concerns", cell: info => info.getValue() },
  { accessorKey: "relationship_owner", header: "Relationship Owner", cell: info => info.getValue() },
];
