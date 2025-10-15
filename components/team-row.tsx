"use client";

import { useConfirmation } from "@/hooks/use-confirmation";
import type { Team } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmationModal } from "./confirmation-modal";
import { ExpandedMembersSection } from "./expanded-members-section";
import { Icon } from "./icon";
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
    // Prevent deleting the last member
    if (team.members.length === 1) {
      await confirm({
        title: "Cannot Delete Last Member",
        message: `Cannot remove the last member from "${team.teamName}".\n\nA team must have at least one member.`,
        confirmText: "OK",
        cancelText: "",
        variant: "danger",
      });
      return;
    }

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
          <Icon
            name="drag-handle"
            className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground group-hover:text-foreground transition-colors"
          />
        </td>
        <td data-label="Team Name" className="px-4 sm:px-6 py-3 sm:py-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 font-semibold text-primary hover:text-primary/80 transition-colors text-sm sm:text-base"
          >
            <Icon
              name="chevron-right"
              className={`h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-200 ${
                isExpanded ? "rotate-90" : ""
              }`}
            />
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
            <ExpandedMembersSection
              members={team.members}
              editingMemberId={editingMemberId}
              editingMemberName={editingMemberName}
              onMemberEdit={handleMemberEdit}
              onMemberSave={handleMemberSave}
              onMemberDelete={handleMemberDelete}
              onCancelEdit={() => setEditingMemberId(null)}
              onNameChange={setEditingMemberName}
            />
          </td>
        </tr>
      )}
    </>
  );
}
