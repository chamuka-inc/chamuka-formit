"use client";

import { useFormContext } from "@/lib/context/Context";
import { Question } from "./Question";
import { ContextElements } from "./ContextElements";
import { Pencil, Plus, Trash2, FileText } from "lucide-react";

interface PageContentProps {
  onEditPage: () => void;
  onAddQuestion: (questionIndex?: number) => void;
}

export const PageContent = ({
  onEditPage,
  onAddQuestion,
}: PageContentProps) => {
  const {
    state: { pages, currentPageIndex },
    deleteQuestion,
    deletePage,
  } = useFormContext();

  const currentPage = pages[currentPageIndex];

  const handleDeletePage = () => {
    deletePage(currentPageIndex);
  };

  if (!currentPage) {
    return (
      <div className='flex h-[60vh] flex-col items-center justify-center p-4 text-center sm:p-8'>
        <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted sm:h-16 sm:w-16'>
          <FileText className='h-6 w-6 text-muted-foreground sm:h-8 sm:w-8' />
        </div>
        <h2 className='mb-2 text-lg font-semibold text-foreground sm:text-xl'>
          No Page Selected
        </h2>
        <p className='max-w-sm text-sm text-muted-foreground sm:text-base'>
          Select a page from the sidebar or create a new one to start building
          your form.
        </p>
      </div>
    );
  }

  return (
    <div className='p-4 sm:p-6'>
      <div className='mb-6 flex flex-col items-start justify-between gap-4 sm:mb-8 sm:flex-row sm:items-center'>
        <div className='flex items-center gap-3'>
          <FileText className='h-5 w-5 text-muted-foreground sm:h-6 sm:w-6' />
          <div>
            <h2 className='text-xl font-bold text-foreground sm:text-2xl'>
              {currentPage.title}
            </h2>
            <p className='text-xs text-muted-foreground sm:text-sm'>
              {currentPage.questions?.length
                ? `${currentPage.questions.length} question${currentPage.questions.length !== 1 ? "s" : ""}`
                : "No questions"}
              {currentPage.contextElements?.length
                ? `, ${currentPage.contextElements.length} content element${currentPage.contextElements.length !== 1 ? "s" : ""}`
                : ""}
            </p>
          </div>
        </div>

        <div className='flex w-full items-center gap-3 sm:w-auto'>
          <button
            onClick={onEditPage}
            className='inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary sm:flex-none sm:gap-2 sm:px-4 sm:py-2.5'
          >
            <Pencil className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
            Edit Page
          </button>
          <button
            onClick={handleDeletePage}
            className='inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/20 sm:flex-none sm:gap-2 sm:px-4 sm:py-2.5'
          >
            <Trash2 className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
            Delete
          </button>
        </div>
      </div>

      <div className='space-y-4 sm:space-y-6'>
        {/* Context Elements Section */}
        {currentPage.contextElements &&
          currentPage.contextElements.length > 0 && (
            <div className='rounded-xl border border-border bg-background p-4 sm:p-6'>
              <ContextElements elements={currentPage.contextElements} />
            </div>
          )}

        {/* Questions Section */}
        {currentPage.questions?.map((question, index) => (
          <Question
            key={question.id || index}
            question={question}
            index={index}
            mode='builder'
            onEdit={(index) => onAddQuestion(index)}
            onDelete={() => deleteQuestion(currentPageIndex, index)}
          />
        ))}

        {!currentPage.questions?.length &&
          !currentPage.contextElements?.length && (
            <div className='rounded-xl border-2 border-dashed border-border py-8 text-center sm:py-12'>
              <FileText className='mx-auto mb-3 h-10 w-10 text-muted-foreground sm:mb-4 sm:h-12 sm:w-12' />
              <p className='text-sm text-foreground-secondary sm:text-base'>
                No content added to this page yet.
              </p>
              <p className='mt-1 text-xs text-muted-foreground sm:text-sm'>
                Click the "Edit Page" button to add content or add a question
                below.
              </p>
            </div>
          )}

        <button
          onClick={() => onAddQuestion()}
          className='mt-6 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-accent/80 sm:mt-8 sm:gap-2 sm:py-3'
        >
          <Plus className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
          Add Question
        </button>
      </div>
    </div>
  );
};
