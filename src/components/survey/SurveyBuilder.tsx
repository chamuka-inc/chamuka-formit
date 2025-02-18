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
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <header className="relative overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse-slow opacity-70"></div>
        <div className="relative z-10 py-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-white drop-shadow-sm transition-transform transform hover:scale-105">
            Survey Builder
          </h1>
        </div>
      </header>

      {/* Tab Navigation */}
      <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Main Content */}
      <div className="mb-12">
        {activeTab === 'builder' ? (
          <div className="flex flex-col md:flex-row">
            <PageListSidebar onAddPage={handleOpenPageModal} />
            <div className="md:w-3/4">
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