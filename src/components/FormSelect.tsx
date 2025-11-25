"use client";

import { FC } from "react";
import SmartFormSelect from "./SmartFormSelect";
import { useDisableNumberInputScroll } from "../hooks/useDisableNumberInputScroll";

// Support for legacy IOptions interface from definations/schema
interface IOptions {
  label: string;
  value: string | number | boolean;
}

interface SelectProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  options?: IOptions[];
  className?: string;
  // Smart behavior configuration
  searchThreshold?: number;
  forceSearch?: boolean;
  forceSelect?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  onValueChange?: (value: string) => void;
}

/**
 * Enhanced FormSelect with Smart Search Capabilities
 *
 * Compatible with legacy IOptions interface and className wrapper
 *
 * 🎯 **Auto-Smart Behavior:**
 * - Small lists (< 10 items): Regular dropdown
 * - Large lists (≥ 10 items): Searchable combobox
 *
 * ✅ **100% Backward Compatible** with existing FormSelect usage
 */
const FormSelect: FC<SelectProps> = (props) => {
  useDisableNumberInputScroll();

  return <SmartFormSelect {...props} />;
};

export default FormSelect;
