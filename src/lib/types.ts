export type ContextElementType = "paragraph" | "image" | "video";

export interface ContextElement {
  id?: string;
  type: ContextElementType;
  content: string;
}

export type QuestionType = "text" | "radio" | "checkbox";

export interface Question {
  id?: string;
  type: QuestionType;
  text: string;
  required?: boolean;
  options?: string[];
  contextElements?: ContextElement[];
}

export interface FormPage {
  id?: string;
  title: string;
  questions?: Question[];
  contextElements?: ContextElement[];
}

export interface FormState {
  pages: FormPage[];
  currentPageIndex: number;
  previewPageIndex: number;
  isLoading: boolean;
  error: string | null;
  title?: string;
  description?: string;
  loadingStates: {
    savingPage: boolean;
    savingQuestion: boolean;
    loadingForm: boolean;
  };
}

export type FormAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "LOAD_SURVEY"; payload: FormPage[] }
  | { type: "ADD_PAGE"; payload: FormPage }
  | { type: "UPDATE_PAGE"; payload: { index: number; page: FormPage } }
  | { type: "DELETE_PAGE"; payload: number }
  | { type: "SELECT_PAGE"; payload: number }
  | { type: "MOVE_PAGE"; payload: { fromIndex: number; toIndex: number } }
  | { type: "ADD_QUESTION"; payload: { pageIndex: number; question: Question } }
  | {
      type: "UPDATE_QUESTION";
      payload: { pageIndex: number; questionIndex: number; question: Question };
    }
  | {
      type: "DELETE_QUESTION";
      payload: { pageIndex: number; questionIndex: number };
    }
  | { type: "SET_PREVIEW_PAGE"; payload: number }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "CLEAR_HISTORY" };

export interface FormContextType {
  state: FormState;
  dispatch: React.Dispatch<FormAction>;
  // Action creators
  loadForm: (pages: FormPage[]) => void;
  addPage: (page: FormPage) => void;
  updatePage: (index: number, page: FormPage) => void;
  deletePage: (index: number) => void;
  selectPage: (index: number) => void;
  movePageUp: (index: number) => void;
  movePageDown: (index: number) => void;
  addQuestion: (pageIndex: number, question: Question) => void;
  updateQuestion: (
    pageIndex: number,
    questionIndex: number,
    question: Question,
  ) => void;
  deleteQuestion: (pageIndex: number, questionIndex: number) => void;
  showPreviousPreviewPage: () => void;
  showNextPreviewPage: () => void;
  setPreviewPageIndex: (index: number) => void;
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;
  // Memoized selectors
  currentPage: FormPage | null;
  pageStats: {
    totalPages: number;
    pagesWithQuestions: number;
    pagesWithContent: number;
  };
  questionCount: number;
  // History actions
  canUndo: boolean;
  canRedo: boolean;
}

export enum CreditTransactionType {
  AI = "ai",
  PURCHASE = "purchase",
  EXPORT = "export",
  ANALYTICS = "analytics",
  REFUND = "refund",
}
