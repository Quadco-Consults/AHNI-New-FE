"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "components/ui/dialog";
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
                className={dialogProps?.width || dialogProps?.className || "max-w-lg"}
                aria-describedby={dialogProps?.description ? "dialog-description" : undefined}
                {...(dialogProps || {})}
            >
                {dialogProps?.header ? (
                    <DialogHeader>
                        <DialogTitle>{dialogProps.header}</DialogTitle>
                        {dialogProps?.description && (
                            <DialogDescription id="dialog-description">
                                {dialogProps.description}
                            </DialogDescription>
                        )}
                    </DialogHeader>
                ) : (
                    <>
                        <DialogTitle className="sr-only">Dialog</DialogTitle>
                        <DialogDescription className="sr-only">Dialog content</DialogDescription>
                    </>
                )}
                {children}
            </DialogContent>
        </Dialog>
    );
};