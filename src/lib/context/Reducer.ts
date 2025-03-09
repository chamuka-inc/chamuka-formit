import { FormState, FormAction } from "../types";
import { validateAction, validateFormState } from "./Validation";

export const initialState: FormState = {
  pages: [],
  currentPageIndex: -1,
  previewPageIndex: 0,
  isLoading: true,
  error: null,
  title: "",
  description: "",
  loadingStates: {
    savingPage: false,
    savingQuestion: false,
    loadingForm: true,
  },
};

export function formReducer(
  state: FormState = initialState,
  action: FormAction,
): FormState {
  // Validate action before processing
  const actionErrors = validateAction(state, action);
  if (actionErrors.length > 0) {
    return {
      ...state,
      error: `Invalid action: ${actionErrors[0].message}`,
    };
  }

  let newState: FormState;

  switch (action.type) {
    case "SET_LOADING":
      newState = { ...state, isLoading: action.payload };
      break;

    case "SET_ERROR":
      newState = { ...state, error: action.payload };
      break;

    case "LOAD_SURVEY":
      // Ensure we have valid pages with required properties
      const validatedPages = action.payload.map((page) => ({
        title: page.title || "Untitled Page",
        questions: (page.questions || []).map((q) => ({
          id: q.id || `q-${Math.random().toString(36).substr(2, 9)}`,
          type: q.type || "text",
          text: q.text || "Untitled Question",
          required: q.required !== undefined ? q.required : false,
          options: q.options || [],
          contextElements: q.contextElements || [],
        })),
        contextElements: page.contextElements || [],
      }));

      newState = {
        ...state,
        pages: validatedPages,
        currentPageIndex: validatedPages.length > 0 ? 0 : -1,
        previewPageIndex: 0,
        isLoading: false,
        error: null,
      };
      break;

    case "ADD_PAGE":
      newState = {
        ...state,
        pages: [...state.pages, action.payload],
        currentPageIndex: state.pages.length,
      };
      break;

    case "UPDATE_PAGE":
      newState = {
        ...state,
        pages: state.pages.map((page, index) =>
          index === action.payload.index ? action.payload.page : page,
        ),
      };
      break;

    case "DELETE_PAGE": {
      const updatedPages = state.pages.filter(
        (_, index) => index !== action.payload,
      );
      newState = {
        ...state,
        pages: updatedPages,
        currentPageIndex:
          updatedPages.length === 0
            ? -1
            : Math.min(state.currentPageIndex, updatedPages.length - 1),
        previewPageIndex: Math.min(
          state.previewPageIndex,
          updatedPages.length - 1,
        ),
      };
      break;
    }

    case "SELECT_PAGE":
      // For page navigation, we'll update the state even if there are validation errors
      newState = {
        ...state,
        currentPageIndex: action.payload,
      };
      // Return immediately for SELECT_PAGE action to bypass validation
      return newState;

    case "MOVE_PAGE": {
      const { fromIndex, toIndex } = action.payload;
      if (fromIndex === toIndex) return state;

      const updatedPages = [...state.pages];
      const [movedPage] = updatedPages.splice(fromIndex, 1);
      updatedPages.splice(toIndex, 0, movedPage);

      let newCurrentPageIndex = state.currentPageIndex;
      if (state.currentPageIndex === fromIndex) {
        newCurrentPageIndex = toIndex;
      } else if (
        fromIndex < state.currentPageIndex &&
        toIndex >= state.currentPageIndex
      ) {
        newCurrentPageIndex--;
      } else if (
        fromIndex > state.currentPageIndex &&
        toIndex <= state.currentPageIndex
      ) {
        newCurrentPageIndex++;
      }

      newState = {
        ...state,
        pages: updatedPages,
        currentPageIndex: newCurrentPageIndex,
      };
      break;
    }

    case "ADD_QUESTION":
      newState = {
        ...state,
        pages: state.pages.map((page, index) =>
          index === action.payload.pageIndex
            ? {
                ...page,
                questions: [...(page.questions || []), action.payload.question],
              }
            : page,
        ),
      };
      break;

    case "UPDATE_QUESTION":
      newState = {
        ...state,
        pages: state.pages.map((page, index) =>
          index === action.payload.pageIndex && page.questions
            ? {
                ...page,
                questions: page.questions.map((q, qIndex) =>
                  qIndex === action.payload.questionIndex
                    ? action.payload.question
                    : q,
                ),
              }
            : page,
        ),
      };
      break;

    case "DELETE_QUESTION":
      newState = {
        ...state,
        pages: state.pages.map((page, index) =>
          index === action.payload.pageIndex && page.questions
            ? {
                ...page,
                questions: page.questions.filter(
                  (_, qIndex) => qIndex !== action.payload.questionIndex,
                ),
              }
            : page,
        ),
      };
      break;

    case "SET_PREVIEW_PAGE":
      newState = {
        ...state,
        previewPageIndex: Math.min(
          Math.max(0, action.payload),
          state.pages.length - 1,
        ),
      };
      break;

    default:
      return state;
  }

  // Validate new state before returning
  const { isValid, errors } = validateFormState(newState);
  if (!isValid) {
    return {
      ...state,
      error: `Invalid state: ${errors[0].message}`,
    };
  }

  return newState;
}
