import FinancingRequestForm from "@/components/FinancingRequestForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Noema Finance
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Global Financing Request Portal
          </p>
        </div>

        <FinancingRequestForm />
      </div>
    </div>
  );
}
