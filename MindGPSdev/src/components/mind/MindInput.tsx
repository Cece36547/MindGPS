import * as React from "react";
import { cn } from "@/lib/utils";

export interface MindInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}
// mind input component, used for displaying input fields in our design system, we are creating a variant for the input that can be used to display different types of inputs such as text, password, email and number, we are also creating a fullWidth variant that can be used to make the input take the full width of its container
export const MindInput = React.forwardRef<HTMLInputElement, MindInputProps>( 
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type} // we are using the type prop to determine the type of input we want to display, we are also using the ref to focus the input element when the component is rendered
        className={cn(
          "flex h-11 w-full rounded-xl border border-input/90 bg-white/70 px-4 py-2",
          "text-sm text-foreground placeholder:text-muted-foreground",
          "backdrop-blur-sm transition-all duration-200",
          "outline-none",
          "focus:border-primary/60 focus:ring-4 focus:ring-ring",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    );
  } 
);
// we are using forwardRef to forward the ref to the input element, this allows us to use the ref in the parent component to focus the input element when the component is rendered
MindInput.displayName = "MindInput"; // mind input component designed in our vision according to the google stitch prototype