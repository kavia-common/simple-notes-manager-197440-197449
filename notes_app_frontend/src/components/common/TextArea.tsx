"use client";

import React from "react";

type TextAreaSize = "sm" | "md" | "lg";

export interface TextAreaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  label?: string;
  size?: TextAreaSize;
  error?: string;
  helperText?: string;
  id?: string;
}

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

const sizeStyles: Record<TextAreaSize, string> = {
  sm: "text-sm p-3",
  md: "text-sm p-3.5",
  lg: "text-base p-4",
};

// PUBLIC_INTERFACE
export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    { className, label, size = "md", error, helperText, id, disabled, rows = 6, ...props },
    ref
  ) => {
    // Ensure hook order is consistent
    const autoId = React.useId();
    const areaId = id ?? autoId;
    const descriptionId = helperText ? `${areaId}-desc` : undefined;
    const errorId = error ? `${areaId}-error` : undefined;
    const describedBy =
      [descriptionId, errorId].filter(Boolean).join(" ") || undefined;

    return (
      <div className={cn("w-full", className)}>
        {label && (
          <label
            htmlFor={areaId}
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <textarea
          id={areaId}
          ref={ref}
          disabled={disabled}
          rows={rows}
          aria-invalid={!!error || undefined}
          aria-describedby={describedBy}
          className={cn(
            "w-full rounded-md border transition-colors outline-none text-gray-900 placeholder-gray-400",
            disabled ? "bg-gray-100 border-gray-200" : "bg-white border-gray-300",
            error
              ? "border-red-500 focus:ring-2 focus:ring-red-500/40"
              : "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40",
            sizeStyles[size]
          )}
          {...props}
        />
        {helperText && !error && (
          <p id={descriptionId} className="mt-1 text-xs text-gray-500">
            {helperText}
          </p>
        )}
        {error && (
          <p id={errorId} role="alert" className="mt-1 text-xs text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";
