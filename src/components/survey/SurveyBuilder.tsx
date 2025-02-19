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
import { Layout, Menu } from 'lucide-react';

const SurveyBuilderContent = () => {
  const [activeTab, setActiveTab] = useState<'builder' | 'preview'>('builder');
  const [isPageModalOpen, setIsPageModalOpen] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const {
    pages,
    currentPageIndex,
    addPage,
    updatePage,
    addQuestion,
    updateQuestion,
    setCurrentPageIndex,
  } = useSurveyContext();

  const handleTabChange = (tab: 'builder' | 'preview') => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  const handleOpenPageModal = () => {
    if (currentPageIndex === -1) {
      setCurrentPageIndex(-1);
    }
    setIsPageModalOpen(true);
    setIsSidebarOpen(false);
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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Lean Header */}
      <header className="relative bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative z-10 px-4 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Layout className="h-5 w-5 sm:h-6 sm:w-6 text-white/90" />
              <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-white">
                Survey Builder
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-white/80">
              {pages.length} page{pages.length !== 1 ? 's' : ''} created
            </p>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      </header>

      {/* Main Content with Enhanced Container */}
      <main className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl">
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />
              {activeTab === 'builder' && (
                <button
                  onClick={toggleSidebar}
                  className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Menu className="h-6 w-6" />
                </button>
              )}
            </div>
            <div className="hidden lg:block mb-8">
              <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />
            </div>

            <div className="mb-12">
              {activeTab === 'builder' ? (
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Sidebar for mobile */}
                  <div
                    className={`
                      fixed inset-0 z-40 lg:hidden transition-transform duration-300 transform
                      ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    `}
                  >
                    <div className="absolute inset-0 bg-black/40" onClick={toggleSidebar} />
                    <div className="relative w-80 h-full bg-white dark:bg-gray-800 p-4 overflow-y-auto">
                      <PageListSidebar onAddPage={handleOpenPageModal} />
                    </div>
                  </div>
                  
                  {/* Sidebar for desktop */}
                  <div className="hidden lg:block">
                    <PageListSidebar onAddPage={handleOpenPageModal} />
                  </div>
                  
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