import Card from "components/shared/Card";
import { Button } from "components/ui/button";
import SearchIcon from "components/icons/SearchIcon";
import FilterIcon from "components/icons/FilterIcon";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "components/Table/DataTable";
import { useGetAllStakeholderRegisterQuery } from "services/programsApi/stakeholder";
import BreadcrumbCard, { TBreadcrumbList } from "components/shared/Breadcrumb";
import { useState } from "react";
import { TStakeholderRegisterData } from "definations/program-validator";

const breadcrumbs: TBreadcrumbList[] = [
  { name: "Programs", icon: true },
  { name: "Stakeholder Management", icon: true },
  { name: "Analysis & Mapping", icon: false },
];

export default function StakeholderAnalysisMappingPage() {
  const [page, setPage] = useState(1);

  const { data: stakeholderRegister, isLoading } =
    useGetAllStakeholderRegisterQuery({
      page,
      size: 10,
    });

  return (
    <div className='space-y-5'>
      <BreadcrumbCard list={breadcrumbs} />

      <Card className='space-y-5'>
        <div className='flex items-center justify-start gap-2'>
          <span className='flex items-center w-1/3 px-2 py-2 border rounded-lg'>
            <SearchIcon />
            <input
              placeholder='Search'
              type='text'
              className='ml-2 h-6 w-[350px] border-none bg-none focus:outline-none outline-none'
            />
          </span>
          <Button className='shadow-sm' variant='ghost'>
            <FilterIcon />
          </Button>
        </div>

        <DataTable
          data={stakeholderRegister?.data.results || []}
          columns={columns}
          isLoading={isLoading}
          pagination={{
            total: stakeholderRegister?.data.pagination.count ?? 0,
            pageSize: stakeholderRegister?.data.pagination.page_size ?? 0,
            onChange: (page: number) => setPage(page),
          }}
        />
      </Card>
    </div>
  );
}

const columns: ColumnDef<TStakeholderRegisterData>[] = [
  {
    header: "Stakeholder Name",
    id: "name",
    accessorFn: (data) => `${data.name}`,
    size: 250,
  },
  {
    header: "Physical Office Address",
    id: "office_address",
    accessorFn: (data) => `${data.office_address}`,
    size: 250,
  },
  {
    header: "Institution/Organization",
    id: "organization",
    accessorFn: (data) => `${data.organization}`,
    size: 300,
  },
  {
    header: "Designation",
    id: "designation",
    accessorFn: (data) => `${data.designation}`,
  },
  {
    header: "State",
    id: "state",
    accessorFn: (data) => `${data.state}`,
    size: 150,
  },
  {
    header: "Phone Number",
    id: "phone_number",
    accessorFn: (data) => `${data.phone_number}`,
    size: 150,
  },
  {
    header: "E-Mail",
    id: "email",
    accessorFn: (data) => `${data.email}`,
    size: 200,
  },
  {
    header: "Project Role",
    id: "project_role",
    accessorFn: (data) => `${data.project_role}`,
    size: 200,
  },
  {
    header: "Importance",
    id: "importance",
    accessorFn: (data) => `${data.importance}`,
    size: 200,
  },
  {
    header: "Influence",
    id: "influence",
    accessorFn: (data) => `${data.influence}`,
    size: 200,
  },
  {
    header: "Score",
    id: "score",
    accessorFn: (data) => `${data.score}`,
    size: 200,
  },
  {
    header: "Major Concerns",
    id: "major_concerns",
    accessorFn: (data) => `${data.major_concerns}`,
    size: 200,
  },

  {
    header: "Relationship Owner",
    id: "relationship_owner",
    accessorFn: (data) => `${data.relationship_owner}`,
    size: 200,
  },
];
