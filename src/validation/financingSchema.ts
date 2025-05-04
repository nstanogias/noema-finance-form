import { z } from "zod";
import { addDays, addYears, isAfter, parseISO } from "date-fns";
import { PROJECT_CODE_REGEX } from "@/types";

export const financingSchema = z.object({
  requestor: z.string().min(2, "Requestor name is required"),
  originCountry: z.string().min(1, "Country is required"),
  projectCode: z
    .string()
    .regex(
      PROJECT_CODE_REGEX,
      "Project code must be in XXXX-XXXX format with capital letters and digits 1-9"
    ),
  description: z.string().max(150, "Description cannot exceed 150 characters"),
  amount: z.coerce.number().positive("Amount must be positive"),
  currency: z.string().min(1, "Currency is required"),
  validityStartDate: z.string().refine(
    (date: string) => {
      const today = new Date();
      const startDate = parseISO(date);
      const minValidDate = addDays(today, 15);
      return isAfter(startDate, minValidDate);
    },
    { message: "Start date must be at least 15 days from today" }
  ),
  validityEndDate: z.string().superRefine((date: string, ctx) => {
    // Get validityStartDate from the form data
    let validityStartDate: string | undefined;
    try {
      // Try to safely access the form data
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      validityStartDate = (ctx as any).parent?.validityStartDate;
    } catch {
      // If we can't access it, skip validation
      return true;
    }

    if (!validityStartDate) return true;

    const startDate = parseISO(validityStartDate);
    const endDate = parseISO(date);
    const minEndDate = addYears(startDate, 1);
    const maxEndDate = addYears(startDate, 3);

    if (!isAfter(endDate, minEndDate)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End date must be at least 1 year after start date",
      });
      return false;
    }

    if (isAfter(endDate, maxEndDate)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End date cannot be more than 3 years after start date",
      });
      return false;
    }

    return true;
  }),
});

export type FinancingFormData = z.infer<typeof financingSchema>;
