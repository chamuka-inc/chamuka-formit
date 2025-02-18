"use client";

import { useState, useEffect } from 'react';
import { Question } from '@/lib/types';
import { X, MessageSquare, CheckSquare, AlignLeft, Plus, Trash2 } from 'lucide-react';

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
  const [questionText, setQuestionText] = useState('');
  const [questionType, setQuestionType] = useState<'text' | 'radio' | 'checkbox'>('text');
  const [options, setOptions] = useState<string[]>([]);
  const [newOption, setNewOption] = useState('');

  useEffect(() => {
    if (isOpen && currentQuestion) {
      setQuestionText(currentQuestion.text);
      setQuestionType(currentQuestion.type);
      setOptions(currentQuestion.options || []);
    } else {
      setQuestionText('');
      setQuestionType('text');
      setOptions([]);
    }
    setNewOption('');
  }, [isOpen, currentQuestion]);

  const handleAddOption = () => {
    if (newOption.trim()) {
      setOptions([...options, newOption.trim()]);
      setNewOption('');
    }
  };

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const newQuestion: Question = {
      text: questionText,
      type: questionType,
      options: ['radio', 'checkbox'].includes(questionType) ? options : undefined,
    };
    onSave(newQuestion);
    onClose();
  };

  const QuestionTypeIcon = {
    text: AlignLeft,
    radio: MessageSquare,
    checkbox: CheckSquare,
  }[questionType];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
      />
      <div className="relative w-11/12 max-w-2xl animate-fade-in">
        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-2xl">
          {/* Header */}
          <div className="relative px-8 py-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <QuestionTypeIcon className="h-6 w-6 text-blue-500 dark:text-blue-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {currentQuestion ? 'Edit Question' : 'Add Question'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="absolute right-6 top-6 p-2 rounded-full text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-8 py-6 max-h-[calc(80vh-8rem)] overflow-y-auto">
            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="question-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Question Text
                </label>
                <textarea
                  id="question-text"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-shadow resize-none"
                  placeholder="Enter your question here..."
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Question Type
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { type: 'text', label: 'Text Input', icon: AlignLeft },
                    { type: 'radio', label: 'Single Choice', icon: MessageSquare },
                    { type: 'checkbox', label: 'Multiple Choice', icon: CheckSquare },
                  ].map(({ type, label, icon: Icon }) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setQuestionType(type as any)}
                      className={`
                        flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all
                        ${questionType === type
                          ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-500/10'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400'
                        }
                      `}
                    >
                      <Icon className={`h-6 w-6 ${
                        questionType === type
                          ? 'text-blue-500 dark:text-blue-400'
                          : 'text-gray-400 dark:text-gray-500'
                      }`} />
                      <span className={`text-sm font-medium ${
                        questionType === type
                          ? 'text-blue-700 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {['radio', 'checkbox'].includes(questionType) && (
                <div className="space-y-4 pt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Answer Options
                  </label>
                  
                  <div className="space-y-3">
                    {options.map((option, index) => (
                      <div
                        key={index}
                        className="group flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                      >
                        <input
                          type={questionType}
                          disabled
                          className={`
                            h-4 w-4 border-2 transition-colors
                            ${questionType === 'radio' ? 'rounded-full' : 'rounded'}
                            border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700
                          `}
                        />
                        <span className="flex-1 text-gray-700 dark:text-gray-300">{option}</span>
                        <button
                          onClick={() => handleRemoveOption(index)}
                          className="p-1 rounded-md text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newOption}
                      onChange={(e) => setNewOption(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddOption()}
                      placeholder="Add a new option..."
                      className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-shadow"
                    />
                    <button
                      onClick={handleAddOption}
                      disabled={!newOption.trim()}
                      className={`
                        inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors
                        ${newOption.trim()
                          ? 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400'
                          : 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                        }
                      `}
                    >
                      <Plus className="h-4 w-4" />
                      Add Option
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 px-8 py-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-end gap-4">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!questionText.trim() || ((['radio', 'checkbox'].includes(questionType)) && options.length < 2)}
                className={`
                  px-6 py-2.5 rounded-lg font-medium transition-all
                  ${(questionText.trim() && (!['radio', 'checkbox'].includes(questionType) || options.length >= 2))
                    ? 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white transform hover:scale-[1.02]'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                {currentQuestion ? 'Save Changes' : 'Create Question'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 