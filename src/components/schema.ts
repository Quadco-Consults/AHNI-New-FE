import { z } from "zod";

export const uiSchema = z.object({
  sheet: z.object({
    isOpen: z.boolean(),
    type: z.string(),
    sheetProps: z
      .record(z.string(), z.union([z.string(), z.object({})]))
      .optional(),
  }),
  dailog: z.object({
    isOpen: z.boolean(),
    type: z.string(),
    dialogProps: z
      .record(z.union([z.string(), z.array(z.string())]))
      .optional(),
  }),
});

export type IOptions = {
  label: string;
  value: string | number | boolean;
};
