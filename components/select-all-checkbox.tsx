interface SelectAllCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  count: number;
  label?: string;
}

export function SelectAllCheckbox({
  checked,
  onChange,
  count,
  label = "Select All Teams",
}: SelectAllCheckboxProps) {
  return (
    <div className="mb-4 sm:hidden flex items-center gap-3 bg-card border-2 border-border rounded-xl px-4 py-3 shadow-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-5 w-5 rounded-md border-2 border-gray-300 text-primary focus:ring-2 focus:ring-primary/20 cursor-pointer transition-all"
      />
      <label className="text-sm font-semibold text-foreground cursor-pointer">
        {label} ({count})
      </label>
    </div>
  );
}

