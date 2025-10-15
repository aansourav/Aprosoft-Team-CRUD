import { TeamMemberRow } from "./team-member-row";

interface Member {
  _id?: string;
  name: string;
}

interface TeamMembersSectionProps {
  members: Member[];
  errors: Record<string, string>;
  onMemberUpdate: (index: number, name: string) => void;
  onRemoveMember: (index: number) => void;
  onAddMember: () => void;
}

export function TeamMembersSection({
  members,
  errors,
  onMemberUpdate,
  onRemoveMember,
  onAddMember,
}: TeamMembersSectionProps) {
  return (
    <div>
      <div className="mb-2 sm:mb-3 flex items-center justify-between gap-2">
        <label className="block text-xs sm:text-sm font-semibold text-foreground">
          Team Members <span className="text-destructive">*</span>
        </label>
        <button
          type="button"
          onClick={onAddMember}
          className="rounded-xl bg-success px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-success-foreground shadow-md hover:bg-success/90 hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 whitespace-nowrap"
        >
          + Add Member
        </button>
      </div>
      <div className="space-y-2 sm:space-y-3">
        {members.map((member, index) => (
          <TeamMemberRow
            key={index}
            member={member}
            onUpdate={(name) => onMemberUpdate(index, name)}
            onRemove={() => onRemoveMember(index)}
            error={errors[`member-${index}`]}
          />
        ))}
      </div>
    </div>
  );
}

