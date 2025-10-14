"use client";

import { useConfirmation } from "@/hooks/use-confirmation";
import type { Team } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmationModal } from "./confirmation-modal";
import { ThreeStateCheckbox } from "./three-state-checkbox";

interface TeamRowProps {
  team: Team;
  isSelected: boolean;
  onSelect: (id: string, checked: boolean) => void;
  onDelete: (id: string) => void;
  onStatusUpdate: (
    id: string,
    field: string,
    status: string,
    teamName: string
  ) => Promise<void>;
  onMemberDelete: (teamId: string, memberId: string) => Promise<void>;
  onMemberUpdate: (
    teamId: string,
    memberId: string,
    name: string
  ) => Promise<void>;
  dragHandleProps?: any;
}

export function TeamRow({
  team,
  isSelected,
  onSelect,
  onDelete,
  onStatusUpdate,
  onMemberDelete,
  onMemberUpdate,
  dragHandleProps,
}: TeamRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [editingMemberName, setEditingMemberName] = useState("");
  const { confirm, isOpen, options, handleConfirm, handleCancel } =
    useConfirmation();
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/teams/${team._id}`);
  };

  const handleDeleteClick = async () => {
    const confirmed = await confirm({
      title: "Delete Team",
      message: `Are you sure you want to delete "${team.teamName}"?\n\nThis action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger",
    });

    if (confirmed) {
      onDelete(team._id!);
    }
  };

  const handleMemberEdit = (memberId: string, currentName: string) => {
    setEditingMemberId(memberId);
    setEditingMemberName(currentName);
  };

  const handleMemberSave = async (memberId: string) => {
    if (editingMemberName.trim()) {
      await onMemberUpdate(team._id!, memberId, editingMemberName);
      setEditingMemberId(null);
      setEditingMemberName("");
    }
  };

  const handleMemberDelete = async (memberId: string) => {
    const member = team.members.find((m) => m._id === memberId);
    const memberName = member?.name || "this member";

    const confirmed = await confirm({
      title: "Delete Member",
      message: `Are you sure you want to remove "${memberName}" from "${team.teamName}"?\n\nThis action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger",
    });

    if (confirmed) {
      await onMemberDelete(team._id!, memberId);
    }
  };

  return (
    <>
      <ConfirmationModal
        isOpen={isOpen}
        title={options.title}
        message={options.message}
        confirmText={options.confirmText}
        cancelText={options.cancelText}
        variant={options.variant}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
      <tr className="border-b border-border transition-all duration-200 hover:bg-muted/30 group">
        <td data-label="Select" className="px-4 sm:px-6 py-3 sm:py-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(team._id!, e.target.checked)}
            className="h-4 w-4 sm:h-5 sm:w-5 rounded-md border-2 border-gray-300 text-primary focus:ring-2 focus:ring-primary/20 cursor-pointer transition-all"
          />
        </td>
        <td
          data-label="Order"
          className="cursor-move px-4 sm:px-6 py-3 sm:py-4"
          {...dragHandleProps}
        >
          <svg
            className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground group-hover:text-foreground transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8h16M4 16h16"
            />
          </svg>
        </td>
        <td data-label="Team Name" className="px-4 sm:px-6 py-3 sm:py-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 font-semibold text-primary hover:text-primary/80 transition-colors text-sm sm:text-base"
          >
            <svg
              className={`h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-200 ${
                isExpanded ? "rotate-90" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            {team.teamName}
          </button>
        </td>
        <td
          data-label="Manager"
          className="px-4 sm:px-6 py-3 sm:py-4 text-foreground font-medium text-sm sm:text-base"
        >
          {team.manager}
        </td>
        <td
          data-label="Director"
          className="px-4 sm:px-6 py-3 sm:py-4 text-foreground font-medium text-sm sm:text-base"
        >
          {team.director}
        </td>
        <td data-label="Manager Approval" className="px-4 sm:px-6 py-3 sm:py-4">
          <ThreeStateCheckbox
            status={team.managerApprovalStatus}
            onStatusChange={async (newStatus) => {
              await onStatusUpdate(
                team._id!,
                "managerApprovalStatus",
                newStatus,
                team.teamName
              );
            }}
            label="Manager Approval"
          />
        </td>
        <td
          data-label="Director Approval"
          className="px-4 sm:px-6 py-3 sm:py-4"
        >
          <ThreeStateCheckbox
            status={team.directorApprovalStatus}
            onStatusChange={async (newStatus) => {
              await onStatusUpdate(
                team._id!,
                "directorApprovalStatus",
                newStatus,
                team.teamName
              );
            }}
            label="Director Approval"
          />
        </td>
        <td data-label="Actions" className="px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="rounded-lg bg-primary px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Edit
            </button>
            <button
              onClick={handleDeleteClick}
              className="rounded-lg bg-destructive px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-destructive-foreground shadow-sm hover:bg-destructive/90 hover:shadow-md transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Delete
            </button>
          </div>
        </td>
      </tr>
      {isExpanded && (
        <tr className="animate-slide-in">
          <td
            colSpan={8}
            className="bg-gradient-to-br from-muted/30 via-muted/20 to-muted/10 px-0 sm:px-6 py-3 sm:py-6 border-b border-border"
          >
            <div className="sm:ml-12 max-w-full px-0 pb-4">
              <h4 className="mb-3 sm:mb-4 text-sm sm:text-lg font-bold text-foreground flex items-center gap-2 px-3 sm:px-1 pt-3">
                <svg
                  className="h-4 w-4 sm:h-5 sm:w-5 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                Team Members
              </h4>
              {team.members && team.members.length > 0 ? (
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
                        {team.members.map((member) => (
                          <tr
                            key={member._id}
                            className="hover:bg-muted/20 transition-colors"
                          >
                            <td className="px-6 py-4 align-middle">
                              {editingMemberId === member._id ? (
                                <input
                                  type="text"
                                  value={editingMemberName}
                                  onChange={(e) =>
                                    setEditingMemberName(e.target.value)
                                  }
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
                                {editingMemberId === member._id ? (
                                  <>
                                    <button
                                      onClick={() =>
                                        handleMemberSave(member._id!)
                                      }
                                      className="rounded-lg bg-success px-4 py-2 text-sm font-semibold text-success-foreground shadow-sm hover:bg-success/90 transition-all duration-200 hover:scale-105 active:scale-95 whitespace-nowrap"
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={() => setEditingMemberId(null)}
                                      className="rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground shadow-sm hover:bg-secondary/80 transition-all duration-200 hover:scale-105 active:scale-95 whitespace-nowrap"
                                    >
                                      Cancel
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      onClick={() =>
                                        handleMemberEdit(
                                          member._id!,
                                          member.name
                                        )
                                      }
                                      className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95 whitespace-nowrap"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleMemberDelete(member._id!)
                                      }
                                      className="rounded-lg bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground shadow-sm hover:bg-destructive/90 transition-all duration-200 hover:scale-105 active:scale-95 whitespace-nowrap"
                                    >
                                      Delete
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View - Hidden on Desktop */}
                  <div className="block sm:hidden space-y-3">
                    {team.members.map((member) => (
                      <div
                        key={member._id}
                        className="rounded-xl border border-border bg-card shadow-sm overflow-hidden"
                      >
                        {/* Member Name Section */}
                        <div className="px-4 py-3.5 border-b border-border">
                          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                            Member Name
                          </div>
                          {editingMemberId === member._id ? (
                            <input
                              type="text"
                              value={editingMemberName}
                              onChange={(e) =>
                                setEditingMemberName(e.target.value)
                              }
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
                            {editingMemberId === member._id ? (
                              <>
                                <button
                                  onClick={() => handleMemberSave(member._id!)}
                                  className="rounded-lg bg-success px-4 py-2 text-xs font-semibold text-success-foreground shadow-sm hover:bg-success/90 transition-all duration-200 active:scale-95 whitespace-nowrap"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingMemberId(null)}
                                  className="rounded-lg bg-secondary px-4 py-2 text-xs font-semibold text-secondary-foreground shadow-sm hover:bg-secondary/80 transition-all duration-200 active:scale-95 whitespace-nowrap"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() =>
                                    handleMemberEdit(member._id!, member.name)
                                  }
                                  className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all duration-200 active:scale-95 whitespace-nowrap"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() =>
                                    handleMemberDelete(member._id!)
                                  }
                                  className="rounded-lg bg-destructive px-4 py-2 text-xs font-semibold text-destructive-foreground shadow-sm hover:bg-destructive/90 transition-all duration-200 active:scale-95 whitespace-nowrap"
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-lg sm:rounded-xl border-2 border-dashed border-border bg-muted/20 px-3 sm:px-6 py-4 sm:py-8 text-center">
                  <svg
                    className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground/50 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                    No members added yet.
                  </p>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
