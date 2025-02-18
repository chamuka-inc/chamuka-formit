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

export type PageType = 'survey' | 'info';

export interface SurveyPage {
  title: string;
  pageType: PageType;
  questions: Question[];
  contextElements?: ContextElement[];
}

export interface SurveyContextType {
  pages: SurveyPage[];
  currentPageIndex: number;
  previewPageIndex: number;
  setPages: (pages: SurveyPage[]) => void;
  setCurrentPageIndex: (index: number) => void;
  setPreviewPageIndex: (index: number) => void;
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
}
