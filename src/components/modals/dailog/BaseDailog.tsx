import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "components/ui/dialog";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { cn } from "lib/utils";
import * as React from "react";
import { closeDialog, dailogSelector } from "store/ui";

export function BaseDailog({ children }: { children: React.ReactNode }) {
  const { isOpen, dialogProps } = useAppSelector(dailogSelector);
  const dispatch = useAppDispatch();

  const header = dialogProps?.header;
  //   const isDesktop = useMediaQuery("(min-width: 768px)");

  //   if (isDesktop) {
  return (
    <Dialog open={isOpen} onOpenChange={() => dispatch(closeDialog())}>
      <DialogContent
        className={cn(
          "overflow-auto",
          dialogProps?.width ? `${dialogProps.width}` : "sm:max-w-[425px]",
          dialogProps?.height && `${dialogProps.height}`
        )}
      >
        {header ? (
          <DialogHeader className="py-5">
            <DialogTitle className="font-semibold text-center">
              {header}
            </DialogTitle>
          </DialogHeader>
        ) : undefined}
        {children}
      </DialogContent>
    </Dialog>
  );
}
