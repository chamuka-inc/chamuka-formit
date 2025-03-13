"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Question, ContextElement, ContextElementType } from "@/lib/types";
import {
  X,
  MessageSquare,
  CheckSquare,
  AlignLeft,
  Plus,
  Trash2,
} from "lucide-react";
import { ContextElementEditor } from "./ContextElementEditor";

// Type definitions
type QuestionType = "text" | "radio" | "checkbox";

interface QuestionFormState {
  text: string;
  type: QuestionType;
  options: string[];
  contextElements: ContextElement[];
  required: boolean;
}

interface NewContextElementState {
  type: ContextElementType;
  content: string;
}

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentQuestion?: Question;
  onSave: (question: Question) => void;
}

// Reusable components
const ModalHeader = ({
  title,
  icon: Icon,
  onClose,
}: {
  title: string;
  icon: React.ElementType;
  onClose: () => void;
}) => (
  <div className='relative border-b border-gray-200 px-4 py-4 dark:border-gray-700 sm:px-6 md:px-8 md:py-6'>
    <div className='flex items-center gap-2 sm:gap-3'>
      <Icon className='h-5 w-5 text-blue-500 dark:text-blue-400 sm:h-6 sm:w-6' />
      <h2 className='text-xl font-bold text-gray-900 dark:text-gray-100 sm:text-2xl'>
        {title}
      </h2>
    </div>
    <button
      onClick={onClose}
      className='absolute right-4 top-4 rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-500 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-400 sm:right-6 sm:top-6 sm:p-2'
      aria-label='Close modal'
    >
      <X className='h-4 w-4 sm:h-5 sm:w-5' />
    </button>
  </div>
);

const OptionTypeButton = ({
  selected,
  type,
  label,
  icon: Icon,
  onClick,
}: {
  selected: boolean;
  type: string;
  label: string;
  icon: React.ElementType;
  onClick: () => void;
}) => (
  <button
    type='button'
    onClick={onClick}
    className={`flex items-center gap-2 rounded-lg border-2 p-2 transition-all sm:flex-col sm:items-center sm:p-4 ${
      selected
        ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-500/10"
        : "border-gray-200 hover:border-blue-500 dark:border-gray-700 dark:hover:border-blue-400"
    } `}
  >
    <Icon
      className={`h-5 w-5 sm:h-6 sm:w-6 ${
        selected
          ? "text-blue-500 dark:text-blue-400"
          : "text-gray-400 dark:text-gray-500"
      }`}
    />
    <span
      className={`text-sm font-medium ${
        selected
          ? "text-blue-700 dark:text-blue-400"
          : "text-gray-700 dark:text-gray-300"
      }`}
    >
      {label}
    </span>
  </button>
);

const OptionItem = ({
  option,
  type,
  onRemove,
}: {
  option: string;
  type: QuestionType;
  onRemove: () => void;
}) => (
  <div className='group flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-800 sm:gap-3 sm:p-3'>
    <input
      type={type}
      disabled
      className={`h-4 w-4 border-2 transition-colors ${type === "radio" ? "rounded-full" : "rounded"} border-gray-300 bg-gray-100 dark:border-gray-600 dark:bg-gray-700`}
    />
    <span className='min-w-0 flex-1 break-words text-sm text-gray-700 dark:text-gray-300 sm:text-base'>
      {option}
    </span>
    <button
      onClick={onRemove}
      className='rounded-md p-1 text-gray-400 opacity-70 transition-opacity hover:text-red-500 group-hover:opacity-100 dark:text-gray-500 dark:hover:text-red-400 sm:opacity-0'
      aria-label='Remove option'
    >
      <Trash2 className='h-4 w-4' />
    </button>
  </div>
);

const AddItemInput = <T extends string>({
  value,
  onChange,
  onAdd,
  placeholder,
  buttonLabel,
  mobileButtonLabel,
  contextType,
}: {
  value: T;
  onChange: (value: T) => void;
  onAdd: () => void;
  placeholder: string;
  buttonLabel: string;
  mobileButtonLabel: string;
  contextType?: ContextElementType;
}) => {
  const isDisabled = !value.trim();
  const isTextarea = contextType === "paragraph";

  return (
    <div className='flex flex-1 gap-2'>
      {isTextarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value as T)}
          placeholder={placeholder}
          rows={2}
          className='min-h-[60px] min-w-0 flex-1 resize-y rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-900 placeholder-gray-400 transition-shadow focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:ring-blue-400'
        />
      ) : (
        <input
          type='text'
          value={value}
          onChange={(e) => onChange(e.target.value as T)}
          onKeyDown={(e) => e.key === "Enter" && !isDisabled && onAdd()}
          placeholder={placeholder}
          className='min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 transition-shadow focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:ring-blue-400 sm:px-4 sm:py-2.5'
        />
      )}
      <button
        onClick={onAdd}
        disabled={isDisabled}
        className={`inline-flex items-center gap-1 whitespace-nowrap rounded-lg px-3 py-2 font-medium transition-colors sm:gap-2 sm:px-4 sm:py-2.5 ${
          !isDisabled
            ? "bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20"
            : "cursor-not-allowed bg-gray-50 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
        } `}
      >
        <Plus className='h-4 w-4' />
        <span className='hidden sm:inline'>{buttonLabel}</span>
        <span className='inline sm:hidden'>{mobileButtonLabel}</span>
      </button>
    </div>
  );
};

// Main component
export const QuestionModal = ({
  isOpen,
  onClose,
  currentQuestion,
  onSave,
}: QuestionModalProps) => {
  // Form state
  const [formState, setFormState] = useState<QuestionFormState>({
    text: "",
    type: "text",
    options: [],
    contextElements: [],
    required: false,
  });

  // Input state
  const [newOption, setNewOption] = useState("");
  const [newContextElement, setNewContextElement] =
    useState<NewContextElementState>({
      type: "paragraph",
      content: "",
    });

  // Reset form when modal opens/closes or question changes
  useEffect(() => {
    if (isOpen && currentQuestion) {
      setFormState({
        text: currentQuestion.text,
        type: currentQuestion.type,
        options: currentQuestion.options || [],
        contextElements: currentQuestion.contextElements || [],
        required: currentQuestion.required || false,
      });
    } else {
      setFormState({
        text: "",
        type: "text",
        options: [],
        contextElements: [],
        required: false,
      });
    }
    setNewOption("");
    setNewContextElement({ type: "paragraph", content: "" });
  }, [isOpen, currentQuestion]);

  // Handle functions with useCallback for optimization
  const handleAddOption = useCallback(() => {
    if (newOption.trim()) {
      setFormState((prevState) => ({
        ...prevState,
        options: [...prevState.options, newOption.trim()],
      }));
      setNewOption("");
    }
  }, [newOption]);

  const handleRemoveOption = useCallback((index: number) => {
    setFormState((prevState) => ({
      ...prevState,
      options: prevState.options.filter((_, i) => i !== index),
    }));
  }, []);

  const handleAddContextElement = useCallback(() => {
    if (newContextElement.content.trim()) {
      setFormState((prevState) => ({
        ...prevState,
        contextElements: [
          ...prevState.contextElements,
          { ...newContextElement },
        ],
      }));
      setNewContextElement((prev) => ({ ...prev, content: "" }));
    }
  }, [newContextElement]);

  const handleRemoveContextElement = useCallback((index: number) => {
    setFormState((prevState) => ({
      ...prevState,
      contextElements: prevState.contextElements.filter((_, i) => i !== index),
    }));
  }, []);

  const handleSave = useCallback(() => {
    if (formState.text.trim()) {
      onSave({
        ...(currentQuestion?.id ? { id: currentQuestion.id } : {}),
        text: formState.text.trim(),
        type: formState.type,
        options: formState.type !== "text" ? formState.options : undefined,
        contextElements:
          formState.contextElements.length > 0
            ? formState.contextElements
            : undefined,
        required: formState.required,
      });
      onClose();
    }
  }, [formState, currentQuestion, onSave, onClose]);

  // Memoized values
  const isFormValid = useMemo(() => {
    const { text, type, options } = formState;
    return (
      text.trim() &&
      (!["radio", "checkbox"].includes(type) || options.length >= 2)
    );
  }, [formState]);

  const QuestionTypeIcon = useMemo(() => {
    return {
      text: AlignLeft,
      radio: MessageSquare,
      checkbox: CheckSquare,
    }[formState.type];
  }, [formState.type]);

  const getContextPlaceholder = useCallback(
    (type: ContextElementType): string => {
      switch (type) {
        case "paragraph":
          return "Add explanatory text...";
        case "image":
          return "Add image URL...";
        case "video":
          return "Add video URL...";
        default:
          return "Add content...";
      }
    },
    [],
  );

  const questionTypeOptions = useMemo(
    () => [
      { type: "text" as const, label: "Text Input", icon: AlignLeft },
      { type: "radio" as const, label: "Single Choice", icon: MessageSquare },
      {
        type: "checkbox" as const,
        label: "Multiple Choice",
        icon: CheckSquare,
      },
    ],
    [],
  );

  // Don't render anything if modal is closed
  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity ${
        isOpen ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div
        className={`w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-xl transition-transform dark:bg-gray-900 ${
          isOpen ? "scale-100" : "scale-95"
        }`}
      >
        <ModalHeader
          title={currentQuestion ? "Edit Question" : "Add Question"}
          icon={MessageSquare}
          onClose={onClose}
        />

        <div className='space-y-6 p-4 sm:p-6 md:p-8'>
          {/* Question Text Input */}
          <div className='space-y-2'>
            <label
              htmlFor='questionText'
              className='text-sm font-medium text-gray-700 dark:text-gray-300'
            >
              Question Text
            </label>
            <div className='flex items-center gap-2'>
              <input
                id='questionText'
                type='text'
                value={formState.text}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, text: e.target.value }))
                }
                placeholder='Enter your question here...'
                className='flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 transition-shadow focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:ring-blue-400'
              />
              <label className='flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-800'>
                <input
                  type='checkbox'
                  checked={formState.required}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      required: e.target.checked,
                    }))
                  }
                  className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:focus:ring-blue-400'
                />
                <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Required
                </span>
              </label>
            </div>
          </div>

          {/* Question Type */}
          <div className='space-y-2'>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
              Question Type
            </label>
            <div className='grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4'>
              {questionTypeOptions.map(({ type, label, icon }) => (
                <OptionTypeButton
                  key={type}
                  type={type}
                  label={label}
                  icon={icon}
                  selected={formState.type === type}
                  onClick={() => setFormState((prev) => ({ ...prev, type }))}
                />
              ))}
            </div>
          </div>

          {/* Context Elements Section */}
          <div className='space-y-3 pt-3 sm:space-y-4 sm:pt-4'>
            <ContextElementEditor
              elements={formState.contextElements}
              setElements={(elements) =>
                setFormState((prev) => ({
                  ...prev,
                  contextElements: elements,
                }))
              }
            />
          </div>

          {/* Options Section - Only show for radio or checkbox question types */}
          {["radio", "checkbox"].includes(formState.type) && (
            <div className='space-y-3 pt-3 sm:space-y-4 sm:pt-4'>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                Answer Options
              </label>

              {/* Options List */}
              {formState.options.length > 0 && (
                <div className='space-y-2 sm:space-y-3'>
                  {formState.options.map((option, index) => (
                    <OptionItem
                      key={index}
                      option={option}
                      type={formState.type as QuestionType}
                      onRemove={() => handleRemoveOption(index)}
                    />
                  ))}
                </div>
              )}

              {/* Add Option */}
              <div className='flex gap-2 sm:gap-3'>
                <AddItemInput
                  value={newOption}
                  onChange={setNewOption}
                  onAdd={handleAddOption}
                  placeholder='Add a new option...'
                  buttonLabel='Add Option'
                  mobileButtonLabel='Add'
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='sticky bottom-0 border-t border-gray-200 bg-gray-50 px-4 py-4 dark:border-gray-700 dark:bg-gray-800/50 sm:px-6 md:px-8 md:py-6'>
          <div className='flex justify-end gap-2 sm:gap-4'>
            <button
              onClick={onClose}
              className='rounded-lg border border-gray-200 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 sm:px-6 sm:py-2.5'
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!isFormValid}
              className={`rounded-lg px-4 py-2 font-medium transition-all sm:px-6 sm:py-2.5 ${
                isFormValid
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
  );
};
