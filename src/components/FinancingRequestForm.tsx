"use client";

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, addYears, format, parseISO } from "date-fns";
import { useFinancing } from "@/context/FinancingContext";
import { useCountries, CountryData } from "@/hooks/useCountries";
import { useCurrencies } from "@/hooks/useCurrencies";
import { useFinancingRequest } from "@/hooks/useFinancingRequest";
import {
  financingSchema,
  FinancingFormData,
} from "@/validation/financingSchema";
import { FinancingRequest } from "@/types";
import SubmittedRequestsTable from "./SubmittedRequestsTable";

export default function FinancingRequestForm() {
  const [isCountryOpec, setIsCountryOpec] = useState(false);
  const { addSubmittedRequest } = useFinancing();

  const [validityDateRange, setValidityDateRange] = useState<{
    min?: string;
    max?: string;
  }>({});

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FinancingFormData>({
    resolver: zodResolver(financingSchema),
    defaultValues: {},
  });

  const selectedCountry = watch("originCountry");
  const selectedStartDate = watch("validityStartDate");

  const { data: countriesData = [], isLoading: isLoadingCountries } =
    useCountries();
  const { data: currenciesData = [], isLoading: isLoadingCurrencies } =
    useCurrencies();
  const { mutate, isPending, isSuccess, isError, error } =
    useFinancingRequest();

  useEffect(() => {
    if (selectedStartDate) {
      try {
        const startDate = parseISO(selectedStartDate);
        const minDate = addYears(startDate, 1);
        const maxDate = addYears(startDate, 3);

        setValidityDateRange({
          min: format(minDate, "yyyy-MM-dd"),
          max: format(maxDate, "yyyy-MM-dd"),
        });
      } catch {
        setValidityDateRange({});
      }
    } else {
      setValidityDateRange({});
    }
  }, [selectedStartDate]);

  useEffect(() => {
    if (selectedCountry) {
      const country = countriesData.find(
        (c: CountryData) => c.code === selectedCountry
      );
      if (country?.opec) {
        setIsCountryOpec(true);
        setValue("currency", "USD");
      } else {
        setIsCountryOpec(false);
      }
    }
  }, [selectedCountry, countriesData, setValue]);

  const onSubmit: SubmitHandler<FinancingFormData> = (
    data: FinancingFormData
  ) => {
    mutate(data, {
      onSuccess: () => {
        addSubmittedRequest(data as unknown as FinancingRequest);
        reset();
        setIsCountryOpec(false);
      },
    });
  };

  const handleReset = () => {
    reset();
    setIsCountryOpec(false);
    setValidityDateRange({});
  };

  const minValidityStartDate = format(addDays(new Date(), 15), "yyyy-MM-dd");

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6">New Financing Request</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="requestor" className="block text-sm font-medium">
              Requestor Name/Surname
            </label>
            <input
              id="requestor"
              type="text"
              {...register("requestor")}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="John Doe"
            />
            {errors.requestor && (
              <p className="text-sm text-red-500">{errors.requestor.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="originCountry"
              className="block text-sm font-medium"
            >
              Origin Country
            </label>
            <select
              id="originCountry"
              {...register("originCountry")}
              className="w-full px-3 py-2 border rounded-md"
              disabled={isLoadingCountries}
            >
              <option value="">Select country</option>
              {countriesData.map((country: CountryData) => (
                <option key={country.code} value={country.code}>
                  {country.name} {country.opec ? "(OPEC)" : ""}
                </option>
              ))}
            </select>
            {errors.originCountry && (
              <p className="text-sm text-red-500">
                {errors.originCountry.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="projectCode" className="block text-sm font-medium">
            Project Code (Format: XXXX-XXXX)
          </label>
          <input
            id="projectCode"
            type="text"
            {...register("projectCode")}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="PROJ-1234"
          />
          <p className="text-xs text-gray-500">
            4 capital letters A-Z, followed by a hyphen, followed by 4 digits
            1-9
          </p>
          {errors.projectCode && (
            <p className="text-sm text-red-500">{errors.projectCode.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            {...register("description")}
            rows={3}
            maxLength={150}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Brief description of the financing request (max 150 characters)"
          />
          <p className="text-xs text-gray-500">Maximum 150 characters</p>
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="amount" className="block text-sm font-medium">
              Payment Amount
            </label>
            <input
              id="amount"
              type="number"
              step="0.01"
              {...register("amount")}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="0.00"
            />
            {errors.amount && (
              <p className="text-sm text-red-500">{errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="currency" className="block text-sm font-medium">
              Payment Currency
            </label>
            <select
              id="currency"
              {...register("currency")}
              className="w-full px-3 py-2 border rounded-md"
              disabled={isCountryOpec || isLoadingCurrencies}
            >
              <option value="">Select currency</option>
              {currenciesData.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.name}
                </option>
              ))}
            </select>
            {isCountryOpec && (
              <p className="text-xs text-amber-600">
                OPEC member countries must use USD for payment
              </p>
            )}
            {errors.currency && (
              <p className="text-sm text-red-500">{errors.currency.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="validityStartDate"
              className="block text-sm font-medium"
            >
              Validity Start Date
            </label>
            <input
              id="validityStartDate"
              type="date"
              min={minValidityStartDate}
              {...register("validityStartDate")}
              className="w-full px-3 py-2 border rounded-md"
            />
            <p className="text-xs text-gray-500">
              Must be at least 15 days from today
            </p>
            {errors.validityStartDate && (
              <p className="text-sm text-red-500">
                {errors.validityStartDate.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="validityEndDate"
              className="block text-sm font-medium"
            >
              Validity End Date
            </label>
            <input
              id="validityEndDate"
              type="date"
              min={validityDateRange.min}
              max={validityDateRange.max}
              disabled={!selectedStartDate}
              {...register("validityEndDate")}
              className="w-full px-3 py-2 border rounded-md"
            />
            <p className="text-xs text-gray-500">
              {selectedStartDate
                ? `Must be between ${validityDateRange.min} and ${validityDateRange.max}`
                : "Select a start date first"}
            </p>
            {errors.validityEndDate && (
              <p className="text-sm text-red-500">
                {errors.validityEndDate?.message as string}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 border rounded-md text-gray-600 cursor-pointer"
            disabled={isPending}
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 cursor-pointer"
          >
            {isPending ? "Submitting..." : "Submit Request"}
          </button>
        </div>

        {isSuccess && (
          <div className="p-3 bg-green-50 text-green-700 rounded-md">
            Financing request submitted successfully!
          </div>
        )}

        {isError && (
          <div className="p-3 bg-red-50 text-red-700 rounded-md">
            Error submitting request:{" "}
            {error instanceof Error ? error.message : "Unknown error"}
          </div>
        )}
      </form>

      <SubmittedRequestsTable />
    </div>
  );
}
