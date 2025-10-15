"use client";

interface MemberCardMobileProps {
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

export function MemberCardMobile({
  member,
  isEditing,
  editingName,
  onEdit,
  onDelete,
  onSave,
  onCancel,
  onNameChange,
  isLastMember = false,
}: MemberCardMobileProps) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      {/* Member Name Section */}
      <div className="px-4 py-3.5 border-b border-border">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Member Name
        </div>
        {isEditing ? (
          <input
            type="text"
            value={editingName}
            onChange={(e) => onNameChange(e.target.value)}
            className="w-full rounded-lg border-2 border-primary bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            autoFocus
          />
        ) : (
          <div className="text-foreground font-medium text-sm">
            {member.name}
          </div>
        )}
      </div>

      {/* Actions Section */}
      <div className="px-4 py-3.5 bg-muted/20">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">
          Actions
        </div>
        <div className="flex gap-2 justify-start">
          {isEditing ? (
            <>
              <button
                onClick={onSave}
                className="rounded-lg bg-success px-4 py-2 text-xs font-semibold text-success-foreground shadow-sm hover:bg-success/90 transition-all duration-200 active:scale-95 whitespace-nowrap"
              >
                Save
              </button>
              <button
                onClick={onCancel}
                className="rounded-lg bg-secondary px-4 py-2 text-xs font-semibold text-secondary-foreground shadow-sm hover:bg-secondary/80 transition-all duration-200 active:scale-95 whitespace-nowrap"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onEdit}
                className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all duration-200 active:scale-95 whitespace-nowrap"
              >
                Edit
              </button>
              <button
                onClick={onDelete}
                disabled={isLastMember}
                className={`rounded-lg px-4 py-2 text-xs font-semibold shadow-sm transition-all duration-200 whitespace-nowrap ${
                  isLastMember
                    ? "bg-destructive/50 text-destructive-foreground/50 cursor-not-allowed"
                    : "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:scale-95"
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
      </div>
    </div>
  );
}
