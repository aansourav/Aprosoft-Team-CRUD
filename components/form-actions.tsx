interface FormActionsProps {
  onSubmit: () => void;
  onExit: () => void;
  submitLabel?: string;
  exitLabel?: string;
}

export function FormActions({
  onSubmit,
  onExit,
  submitLabel = "Save Team",
  exitLabel = "Exit",
}: FormActionsProps) {
  return (
    <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-2 sm:gap-3">
      <button
        type="submit"
        onClick={onSubmit}
        className="rounded-xl bg-primary px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-primary-foreground shadow-lg hover:bg-primary/90 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
      >
        {submitLabel}
      </button>
      <button
        type="button"
        onClick={onExit}
        className="rounded-xl bg-secondary px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-secondary-foreground shadow-lg hover:bg-secondary/80 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
      >
        {exitLabel}
      </button>
    </div>
  );
}

