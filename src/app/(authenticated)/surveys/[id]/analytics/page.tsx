"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { ArrowLeft, BarChart, Download, FileText } from "lucide-react";
import { api } from "@/lib/trpc/react";

export default function SurveyAnalyticsPage() {
  const params = useParams();
  const id = params?.id as string;
  const [activeTab, setActiveTab] = useState<"overview" | "submissions">(
    "overview",
  );

  // Fetch survey data
  const {
    data: survey,
    isLoading: surveyLoading,
    error: surveyError,
  } = api.survey.getById.useQuery({ id });

  // Fetch submissions
  const {
    data: submissions,
    isLoading: submissionsLoading,
    error: submissionsError,
  } = api.survey.getSubmissions.useQuery({ surveyId: id }, { enabled: !!id });

  // Download responses as CSV
  const downloadCSV = () => {
    if (!survey || !submissions) return;

    // Parse survey data
    const surveyData = survey.data
      ? typeof survey.data === "object"
        ? (survey.data as any)
        : { pages: [] }
      : { pages: [] };
    const surveyPages = Array.isArray(surveyData.pages) ? surveyData.pages : [];

    // Prepare headers
    let headers = ["Submission ID", "Submission Date"];
    const questionMap = new Map();

    // Collect all questions from all pages
    surveyPages.forEach((page: any) => {
      if (page.questions) {
        page.questions.forEach((question: any) => {
          questionMap.set(question.id, question.text);
          headers.push(question.text);
        });
      }
    });

    // Create CSV content
    let csvContent = headers.join(",") + "\n";

    // Add submission data
    submissions.forEach((submission) => {
      let row = [
        submission.id,
        new Date(submission.submittedAt).toLocaleString(),
      ];

      // Get the submission data
      const submissionData = submission.data
        ? typeof submission.data === "object"
          ? (submission.data as any)
          : { responses: {} }
        : { responses: {} };
      const responses = submissionData.responses || {};

      // Initialize all question values as empty
      const responseValues = Array(questionMap.size).fill("");

      // Fill in responses
      Object.entries(responses).forEach(([questionId, value]) => {
        const questionIndex = Array.from(questionMap.keys()).indexOf(
          questionId,
        );
        if (questionIndex >= 0) {
          responseValues[questionIndex] =
            `"${String(value).replace(/"/g, '""')}"`;
        }
      });

      row = row.concat(responseValues);
      csvContent += row.join(",") + "\n";
    });

    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${survey.title.replace(/\s+/g, "_")}_responses.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Loading state
  if (surveyLoading || submissionsLoading) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='flex min-h-[60vh] items-center justify-center'>
          <div className='h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500'></div>
        </div>
      </div>
    );
  }

  // Error state
  if (surveyError || submissionsError) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20'>
          <h2 className='text-lg font-semibold text-red-700 dark:text-red-400'>
            Error Loading Data
          </h2>
          <p className='text-red-600 dark:text-red-300'>
            {surveyError?.message ||
              submissionsError?.message ||
              "Failed to load survey data"}
          </p>
        </div>
      </div>
    );
  }

  // No survey found
  if (!survey) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='rounded-lg border border-yellow-200 bg-yellow-50 p-6 dark:border-yellow-800 dark:bg-yellow-900/20'>
          <h2 className='text-lg font-semibold text-yellow-700 dark:text-yellow-400'>
            Survey Not Found
          </h2>
          <p className='text-yellow-600 dark:text-yellow-300'>
            The requested survey does not exist or you don't have access to it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Header */}
      <div className='mb-8'>
        <div className='mb-4 flex items-center'>
          <Link
            href='/dashboard'
            className='mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          >
            <ArrowLeft className='h-5 w-5' />
          </Link>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
            {survey.title} - Analytics
          </h1>
        </div>
        <p className='text-gray-600 dark:text-gray-300'>
          {survey.description || "No description provided"}
        </p>
      </div>

      {/* Tab navigation */}
      <div className='mb-6 border-b border-gray-200 dark:border-gray-700'>
        <nav className='-mb-px flex'>
          <button
            onClick={() => setActiveTab("overview")}
            className={`border-b-2 px-4 py-2 text-center text-sm font-medium ${
              activeTab === "overview"
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            <BarChart className='mr-2 inline-block h-4 w-4' />
            Overview
          </button>
          <button
            onClick={() => setActiveTab("submissions")}
            className={`ml-8 border-b-2 px-4 py-2 text-center text-sm font-medium ${
              activeTab === "submissions"
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            <FileText className='mr-2 inline-block h-4 w-4' />
            Submissions
          </button>
        </nav>
      </div>

      {activeTab === "overview" && (
        <div className='rounded-lg bg-white p-6 shadow dark:bg-gray-800'>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
            <div className='rounded-lg bg-blue-50 p-6 dark:bg-blue-900/20'>
              <h3 className='mb-1 text-lg font-medium text-blue-800 dark:text-blue-300'>
                Total Submissions
              </h3>
              <p className='text-3xl font-bold text-blue-900 dark:text-blue-200'>
                {submissions?.length || 0}
              </p>
            </div>

            <div className='rounded-lg bg-green-50 p-6 dark:bg-green-900/20'>
              <h3 className='mb-1 text-lg font-medium text-green-800 dark:text-green-300'>
                Completion Rate
              </h3>
              <p className='text-3xl font-bold text-green-900 dark:text-green-200'>
                100%
              </p>
            </div>

            <div className='rounded-lg bg-purple-50 p-6 dark:bg-purple-900/20'>
              <h3 className='mb-1 text-lg font-medium text-purple-800 dark:text-purple-300'>
                Average Time
              </h3>
              <p className='text-3xl font-bold text-purple-900 dark:text-purple-200'>
                N/A
              </p>
            </div>
          </div>

          <div className='mt-8'>
            <h3 className='mb-4 text-lg font-medium text-gray-900 dark:text-white'>
              Response Summary
            </h3>

            {submissions && submissions.length > 0 ? (
              <div className='mt-4'>
                <button
                  onClick={downloadCSV}
                  className='inline-flex items-center rounded-md bg-green-500 px-4 py-2 font-medium text-white hover:bg-green-600'
                >
                  <Download className='mr-2 h-5 w-5' />
                  Download CSV
                </button>
              </div>
            ) : (
              <div className='rounded-lg bg-gray-50 p-6 text-center dark:bg-gray-700'>
                <FileText className='mx-auto mb-3 h-12 w-12 text-gray-400 dark:text-gray-500' />
                <h4 className='mb-2 text-lg font-medium text-gray-900 dark:text-white'>
                  No Submissions Yet
                </h4>
                <p className='text-gray-600 dark:text-gray-400'>
                  You haven't received any submissions for this survey yet.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "submissions" && (
        <div className='overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800'>
          {submissions && submissions.length > 0 ? (
            <>
              <div className='flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700'>
                <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
                  All Submissions
                </h3>
                <button
                  onClick={downloadCSV}
                  className='inline-flex items-center rounded-md bg-green-500 px-3 py-1 text-sm font-medium text-white hover:bg-green-600'
                >
                  <Download className='mr-1 h-4 w-4' />
                  Export
                </button>
              </div>
              <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
                  <thead className='bg-gray-50 dark:bg-gray-700'>
                    <tr>
                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300'
                      >
                        ID
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300'
                      >
                        Submitted At
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300'
                      >
                        User Agent
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300'
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800'>
                    {submissions.map((submission) => (
                      <tr
                        key={submission.id}
                        className='hover:bg-gray-50 dark:hover:bg-gray-700'
                      >
                        <td className='whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white'>
                          {submission.id.slice(0, 8)}...
                        </td>
                        <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300'>
                          {new Date(submission.submittedAt).toLocaleString()}
                        </td>
                        <td className='max-w-xs truncate whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300'>
                          {submission.userAgent || "Unknown"}
                        </td>
                        <td className='whitespace-nowrap px-6 py-4 text-right text-sm'>
                          <button
                            onClick={() => {
                              toast.info("Response details coming soon");
                            }}
                            className='text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300'
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className='p-8 text-center'>
              <FileText className='mx-auto mb-3 h-12 w-12 text-gray-400 dark:text-gray-500' />
              <h4 className='mb-2 text-lg font-medium text-gray-900 dark:text-white'>
                No Submissions
              </h4>
              <p className='text-gray-600 dark:text-gray-400'>
                You haven't received any submissions for this survey yet.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
