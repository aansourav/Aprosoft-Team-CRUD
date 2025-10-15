interface FormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
}

export function FormField({
  id,
  label,
  value,
  onChange,
  error,
  placeholder,
  required = true,
  type = "text",
}: FormFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 sm:mb-2 block text-xs sm:text-sm font-semibold text-foreground"
      >
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-xl border-2 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-4 transition-all ${
          error
            ? "border-destructive focus:ring-destructive/20"
            : "border-input focus:border-primary focus:ring-primary/10"
        }`}
        placeholder={placeholder}
      />
      {error && (
        <p className="mt-1.5 text-xs sm:text-sm text-destructive font-medium">
          {error}
        </p>
      )}
    </div>
  );
}

