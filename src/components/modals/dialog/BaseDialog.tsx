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

    // Filter out custom props that shouldn't be passed to DOM elements
    const {
        header,
        description,
        width,
        className,
        grantId,
        projectId,
        subGrantId,
        isSubGrant,
        data,
        disbursement,
        ...domSafeProps
    } = dialogProps || {};

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent
                className={width || className || "max-w-lg"}
                aria-describedby={description ? "dialog-description" : undefined}
                {...domSafeProps}
            >
                {header ? (
                    <DialogHeader>
                        <DialogTitle>{header}</DialogTitle>
                        {description && (
                            <DialogDescription id="dialog-description">
                                {description}
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