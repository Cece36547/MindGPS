import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const mindButtonVariants = cva( // mind button component, used for displaying buttons in our design system, we are creating a variant for the button that can be used to display different types of buttons such as primary, secondary, ghost and subtle, we are also creating a fullWidth variant that can be used to make the button take the full width of its container
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "transition-all duration-200",
    "outline-none",
    "disabled:pointer-events-none disabled:opacity-50",
    "focus-visible:ring-4 focus-visible:ring-ring",
    "font-medium",
  ],
  {
    variants: {
      variant: {
        primary: [
          "h-11 rounded-xl px-5 text-sm",
          "bg-primary text-primary-foreground",
          "hover:brightness-95",
          "shadow-[0_8px_24px_-10px_color-mix(in_oklab,var(--primary)_35%,transparent)]",
        ],
        secondary: [
          "h-11 rounded-xl px-5 text-sm",
          "border border-border/80 bg-white/60 text-foreground backdrop-blur-sm",
          "hover:bg-accent hover:text-accent-foreground",
        ],
        ghost: [
          "h-10 rounded-xl px-4 text-sm",
          "text-muted-foreground",
          "hover:bg-accent/70 hover:text-foreground",
        ],
        subtle: [
          "h-10 rounded-xl px-4 text-sm",
          "bg-accent/70 text-accent-foreground",
          "hover:bg-accent",
        ],
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      fullWidth: false,
    },
  }
);

export interface MindButtonProps // mind button props, used for displaying buttons in our design system, we are creating a variant for the button that can be used to display different types of buttons such as primary, secondary, ghost and subtle, we are also creating a fullWidth variant that can be used to make the button take the full width of its container
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof mindButtonVariants> {}

export function MindButton({
  className,
  variant,
  fullWidth,
  type = "button",
  ...props
}: MindButtonProps) {
  return (
    <button
      type={type}
      className={cn(mindButtonVariants({ variant, fullWidth }), className)}
      {...props}
    />
  );
} // mind button component designed in our vision according to the google stitch prototype