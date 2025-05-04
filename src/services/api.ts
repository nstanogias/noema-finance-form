import axios from "axios";
import { FinancingRequest } from "@/types";

export const api = axios.create({
  baseURL: "http://test-noema-api.azurewebsites.net",
  headers: {
    "Content-Type": "application/json",
  },
});

export const submitFinancingRequest = async (data: FinancingRequest) => {
  const response = await api.post("/api/requests", data);
  return response.data;
};
