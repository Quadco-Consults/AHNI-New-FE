"use client";

import { Dialog, DialogContent } from "components/ui/dialog";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { FC, ReactNode } from "react";
import { closeDialog, dailogSelector } from "store/ui";

type PageProps = {
    children: ReactNode;
};

export const BaseDialog: FC<PageProps> = ({ children }) => {
    const dispatch = useAppDispatch();
    const { isOpen, dialogProps } = useAppSelector(dailogSelector);

    const handleClose = () => {
        dispatch(closeDialog());
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent
                className={dialogProps?.className || "max-w-lg"}
                {...(dialogProps || {})}
            >
                {children}
            </DialogContent>
        </Dialog>
    );
};