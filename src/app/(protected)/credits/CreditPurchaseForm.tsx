"use client";

import { useState } from "react";
import { api } from "@/lib/trpc/react";
import { toast } from "react-toastify";
import { CreditTransactionType } from "@/lib/types";

// Credit package options
const creditPackages = [
  {
    id: "small",
    name: "Basic",
    credits: 10,
    amount: 500,
    description: "Perfect for occasional users",
  },
  {
    id: "medium",
    name: "Plus",
    credits: 25,
    amount: 1000,
    description: "Great for regular users",
    popular: true,
  },
  {
    id: "large",
    name: "Pro",
    credits: 50,
    amount: 1800,
    description: "Best value for power users",
  },
];

export function CreditPurchaseForm() {
  const [selectedPackage, setSelectedPackage] = useState<string>("medium");
  const [isLoading, setIsLoading] = useState(false);

  const { data: credits, refetch: refetchCredits } =
    api.credits.getCredits.useQuery();
  const { mutate: purchaseCredits } = api.credits.purchaseCredits.useMutation({
    onSuccess: () => {
      refetchCredits();
      toast.success("Credits purchased successfully!");
      setIsLoading(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to purchase credits");
      setIsLoading(false);
    },
  });

  const handlePurchase = () => {
    const selectedPkg = creditPackages.find(
      (pkg) => pkg.id === selectedPackage,
    );
    if (!selectedPkg) return;

    setIsLoading(true);
    purchaseCredits({
      credits: selectedPkg.credits,
      amount: selectedPkg.amount,
      type: CreditTransactionType.PURCHASE,
      description: `Purchased ${selectedPkg.credits} credits (${selectedPkg.name} package)`,
    });
  };

  return (
    <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800'>
      <div className='mb-4 flex items-center justify-between'>
        <h3 className='text-lg font-medium'>Purchase Credits</h3>
        <div className='text-sm'>
          <span className='text-gray-500 dark:text-gray-400'>
            Current Balance:
          </span>{" "}
          <span className='font-medium'>{credits?.credits || 0} credits</span>
        </div>
      </div>

      <div className='mb-6 space-y-3'>
        {creditPackages.map((pkg) => (
          <div
            key={pkg.id}
            className={`cursor-pointer rounded-lg border p-4 transition ${
              selectedPackage === pkg.id
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-200 hover:border-blue-300 dark:border-gray-700 dark:hover:border-blue-700"
            } ${pkg.popular ? "relative" : ""} `}
            onClick={() => setSelectedPackage(pkg.id)}
          >
            {pkg.popular && (
              <div className='absolute -right-2 -top-2 rounded-full bg-blue-500 px-2 py-1 text-xs text-white'>
                Most Popular
              </div>
            )}
            <div className='flex justify-between'>
              <div>
                <div className='font-medium'>{pkg.name}</div>
                <div className='text-sm text-gray-500 dark:text-gray-400'>
                  {pkg.description}
                </div>
              </div>
              <div className='text-right'>
                <div className='font-bold'>{pkg.credits} credits</div>
                <div className='text-sm'>${(pkg.amount / 100).toFixed(2)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        className='w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
        onClick={handlePurchase}
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Purchase Credits"}
      </button>

      <div className='mt-4 text-center text-xs text-gray-500 dark:text-gray-400'>
        Secure payment processing. No credit card information is stored on our
        servers.
      </div>
    </div>
  );
}
