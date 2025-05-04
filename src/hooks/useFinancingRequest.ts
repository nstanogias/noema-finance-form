import { useMutation } from "@tanstack/react-query";
import { submitFinancingRequest } from "@/services/api";
import { FinancingRequest } from "@/types";
import { FinancingFormData } from "@/validation/financingSchema";

export const useFinancingRequest = () => {
  return useMutation({
    mutationFn: (data: FinancingFormData) =>
      submitFinancingRequest(data as unknown as FinancingRequest),
  });
};
