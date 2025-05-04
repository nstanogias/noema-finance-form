import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { OPEC_COUNTRIES, Country } from "@/types";

export interface CountryData extends Country {
  opec: boolean;
}

export const useCountries = () => {
  return useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      const response = await axios.get("https://restcountries.com/v3.1/all");
      return response.data;
    },
    select: (data) => {
      return data
        .map(
          (country: {
            name?: { common?: string };
            cca2?: string;
          }): CountryData => {
            const commonName = country?.name?.common
              ? String(country.name.common)
              : "";
            const countryCode = country?.cca2 ? String(country.cca2) : "";

            return {
              name: commonName,
              code: countryCode,
              opec: OPEC_COUNTRIES.includes(commonName),
            };
          }
        )
        .sort((a: CountryData, b: CountryData) => a.name.localeCompare(b.name));
    },
  });
};
