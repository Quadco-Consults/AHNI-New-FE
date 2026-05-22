/**
 * DownloadIcon - Migrated to Lucide React
 *
 * MIGRATION: 2026-05-20 Phase 2
 * Old: Custom SVG with currentColor
 * New: Lucide Download icon
 *
 * This file now re-exports from LucideMigration.tsx for consistency
 * across the application. The old SVG implementation is preserved
 * below as a comment for reference.
 */

export { DownloadIcon as default, DownloadIconMigrated as DownloadIcon } from './LucideMigration';

/*
====================================================================================================
OLD IMPLEMENTATION (PRESERVED AS REFERENCE - Can be removed after 2026-06-20)
====================================================================================================

Original custom SVG implementation:

import React from "react";

type Props = {
  size?: string;
};

const DownloadIcon = ({ size = "16" }: Props) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 1C8.27614 1 8.5 1.22386 8.5 1.5V9.79289L10.6464 7.64645C10.8417 7.45118 11.1583 7.45118 11.3536 7.64645C11.5488 7.84171 11.5488 8.15829 11.3536 8.35355L8.35355 11.3536C8.15829 11.5488 7.84171 11.5488 7.64645 11.3536L4.64645 8.35355C4.45118 8.15829 4.45118 7.84171 4.64645 7.64645C4.84171 7.45118 5.15829 7.45118 5.35355 7.64645L7.5 9.79289V1.5C7.5 1.22386 7.72386 1 8 1Z"
        fill="currentColor"
      />
      <path
        d="M2.5 13.5C2.5 13.2239 2.72386 13 3 13H13C13.2761 13 13.5 13.2239 13.5 13.5C13.5 13.7761 13.2761 14 13 14H3C2.72386 14 2.5 13.7761 2.5 13.5Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default DownloadIcon;

====================================================================================================
END OF OLD IMPLEMENTATION
====================================================================================================
*/