"use client";

interface MemberTableRowProps {
  member: { _id?: string; name: string };
  isEditing: boolean;
  editingName: string;
  onEdit: () => void;
  onDelete: () => void;
  onSave: () => void;
  onCancel: () => void;
  onNameChange: (name: string) => void;
  isLastMember?: boolean;
}

export function MemberTableRow({
  member,
  isEditing,
  editingName,
  onEdit,
  onDelete,
  onSave,
  onCancel,
  onNameChange,
  isLastMember = false,
}: MemberTableRowProps) {
  return (
    <tr className="hover:bg-muted/20 transition-colors">
      <td className="px-6 py-4 align-middle">
        {isEditing ? (
          <input
            type="text"
            value={editingName}
            onChange={(e) => onNameChange(e.target.value)}
            className="w-full rounded-lg border-2 border-primary bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            autoFocus
          />
        ) : (
          <span className="text-foreground font-medium text-base">
            {member.name}
          </span>
        )}
      </td>
      <td className="px-6 py-4 align-middle">
        <div className="flex gap-2.5 justify-end items-center">
          {isEditing ? (
            <>
              <button
                onClick={onSave}
                className="rounded-lg bg-success px-4 py-2 text-sm font-semibold text-success-foreground shadow-sm hover:bg-success/90 transition-all duration-200 hover:scale-105 active:scale-95 whitespace-nowrap"
              >
                Save
              </button>
              <button
                onClick={onCancel}
                className="rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground shadow-sm hover:bg-secondary/80 transition-all duration-200 hover:scale-105 active:scale-95 whitespace-nowrap"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onEdit}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95 whitespace-nowrap"
              >
                Edit
              </button>
              <button
                onClick={onDelete}
                disabled={isLastMember}
                className={`rounded-lg px-4 py-2 text-sm font-semibold shadow-sm transition-all duration-200 whitespace-nowrap ${
                  isLastMember
                    ? "bg-destructive/50 text-destructive-foreground/50 cursor-not-allowed"
                    : "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:scale-105 active:scale-95"
                }`}
                title={
                  isLastMember
                    ? "Cannot delete the last member"
                    : "Delete member"
                }
              >
                Delete
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}
