/**
 * SearchIcon - Migrated to Lucide React
 *
 * MIGRATION: 2026-05-20 Phase 2
 * Old: Custom SVG with dark stroke color (#20293A)
 * New: Lucide Search icon with matching dark color
 *
 * This file now re-exports from LucideMigration.tsx for consistency
 * across the application. The old SVG implementation is preserved
 * below as a comment for reference.
 */

export { SearchIcon as default, SearchIconMigrated as SearchIcon } from './LucideMigration';

/*
====================================================================================================
OLD IMPLEMENTATION (PRESERVED AS REFERENCE - Can be removed after 2026-06-20)
====================================================================================================

Original custom SVG implementation:

type Props = {
    size?: string
}

const SearchIcon = ({size = '24'}: Props) => {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.667 11.667L14.667 14.667" stroke="#20293A" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.333 7.33301C13.333 4.0193 10.6467 1.33301 7.33301 1.33301C4.0193 1.33301 1.33301 4.0193 1.33301 7.33301C1.33301 10.6467 4.0193 13.333 7.33301 13.333C10.6467 13.333 13.333 10.6467 13.333 7.33301Z" stroke="#20293A" strokeLinejoin="round"/>
    </svg>

  )
}

export default SearchIcon

====================================================================================================
END OF OLD IMPLEMENTATION
====================================================================================================
*/