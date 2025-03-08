"use client";

import { useState, useEffect } from "react";
import { Question, ContextElement, ContextElementType } from "@/lib/types";
import {
  X,
  MessageSquare,
  CheckSquare,
  AlignLeft,
  Plus,
  Trash2,
  Type,
  Image,
  Video,
} from "lucide-react";

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
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState<
    "text" | "radio" | "checkbox"
  >("text");
  const [options, setOptions] = useState<string[]>([]);
  const [newOption, setNewOption] = useState("");
  const [contextElements, setContextElements] = useState<ContextElement[]>([]);
  const [newContextElement, setNewContextElement] = useState<{
    type: ContextElementType;
    content: string;
  }>({
    type: "paragraph",
    content: "",
  });

  useEffect(() => {
    if (isOpen && currentQuestion) {
      setQuestionText(currentQuestion.text);
      setQuestionType(currentQuestion.type);
      setOptions(currentQuestion.options || []);
      setContextElements(currentQuestion.contextElements || []);
    } else {
      setQuestionText("");
      setQuestionType("text");
      setOptions([]);
      setContextElements([]);
    }
    setNewOption("");
    setNewContextElement({ type: "paragraph", content: "" });
  }, [isOpen, currentQuestion]);

  const handleAddOption = () => {
    if (newOption.trim()) {
      setOptions([...options, newOption.trim()]);
      setNewOption("");
    }
  };

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleAddContextElement = () => {
    if (newContextElement.content.trim()) {
      setContextElements([...contextElements, { ...newContextElement }]);
      setNewContextElement({ ...newContextElement, content: "" });
    }
  };

  const handleRemoveContextElement = (index: number) => {
    setContextElements(contextElements.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const newQuestion: Question = {
      text: questionText,
      type: questionType,
      options: ["radio", "checkbox"].includes(questionType)
        ? options
        : undefined,
      contextElements: contextElements.length > 0 ? contextElements : undefined,
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
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <div
        className='fixed inset-0 animate-fade-in bg-black/40 backdrop-blur-sm transition-opacity'
        onClick={onClose}
      />
      <div className='relative w-11/12 max-w-2xl animate-fade-in'>
        <div className='relative overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-800'>
          {/* Header */}
          <div className='relative border-b border-gray-200 px-8 py-6 dark:border-gray-700'>
            <div className='flex items-center gap-3'>
              <QuestionTypeIcon className='h-6 w-6 text-blue-500 dark:text-blue-400' />
              <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
                {currentQuestion ? "Edit Question" : "Add Question"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className='absolute right-6 top-6 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-500 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-400'
            >
              <X className='h-5 w-5' />
            </button>
          </div>

          {/* Content */}
          <div className='max-h-[calc(80vh-8rem)] overflow-y-auto px-8 py-6'>
            <div className='space-y-6'>
              <div className='space-y-2'>
                <label
                  htmlFor='question-text'
                  className='block text-sm font-medium text-gray-700 dark:text-gray-300'
                >
                  Question Text
                </label>
                <textarea
                  id='question-text'
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  rows={3}
                  className='w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 transition-shadow focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:ring-blue-400'
                  placeholder='Enter your question here...'
                />
              </div>

              <div className='space-y-2'>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Question Type
                </label>
                <div className='grid grid-cols-3 gap-4'>
                  {[
                    { type: "text", label: "Text Input", icon: AlignLeft },
                    {
                      type: "radio",
                      label: "Single Choice",
                      icon: MessageSquare,
                    },
                    {
                      type: "checkbox",
                      label: "Multiple Choice",
                      icon: CheckSquare,
                    },
                  ].map(({ type, label, icon: Icon }) => (
                    <button
                      key={type}
                      type='button'
                      onClick={() => setQuestionType(type as any)}
                      className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${
                        questionType === type
                          ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-500/10"
                          : "border-gray-200 hover:border-blue-500 dark:border-gray-700 dark:hover:border-blue-400"
                      } `}
                    >
                      <Icon
                        className={`h-6 w-6 ${
                          questionType === type
                            ? "text-blue-500 dark:text-blue-400"
                            : "text-gray-400 dark:text-gray-500"
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          questionType === type
                            ? "text-blue-700 dark:text-blue-400"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Context Elements Section */}
              <div className='space-y-4 pt-4'>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Question Context
                </label>

                <div className='space-y-3'>
                  {contextElements.map((element, index) => (
                    <div
                      key={index}
                      className='group flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800'
                    >
                      {element.type === "paragraph" && (
                        <Type className='mt-0.5 h-5 w-5 text-gray-400' />
                      )}
                      {element.type === "image" && (
                        <Image className='mt-0.5 h-5 w-5 text-gray-400' />
                      )}
                      {element.type === "video" && (
                        <Video className='mt-0.5 h-5 w-5 text-gray-400' />
                      )}
                      <div className='flex-1'>
                        <div className='mb-1 text-xs font-medium text-gray-500 dark:text-gray-400'>
                          {element.type.charAt(0).toUpperCase() +
                            element.type.slice(1)}
                        </div>
                        <div className='text-gray-700 dark:text-gray-300'>
                          {element.content}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveContextElement(index)}
                        className='rounded-md p-1 text-gray-400 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100 dark:text-gray-500 dark:hover:text-red-400'
                      >
                        <Trash2 className='h-4 w-4' />
                      </button>
                    </div>
                  ))}
                </div>

                <div className='space-y-3'>
                  <div className='flex gap-3'>
                    <select
                      value={newContextElement.type}
                      onChange={(e) =>
                        setNewContextElement({
                          ...newContextElement,
                          type: e.target.value as ContextElementType,
                        })
                      }
                      className='rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100'
                    >
                      <option value='paragraph'>Paragraph</option>
                      <option value='image'>Image URL</option>
                      <option value='video'>Video URL</option>
                    </select>
                    <input
                      type='text'
                      value={newContextElement.content}
                      onChange={(e) =>
                        setNewContextElement({
                          ...newContextElement,
                          content: e.target.value,
                        })
                      }
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleAddContextElement()
                      }
                      placeholder={
                        newContextElement.type === "paragraph"
                          ? "Add explanatory text..."
                          : newContextElement.type === "image"
                            ? "Add image URL..."
                            : "Add video URL..."
                      }
                      className='flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-400 transition-shadow focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:ring-blue-400'
                    />
                    <button
                      onClick={handleAddContextElement}
                      disabled={!newContextElement.content.trim()}
                      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 font-medium transition-colors ${
                        newContextElement.content.trim()
                          ? "bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20"
                          : "cursor-not-allowed bg-gray-50 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
                      } `}
                    >
                      <Plus className='h-4 w-4' />
                      Add Context
                    </button>
                  </div>
                </div>
              </div>

              {["radio", "checkbox"].includes(questionType) && (
                <div className='space-y-4 pt-4'>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                    Answer Options
                  </label>

                  <div className='space-y-3'>
                    {options.map((option, index) => (
                      <div
                        key={index}
                        className='group flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800'
                      >
                        <input
                          type={questionType}
                          disabled
                          className={`h-4 w-4 border-2 transition-colors ${questionType === "radio" ? "rounded-full" : "rounded"} border-gray-300 bg-gray-100 dark:border-gray-600 dark:bg-gray-700`}
                        />
                        <span className='flex-1 text-gray-700 dark:text-gray-300'>
                          {option}
                        </span>
                        <button
                          onClick={() => handleRemoveOption(index)}
                          className='rounded-md p-1 text-gray-400 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100 dark:text-gray-500 dark:hover:text-red-400'
                        >
                          <Trash2 className='h-4 w-4' />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className='flex gap-3'>
                    <input
                      type='text'
                      value={newOption}
                      onChange={(e) => setNewOption(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddOption()}
                      placeholder='Add a new option...'
                      className='flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-400 transition-shadow focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:ring-blue-400'
                    />
                    <button
                      onClick={handleAddOption}
                      disabled={!newOption.trim()}
                      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 font-medium transition-colors ${
                        newOption.trim()
                          ? "bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20"
                          : "cursor-not-allowed bg-gray-50 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
                      } `}
                    >
                      <Plus className='h-4 w-4' />
                      Add Option
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className='sticky bottom-0 border-t border-gray-200 bg-gray-50 px-8 py-6 dark:border-gray-700 dark:bg-gray-800/50'>
            <div className='flex justify-end gap-4'>
              <button
                onClick={onClose}
                className='rounded-lg border border-gray-200 px-6 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={
                  !questionText.trim() ||
                  (["radio", "checkbox"].includes(questionType) &&
                    options.length < 2)
                }
                className={`rounded-lg px-6 py-2.5 font-medium transition-all ${
                  questionText.trim() &&
                  (!["radio", "checkbox"].includes(questionType) ||
                    options.length >= 2)
                    ? "transform bg-blue-500 text-white hover:scale-[1.02] hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                    : "cursor-not-allowed bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500"
                } `}
              >
                {currentQuestion ? "Save Changes" : "Create Question"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
