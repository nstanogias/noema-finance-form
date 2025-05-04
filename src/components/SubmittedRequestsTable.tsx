"use client";

import { useFinancing } from "@/context/FinancingContext";

export default function SubmittedRequestsTable() {
  const { submittedRequests, clearSubmittedRequests } = useFinancing();

  if (submittedRequests.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 border-t pt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Submitted Requests</h3>
        <button
          onClick={clearSubmittedRequests}
          className="text-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded cursor-pointer"
        >
          Clear History
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Requestor
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Project Code
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Amount
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Validity Period
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {submittedRequests.map((request, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  {request.requestor}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  {request.projectCode}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  {request.amount} {request.currency}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  {request.validityStartDate} to {request.validityEndDate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
