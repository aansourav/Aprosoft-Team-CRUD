import { Icon } from "./icon";

interface EmptyStateProps {
  message: string;
  icon?: string;
}

export function EmptyState({
  message,
  icon = "empty-state",
}: EmptyStateProps) {
  return (
    <div className="py-12 sm:py-20 text-center px-4">
      <Icon
        name={icon}
        className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground/50 mb-4"
      />
      <p className="text-base sm:text-xl font-medium text-muted-foreground">
        {message}
      </p>
    </div>
  );
}

