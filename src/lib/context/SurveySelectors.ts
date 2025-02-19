import { SurveyState } from '../types';

export const surveySelectors = {
  getCurrentPage: (state: SurveyState) => 
    state.currentPageIndex >= 0 ? state.pages[state.currentPageIndex] : null,
  
  getQuestionCount: (state: SurveyState) => 
    state.pages.reduce((count, page) => count + (page.questions?.length || 0), 0),
  
  getPageStats: (state: SurveyState) => ({
    totalPages: state.pages.length,
    pagesWithQuestions: state.pages.filter(p => p.questions?.length).length,
    pagesWithContent: state.pages.filter(p => p.contextElements?.length).length
  })
}; 