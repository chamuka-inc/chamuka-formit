"use client";

import { useState, useEffect } from 'react';
import { Question, ContextElement } from '@/lib/types';
import { ContextElementEditor } from './ContextElementEditor';
import { X, Plus, Trash2 } from 'lucide-react';

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentQuestion?: Question;
  onSave: (question: Question) => void;
}

export const QuestionModal = ({
  isOpen,
  onClose,
  currentQuestion,
  onSave,
}: QuestionModalProps) => {
  const [questionType, setQuestionType] = useState<'text' | 'radio' | 'checkbox'>('text');
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [contextElements, setContextElements] = useState<ContextElement[]>([]);

  useEffect(() => {
    if (isOpen && currentQuestion) {
      setQuestionType(currentQuestion.type);
      setQuestionText(currentQuestion.text);
      setOptions(currentQuestion.options || []);
      setContextElements(currentQuestion.contextElements || []);
    } else {
      setQuestionType('text');
      setQuestionText('');
      setOptions([]);
      setContextElements([]);
    }
  }, [isOpen, currentQuestion]);

  const handleSave = () => {
    const newQuestion: Question = {
      type: questionType,
      text: questionText,
      options: questionType === 'text' ? undefined : options,
      contextElements: contextElements.length > 0 ? contextElements : undefined,
    };
    onSave(newQuestion);
    onClose();
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const updateOption = (index: number, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 sm:p-8 w-11/12 max-w-md transition-all">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200">
            {currentQuestion ? 'Edit Question' : 'Add Question'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="question-type" className="block text-gray-700 dark:text-gray-300 font-bold mb-2">
              Question Type
            </label>
            <select
              id="question-type"
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value as 'text' | 'radio' | 'checkbox')}
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            >
              <option value="text">Text</option>
              <option value="radio">Radio</option>
              <option value="checkbox">Checkbox</option>
            </select>
          </div>

          <div>
            <label htmlFor="question-text" className="block text-gray-700 dark:text-gray-300 font-bold mb-2">
              Question Text
            </label>
            <input
              type="text"
              id="question-text"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
          </div>

          <ContextElementEditor elements={contextElements} setElements={setContextElements} />

          {(questionType === 'radio' || questionType === 'checkbox') && (
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">
                Options
              </label>
              <ul className="space-y-2">
                {options.map((option, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    />
                    <button
                      onClick={() => removeOption(index)}
                      className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={addOption}
                className="mt-2 flex items-center gap-2 text-blue-500 hover:text-blue-600 font-semibold py-2 px-3 rounded hover:bg-blue-50 dark:hover:bg-gray-700"
              >
                <Plus className="h-4 w-4" />
                Add Option
              </button>
            </div>
          )}

          <div className="flex justify-end gap-4 mt-8">
            <button
              onClick={onClose}
              className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded transition-all transform hover:scale-105"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-all transform hover:scale-105"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 