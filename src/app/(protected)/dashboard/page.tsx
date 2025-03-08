"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  Plus,
  FileText,
  Edit,
  Trash2,
  ExternalLink,
  LineChart,
  Database,
  Filter,
  Calendar,
  Clock,
  Users,
} from "lucide-react";
import { api } from "@/lib/trpc/react";

export default function DashboardPage() {
  // Fetch user's forms
  const {
    data: forms,
    isLoading,
    isError,
    refetch,
  } = api.form.getAll.useQuery();

  // Filter state
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Delete form mutation
  const deleteMutation = api.form.delete.useMutation({
    onSuccess: () => {
      toast.success("Form deleted successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(`Error deleting form: ${error.message}`);
    },
  });

  // State for delete confirmation
  const [formToDelete, setFormToDelete] = useState<string | null>(null);

  // Handle delete button click
  const handleDeleteClick = (formId: string) => {
    setFormToDelete(formId);
  };

  // Handle delete confirmation
  const handleConfirmDelete = () => {
    if (formToDelete) {
      deleteMutation.mutate({ id: formToDelete });
      setFormToDelete(null);
    }
  };

  // Handle cancel delete
  const handleCancelDelete = () => {
    setFormToDelete(null);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  // Get status badge style
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "published":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "archived":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  // Filter forms by status
  const filteredForms = forms?.filter((form) =>
    statusFilter ? form.status === statusFilter : true,
  );

  // Loading state
  if (isLoading) {
    return (
      <div className='p-4'>
        <div className='mb-8 flex items-center justify-between'>
          <h1 className='text-2xl font-bold'>My Collection</h1>
          <div className='h-10 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700'></div>
        </div>

        <div className='mb-6 flex gap-2'>
          <div className='h-6 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700'></div>
          <div className='h-6 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700'></div>
          <div className='h-6 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700'></div>
        </div>

        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className='flex h-full animate-pulse flex-col rounded-lg bg-white shadow dark:bg-gray-800'
            >
              <div className='flex-1 p-6'>
                <div className='mb-4 flex items-start justify-between'>
                  <div className='h-6 w-20 rounded bg-gray-200 dark:bg-gray-700'></div>
                </div>
                <div className='mb-4 h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-700'></div>
                <div className='mb-6 h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700'></div>
                <div className='mt-auto space-y-2'>
                  <div className='h-4 w-40 rounded bg-gray-200 dark:bg-gray-700'></div>
                  <div className='h-4 w-32 rounded bg-gray-200 dark:bg-gray-700'></div>
                </div>
              </div>

              <div className='border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800'>
                <div className='flex justify-between'>
                  <div className='h-8 w-20 rounded bg-gray-200 dark:bg-gray-700'></div>
                  <div className='h-8 w-20 rounded bg-gray-200 dark:bg-gray-700'></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div>
        <div className='rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20'>
          <h2 className='text-lg font-semibold text-red-700 dark:text-red-400'>
            Error Loading Forms
          </h2>
          <p className='text-red-600 dark:text-red-300'>
            Failed to load your forms. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='p-4'>
      {/* Header */}
      <div className='mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
            My Collection
          </h1>
          <p className='mt-1 text-sm text-gray-600 dark:text-gray-400'>
            Manage and analyze your collection
          </p>
        </div>
        <div className='flex space-x-3'>
          <Link
            href='/forms/create'
            className='inline-flex items-center rounded-md bg-blue-600 px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-blue-700'
          >
            <Plus className='mr-1.5 h-5 w-5' />
            Create
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className='mb-6 rounded-lg bg-white p-4 shadow dark:bg-gray-800'>
        <div className='flex flex-wrap items-center gap-2'>
          <span className='mr-2 text-sm font-medium text-gray-700 dark:text-gray-300'>
            <Filter className='mr-1.5 inline h-4 w-4' />
            Filter by status:
          </span>
          <div className='flex flex-wrap gap-2'>
            <button
              onClick={() => setStatusFilter(null)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                statusFilter === null
                  ? "bg-blue-100 text-blue-800 ring-1 ring-blue-400 dark:bg-blue-900/30 dark:text-blue-300 dark:ring-blue-500"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter("draft")}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                statusFilter === "draft"
                  ? "bg-yellow-100 text-yellow-800 ring-1 ring-yellow-400 dark:bg-yellow-900/30 dark:text-yellow-300 dark:ring-yellow-500"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              Draft
            </button>
            <button
              onClick={() => setStatusFilter("published")}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                statusFilter === "published"
                  ? "bg-green-100 text-green-800 ring-1 ring-green-400 dark:bg-green-900/30 dark:text-green-300 dark:ring-green-500"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              Published
            </button>
            <button
              onClick={() => setStatusFilter("archived")}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                statusFilter === "archived"
                  ? "bg-gray-300 text-gray-800 ring-1 ring-gray-400 dark:bg-gray-600 dark:text-gray-200 dark:ring-gray-500"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              Archived
            </button>
          </div>
        </div>
      </div>

      {/* Form list */}
      {filteredForms && filteredForms.length > 0 ? (
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {filteredForms.map((form) => (
            <div
              key={form.id}
              className='group flex h-full flex-col overflow-hidden rounded-lg bg-white shadow transition-shadow hover:shadow-md dark:bg-gray-800'
            >
              <div className='flex flex-1 flex-col p-6'>
                <div className='mb-4 flex items-start justify-between'>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusBadge(form.status)}`}
                  >
                    {form.status.charAt(0).toUpperCase() + form.status.slice(1)}
                  </span>
                </div>

                <Link
                  href={`/forms/${form.id}/edit`}
                  className='block transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400'
                >
                  <h2 className='mb-2 line-clamp-1 text-lg font-semibold text-gray-900 dark:text-white'>
                    {form.title}
                  </h2>
                </Link>

                {form.description && (
                  <p className='mb-4 line-clamp-2 text-sm text-gray-600 dark:text-gray-300'>
                    {form.description}
                  </p>
                )}

                <div className='mt-auto space-y-2 text-xs text-gray-500 dark:text-gray-400'>
                  <div className='flex items-center'>
                    <Calendar className='mr-1.5 h-3.5 w-3.5' />
                    <span>
                      Created: {formatDate(form.createdAt.toString())}
                    </span>
                  </div>
                  <div className='flex items-center'>
                    <Clock className='mr-1.5 h-3.5 w-3.5' />
                    <span>
                      Updated: {formatDate(form.updatedAt.toString())}
                    </span>
                  </div>
                </div>
              </div>

              <div className='border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800'>
                <div className='flex items-center justify-between'>
                  <div className='flex space-x-2'>
                    <Link
                      href={`/forms/${form.id}/edit`}
                      className='rounded p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20'
                      title='Edit Form'
                    >
                      <Edit className='h-4 w-4' />
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(form.id)}
                      className='rounded p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20'
                      title='Delete Form'
                    >
                      <Trash2 className='h-4 w-4' />
                    </button>
                  </div>
                  <div className='flex space-x-2'>
                    {form.status === "published" && (
                      <>
                        <Link
                          href={`/s/${form.publicShareToken}`}
                          target='_blank'
                          className='rounded p-2 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20'
                          title='Open Form'
                        >
                          <ExternalLink className='h-4 w-4' />
                        </Link>
                        <Link
                          href={`/forms/${form.id}/analytics`}
                          className='rounded p-2 text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20'
                          title='View Analytics'
                        >
                          <LineChart className='h-4 w-4' />
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='rounded-lg bg-white p-8 text-center shadow dark:bg-gray-800'>
          <div className='mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700'>
            <FileText className='h-10 w-10 text-gray-400 dark:text-gray-500' />
          </div>
          <h3 className='mb-2 text-xl font-semibold text-gray-900 dark:text-white'>
            {statusFilter ? `No ${statusFilter} forms found` : "No forms yet"}
          </h3>
          <p className='mx-auto mb-8 max-w-md text-gray-600 dark:text-gray-400'>
            {statusFilter
              ? `You don't have any forms with ${statusFilter} status. Try a different filter or create a new form.`
              : "Create your first form to start collecting feedback and valuable data from your audience."}
          </p>
          <div className='flex justify-center space-x-4'>
            <Link
              href='/forms/create'
              className='inline-flex items-center rounded-md bg-blue-500 px-5 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-blue-600'
            >
              <Plus className='mr-2 h-5 w-5' />
              Create New Form
            </Link>
          </div>
          {statusFilter && (
            <button
              onClick={() => setStatusFilter(null)}
              className='mt-6 text-sm text-blue-600 hover:underline dark:text-blue-400'
            >
              View all forms
            </button>
          )}
        </div>
      )}

      {/* Delete confirmation modal */}
      {formToDelete && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4'>
          <div className='w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800'>
            <h3 className='mb-4 text-lg font-semibold text-gray-900 dark:text-white'>
              Delete Form
            </h3>
            <p className='mb-6 text-gray-700 dark:text-gray-300'>
              Are you sure you want to delete this form? This action cannot be
              undone.
            </p>
            <div className='flex justify-end space-x-3'>
              <button
                onClick={handleCancelDelete}
                className='rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className='rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700'
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
