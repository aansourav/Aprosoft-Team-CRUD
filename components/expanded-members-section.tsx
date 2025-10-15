"use client";

import { Icon } from "./icon";
import { MemberCardMobile } from "./member-card-mobile";
import { MemberTableRow } from "./member-table-row";

interface Member {
  _id?: string;
  name: string;
}

interface ExpandedMembersSectionProps {
  members: Member[];
  editingMemberId: string | null;
  editingMemberName: string;
  onMemberEdit: (memberId: string, currentName: string) => void;
  onMemberSave: (memberId: string) => void;
  onMemberDelete: (memberId: string) => void;
  onCancelEdit: () => void;
  onNameChange: (name: string) => void;
}

export function ExpandedMembersSection({
  members,
  editingMemberId,
  editingMemberName,
  onMemberEdit,
  onMemberSave,
  onMemberDelete,
  onCancelEdit,
  onNameChange,
}: ExpandedMembersSectionProps) {
  return (
    <div className="sm:ml-12 max-w-full px-0 pb-4">
      <h4 className="mb-3 sm:mb-4 text-sm sm:text-lg font-bold text-foreground flex items-center gap-2 px-3 sm:px-1 pt-3">
        <Icon
          name="team-members"
          className="h-4 w-4 sm:h-5 sm:w-5 text-primary"
        />
        Team Members
      </h4>
      {members && members.length > 0 ? (
        <div className="w-full space-y-3 px-3 sm:px-0">
          {/* Desktop Table View - Hidden on Mobile */}
          <div className="hidden sm:block w-full overflow-hidden rounded-xl border border-border bg-card shadow-md">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Member Name
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {members.map((member) => (
                  <MemberTableRow
                    key={member._id}
                    member={member}
                    isEditing={editingMemberId === member._id}
                    editingName={editingMemberName}
                    onEdit={() => onMemberEdit(member._id!, member.name)}
                    onDelete={() => onMemberDelete(member._id!)}
                    onSave={() => onMemberSave(member._id!)}
                    onCancel={onCancelEdit}
                    onNameChange={onNameChange}
                    isLastMember={members.length === 1}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View - Hidden on Desktop */}
          <div className="block sm:hidden space-y-3">
            {members.map((member) => (
              <MemberCardMobile
                key={member._id}
                member={member}
                isEditing={editingMemberId === member._id}
                editingName={editingMemberName}
                onEdit={() => onMemberEdit(member._id!, member.name)}
                onDelete={() => onMemberDelete(member._id!)}
                onSave={() => onMemberSave(member._id!)}
                onCancel={onCancelEdit}
                onNameChange={onNameChange}
                isLastMember={members.length === 1}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-lg sm:rounded-xl border-2 border-dashed border-border bg-muted/20 px-3 sm:px-6 py-4 sm:py-8 text-center">
          <Icon
            name="team-members"
            className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground/50 mb-2"
          />
          <p className="text-xs sm:text-sm font-medium text-muted-foreground">
            No members added yet.
          </p>
        </div>
      )}
    </div>
  );
}
