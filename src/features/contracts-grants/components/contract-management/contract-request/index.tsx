"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "components/ui/button";
import { Card } from "components/ui/card";
import { Input } from "components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import DataTable from "components/Table/DataTable";
import { Plus, Search, Filter } from "lucide-react";
import { contractRequestColumns } from "@/features/contracts-grants/components/table-columns/contract-management/contract-request";
import { useGetAllContractRequests } from "@/features/contracts-grants/controllers/contractController";
import { CG_ROUTES } from "constants/RouterConstants";

export default function ContractRequest() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string | undefined>(undefined);

  const { data, isFetching } = useGetAllContractRequests({
    page,
    size: 20,
    search,
    status,
  });

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Contract Requests</h1>
          <p className="text-gray-600">Manage and track contract requests</p>
        </div>
        <Button onClick={() => router.push(CG_ROUTES.CREATE_CONTRACT_REQUEST)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Contract Request
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search contract requests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={status || "all"}
            onValueChange={(value) => setStatus(value === "all" ? undefined : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="SUBMITTED">Submitted</SelectItem>
              <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
              <SelectItem value="REVIEWED">Reviewed</SelectItem>
              <SelectItem value="AUTHORIZED">Authorized</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>
      </Card>

      {/* Table */}
      <Card className="p-6">
        <DataTable
          columns={contractRequestColumns}
          data={data?.data?.results || []}
          isLoading={isFetching}
          pagination={{
            total: data?.data?.paginator?.count || 0,
            pageSize: 20,
            onChange: setPage,
          }}
        />
      </Card>
    </div>
  );
}
