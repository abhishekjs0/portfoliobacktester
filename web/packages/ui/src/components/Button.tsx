import type { ButtonHTMLAttributes, ReactElement, ReactNode } from "react";
import { cloneElement, forwardRef, isValidElement } from "react";
import clsx from "clsx";

export type ButtonVariant = "primary" | "secondary" | "ghost";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: ReactNode;
  isLoading?: boolean;
  asChild?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:bg-indigo-400",
  secondary:
    "bg-slate-100 text-slate-900 hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:bg-slate-100",
  ghost:
    "bg-transparent text-indigo-600 hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:text-indigo-300",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      type = "button",
      variant = "primary",
      icon,
      isLoading = false,
      children,
      disabled,
      asChild = false,
      ...rest
    },
    ref
  ) => {
    const classes = clsx(
      "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition-colors duration-150",
      "focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
      variantClasses[variant],
      className
    );

    const content = (
      <span className="inline-flex items-center gap-2">
        {icon}
        <span>{children}</span>
      </span>
    );

    if (asChild && isValidElement(children)) {
      const child = children as ReactElement;
      const mergedProps = {
        className: clsx(classes, child.props.className),
        "aria-disabled": disabled || isLoading ? true : undefined,
        ...rest,
      };
      return cloneElement(child, mergedProps);
    }

    return (
      <button ref={ref} type={type} className={classes} disabled={disabled || isLoading} {...rest}>
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
            <span>Processing…</span>
          </span>
        ) : (
          content
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
