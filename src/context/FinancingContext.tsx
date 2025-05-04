"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { FinancingRequest } from "@/types";

interface FinancingContextType {
  submittedRequests: FinancingRequest[];
  addSubmittedRequest: (request: FinancingRequest) => void;
  clearSubmittedRequests: () => void;
}

const FinancingContext = createContext<FinancingContextType | undefined>(
  undefined
);

export function FinancingProvider({ children }: { children: ReactNode }) {
  const [submittedRequests, setSubmittedRequests] = useState<
    FinancingRequest[]
  >([]);

  const addSubmittedRequest = (request: FinancingRequest) => {
    setSubmittedRequests((prev) => [...prev, request]);
  };

  const clearSubmittedRequests = () => {
    setSubmittedRequests([]);
  };

  return (
    <FinancingContext.Provider
      value={{ submittedRequests, addSubmittedRequest, clearSubmittedRequests }}
    >
      {children}
    </FinancingContext.Provider>
  );
}

export const useFinancing = () => {
  const context = useContext(FinancingContext);
  if (context === undefined) {
    throw new Error("useFinancing must be used within a FinancingProvider");
  }
  return context;
};
