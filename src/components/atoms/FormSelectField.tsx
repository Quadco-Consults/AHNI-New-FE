"use client";

import React, { forwardRef } from "react";
import SmartFormSelect from "./SmartFormSelect";

type TOption = {
  label: string;
  value: string;
};

interface SelectProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  options?: TOption[];
  disabled?: boolean;
  children?: React.ReactNode;
  onValueChange?: (value: string) => void;
  // Smart behavior configuration (inherited from SmartFormSelect)
  searchThreshold?: number;
  forceSearch?: boolean;
  forceSelect?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
}

/**
 * Enhanced FormSelect with Smart Search Capabilities
 *
 * 🎯 **Auto-Smart Behavior:**
 * - Small lists (< 10 items): Regular dropdown
 * - Large lists (≥ 10 items): Searchable combobox
 *
 * 🔧 **Manual Override:**
 * - forceSearch={true}: Always searchable
 * - forceSelect={true}: Always regular dropdown
 * - searchThreshold={N}: Custom threshold for auto-search
 *
 * ✅ **100% Backward Compatible** with existing FormSelect usage
 */
const FormSelect = forwardRef<HTMLButtonElement, SelectProps>((props, ref) => {
  return <SmartFormSelect {...props} ref={ref} />;
});

FormSelect.displayName = "FormSelect";

export default FormSelect;