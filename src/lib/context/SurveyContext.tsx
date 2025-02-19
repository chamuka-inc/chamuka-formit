"use client";

import { createContext, useContext, useEffect, useReducer, useCallback } from 'react';
import { SurveyContextType, SurveyPage, Question, SurveyState, SurveyAction } from '../types';
import { surveyReducer, initialState } from './SurveyReducer';
import { createHistoryReducer, HistoryState } from './SurveyHistory';
import { createStorageManager } from './SurveyStorage';

const SurveyContext = createContext<SurveyContextType | null>(null);
const storageManager = createStorageManager('surveyData');

export const useSurveyContext = () => {
  const context = useContext(SurveyContext);
  if (!context) {
    throw new Error('useSurveyContext must be used within a SurveyContextProvider');
  }
  return context;
};

const initialHistoryState: HistoryState<SurveyState> = {
  past: [],
  present: initialState,
  future: [],
};

export const SurveyContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [history, dispatch] = useReducer(createHistoryReducer(surveyReducer), initialHistoryState);
  const state = history.present;

  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  useEffect(() => {
    if (!state.isLoading) {
      storageManager.save(state);
    }
  }, [state.pages]);

  const loadFromLocalStorage = () => {
    try {
      const loadedState = storageManager.load();
      if (loadedState) {
        dispatch({ type: 'LOAD_SURVEY', payload: loadedState.pages });
      } else {
        setupSampleSurvey();
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load survey data' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loadSurvey = useCallback((pages: SurveyPage[]) => {
    dispatch({ type: 'LOAD_SURVEY', payload: pages });
  }, []);

  const addPage = useCallback((page: SurveyPage) => {
    dispatch({ type: 'ADD_PAGE', payload: page });
  }, []);

  const updatePage = useCallback((index: number, page: SurveyPage) => {
    dispatch({ type: 'UPDATE_PAGE', payload: { index, page } });
  }, []);

  const deletePage = useCallback((index: number) => {
    dispatch({ type: 'DELETE_PAGE', payload: index });
  }, []);

  const selectPage = useCallback((index: number) => {
    dispatch({ type: 'SELECT_PAGE', payload: index });
  }, []);

  const movePageUp = useCallback((index: number) => {
    if (index > 0) {
      dispatch({ type: 'MOVE_PAGE', payload: { fromIndex: index, toIndex: index - 1 } });
    }
  }, [state.pages.length]);

  const movePageDown = useCallback((index: number) => {
    if (index < state.pages.length - 1) {
      dispatch({ type: 'MOVE_PAGE', payload: { fromIndex: index, toIndex: index + 1 } });
    }
  }, [state.pages.length]);

  const addQuestion = useCallback((pageIndex: number, question: Question) => {
    dispatch({ type: 'ADD_QUESTION', payload: { pageIndex, question } });
  }, []);

  const updateQuestion = useCallback((pageIndex: number, questionIndex: number, question: Question) => {
    dispatch({ type: 'UPDATE_QUESTION', payload: { pageIndex, questionIndex, question } });
  }, []);

  const deleteQuestion = useCallback((pageIndex: number, questionIndex: number) => {
    dispatch({ type: 'DELETE_QUESTION', payload: { pageIndex, questionIndex } });
  }, []);

  const showPreviousPreviewPage = useCallback(() => {
    dispatch({ type: 'SET_PREVIEW_PAGE', payload: state.previewPageIndex - 1 });
  }, [state.previewPageIndex]);

  const showNextPreviewPage = useCallback(() => {
    dispatch({ type: 'SET_PREVIEW_PAGE', payload: state.previewPageIndex + 1 });
  }, [state.previewPageIndex]);

  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, []);

  const redo = useCallback(() => {
    dispatch({ type: 'REDO' });
  }, []);

  const clearHistory = useCallback(() => {
    dispatch({ type: 'CLEAR_HISTORY' });
  }, []);

  const setupSampleSurvey = () => {
    const samplePages: SurveyPage[] = [
      {
        title: "Welcome to Our Survey",
        contextElements: [
          { type: 'paragraph', content: 'Welcome to our survey! We value your input and feedback.' },
          { type: 'image', content: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80' },
          { type: 'paragraph', content: 'Please take a moment to share your thoughts with us.' }
        ]
      },
      {
        title: "Contact Information",
        questions: [
          {
            contextElements: [
              { type: 'paragraph', content: 'Please provide your contact information below.' }
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
        title: "Product Feedback",
        contextElements: [
          { type: 'paragraph', content: 'We would love to hear about your experience with our products.' }
        ],
        questions: [
          {
            type: "radio",
            text: "How satisfied are you with our product?",
            options: [
              "Very satisfied",
              "Satisfied",
              "Neutral",
              "Dissatisfied",
              "Very dissatisfied"
            ]
          },
          {
            type: "checkbox",
            text: "Which features do you use most? (Select all that apply)",
            options: [
              "Feature A",
              "Feature B",
              "Feature C",
              "Feature D"
            ]
          }
        ]
      }
    ];
    dispatch({ type: 'LOAD_SURVEY', payload: samplePages });
  };

  const value: SurveyContextType = {
    state,
    dispatch,
    loadSurvey,
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
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    undo,
    redo,
    clearHistory,
  };

  return (
    <SurveyContext.Provider value={value}>
      {children}
    </SurveyContext.Provider>
  );
}; 