"use client";

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useCallback,
  useMemo,
} from "react";
import {
  FormContextType,
  FormPage,
  Question,
  FormState,
  FormAction,
} from "../types";
import { formReducer, initialState } from "./Reducer";
import { createHistoryReducer, HistoryState } from "./History";
import { createStorageManager } from "./Storage";
import { formSelectors } from "./Selectors";

const FormContext = createContext<FormContextType | null>(null);
const storageManager = createStorageManager("formData");

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormContextProvider");
  }
  return context;
};

export const FormContextProvider = ({
  children,
  initialPages = [],
  initialTitle = "",
  initialDescription = "",
}: {
  children: React.ReactNode;
  initialPages?: FormPage[];
  initialTitle?: string;
  initialDescription?: string;
}) => {
  console.log("FormContextProvider initialPages:", initialPages);

  const [history, dispatch] = useReducer(createHistoryReducer(formReducer), {
    past: [],
    present: {
      ...initialState,
      pages: initialPages.length > 0 ? initialPages : initialState.pages,
      currentPageIndex: initialPages.length > 0 ? 0 : -1,
      title: initialTitle,
      description: initialDescription,
      isLoading: false,
      loadingStates: {
        savingPage: false,
        savingQuestion: false,
        loadingForm: false,
      },
    },
    future: [],
  });

  const state = history.present;
  console.log("FormContext state:", state);

  useEffect(() => {
    console.log(
      "FormContext useEffect initialPages.length:",
      initialPages.length,
    );
    if (initialPages.length > 0) {
      // If we have initialPages, load them directly
      loadForm(initialPages);
      // Clear local storage to prevent conflicts with database data
      storageManager.clear();
    } else if (initialPages.length === 0) {
      loadFromLocalStorage();
    }
  }, [initialPages.length]);

  useEffect(() => {
    if (!state.isLoading) {
      storageManager.save(state);
    }
  }, [state.pages]);

  const loadFromLocalStorage = () => {
    try {
      const loadedState = storageManager.load();
      if (loadedState) {
        dispatch({ type: "LOAD_SURVEY", payload: loadedState.pages });
      } else if (initialPages.length === 0) {
        setupSampleForm();
      }
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to load form data" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const loadForm = useCallback((pages: FormPage[]) => {
    dispatch({ type: "LOAD_SURVEY", payload: pages });
  }, []);

  const addPage = useCallback((page: FormPage) => {
    dispatch({ type: "ADD_PAGE", payload: page });
  }, []);

  const updatePage = useCallback((index: number, page: FormPage) => {
    dispatch({ type: "UPDATE_PAGE", payload: { index, page } });
  }, []);

  const deletePage = useCallback((index: number) => {
    dispatch({ type: "DELETE_PAGE", payload: index });
  }, []);

  const selectPage = useCallback((index: number) => {
    dispatch({ type: "SELECT_PAGE", payload: index });
  }, []);

  const movePageUp = useCallback(
    (index: number) => {
      if (index > 0) {
        dispatch({
          type: "MOVE_PAGE",
          payload: { fromIndex: index, toIndex: index - 1 },
        });
      }
    },
    [state.pages.length],
  );

  const movePageDown = useCallback(
    (index: number) => {
      if (index < state.pages.length - 1) {
        dispatch({
          type: "MOVE_PAGE",
          payload: { fromIndex: index, toIndex: index + 1 },
        });
      }
    },
    [state.pages.length],
  );

  const addQuestion = useCallback((pageIndex: number, question: Question) => {
    dispatch({ type: "ADD_QUESTION", payload: { pageIndex, question } });
  }, []);

  const updateQuestion = useCallback(
    (pageIndex: number, questionIndex: number, question: Question) => {
      dispatch({
        type: "UPDATE_QUESTION",
        payload: { pageIndex, questionIndex, question },
      });
    },
    [],
  );

  const deleteQuestion = useCallback(
    (pageIndex: number, questionIndex: number) => {
      dispatch({
        type: "DELETE_QUESTION",
        payload: { pageIndex, questionIndex },
      });
    },
    [],
  );

  const showPreviousPreviewPage = useCallback(() => {
    dispatch({ type: "SET_PREVIEW_PAGE", payload: state.previewPageIndex - 1 });
  }, [state.previewPageIndex]);

  const showNextPreviewPage = useCallback(() => {
    dispatch({ type: "SET_PREVIEW_PAGE", payload: state.previewPageIndex + 1 });
  }, [state.previewPageIndex]);

  const setPreviewPageIndex = useCallback((index: number) => {
    dispatch({ type: "SET_PREVIEW_PAGE", payload: index });
  }, []);

  const undo = useCallback(() => {
    dispatch({ type: "UNDO" });
  }, []);

  const redo = useCallback(() => {
    dispatch({ type: "REDO" });
  }, []);

  const clearHistory = useCallback(() => {
    dispatch({ type: "CLEAR_HISTORY" });
  }, []);

  const setupSampleForm = () => {
    console.log("Setting up sample form");
    const samplePages: FormPage[] = [
      {
        title: "Customer Feedback Form - Introduction",
        questions: [],
        contextElements: [
          {
            type: "paragraph",
            content:
              "# Welcome to our Customer Feedback Form!\n\nWe value your input and would like to hear about your experience with our products and services.\n\n**Your feedback matters** and will help us improve our offerings.",
          },
          {
            type: "image",
            content:
              "https://images.unsplash.com/photo-1556155092-490a1ba16284?auto=format&fit=crop&w=600&q=80",
          },
          {
            type: "paragraph",
            content:
              "## Important Information\n\n- This form will take approximately 5 minutes to complete\n- All responses are confidential\n- Your honest feedback is appreciated",
          },
        ],
      },
      {
        title: "Personal Information",
        questions: [
          {
            id: "q1",
            type: "text",
            text: "What is your full name?",
            required: true,
            contextElements: [
              {
                type: "paragraph",
                content: "Please provide your contact information below.",
              },
            ],
          },
          {
            id: "q2",
            type: "text",
            text: "What is your email address?",
            required: true,
          },
          {
            id: "q3",
            type: "radio",
            text: "How often do you use our products?",
            required: true,
            options: [
              "Daily",
              "Weekly",
              "Monthly",
              "Rarely",
              "First time user",
            ],
          },
        ],
      },
      {
        title: "Product Feedback",
        questions: [
          {
            id: "q4",
            type: "radio",
            text: "How would you rate our product quality?",
            required: true,
            options: ["Excellent", "Good", "Average", "Below Average", "Poor"],
          },
          {
            id: "q5",
            type: "checkbox",
            text: "Which features do you use most often? (Select all that apply)",
            required: false,
            options: [
              "Feature A",
              "Feature B",
              "Feature C",
              "Feature D",
              "Feature E",
            ],
          },
          {
            id: "q6",
            type: "text",
            text: "What improvements would you suggest for our products?",
            required: false,
          },
        ],
      },
      {
        title: "Thank You",
        questions: [],
        contextElements: [
          {
            type: "paragraph",
            content:
              "# Thank You!\n\n**Your feedback is invaluable to us.**\n\nWe will carefully review your responses and use them to:\n\n1. Improve our products\n2. Enhance our services\n3. Better serve our customers",
          },
          {
            type: "image",
            content:
              "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80",
          },
          {
            type: "paragraph",
            content:
              "> We appreciate your time and commitment to helping us grow.\n\n*If you have any additional feedback, please feel free to [contact us](mailto:support@example.com).*",
          },
        ],
      },
    ];
    dispatch({ type: "LOAD_SURVEY", payload: samplePages });
  };

  const memoizedValue = useMemo(
    () => ({
      state,
      dispatch,
      loadForm,
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
      setPreviewPageIndex,
      // Memoized selectors
      currentPage: formSelectors.getCurrentPage(state),
      pageStats: formSelectors.getPageStats(state),
      questionCount: formSelectors.getQuestionCount(state),
      // History actions
      canUndo: history.past.length > 0,
      canRedo: history.future.length > 0,
      undo,
      redo,
      clearHistory,
    }),
    [
      state,
      history.past.length,
      history.future.length,
      // Include all callback functions in dependencies
      loadForm,
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
      setPreviewPageIndex,
      undo,
      redo,
      clearHistory,
    ],
  );

  return (
    <FormContext.Provider value={memoizedValue}>
      {children}
    </FormContext.Provider>
  );
};
