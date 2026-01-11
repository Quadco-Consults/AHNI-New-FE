"use client";

import { useState } from "react";
import Card from "@/components/Card";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import DataTable from "@/components/Table/DataTable";
import TableFilters from "@/components/Table/TableFilters";
import { useGetAllActivityHeadings } from "@/features/contracts-grants/controllers/activityHeadingController";
import { activityHeadingColumns } from "@/features/contracts-grants/components/table-columns/closeout-plan/activity-headings";
import CreateEditModal from "./CreateEditModal";

export default function ActivityHeadings() {
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const { data, isFetching } = useGetAllActivityHeadings({
    page,
    size: 10,
  });

  const handleEdit = (id: string) => {
    setEditId(id);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditId(null);
  };

  const handleCreateNew = () => {
    setEditId(null);
    setModalOpen(true);
  };

  return (
    <section className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Activity Headings</h1>
          <p className="text-gray-600 mt-1">
            Manage activity headings for close-out plans
          </p>
        </div>
        <Button size="lg" onClick={handleCreateNew}>
          <PlusIcon />
          New Heading
        </Button>
      </div>

      <Card>
        <TableFilters>
          <DataTable
            columns={activityHeadingColumns(handleEdit)}
            data={data?.data?.results || []}
            isLoading={isFetching}
            pagination={{
              total: data?.data?.paginator?.count ?? 0,
              pageSize: data?.data?.paginator?.page_size ?? 10,
              onChange: (page: number) => setPage(page),
            }}
          />
        </TableFilters>
      </Card>

      <CreateEditModal
        open={modalOpen}
        onClose={handleCloseModal}
        editId={editId}
      />
    </section>
  );
}
