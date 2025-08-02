declare module "*.png";
declare module "*.svg";
declare module "*.jpeg";
declare module "*.jpg";

// types.ts
export interface FilterField {
  name: string;
  label: string;
  type: "string" | "uuid" | "date" | "enum" | "boolean" | "number";
  enumValues?: { label: string; value: string }[];
  placeholder?: string;
}
