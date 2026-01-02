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
      <Search className='h-4 w-4 text-muted-foreground' />
    </div>
    <input
      type='text'
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder='Search forms...'
      className='block w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3 text-sm transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10'
    />
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
    if (status === null) return "bg-primary text-primary-foreground";
    switch (status) {
      case "draft":
        return "bg-warning/10 text-warning border-warning/20";
      case "published":
        return "bg-success/10 text-success border-success/20";
      case "archived":
        return "bg-secondary text-secondary-foreground";
      default:
        return "bg-background text-foreground border-border";
    }
  };

  return (
    <div className='flex flex-wrap items-center gap-3'>
      <span className='text-xs font-semibold text-muted-foreground'>
        Filter:
      </span>
      <div className='flex flex-wrap gap-2'>
        {filters.map(({ label, value }) => (
          <button
            key={label}
            onClick={() => onFilterChange(value)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
              currentFilter === value
                ? getFilterStyle(value) + " shadow-sm"
                : "border border-border bg-background text-foreground hover:bg-muted"
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
        return "bg-warning/10 text-warning";
      case "published":
        return "bg-success/10 text-success";
      case "archived":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", DATE_FORMAT_OPTIONS).format(date);
  };

  return (
    <div className='group flex h-full flex-col rounded-2xl border border-border bg-background transition-all hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5'>
      <div className='flex flex-1 flex-col p-6'>
        <div className='mb-4 flex items-start justify-between'>
          <span
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(
              form.status,
            )}`}
          >
            {form.status}
          </span>
        </div>

        <Link href={`/forms/${form.id}/edit`} className='block'>
          <h2 className='mb-2 line-clamp-1 text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary'>
            {form.title}
          </h2>
        </Link>

        {form.description && (
          <p className='mb-6 line-clamp-2 text-sm font-medium leading-relaxed text-muted-foreground'>
            {form.description}
          </p>
        )}

        <div className='mt-auto space-y-2 border-t border-border/50 pt-4 text-[11px] font-medium text-muted-foreground'>
          <div className='flex items-center'>
            <Calendar className='mr-2 h-3 w-3 opacity-60' />
            <span>Created {formatDate(form.createdAt)}</span>
          </div>
          <div className='flex items-center'>
            <Clock className='mr-2 h-3 w-3 opacity-60' />
            <span>Updated {formatDate(form.updatedAt)}</span>
          </div>
        </div>
      </div>

      <div className='rounded-b-2xl border-t border-border bg-muted/30 p-4'>
        <div className='flex items-center justify-between'>
          <div className='flex gap-1'>
            <Link
              href={`/forms/${form.id}/edit`}
              className='rounded-lg p-2 text-muted-foreground transition-all hover:bg-background hover:text-primary'
              title='Edit Form'
            >
              <Edit className='h-4 w-4' />
            </Link>
            <button
              onClick={() => onDelete(form.id)}
              className='rounded-lg p-2 text-muted-foreground transition-all hover:bg-background hover:text-destructive'
              title='Delete Form'
            >
              <Trash2 className='h-4 w-4' />
            </button>
          </div>
          <div className='flex gap-1'>
            {form.status === "published" && (
              <>
                <Link
                  href={`/s/${form.publicShareToken}`}
                  target='_blank'
                  className='rounded-lg p-2 text-muted-foreground transition-all hover:bg-background hover:text-success'
                  title='Open Form'
                >
                  <ExternalLink className='h-4 w-4' />
                </Link>
                <Link
                  href={`/forms/${form.id}/analytics`}
                  className='rounded-lg p-2 text-muted-foreground transition-all hover:bg-background hover:text-primary'
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
  <div className='mt-8 flex items-center justify-between rounded-2xl border border-border bg-background p-4 shadow-sm'>
    {/* Mobile pagination */}
    <div className='flex flex-1 justify-between sm:hidden'>
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className='rounded-xl border border-border bg-background px-4 py-2 text-xs font-semibold transition-all hover:bg-muted disabled:opacity-50'
      >
        Previous
      </button>
      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, pageCount))}
        disabled={currentPage === pageCount}
        className='rounded-xl border border-border bg-background px-4 py-2 text-xs font-semibold transition-all hover:bg-muted disabled:opacity-50'
      >
        Next
      </button>
    </div>

    {/* Desktop pagination */}
    <div className='hidden sm:flex sm:flex-1 sm:items-center sm:justify-between'>
      <div>
        <p className='text-xs font-medium text-muted-foreground'>
          Showing{" "}
          <span className='font-bold text-foreground'>
            {(currentPage - 1) * ITEMS_PER_PAGE + 1}
          </span>{" "}
          to{" "}
          <span className='font-bold text-foreground'>
            {Math.min(currentPage * ITEMS_PER_PAGE, total)}
          </span>{" "}
          of <span className='font-bold text-foreground'>{total}</span> forms
        </p>
      </div>
      <div>
        <nav className='flex gap-1.5' aria-label='Pagination'>
          <button
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className='rounded-lg border border-border bg-background p-2 transition-all hover:bg-muted disabled:opacity-50'
          >
            <ChevronLeft className='h-4 w-4' />
          </button>
          {Array.from({ length: pageCount }).map((_, index) => {
            const pageNumber = index + 1;
            const isCurrentPage = pageNumber === currentPage;

            return (
              <button
                key={pageNumber}
                onClick={() => onPageChange(pageNumber)}
                className={`flex h-9 w-9 items-center justify-center rounded-lg border text-xs font-bold transition-all ${
                  isCurrentPage
                    ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "border-border bg-background text-foreground hover:bg-muted"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}
          <button
            onClick={() => onPageChange(Math.min(currentPage + 1, pageCount))}
            disabled={currentPage === pageCount}
            className='rounded-lg border border-border bg-background p-2 transition-all hover:bg-muted disabled:opacity-50'
          >
            <ChevronRight className='h-4 w-4' />
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
      <div className='mx-auto max-w-7xl p-8'>
        <div className='mb-10 flex items-end justify-between'>
          <div className='space-y-3'>
            <div className='h-9 w-48 animate-pulse rounded-lg bg-muted'></div>
            <div className='h-4 w-64 animate-pulse rounded-lg bg-muted'></div>
          </div>
          <div className='h-12 w-40 animate-pulse rounded-xl bg-muted'></div>
        </div>

        <div className='mb-10 rounded-2xl border border-border bg-background p-6 shadow-sm'>
          <div className='flex gap-6'>
            <div className='h-10 flex-1 animate-pulse rounded-xl bg-muted'></div>
            <div className='h-10 w-64 animate-pulse rounded-xl bg-muted'></div>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className='flex h-[400px] animate-pulse flex-col rounded-2xl border border-border bg-background'
            >
              <div className='flex-1 p-6'>
                <div className='mb-4 h-5 w-16 rounded-full bg-muted'></div>
                <div className='mb-4 h-7 w-3/4 rounded-lg bg-muted'></div>
                <div className='mb-6 h-4 w-1/2 rounded-lg bg-muted'></div>
                <div className='mt-auto space-y-3'>
                  <div className='h-3 w-40 rounded bg-muted'></div>
                  <div className='h-3 w-32 rounded bg-muted'></div>
                </div>
              </div>
              <div className='h-20 rounded-b-2xl border-t border-border bg-muted/30'></div>
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
    <div className='mx-auto max-w-7xl p-8'>
      {/* Header */}
      <div className='mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between'>
        <div className='min-w-0 flex-1'>
          <h1 className='mb-2 text-3xl font-bold tracking-tight'>My Forms</h1>
          <p className='text-sm font-medium text-muted-foreground'>
            Manage your content and view performance analytics.
          </p>
        </div>
        <div className='flex shrink-0'>
          <Link
            href='/forms/create'
            className='inline-flex items-center rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] hover:bg-primary-hover active:scale-100'
          >
            <Plus className='mr-2 h-5 w-5' />
            Create New Form
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className='mb-10 rounded-2xl border border-border bg-background p-6 shadow-sm'>
        <div className='flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between'>
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
          <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
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
        <div className='rounded-2xl border border-dashed border-border bg-muted/30 p-16 text-center'>
          <div className='mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-background shadow-sm'>
            <FileText className='h-8 w-8 text-primary' />
          </div>
          <h3 className='mb-2 text-xl font-bold tracking-tight'>
            No forms yet
          </h3>
          <p className='mb-8 text-sm font-medium text-muted-foreground'>
            {search
              ? "No forms match your search criteria"
              : "Get started by creating your first form structure."}
          </p>
          {!search && (
            <Link
              href='/forms/create'
              className='inline-flex items-center rounded-xl bg-primary px-8 py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] hover:bg-primary-hover'
            >
              <Plus className='mr-2 h-5 w-5' />
              Create Form
            </Link>
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
