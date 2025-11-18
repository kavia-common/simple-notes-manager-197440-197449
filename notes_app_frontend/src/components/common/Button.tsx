"use client";

import React from "react";

/**
 * Ocean Professional theme tokens
 */
const theme = {
  primary: {
    base: "bg-blue-600 text-white",
    hover: "hover:bg-blue-700",
    ring: "focus-visible:ring-blue-500/50",
    border: "border-transparent",
  },
  secondary: {
    base: "bg-amber-500 text-white",
    hover: "hover:bg-amber-600",
    ring: "focus-visible:ring-amber-500/50",
    border: "border-transparent",
  },
  destructive: {
    base: "bg-red-500 text-white",
    hover: "hover:bg-red-600",
    ring: "focus-visible:ring-red-500/50",
    border: "border-transparent",
  },
  ghost: {
    base: "bg-transparent text-gray-900",
    hover: "hover:bg-gray-100",
    ring: "focus-visible:ring-blue-500/40",
    border: "border-gray-300",
  },
};

const sizes = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export type ButtonVariant = "primary" | "secondary" | "destructive" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/**
 * Utility to combine class names
 * Ensures only string-like truthy values are joined, avoiding numeric truthy values.
 */
function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter((v): v is string => typeof v === "string" && v.length > 0).join(" ");
}

// PUBLIC_INTERFACE
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      disabled,
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;
    const color = theme[variant];

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center rounded-md border font-medium transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "ring-offset-white dark:ring-offset-gray-900",
          color.base,
          color.hover,
          color.ring,
          color.border,
          sizes[size],
          isDisabled && "opacity-60 cursor-not-allowed",
          className
        )}
        disabled={isDisabled}
        aria-disabled={isDisabled || undefined}
        aria-busy={isLoading || undefined}
        {...props}
      >
        {/* Loading spinner */}
        {isLoading && (
          <svg
            className={cn(
              "animate-spin -ml-0.5 mr-2 h-4 w-4 text-current",
              leftIcon ? "-ml-1" : false
            )}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            role="img"
            aria-label="Loading"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        )}
        {leftIcon && !isLoading ? (
          <span className="-ml-1 mr-2 inline-flex">{leftIcon}</span>
        ) : null}
        <span>{children}</span>
        {rightIcon ? <span className="ml-2 inline-flex">{rightIcon}</span> : null}
      </button>
    );
  }
);

Button.displayName = "Button";
