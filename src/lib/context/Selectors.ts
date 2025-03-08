import { FormState } from "../types";

export const formSelectors = {
  getCurrentPage: (state: FormState) =>
    state.currentPageIndex >= 0 ? state.pages[state.currentPageIndex] : null,

  getQuestionCount: (state: FormState) =>
    state.pages.reduce(
      (count, page) => count + (page.questions?.length || 0),
      0,
    ),

  getPageStats: (state: FormState) => ({
    totalPages: state.pages.length,
    pagesWithQuestions: state.pages.filter((p) => p.questions?.length).length,
    pagesWithContent: state.pages.filter((p) => p.contextElements?.length)
      .length,
  }),
};
