import { Metadata } from "next";
import { CreditPurchaseForm } from "./CreditPurchaseForm";
import { TransactionHistory } from "./TransactionHistory";
import { Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Credits | Form Builder",
  description: "Purchase credits to use premium features",
};

export default function CreditsPage() {
  return (
    <div className='container max-w-6xl py-12 px-6 mx-auto'>
      <div className='mb-12'>
        <h1 className='text-3xl font-bold tracking-tight mb-2'>
          Credits & Billing
        </h1>
        <p className='text-sm font-medium text-muted-foreground'>
          Manage your credit balance and explore premium features.
        </p>
      </div>

      <div className='grid grid-cols-1 gap-12 md:grid-cols-3'>
        <div className='md:col-span-1'>
          <CreditPurchaseForm />
        </div>

        <div className='col-span-1 space-y-8 md:col-span-2'>
          <div className='rounded-2xl border border-border bg-muted/30 p-8 shadow-sm'>
            <h2 className='mb-6 text-lg font-bold tracking-tight'>How it works</h2>
            <ul className='list-none space-y-4 text-sm font-medium text-muted-foreground'>
              <li className='flex items-start'>
                <div className='mr-3 mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0' />
                Credits are used to power AI generation and advanced features.
              </li>
              <li className='flex items-start'>
                <div className='mr-3 mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0' />
                Standard accounts receive 5 complimentary credits every month.
              </li>
              <li className='flex items-start'>
                <div className='mr-3 mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0' />
                Purchased credits remain in your account until used.
              </li>
              <li className='flex items-start'>
                <div className='mr-3 mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0' />
                Balance is automatically updated upon feature usage.
              </li>
            </ul>
          </div>

          <div className='rounded-2xl border border-border bg-muted/30 p-8 shadow-sm'>
            <h2 className='mb-6 text-lg font-bold tracking-tight'>Premium Features</h2>
            <ul className='list-none space-y-4 text-sm font-medium text-muted-foreground'>
              <li className='flex items-start'>
                <div className='mr-3 mt-1 h-4 w-4 rounded bg-primary/10 flex items-center justify-center shrink-0'>
                  <Sparkles className='h-2.5 w-2.5 text-primary' />
                </div>
                <span>AI-Powered Forms — Design complex forms in seconds.</span>
              </li>
              <li className='flex items-start'>
                <div className='mr-3 mt-1 h-4 w-4 rounded bg-primary/10 flex items-center justify-center shrink-0'>
                  <Sparkles className='h-2.5 w-2.5 text-primary' />
                </div>
                <span>Advanced Analytics — Gain deeper insights from your responses.</span>
              </li>
              <li className='flex items-start'>
                <div className='mr-3 mt-1 h-4 w-4 rounded bg-primary/10 flex items-center justify-center shrink-0'>
                  <Sparkles className='h-2.5 w-2.5 text-primary' />
                </div>
                <span>Data Export — Extract your data in multiple professional formats.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className='col-span-1 md:col-span-3'>
          <TransactionHistory />
        </div>
      </div>
    </div>
  );
}
