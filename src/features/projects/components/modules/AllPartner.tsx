import { Button } from "components/ui/button";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import {
    useDeletePartner,
    useGetAllPartners,
} from "@/features/modules/controllers/project/partnerController";
import { useState } from "react";
import DataTable from "components/Table/DataTable";
import { modulePartnerColumn } from "@/features/projects/components/table-columns/project/partner";

export default function AllPartner() {
    const [page, setPage] = useState(1);

    const { data, isFetching } = useGetAllPartners({
        page,
        size: 20,
        search: "",
    });

    const dispatch = useAppDispatch();

    return (
        <div>
            <div className="flex justify-between items-center py-6 mb-6">
                <h1 className="text-[#D92D20] font-semibold text-sm">
                    Partners
                </h1>
                <Button
                    onClick={() =>
                        dispatch(
                            openDialog({
                                type: DialogType.AddPartners,
                                dialogProps: {
                                    header: "Add Partner",
                                },
                            })
                        )
                    }
                    variant="outline"
                    className="gap-x-2 shadow-[0px_3px_8px_rgba(0,0,0,0.07)] bg-[#FFFFFF] text-[#DEA004] border-[1px] border-[#C7CBD5]"
                    size="sm"
                >
                    Click to add New
                </Button>
            </div>

            {data && (
                <DataTable
                    columns={modulePartnerColumn}
                    data={data?.data.results || []}
                    isLoading={isFetching}
                />
            )}
        </div>
    );
}
