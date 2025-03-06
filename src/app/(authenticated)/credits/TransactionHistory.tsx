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
  const { data: transactions, isLoading } = api.credits.getTransactionHistory.useQuery();
  
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded"></div>
      </div>
    );
  }
  
  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <p>No transaction history yet.</p>
      </div>
    );
  }
  
  // Helper function to get transaction type display
  const getTransactionTypeDisplay = (transaction: Transaction) => {
    if (transaction.credits > 0) {
      return "Purchase";
    }
    
    switch(transaction.type) {
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
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-3">Transaction History</h3>
      <div className="border rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Credits
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  {formatDistanceToNow(new Date(transaction.createdAt), { addSuffix: true })}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <span className={transaction.credits > 0 ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}>
                    {getTransactionTypeDisplay(transaction)}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <span className={`font-medium ${transaction.credits > 0 ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}`}>
                    {transaction.credits > 0 ? '+' : ''}{transaction.credits}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  {transaction.amount > 0 ? 
                    `$${(transaction.amount / 100).toFixed(2)}` : 
                    '—'
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 