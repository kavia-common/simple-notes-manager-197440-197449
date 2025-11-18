"use client";

import React from "react";

type InputSize = "sm" | "md" | "lg";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  size?: InputSize;
  error?: string;
  helperText?: string;
  id?: string;
  rightAdornment?: React.ReactNode;
  leftAdornment?: React.ReactNode;
}

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

const sizeStyles: Record<InputSize, string> = {
  sm: "h-9 text-sm px-3",
  md: "h-11 text-sm px-3.5",
  lg: "h-12 text-base px-4",
};

// PUBLIC_INTERFACE
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      size = "md",
      error,
      helperText,
      id,
      disabled,
      rightAdornment,
      leftAdornment,
      ...props
    },
    ref
  ) => {
    // Ensure hooks are called unconditionally and IDs are stable
    const autoId = React.useId();
    const inputId = id ?? autoId;
    const descriptionId = helperText ? `${inputId}-desc` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;
    const describedBy =
      [descriptionId, errorId].filter(Boolean).join(" ") || undefined;

    return (
      <div className={cn("w-full", className)}>
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <div
          className={cn(
            "relative flex items-center rounded-md border transition-colors",
            disabled ? "bg-gray-100 border-gray-200" : "bg-white border-gray-300",
            error
              ? "border-red-500 focus-within:ring-red-500/40"
              : "focus-within:border-blue-500 focus-within:ring-blue-500/40",
            "focus-within:ring-2"
          )}
        >
          {leftAdornment && (
            <span className="pointer-events-none absolute left-3 text-gray-400">
              {leftAdornment}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            aria-invalid={!!error || undefined}
            aria-describedby={describedBy}
            className={cn(
              "w-full rounded-md bg-transparent text-gray-900 placeholder-gray-400 outline-none",
              sizeStyles[size],
              leftAdornment ? "pl-9" : false,
              rightAdornment ? "pr-10" : false
            )}
            {...props}
          />
          {rightAdornment && (
            <span className="absolute right-3 text-gray-400">{rightAdornment}</span>
          )}
        </div>
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

Input.displayName = "Input";
