"use client";

import { useAppSelector } from "hooks/useStore";
import { dailogSelector } from "store/ui";
import { BaseDialog } from "./BaseDialog";
import React, { ReactNode } from "react";
import { DialogType } from "constants/dailogs";
import ProjectObjectiveModal from "@/features/projects/components/modals/ProjectObjectiveModal";
import ConsortiumModal from "@/features/projects/components/modals/ConsortiumModal";
import WorkPlanUploadModal from "@/features/programs/components/modals/WorkPlanUploadModal";

const dialogs: Record<string, ReactNode> = {
    [DialogType.ProjectObjectiveModal]: <ProjectObjectiveModal />,
    [DialogType.ConsortiumModal]: <ConsortiumModal />,
    [DialogType.WorkPlanUpload]: <WorkPlanUploadModal />,
    // Add more modals here as needed
};

const AppDialog = () => {
    const { type, dialogProps } = useAppSelector(dailogSelector);

    const renderModal = () => {
        const modal = dialogs[type];
        if (!modal) return null;

        // Safely merge props
        const mergedProps = {
            ...(modal.props || {}),
            ...(dialogProps || {}),
        };

        return React.cloneElement(modal as React.ReactElement, mergedProps);
    };

    return <BaseDialog>{renderModal()}</BaseDialog>;
};

export default AppDialog;