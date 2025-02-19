import { SurveyState } from '../types';

function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export interface StorageManager {
  save: (state: SurveyState) => void;
  load: () => SurveyState | null;
  clear: () => void;
}

export function createStorageManager(key: string, debounceMs = 1000): StorageManager {
  const debouncedSave = debounce((state: SurveyState) => {
    try {
      const serializedState = JSON.stringify({
        pages: state.pages,
        timestamp: Date.now(),
      });
      localStorage.setItem(key, serializedState);
    } catch (error) {
      console.error('Failed to save state to localStorage:', error);
    }
  }, debounceMs);

  const load = (): SurveyState | null => {
    try {
      const serializedState = localStorage.getItem(key);
      if (!serializedState) return null;

      const { pages } = JSON.parse(serializedState);
      return {
        pages,
        currentPageIndex: pages.length > 0 ? 0 : -1,
        previewPageIndex: 0,
        isLoading: false,
        error: null,
        loadingStates: {
          savingPage: false,
          savingQuestion: false,
          loadingSurvey: false
        }
      };
    } catch (error) {
      console.error('Failed to load state from localStorage:', error);
      return null;
    }
  };

  const clear = () => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to clear state from localStorage:', error);
    }
  };

  return {
    save: debouncedSave,
    load,
    clear,
  };
} 