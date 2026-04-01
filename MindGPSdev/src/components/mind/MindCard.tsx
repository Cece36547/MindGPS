import * as React from "react";
import { cn } from "@/lib/utils";
// react components are reusable pieces of code that return a react element to be rendered to the page, we are creating a card component that can be used to display information in a card format, we are also creating a header, title, description and content component for the card, these components will be used to display the title, description and content of the card respectively.
type MindCardProps = React.HTMLAttributes<HTMLDivElement>;

export function MindCard({ className, ...props }: MindCardProps) { // mind card component, used for displaying information in a card format 
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/80 bg-card/90 text-card-foreground backdrop-blur-md",
        "shadow-[0_10px_40px_-10px_rgba(0,0,0,0.04)]",
        "supports-[backdrop-filter]:bg-card/75",
        "p-6",
        className
      )}
      {...props}
    />
  );
} // mind card compoent designed in our vision

type MindCardHeaderProps = React.HTMLAttributes<HTMLDivElement>;

export function MindCardHeader({ className, ...props }: MindCardHeaderProps) { // header for the mind card, used for displaying the title and description of the card
  return <div className={cn("mb-4 space-y-1", className)} {...props} />;
}

type MindCardTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

export function MindCardTitle({ className, ...props }: MindCardTitleProps) { // title for the mind card, used for displaying the title of the card
  return (
    <h3
      className={cn(
        "text-lg font-semibold tracking-tight text-foreground",
        className
      )}
      {...props}
    />
  );
}

type MindCardDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

export function MindCardDescription({
  className,
  ...props
}: MindCardDescriptionProps) {
  return (
    <p
      className={cn(
        "text-sm leading-relaxed text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

type MindCardContentProps = React.HTMLAttributes<HTMLDivElement>;

export function MindCardContent({
  className,
  ...props
}: MindCardContentProps) {
  return <div className={cn("space-y-4", className)} {...props} />;
}