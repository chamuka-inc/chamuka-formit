import { Metadata } from "next";
import { CreditPurchaseForm } from "./CreditPurchaseForm";
import { TransactionHistory } from "./TransactionHistory";

export const metadata: Metadata = {
  title: "Credits | Form Builder",
  description: "Purchase credits to use premium features",
};

export default function CreditsPage() {
  return (
    <div className='container max-w-6xl py-10'>
      <div className='mb-8'>
        <h1 className='mb-2 text-3xl font-bold'>Credits</h1>
        <p className='text-muted-foreground'>
          Purchase credits to use premium features. Credits can be used for AI
          generation and other advanced functionality.
        </p>
      </div>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
        <div className='md:col-span-1'>
          <CreditPurchaseForm />
        </div>

        <div className='col-span-1 space-y-6 md:col-span-2'>
          <div className='rounded-lg bg-muted p-6'>
            <h2 className='mb-4 text-xl font-semibold'>How Credits Work</h2>
            <ul className='list-disc space-y-2 pl-5'>
              <li>
                Credits allow you to use premium features like AI generation
              </li>
              <li>Free users get 5 credits per month</li>
              <li>Purchased credits never expire</li>
              <li>
                Credits are used automatically when you use premium features
              </li>
            </ul>
          </div>

          <div className='rounded-lg bg-muted p-6'>
            <h2 className='mb-4 text-xl font-semibold'>Premium Features</h2>
            <ul className='list-disc space-y-2 pl-5'>
              <li>AI-generated forms - save hours of design time</li>
              <li>
                Data exports - export your form results in various formats
              </li>
              <li>
                Advanced analytics - get deeper insights into your form results
              </li>
              <li>
                Coming soon: Custom branding, advanced question types, and more
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
