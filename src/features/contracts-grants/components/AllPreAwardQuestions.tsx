"use client";

import { Button } from "components/ui/button";
import { toast } from "sonner";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import TableAction from "components/atoms/TableAction";
import { LoadingSpinner } from "components/Loading";
import {
    useGetAllPreAwardQuestionsManager,
    DeletePreAwardQuestionManager,
} from "@/features/modules/controllers/cg/preAwardQuestionController";
import { useState } from "react";
import Pagination from "components/Pagination";

export default function AllPreAwardQuestions() {
    const [page, setPage] = useState(1);

    const { data: preAwardQuestions, isLoading: isFetching } = useGetAllPreAwardQuestionsManager({
        page,
        size: 20,
    });

    const dispatch = useAppDispatch();

    const { deletePreAwardQuestion, isLoading: isDeleteLoading } =
        DeletePreAwardQuestionManager();

    const onSubmit = async (id: string) => {
        try {
            await deletePreAwardQuestion(id);
            toast.success("Deleted Successfully");
        } catch (error: any) {
            toast.error(error.data?.message ?? "Something went wrong");
        }
    };

    const onUpdate = (item: any) => {
        dispatch(
            openDialog({
                type: DialogType.ADD_PRE_AWARD_QUESTION_MODAL,
                dialogProps: {
                    header: "Update Pre-Award Question",
                    data: item,
                    type: "update",
                },
            })
        );
    };
    return (
        <div>
            <div className="flex items-center justify-between py-6 mb-6">
                <h1 className="text-[#D92D20] font-semibold text-sm">
                    Pre-Award Questions
                </h1>

                <Button
                    onClick={() =>
                        dispatch(
                            openDialog({
                                type: DialogType.ADD_PRE_AWARD_QUESTION_MODAL,
                                dialogProps: {
                                    header: "Add Pre-Award Question",
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
            <div>
                <div className="flex justify-between text-[#756D6D] font-semibold text-sm mb-10">
                    <h1 className="flex-1">Question</h1>
                    <h1 className="flex-1">Type</h1>
                    <h1 className="flex-1">Required</h1>
                    <h1 className="flex-1">Status</h1>
                    <h1 className="flex-1"></h1>
                </div>

                {isFetching || isDeleteLoading ? (
                    <LoadingSpinner />
                ) : (
                    <div>
                        {preAwardQuestions?.results?.map((item) => {
                            return (
                                <div
                                    key={item.id}
                                    className="flex justify-between mt-6 text-[#756D6D] font-normal text-xs"
                                >
                                    <p className="flex-1">{item.question}</p>
                                    <p className="flex-1">
                                        {item.question_type}
                                    </p>
                                    <p className="flex-1">{item.is_required ? "Yes" : "No"}</p>
                                    <p className="flex-1">
                                        {item.is_active ? "Active" : "Inactive"}
                                    </p>
                                    <div className="flex-1">
                                        <TableAction
                                            update
                                            removeView
                                            action={() => onSubmit(item.id)}
                                            updateAction={() => onUpdate(item)}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                <Pagination
                    total={preAwardQuestions?.pagination?.count ?? 0}
                    itemsPerPage={preAwardQuestions?.pagination?.page_size ?? 0}
                    onChange={(page: number) => setPage(page)}
                />
            </div>
        </div>
    );
}
