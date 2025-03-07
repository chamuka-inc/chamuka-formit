import { SurveyState, SurveyPage, Question } from "../types";

export interface ValidationError {
  type: string;
  message: string;
  path?: string[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

function validateQuestion(
  question: Question,
  path: string[] = [],
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!question.text.trim()) {
    errors.push({
      type: "REQUIRED",
      message: "Question text is required",
      path: [...path, "text"],
    });
  }

  if (
    ["radio", "checkbox"].includes(question.type) &&
    (!question.options || question.options.length < 2)
  ) {
    errors.push({
      type: "INVALID_OPTIONS",
      message: `${question.type === "radio" ? "Single" : "Multiple"} choice questions require at least 2 options`,
      path: [...path, "options"],
    });
  }

  if (question.contextElements) {
    question.contextElements.forEach((element, index) => {
      if (!element.content.trim()) {
        errors.push({
          type: "REQUIRED",
          message: `Context element content is required`,
          path: [...path, "contextElements", index.toString(), "content"],
        });
      }

      if (element.type === "image" || element.type === "video") {
        // Skip URL validation in development mode
        if (process.env.NODE_ENV === "development") {
          return;
        }
        try {
          new URL(element.content);
        } catch {
          errors.push({
            type: "INVALID_URL",
            message: `Invalid ${element.type} URL`,
            path: [...path, "contextElements", index.toString(), "content"],
          });
        }
      }
    });
  }

  return errors;
}

function validatePage(page: SurveyPage, index: number): ValidationError[] {
  const errors: ValidationError[] = [];
  const path = ["pages", index.toString()];

  if (!page.title.trim()) {
    errors.push({
      type: "REQUIRED",
      message: "Page title is required",
      path: [...path, "title"],
    });
  }

  if (page.questions?.length) {
    page.questions.forEach((question, qIndex) => {
      if (question && typeof question === "object") {
        const questionErrors = validateQuestion(question, [
          ...path,
          "questions",
          qIndex.toString(),
        ]);
        errors.push(...questionErrors);
      }
    });
  }

  if (page.contextElements?.length) {
    page.contextElements.forEach((element, index) => {
      if (element && typeof element === "object" && "content" in element) {
        if (!element.content.trim()) {
          errors.push({
            type: "REQUIRED",
            message: "Context element content is required",
            path: [...path, "contextElements", index.toString(), "content"],
          });
        }

        if (element.type === "image" || element.type === "video") {
          // Skip URL validation in development mode
          if (process.env.NODE_ENV === "development") {
            return;
          }
          try {
            new URL(element.content);
          } catch {
            errors.push({
              type: "INVALID_URL",
              message: `Invalid ${element.type} URL`,
              path: [...path, "contextElements", index.toString(), "content"],
            });
          }
        }
      }
    });
  }

  return errors;
}

export function validateSurveyState(state: SurveyState): ValidationResult {
  const errors: ValidationError[] = [];

  // Validate indices
  if (state.currentPageIndex >= state.pages.length) {
    errors.push({
      type: "INVALID_INDEX",
      message: "Current page index is out of bounds",
      path: ["currentPageIndex"],
    });
  }

  if (state.previewPageIndex >= state.pages.length) {
    errors.push({
      type: "INVALID_INDEX",
      message: "Preview page index is out of bounds",
      path: ["previewPageIndex"],
    });
  }

  // Validate pages
  state.pages.forEach((page, index) => {
    const pageErrors = validatePage(page, index);
    errors.push(...pageErrors);
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateAction(
  state: SurveyState,
  action: any,
): ValidationError[] {
  const errors: ValidationError[] = [];

  switch (action.type) {
    case "ADD_PAGE":
    case "UPDATE_PAGE": {
      const page =
        action.type === "ADD_PAGE" ? action.payload : action.payload.page;
      const index =
        action.type === "ADD_PAGE" ? state.pages.length : action.payload.index;
      const pageErrors = validatePage(page, index);
      errors.push(...pageErrors);
      break;
    }

    case "ADD_QUESTION":
    case "UPDATE_QUESTION": {
      const question = action.payload.question;
      const pageIndex = action.payload.pageIndex;
      const page = state.pages[pageIndex];

      if (!page) {
        errors.push({
          type: "INVALID_INDEX",
          message: "Page index is out of bounds",
          path: ["payload", "pageIndex"],
        });
        break;
      }

      const questionIndex =
        action.type === "ADD_QUESTION"
          ? page.questions?.length || 0
          : action.payload.questionIndex;

      const questionErrors = validateQuestion(question, [
        "pages",
        pageIndex.toString(),
        "questions",
        questionIndex.toString(),
      ]);
      errors.push(...questionErrors);
      break;
    }

    case "DELETE_PAGE":
    case "SELECT_PAGE":
    case "SET_PREVIEW_PAGE": {
      const index = action.payload;
      if (index < -1 || index >= state.pages.length) {
        errors.push({
          type: "INVALID_INDEX",
          message: "Page index is out of bounds",
          path: ["payload"],
        });
      }
      break;
    }

    case "DELETE_QUESTION": {
      const { pageIndex, questionIndex } = action.payload;
      const page = state.pages[pageIndex];

      if (!page) {
        errors.push({
          type: "INVALID_INDEX",
          message: "Page index is out of bounds",
          path: ["payload", "pageIndex"],
        });
        break;
      }

      if (questionIndex < 0 || questionIndex >= (page.questions?.length || 0)) {
        errors.push({
          type: "INVALID_INDEX",
          message: "Question index is out of bounds",
          path: ["payload", "questionIndex"],
        });
      }
      break;
    }
  }

  return errors;
}
