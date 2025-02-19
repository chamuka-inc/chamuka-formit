export type ContextElementType = 'paragraph' | 'image' | 'video';

export interface ContextElement {
  type: ContextElementType;
  content: string;
}

export type QuestionType = 'text' | 'radio' | 'checkbox';

export interface Question {
  type: QuestionType;
  text: string;
  options?: string[];
  contextElements?: ContextElement[];
}

export interface SurveyPage {
  title: string;
  questions?: Question[];
  contextElements?: ContextElement[];
}

export interface SurveyState {
  pages: SurveyPage[];
  currentPageIndex: number;
  previewPageIndex: number;
  isLoading: boolean;
  error: string | null;
  loadingStates: {
    savingPage: boolean;
    savingQuestion: boolean;
    loadingSurvey: boolean;
  };
}

export type SurveyAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_SURVEY'; payload: SurveyPage[] }
  | { type: 'ADD_PAGE'; payload: SurveyPage }
  | { type: 'UPDATE_PAGE'; payload: { index: number; page: SurveyPage } }
  | { type: 'DELETE_PAGE'; payload: number }
  | { type: 'SELECT_PAGE'; payload: number }
  | { type: 'MOVE_PAGE'; payload: { fromIndex: number; toIndex: number } }
  | { type: 'ADD_QUESTION'; payload: { pageIndex: number; question: Question } }
  | { type: 'UPDATE_QUESTION'; payload: { pageIndex: number; questionIndex: number; question: Question } }
  | { type: 'DELETE_QUESTION'; payload: { pageIndex: number; questionIndex: number } }
  | { type: 'SET_PREVIEW_PAGE'; payload: number }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'CLEAR_HISTORY' };

export interface SurveyContextType {
  state: SurveyState;
  dispatch: React.Dispatch<SurveyAction>;
  // Action creators
  loadSurvey: (pages: SurveyPage[]) => void;
  addPage: (page: SurveyPage) => void;
  updatePage: (index: number, page: SurveyPage) => void;
  deletePage: (index: number) => void;
  selectPage: (index: number) => void;
  movePageUp: (index: number) => void;
  movePageDown: (index: number) => void;
  addQuestion: (pageIndex: number, question: Question) => void;
  updateQuestion: (pageIndex: number, questionIndex: number, question: Question) => void;
  deleteQuestion: (pageIndex: number, questionIndex: number) => void;
  showPreviousPreviewPage: () => void;
  showNextPreviewPage: () => void;
  // Selectors
  currentPage: SurveyPage | null;
  pageStats: {
    totalPages: number;
    pagesWithQuestions: number;
    pagesWithContent: number;
  };
  questionCount: number;
  // History actions
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;
}
