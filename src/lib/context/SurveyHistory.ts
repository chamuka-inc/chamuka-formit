import { SurveyState, SurveyAction } from '../types';

export interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

export type HistoryAction<T> =
  | { type: 'PUSH'; payload: T }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'CLEAR' };

const MAX_HISTORY_LENGTH = 50;

export function historyReducer<T>(state: HistoryState<T>, action: HistoryAction<T>): HistoryState<T> {
  const { past, present, future } = state;

  switch (action.type) {
    case 'PUSH':
      return {
        past: [...past.slice(-MAX_HISTORY_LENGTH + 1), present],
        present: action.payload,
        future: [],
      };

    case 'UNDO':
      if (past.length === 0) return state;

      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);

      return {
        past: newPast,
        present: previous,
        future: [present, ...future],
      };

    case 'REDO':
      if (future.length === 0) return state;

      const next = future[0];
      const newFuture = future.slice(1);

      return {
        past: [...past, present],
        present: next,
        future: newFuture,
      };

    case 'CLEAR':
      return {
        past: [],
        present: present,
        future: [],
      };

    default:
      return state;
  }
}

export function createHistoryReducer(reducer: (state: SurveyState, action: SurveyAction) => SurveyState) {
  return (state: HistoryState<SurveyState>, action: SurveyAction | HistoryAction<SurveyState>) => {
    if (
      action.type === 'UNDO' ||
      action.type === 'REDO' ||
      action.type === 'CLEAR'
    ) {
      return historyReducer(state, action);
    }

    const newPresent = reducer(state.present, action as SurveyAction);
    if (newPresent === state.present) {
      return state;
    }

    return historyReducer(state, { type: 'PUSH', payload: newPresent });
  };
}

export function useHistory<T>(initialPresent: T) {
  return {
    past: [],
    present: initialPresent,
    future: [],
  };
}

export function canUndo(state: HistoryState<any>): boolean {
  return state.past.length > 0;
}

export function canRedo(state: HistoryState<any>): boolean {
  return state.future.length > 0;
} 