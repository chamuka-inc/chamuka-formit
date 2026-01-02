"use client";

import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface SubmissionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: {
    id: string;
    submittedAt: Date;
    userAgent?: string | null;
    data?: any;
  } | null;
  formData?: any;
}

const SubmissionDetailsModal: React.FC<SubmissionDetailsModalProps> = ({
  isOpen,
  onClose,
  submission,
  formData,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Prevent body scrolling when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      // Restore body scrolling when modal is closed
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Close modal on escape key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !submission) return null;

  // Parse submission data
  const submissionData = submission.data
    ? typeof submission.data === "object"
      ? submission.data
      : { responses: {} }
    : { responses: {} };

  const responses = submissionData.responses || {};

  // Parse form data to get questions
  const formPages = formData?.pages || [];
  const questions: Record<string, { text: string; type: string }> = {};

  // Collect all questions from all pages
  formPages.forEach((page: any) => {
    if (page.questions) {
      page.questions.forEach((question: any) => {
        questions[question.id] = {
          text: question.text,
          type: question.type,
        };
      });
    }
  });

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-overlay/50 p-4'>
      <div
        ref={modalRef}
        className='relative max-h-[90vh] w-full max-w-3xl overflow-auto rounded-lg border border-border bg-background p-4 shadow-xl sm:p-6'
        aria-modal='true'
        role='dialog'
        aria-labelledby='modal-title'
      >
        {/* Close button - positioned absolutely for better mobile experience */}
        <button
          onClick={onClose}
          className='absolute right-2 top-2 rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 sm:right-4 sm:top-4'
          aria-label='Close modal'
        >
          <X className='h-5 w-5 sm:h-6 sm:w-6' />
        </button>

        <div className='mb-6 pr-8'>
          <h2
            id='modal-title'
            className='text-lg font-bold text-gray-900 dark:text-white sm:text-xl'
          >
            Submission Details
          </h2>
        </div>

        <div className='mb-6 grid grid-cols-1 gap-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-700 sm:grid-cols-2'>
          <div>
            <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
              Submission ID
            </p>
            <p className='break-all text-gray-900 dark:text-white'>
              {submission.id}
            </p>
          </div>
          <div>
            <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
              Submitted At
            </p>
            <p className='text-gray-900 dark:text-white'>
              {new Date(submission.submittedAt).toLocaleString()}
            </p>
          </div>
          <div className='col-span-1 sm:col-span-2'>
            <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
              User Agent
            </p>
            <p className='break-words text-gray-900 dark:text-white'>
              {submission.userAgent || "Unknown"}
            </p>
          </div>
        </div>

        <div className='mb-4'>
          <h3 className='mb-2 text-lg font-medium text-gray-900 dark:text-white'>
            Responses
          </h3>

          {Object.keys(responses).length > 0 ? (
            <div className='space-y-4'>
              {Object.entries(responses).map(([questionId, answer]) => (
                <div
                  key={questionId}
                  className='rounded-lg border border-gray-200 p-4 dark:border-gray-700'
                >
                  <p className='mb-2 font-medium text-gray-900 dark:text-white'>
                    {questions[questionId]?.text || `Question (${questionId})`}
                  </p>
                  <div className='rounded-md bg-gray-50 p-3 dark:bg-gray-700'>
                    {Array.isArray(answer) ? (
                      <ul className='list-inside list-disc'>
                        {answer.map((item, index) => (
                          <li
                            key={index}
                            className='text-gray-700 dark:text-gray-300'
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : typeof answer === "object" ? (
                      <pre className='max-w-full overflow-x-auto whitespace-pre-wrap break-words text-sm text-gray-700 dark:text-gray-300'>
                        {JSON.stringify(answer, null, 2)}
                      </pre>
                    ) : (
                      <p className='break-words text-gray-700 dark:text-gray-300'>
                        {String(answer)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='rounded-lg bg-gray-50 p-6 text-center dark:bg-gray-700'>
              <p className='text-gray-600 dark:text-gray-400'>
                No response data available for this submission.
              </p>
            </div>
          )}
        </div>

        {/* Footer with close button for better mobile UX */}
        <div className='mt-6 flex justify-end border-t border-gray-200 pt-4 dark:border-gray-700'>
          <button
            onClick={onClose}
            className='rounded-md bg-gray-200 px-4 py-2 font-medium text-gray-800 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionDetailsModal;
