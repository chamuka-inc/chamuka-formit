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
    <div className='rounded-3xl border border-border bg-background p-8 shadow-sm'>
      <div className='mb-8'>
        <h3 className='mb-1 text-xl font-bold tracking-tight'>Buy Credits</h3>
        <p className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
          Balance:{" "}
          <span className='text-primary'>{credits?.credits || 0} Units</span>
        </p>
      </div>

      <div className='mb-8 space-y-4'>
        {creditPackages.map((pkg) => (
          <button
            key={pkg.id}
            className={`flex w-full flex-col items-start rounded-2xl border-2 p-4 text-left transition-all ${
              selectedPackage === pkg.id
                ? "border-primary bg-primary/5 shadow-lg shadow-primary/5"
                : "border-border bg-background text-foreground hover:bg-muted"
            } ${pkg.popular ? "relative" : ""} `}
            onClick={() => setSelectedPackage(pkg.id)}
          >
            {pkg.popular && (
              <div className='absolute -right-1 -top-2 rounded-full bg-primary px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-primary-foreground shadow-sm'>
                Popular
              </div>
            )}
            <div className='flex w-full items-center justify-between'>
              <div className='min-w-0'>
                <div className='text-sm font-bold tracking-tight'>
                  {pkg.name}
                </div>
                <div
                  className={`truncate text-[11px] font-medium ${selectedPackage === pkg.id ? "text-primary/70" : "text-muted-foreground"}`}
                >
                  {pkg.description}
                </div>
              </div>
              <div className='ml-4 shrink-0 text-right'>
                <div className='text-sm font-bold tracking-tight text-primary'>
                  {pkg.credits} Units
                </div>
                <div className='text-xs font-semibold text-muted-foreground'>
                  ${(pkg.amount / 100).toFixed(2)}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <button
        className='w-full rounded-xl bg-primary px-6 py-4 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50'
        onClick={handlePurchase}
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Purchase Credits"}
      </button>

      <div className='mt-6 text-center text-[10px] font-medium text-muted-foreground'>
        Payments are processed securely. No credit card data is stored on our
        servers.
      </div>
    </div>
  );
}
