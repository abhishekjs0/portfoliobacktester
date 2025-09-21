"use client";

import { forwardRef } from "react";
import clsx from "clsx";

export type ButtonVariant = "primary" | "secondary" | "ghost";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
}

const baseStyles =
  "inline-flex items-center justify-center rounded-full border border-transparent px-5 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60";

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-brand text-white hover:bg-brand-dark focus-visible:outline-brand", 
  secondary:
    "bg-white/10 text-white hover:bg-white/20 border-white/20 focus-visible:outline-white",
  ghost: "bg-transparent text-white hover:bg-white/10 border-white/20 focus-visible:outline-white",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", isLoading = false, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(baseStyles, variantStyles[variant], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        <span className="flex items-center gap-2">
          {isLoading && (
            <span
              aria-hidden="true"
              className="h-3 w-3 animate-spin rounded-full border-2 border-white/60 border-t-transparent"
            />
          )}
          <span>{children}</span>
        </span>
      </button>
    );
  }
);

Button.displayName = "Button";
