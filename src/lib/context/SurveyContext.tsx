"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { SurveyContextType, SurveyPage, Question } from '../types';

const SurveyContext = createContext<SurveyContextType | null>(null);

export const useSurveyContext = () => {
  const context = useContext(SurveyContext);
  if (!context) {
    throw new Error('useSurveyContext must be used within a SurveyContextProvider');
  }
  return context;
};

export const SurveyContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [pages, setPages] = useState<SurveyPage[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(-1);
  const [previewPageIndex, setPreviewPageIndex] = useState(0);

  useEffect(() => {
    loadFromLocalStorage();
    if (pages.length === 0) {
      setupSampleSurvey();
    }
  }, []);

  useEffect(() => {
    saveToLocalStorage();
  }, [pages]);

  const loadFromLocalStorage = () => {
    const storedData = localStorage.getItem('surveyData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setPages(parsedData);
      if (parsedData.length > 0) {
        setCurrentPageIndex(0);
      }
    }
  };

  const saveToLocalStorage = () => {
    localStorage.setItem('surveyData', JSON.stringify(pages));
  };

  const addPage = (newPage: SurveyPage) => {
    setPages([...pages, newPage]);
    setCurrentPageIndex(pages.length);
  };

  const updatePage = (index: number, updatedPage: SurveyPage) => {
    const updatedPages = [...pages];
    updatedPages[index] = updatedPage;
    setPages(updatedPages);
  };

  const deletePage = (index: number) => {
    const updatedPages = pages.filter((_, i) => i !== index);
    setPages(updatedPages);
    if (updatedPages.length === 0) {
      setCurrentPageIndex(-1);
      setPreviewPageIndex(0);
    } else {
      setCurrentPageIndex(Math.max(0, currentPageIndex - 1));
      setPreviewPageIndex(Math.min(previewPageIndex, updatedPages.length - 1));
    }
  };

  const selectPage = (index: number) => {
    setCurrentPageIndex(index);
  };

  const movePageUp = (index: number) => {
    if (index <= 0) return;
    const updatedPages = [...pages];
    [updatedPages[index - 1], updatedPages[index]] = [updatedPages[index], updatedPages[index - 1]];
    setPages(updatedPages);
    if (currentPageIndex === index) {
      setCurrentPageIndex(index - 1);
    } else if (currentPageIndex === index - 1) {
      setCurrentPageIndex(index);
    }
  };

  const movePageDown = (index: number) => {
    if (index >= pages.length - 1) return;
    const updatedPages = [...pages];
    [updatedPages[index + 1], updatedPages[index]] = [updatedPages[index], updatedPages[index + 1]];
    setPages(updatedPages);
    if (currentPageIndex === index) {
      setCurrentPageIndex(index + 1);
    } else if (currentPageIndex === index + 1) {
      setCurrentPageIndex(index);
    }
  };

  const addQuestion = (pageIndex: number, newQuestion: Question) => {
    if (pageIndex === -1) return;
    const updatedPages = [...pages];
    updatedPages[pageIndex].questions = [...updatedPages[pageIndex].questions, newQuestion];
    setPages(updatedPages);
  };

  const updateQuestion = (pageIndex: number, questionIndex: number, updatedQuestion: Question) => {
    if (pageIndex === -1) return;
    const updatedPages = [...pages];
    updatedPages[pageIndex].questions[questionIndex] = updatedQuestion;
    setPages(updatedPages);
  };

  const deleteQuestion = (pageIndex: number, questionIndex: number) => {
    if (pageIndex === -1) return;
    const updatedPages = [...pages];
    updatedPages[pageIndex].questions = updatedPages[pageIndex].questions.filter((_, i) => i !== questionIndex);
    setPages(updatedPages);
  };

  const showPreviousPreviewPage = () => {
    if (previewPageIndex > 0) {
      setPreviewPageIndex(previewPageIndex - 1);
    }
  };

  const showNextPreviewPage = () => {
    if (previewPageIndex < pages.length - 1) {
      setPreviewPageIndex(previewPageIndex + 1);
    }
  };

  const setupSampleSurvey = () => {
    const samplePages: SurveyPage[] = [
      {
        title: "Customer Satisfaction Survey - Page 1",
        pageType: "survey",
        questions: [
          {
            contextElements: [
              { type: 'paragraph', content: 'We value your input! Please provide your contact information below.' },
              { type: 'image', content: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=400&q=80' }
            ],
            type: "text",
            text: "What is your name?"
          },
          {
            type: "text",
            text: "What is your email address?"
          }
        ]
      },
      {
        title: "Information Page - About Us",
        pageType: "info",
        questions: [],
        contextElements: [
          { type: 'paragraph', content: 'Discover our journey. We are dedicated to innovation and excellence.' },
          { type: 'image', content: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80' }
        ]
      }
    ];
    setPages(samplePages);
    setCurrentPageIndex(0);
  };

  const value = {
    pages,
    currentPageIndex,
    previewPageIndex,
    setPages,
    setCurrentPageIndex,
    setPreviewPageIndex,
    addPage,
    updatePage,
    deletePage,
    selectPage,
    movePageUp,
    movePageDown,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    showPreviousPreviewPage,
    showNextPreviewPage,
  };

  return (
    <SurveyContext.Provider value={value}>
      {children}
    </SurveyContext.Provider>
  );
}; 