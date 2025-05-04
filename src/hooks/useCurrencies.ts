import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Currency } from "@/types";

export const useCurrencies = () => {
  return useQuery({
    queryKey: ["currencies"],
    queryFn: async () => {
      const response = await axios.get(
        "https://openexchangerates.org/api/currencies.json"
      );
      return response.data;
    },
    select: (data) => {
      return Object.entries(data).map(
        ([code, name]) =>
          ({
            code,
            name: `${code} - ${String(name)}`,
          } as Currency)
      );
    },
  });
};
