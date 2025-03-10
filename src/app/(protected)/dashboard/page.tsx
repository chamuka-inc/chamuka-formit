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
  Filter,
  Calendar,
  Clock,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { api } from "@/lib/trpc/react";

// Types
interface Form {
  id: string;
  title: string;
  description: string | null;
  status: "draft" | "published" | "archived";
  createdAt: Date;
  updatedAt: Date;
  publicShareToken?: string;
}

interface PaginationData {
  total: number;
  pageCount: number;
  page: number;
  limit: number;
}

// Constants
const ITEMS_PER_PAGE = 9;
const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
};

// Components
const SearchBar = ({
  value,
  onChange,
  onSearch,
  onKeyDown,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}) => (
  <div className='relative flex flex-1 sm:max-w-xs'>
    <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
      <Search className='h-5 w-5 text-gray-400' />
    </div>
    <input
      type='text'
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder='Search forms...'
      className='block w-full rounded-l-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400'
    />
    <button
      onClick={onSearch}
      className='inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
    >
      Search
    </button>
  </div>
);

const StatusFilter = ({
  currentFilter,
  onFilterChange,
}: {
  currentFilter: string | null;
  onFilterChange: (status: string | null) => void;
}) => {
  const filters = [
    { label: "All", value: null },
    { label: "Draft", value: "draft" },
    { label: "Published", value: "published" },
    { label: "Archived", value: "archived" },
  ];

  const getFilterStyle = (status: string | null) => {
    switch (status) {
      case "draft":
        return "bg-yellow-100 text-yellow-800 ring-1 ring-yellow-400 dark:bg-yellow-900/30 dark:text-yellow-300 dark:ring-yellow-500";
      case "published":
        return "bg-green-100 text-green-800 ring-1 ring-green-400 dark:bg-green-900/30 dark:text-green-300 dark:ring-green-500";
      case "archived":
        return "bg-gray-300 text-gray-800 ring-1 ring-gray-400 dark:bg-gray-600 dark:text-gray-200 dark:ring-gray-500";
      case null:
        return "bg-blue-100 text-blue-800 ring-1 ring-blue-400 dark:bg-blue-900/30 dark:text-blue-300 dark:ring-blue-500";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600";
    }
  };

  return (
    <div className='flex flex-wrap items-center gap-2'>
      <span className='mr-2 text-sm font-medium text-gray-700 dark:text-gray-300'>
        <Filter className='mr-1.5 inline h-4 w-4' />
        Filter by status:
      </span>
      <div className='flex flex-wrap gap-2'>
        {filters.map(({ label, value }) => (
          <button
            key={label}
            onClick={() => onFilterChange(value)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              currentFilter === value
                ? getFilterStyle(value)
                : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

const FormCard = ({
  form,
  onDelete,
}: {
  form: Form;
  onDelete: (id: string) => void;
}) => {
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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", DATE_FORMAT_OPTIONS).format(date);
  };

  return (
    <div className='group flex h-full flex-col overflow-hidden rounded-lg bg-white shadow transition-shadow hover:shadow-md dark:bg-gray-800'>
      <div className='flex flex-1 flex-col p-6'>
        <div className='mb-4 flex items-start justify-between'>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusBadge(
              form.status,
            )}`}
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
            <span>Created: {formatDate(form.createdAt)}</span>
          </div>
          <div className='flex items-center'>
            <Clock className='mr-1.5 h-3.5 w-3.5' />
            <span>Updated: {formatDate(form.updatedAt)}</span>
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
              onClick={() => onDelete(form.id)}
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
  );
};

const Pagination = ({
  currentPage,
  pageCount,
  total,
  onPageChange,
}: {
  currentPage: number;
  pageCount: number;
  total: number;
  onPageChange: (page: number) => void;
}) => (
  <div className='mt-6 flex items-center justify-between border-t border-gray-200 px-4 py-3 dark:border-gray-700 sm:px-6'>
    {/* Mobile pagination */}
    <div className='flex flex-1 justify-between sm:hidden'>
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className='relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
      >
        Previous
      </button>
      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, pageCount))}
        disabled={currentPage === pageCount}
        className='relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
      >
        Next
      </button>
    </div>

    {/* Desktop pagination */}
    <div className='hidden sm:flex sm:flex-1 sm:items-center sm:justify-between'>
      <div>
        <p className='text-sm text-gray-700 dark:text-gray-300'>
          Showing{" "}
          <span className='font-medium'>
            {(currentPage - 1) * ITEMS_PER_PAGE + 1}
          </span>{" "}
          to{" "}
          <span className='font-medium'>
            {Math.min(currentPage * ITEMS_PER_PAGE, total)}
          </span>{" "}
          of <span className='font-medium'>{total}</span> results
        </p>
      </div>
      <div>
        <nav
          className='isolate inline-flex -space-x-px rounded-md shadow-sm'
          aria-label='Pagination'
        >
          <button
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className='relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
          >
            <span className='sr-only'>Previous</span>
            <ChevronLeft className='h-5 w-5' />
          </button>
          {Array.from({ length: pageCount }).map((_, index) => {
            const pageNumber = index + 1;
            const isCurrentPage = pageNumber === currentPage;

            return (
              <button
                key={pageNumber}
                onClick={() => onPageChange(pageNumber)}
                className={`relative inline-flex items-center border px-4 py-2 text-sm font-medium ${
                  isCurrentPage
                    ? "z-10 border-blue-600 bg-blue-600 text-white dark:border-blue-700 dark:bg-blue-700"
                    : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}
          <button
            onClick={() => onPageChange(Math.min(currentPage + 1, pageCount))}
            disabled={currentPage === pageCount}
            className='relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
          >
            <span className='sr-only'>Next</span>
            <ChevronRight className='h-5 w-5' />
          </button>
        </nav>
      </div>
    </div>
  </div>
);

const DeleteConfirmationModal = ({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) => (
  <div className='fixed inset-0 z-50 overflow-y-auto'>
    <div className='flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0'>
      <div
        className='fixed inset-0 transition-opacity'
        aria-hidden='true'
        onClick={onCancel}
      >
        <div className='absolute inset-0 bg-gray-500 opacity-75 dark:bg-gray-900'></div>
      </div>

      <span
        className='hidden sm:inline-block sm:h-screen sm:align-middle'
        aria-hidden='true'
      >
        &#8203;
      </span>

      <div className='inline-block transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left align-bottom shadow-xl transition-all dark:bg-gray-800 sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle'>
        <div className='sm:flex sm:items-start'>
          <div className='mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20 sm:mx-0 sm:h-10 sm:w-10'>
            <Trash2 className='h-6 w-6 text-red-600 dark:text-red-400' />
          </div>
          <div className='mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left'>
            <h3 className='text-lg font-medium leading-6 text-gray-900 dark:text-white'>
              Delete Form
            </h3>
            <div className='mt-2'>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                Are you sure you want to delete this form? This action cannot be
                undone.
              </p>
            </div>
          </div>
        </div>
        <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse'>
          <button
            type='button'
            onClick={onConfirm}
            className='inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm'
          >
            Delete
          </button>
          <button
            type='button'
            onClick={onCancel}
            className='mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 sm:mt-0 sm:w-auto sm:text-sm'
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default function DashboardPage() {
  // Search state
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [formToDelete, setFormToDelete] = useState<string | null>(null);

  // Fetch forms data
  const { data, isLoading, isError, refetch } = api.form.getAll.useQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: search || undefined,
  });

  // Delete mutation
  const deleteMutation = api.form.delete.useMutation({
    onSuccess: () => {
      toast.success("Form deleted successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(`Error deleting form: ${error.message}`);
    },
  });

  // Event handlers
  const handleSearch = () => {
    setSearch(searchInput.trim());
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleDeleteClick = (formId: string) => {
    setFormToDelete(formId);
  };

  const handleConfirmDelete = () => {
    if (formToDelete) {
      deleteMutation.mutate({ id: formToDelete });
      setFormToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setFormToDelete(null);
  };

  // Filter forms
  const filteredForms = data?.forms.filter((form) =>
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
          {Array.from({ length: 6 }).map((_, i) => (
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

      {/* Search and Filters */}
      <div className='mb-6 rounded-lg bg-white p-4 shadow dark:bg-gray-800'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <SearchBar
            value={searchInput}
            onChange={handleSearchChange}
            onSearch={handleSearch}
            onKeyDown={handleKeyDown}
          />
          <StatusFilter
            currentFilter={statusFilter}
            onFilterChange={setStatusFilter}
          />
        </div>
      </div>

      {/* Form list */}
      {filteredForms && filteredForms.length > 0 ? (
        <>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {filteredForms.map((form) => (
              <FormCard
                key={form.id}
                form={form}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>

          {/* Pagination */}
          {data?.pagination && data.pagination.pageCount > 1 && (
            <Pagination
              currentPage={currentPage}
              pageCount={data.pagination.pageCount}
              total={data.pagination.total}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      ) : (
        <div className='rounded-lg border-2 border-dashed border-gray-300 p-12 text-center dark:border-gray-700'>
          <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800'>
            <FileText className='h-6 w-6 text-gray-600 dark:text-gray-400' />
          </div>
          <h3 className='mt-2 text-sm font-medium text-gray-900 dark:text-white'>
            No forms found
          </h3>
          <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
            {search
              ? "No forms match your search criteria"
              : "Get started by creating a new form"}
          </p>
          {!search && (
            <div className='mt-6'>
              <Link
                href='/forms/create'
                className='inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700'
              >
                <Plus className='mr-1.5 h-5 w-5' />
                Create Form
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {formToDelete && (
        <DeleteConfirmationModal
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
}
