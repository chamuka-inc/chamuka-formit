"use client";

import { useState } from 'react';
import { SurveyContextProvider } from '@/lib/context/SurveyContext';
import { TabNavigation } from './TabNavigation';
import { PageListSidebar } from './PageListSidebar';
import { PageContent } from './PageContent';
import { PagePreview } from './PagePreview';
import { PageModal } from './PageModal';
import { QuestionModal } from './QuestionModal';
import { useSurveyContext } from '@/lib/context/SurveyContext';
import { Layout } from 'lucide-react';

const SurveyBuilderContent = () => {
  const [activeTab, setActiveTab] = useState<'builder' | 'preview'>('builder');
  const [isPageModalOpen, setIsPageModalOpen] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);

  const {
    pages,
    currentPageIndex,
    addPage,
    updatePage,
    addQuestion,
    updateQuestion,
  } = useSurveyContext();

  const handleTabChange = (tab: 'builder' | 'preview') => {
    setActiveTab(tab);
  };

  const handleOpenPageModal = (isEditing = false) => {
    setIsPageModalOpen(true);
  };

  const handleClosePageModal = () => {
    setIsPageModalOpen(false);
  };

  const handleOpenQuestionModal = (questionIndex = -1) => {
    setCurrentQuestionIndex(questionIndex);
    setIsQuestionModalOpen(true);
  };

  const handleCloseQuestionModal = () => {
    setCurrentQuestionIndex(-1);
    setIsQuestionModalOpen(false);
  };

  const handleSavePage = (page: any) => {
    if (currentPageIndex === -1) {
      addPage(page);
    } else {
      updatePage(currentPageIndex, page);
    }
  };

  const handleSaveQuestion = (question: any) => {
    if (currentQuestionIndex === -1) {
      addQuestion(currentPageIndex, question);
    } else {
      updateQuestion(currentPageIndex, currentQuestionIndex, question);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Enhanced Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
        <div className="relative z-10 px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl text-center">
            <div className="flex items-center justify-center mb-4">
              <Layout className="h-10 w-10 text-white opacity-90" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              Survey Builder
            </h1>
            <p className="mx-auto mt-3 max-w-md text-base text-gray-100 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
              Create beautiful, interactive surveys with our modern builder
            </p>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      </header>

      {/* Main Content with Enhanced Container */}
      <main className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl">
          <div className="p-6">
            <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />

            <div className="mb-12">
              {activeTab === 'builder' ? (
                <div className="flex flex-col lg:flex-row gap-6">
                  <PageListSidebar onAddPage={handleOpenPageModal} />
                  <div className="lg:flex-1">
                    <PageContent
                      onEditPage={handleOpenPageModal}
                      onAddQuestion={handleOpenQuestionModal}
                    />
                  </div>
                </div>
              ) : (
                <PagePreview />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <PageModal
        isOpen={isPageModalOpen}
        onClose={handleClosePageModal}
        currentPage={currentPageIndex !== -1 ? pages[currentPageIndex] : undefined}
        onSave={handleSavePage}
      />

      <QuestionModal
        isOpen={isQuestionModalOpen}
        onClose={handleCloseQuestionModal}
        currentQuestion={
          currentQuestionIndex !== -1 && currentPageIndex !== -1
            ? pages[currentPageIndex].questions[currentQuestionIndex]
            : undefined
        }
        onSave={handleSaveQuestion}
      />
    </div>
  );
};

export const SurveyBuilder = () => {
  return (
    <SurveyContextProvider>
      <SurveyBuilderContent />
    </SurveyContextProvider>
  );
}; 