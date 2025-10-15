"use client";

import { ConfirmationModal } from "@/components/confirmation-modal";
import { EmptyState } from "@/components/empty-state";
import { LoadingSpinner } from "@/components/loading-spinner";
import { PageHeader } from "@/components/page-header";
import { SearchBar } from "@/components/search-bar";
import { SelectAllCheckbox } from "@/components/select-all-checkbox";
import { TeamRow } from "@/components/team-row";
import { useConfirmation } from "@/hooks/use-confirmation";
import { useTeamDrag } from "@/hooks/use-team-drag";
import { useTeamSearch } from "@/hooks/use-team-search";
import { useTeamSelection } from "@/hooks/use-team-selection";
import { useTeams } from "@/hooks/use-teams";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";

export default function TeamsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { confirm, isOpen, options, handleConfirm, handleCancel } =
    useConfirmation();

  // Teams management with API operations
  const {
    teams,
    loading,
    fetchTeams,
    deleteTeam,
    bulkDeleteTeams,
    updateTeamStatus,
    deleteMember,
    updateMember,
    reorderTeams,
  } = useTeams(
    (title, description) => toast({ title, description }),
    (title, description) =>
      toast({ title, description, variant: "destructive" })
  );

  // Search functionality
  const { searchQuery, setSearchQuery, filteredTeams } = useTeamSearch(teams);

  // Team selection
  const { selectedTeams, handleSelectTeam, selectAll, clearSelection } =
    useTeamSelection();

  // Local state for drag operations to maintain order during dragging
  const [localFilteredTeams, setLocalFilteredTeams] = useState(filteredTeams);

  // Sync localFilteredTeams when filteredTeams (from search) changes
  useEffect(() => {
    setLocalFilteredTeams(filteredTeams);
  }, [filteredTeams]);

  // Drag and drop
  const { handleDragStart, handleDragOver, handleDragEnd } = useTeamDrag(
    localFilteredTeams,
    setLocalFilteredTeams,
    async (newTeams) => {
      await reorderTeams(newTeams);
      // Fetch teams again to get the updated order from the server
      await fetchTeams();
    }
  );

  useEffect(() => {
    fetchTeams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handler for delete (confirmation handled in TeamRow component)
  const handleDelete = async (id: string) => {
    await deleteTeam(id);
  };

  // Handler for bulk delete with confirmation
  const handleBulkDelete = async () => {
    if (selectedTeams.size === 0) return;

    const selectedTeamNames = teams
      .filter((t) => selectedTeams.has(t._id!))
      .map((t) => t.teamName)
      .join(", ");

    const confirmed = await confirm({
      title: "Delete Multiple Teams",
      message: `Are you sure you want to delete ${selectedTeams.size} team(s)?\n\n${selectedTeamNames}\n\nThis action cannot be undone.`,
      confirmText: "Delete All",
      cancelText: "Cancel",
      variant: "danger",
    });

    if (confirmed) {
      await bulkDeleteTeams(Array.from(selectedTeams));
      clearSelection();
    }
  };

  // Handler for member delete (confirmation handled in TeamRow component)
  const handleMemberDelete = async (teamId: string, memberId: string) => {
    await deleteMember(teamId, memberId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 sm:p-6">
      {loading && <LoadingSpinner />}
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
      <div className="mx-auto max-w-7xl">
        <PageHeader
          title="Team Management"
          description="Manage your teams, members, and approvals efficiently"
          actions={
            <>
              {selectedTeams.size > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="rounded-xl bg-destructive px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-destructive-foreground shadow-lg hover:bg-destructive/90 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  Delete Selected ({selectedTeams.size})
                </button>
              )}
              <button
                onClick={() => router.push("/teams/new")}
                className="rounded-xl bg-primary px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-primary-foreground shadow-lg hover:bg-primary/90 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
              >
                + New Team
              </button>
            </>
          }
        />

        <div className="mb-4 sm:mb-6 animate-fade-in">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search teams or members..."
          />
        </div>

        <SelectAllCheckbox
          checked={
            selectedTeams.size === localFilteredTeams.length &&
            localFilteredTeams.length > 0
          }
          onChange={(checked) => {
            if (checked) {
              selectAll(localFilteredTeams.map((t) => t._id!));
            } else {
              clearSelection();
            }
          }}
          count={localFilteredTeams.length}
        />

        <div className="overflow-hidden rounded-2xl border-2 border-border bg-card shadow-xl animate-scale-in">
          <div className="overflow-x-auto">
            <table className="w-full mobile-card-table">
              <thead className="bg-gradient-to-r from-muted/80 to-muted/50 border-b-2 border-border">
                <tr>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 text-left">
                    <input
                      type="checkbox"
                      checked={
                        selectedTeams.size === localFilteredTeams.length &&
                        localFilteredTeams.length > 0
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          selectAll(localFilteredTeams.map((t) => t._id!));
                        } else {
                          clearSelection();
                        }
                      }}
                      className="h-4 w-4 sm:h-5 sm:w-5 rounded-md border-2 border-gray-300 text-primary focus:ring-2 focus:ring-primary/20 cursor-pointer transition-all"
                    />
                  </th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 text-left text-xs sm:text-sm font-bold text-foreground uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 text-left text-xs sm:text-sm font-bold text-foreground uppercase tracking-wider">
                    Team Name
                  </th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 text-left text-xs sm:text-sm font-bold text-foreground uppercase tracking-wider">
                    Manager
                  </th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 text-left text-xs sm:text-sm font-bold text-foreground uppercase tracking-wider">
                    Director
                  </th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 text-left text-xs sm:text-sm font-bold text-foreground uppercase tracking-wider">
                    Manager Approval
                  </th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 text-left text-xs sm:text-sm font-bold text-foreground uppercase tracking-wider">
                    Director Approval
                  </th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 text-left text-xs sm:text-sm font-bold text-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {localFilteredTeams.map((team, index) => (
                  <TeamRow
                    key={team._id}
                    team={team}
                    isSelected={selectedTeams.has(team._id!)}
                    onSelect={handleSelectTeam}
                    onDelete={handleDelete}
                    onStatusUpdate={updateTeamStatus}
                    onMemberDelete={handleMemberDelete}
                    onMemberUpdate={updateMember}
                    dragHandleProps={{
                      draggable: true,
                      onDragStart: () => handleDragStart(index),
                      onDragOver: (e: React.DragEvent) =>
                        handleDragOver(e, index),
                      onDragEnd: handleDragEnd,
                    }}
                  />
                ))}
              </tbody>
            </table>
          </div>
          {localFilteredTeams.length === 0 && (
            <EmptyState
              message={
                searchQuery
                  ? "No teams found matching your search."
                  : "No teams yet. Create your first team!"
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
