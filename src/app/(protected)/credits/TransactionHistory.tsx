"use client";

import { api } from "@/lib/trpc/react";
import { formatDistanceToNow } from "date-fns";
import { CreditTransactionType } from "@/lib/types";

interface Transaction {
  id: string;
  credits: number;
  amount: number;
  type: string;
  description?: string | null;
  createdAt: Date;
}

export function TransactionHistory() {
  // Default to showing all transactions, but could be filtered by type
  const { data: transactions, isLoading } =
    api.credits.getTransactionHistory.useQuery();

  if (isLoading) {
    return (
      <div className='w-full animate-pulse space-y-3'>
        <div className='h-10 rounded bg-gray-200 dark:bg-gray-800'></div>
        <div className='h-10 rounded bg-gray-200 dark:bg-gray-800'></div>
        <div className='h-10 rounded bg-gray-200 dark:bg-gray-800'></div>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className='w-full py-6 text-center text-muted-foreground'>
        <p>No transaction history yet.</p>
      </div>
    );
  }

  // Helper function to get transaction type display
  const getTransactionTypeDisplay = (transaction: Transaction) => {
    if (transaction.credits > 0) {
      return "Purchase";
    }

    switch (transaction.type) {
      case CreditTransactionType.AI:
        return "AI Generation";
      case CreditTransactionType.EXPORT:
        return "Data Export";
      case CreditTransactionType.ANALYTICS:
        return "Analytics Usage";
      case CreditTransactionType.REFUND:
        return "Refund";
      default:
        return transaction.description || transaction.type;
    }
  };

  return (
    <div className='w-full'>
      <h3 className='mb-6 text-xl font-bold tracking-tight'>Transaction History</h3>
      <div className='w-full border border-border rounded-2xl bg-background overflow-hidden shadow-sm'>
        <div className='max-h-[400px] w-full overflow-y-auto'>
          <table className='w-full table-fixed border-collapse'>
            <thead className='sticky top-0 bg-muted/50 backdrop-blur-md z-10'>
              <tr className="border-b border-border">
                <th
                  scope='col'
                  className='w-1/4 px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground'
                >
                  Date
                </th>
                <th
                  scope='col'
                  className='w-1/4 px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground'
                >
                  Type
                </th>
                <th
                  scope='col'
                  className='w-1/4 px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground'
                >
                  Credits
                </th>
                <th
                  scope='col'
                  className='w-1/4 px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground'
                >
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border/50'>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-muted/30 transition-colors">
                  <td className='truncate px-6 py-4 text-xs font-medium text-muted-foreground'>
                    {formatDistanceToNow(new Date(transaction.createdAt), {
                      addSuffix: true,
                    })}
                  </td>
                  <td className='truncate px-6 py-4 text-xs font-bold'>
                    <span
                      className={
                        transaction.credits > 0
                          ? "text-success"
                          : "text-primary"
                      }
                    >
                      {getTransactionTypeDisplay(transaction)}
                    </span>
                  </td>
                  <td className='truncate px-6 py-4 text-xs font-bold'>
                    <span
                      className={transaction.credits > 0 ? "text-success" : "text-primary"}
                    >
                      {transaction.credits > 0 ? "+" : ""}
                      {transaction.credits}
                    </span>
                  </td>
                  <td className='truncate px-6 py-4 text-xs font-bold text-foreground'>
                    {transaction.amount > 0
                      ? `$${(transaction.amount / 100).toFixed(2)}`
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
