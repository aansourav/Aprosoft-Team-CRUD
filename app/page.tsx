"use client";

import { ConfirmationModal } from "@/components/confirmation-modal";
import { LoadingSpinner } from "@/components/loading-spinner";
import { TeamRow } from "@/components/team-row";
import { useConfirmation } from "@/hooks/use-confirmation";
import { useToast } from "@/hooks/use-toast";
import type { Team } from "@/lib/types";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeams, setSelectedTeams] = useState<Set<string>>(new Set());
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const { confirm, isOpen, options, handleConfirm, handleCancel } =
    useConfirmation();

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredTeams(teams);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = teams.filter(
        (team) =>
          team.teamName.toLowerCase().includes(query) ||
          team.manager.toLowerCase().includes(query) ||
          team.director.toLowerCase().includes(query) ||
          team.members.some((member) =>
            member.name.toLowerCase().includes(query)
          )
      );
      setFilteredTeams(filtered);
    }
  }, [searchQuery, teams]);

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/teams");
      const data = await response.json();
      setTeams(data);
      setFilteredTeams(data);
    } catch (error) {
      toast({
        title: "Error Loading Teams",
        description:
          "Unable to fetch teams from the server. Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const team = teams.find((t) => t._id === id);
    const teamName = team?.teamName || "Team";

    const confirmed = await confirm({
      title: "Delete Team",
      message: `Are you sure you want to delete "${teamName}"?\n\nThis action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger",
    });

    if (!confirmed) return;

    // Optimistic update - remove from UI immediately
    const previousTeams = teams;
    const previousFiltered = filteredTeams;
    setTeams(teams.filter((t) => t._id !== id));
    setFilteredTeams(filteredTeams.filter((t) => t._id !== id));

    try {
      const response = await fetch(`/api/teams/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data.success) {
        toast({
          title: "Team Deleted Successfully",
          description: `"${teamName}" has been removed from the system.`,
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      // Revert on error
      setTeams(previousTeams);
      setFilteredTeams(previousFiltered);
      toast({
        title: "Error Deleting Team",
        description: `Failed to delete "${teamName}". Please try again.`,
        variant: "destructive",
      });
    }
  };

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

    if (!confirmed) return;

    // Optimistic update
    const previousTeams = teams;
    const previousFiltered = filteredTeams;
    const idsToDelete = Array.from(selectedTeams);

    setTeams(teams.filter((t) => !selectedTeams.has(t._id!)));
    setFilteredTeams(filteredTeams.filter((t) => !selectedTeams.has(t._id!)));
    setSelectedTeams(new Set());

    try {
      const response = await fetch("/api/teams/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: idsToDelete }),
      });
      const data = await response.json();

      if (data.success) {
        toast({
          title: "Teams Deleted Successfully",
          description: `${idsToDelete.length} team(s) removed: ${selectedTeamNames}`,
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      // Revert on error
      setTeams(previousTeams);
      setFilteredTeams(previousFiltered);
      toast({
        title: "Error Deleting Teams",
        description: `Failed to delete ${idsToDelete.length} team(s). Please try again.`,
        variant: "destructive",
      });
    }
  };

  const handleStatusUpdate = async (
    id: string,
    field: string,
    status: string,
    teamName: string
  ) => {
    // Optimistic update
    const updateTeamStatus = (teamsList: Team[]) =>
      teamsList.map((t) => (t._id === id ? { ...t, [field]: status } : t));

    const previousTeams = teams;
    const previousFiltered = filteredTeams;

    setTeams(updateTeamStatus(teams));
    setFilteredTeams(updateTeamStatus(filteredTeams));

    try {
      const response = await fetch(`/api/teams/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field, status }),
      });
      const data = await response.json();

      if (data.success) {
        const approvalType =
          field === "managerApprovalStatus" ? "Manager" : "Director";
        let statusMessage = "";

        if (status === "approved") {
          statusMessage = `Team "${teamName}" got ${approvalType} Approval`;
        } else if (status === "not-approved") {
          statusMessage = `Team "${teamName}" was Not Approved by ${approvalType}`;
        } else {
          statusMessage = `Team "${teamName}" ${approvalType} approval status reset to Pending`;
        }

        toast({
          title: "Status Updated Successfully",
          description: statusMessage,
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      // Revert on error
      setTeams(previousTeams);
      setFilteredTeams(previousFiltered);
      toast({
        title: "Error Updating Status",
        description: `Failed to update approval status for "${teamName}". Please try again.`,
        variant: "destructive",
      });
    }
  };

  const handleMemberDelete = async (teamId: string, memberId: string) => {
    const team = teams.find((t) => t._id === teamId);
    const member = team?.members.find((m) => m._id === memberId);
    const memberName = member?.name || "Member";
    const teamName = team?.teamName || "team";

    // Optimistic update
    const updateTeamMembers = (teamsList: Team[]) =>
      teamsList.map((t) =>
        t._id === teamId
          ? { ...t, members: t.members.filter((m) => m._id !== memberId) }
          : t
      );

    const previousTeams = teams;
    const previousFiltered = filteredTeams;

    setTeams(updateTeamMembers(teams));
    setFilteredTeams(updateTeamMembers(filteredTeams));

    try {
      const response = await fetch(`/api/teams/${teamId}/members/${memberId}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data.success) {
        toast({
          title: "Member Removed Successfully",
          description: `"${memberName}" has been removed from "${teamName}".`,
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      // Revert on error
      setTeams(previousTeams);
      setFilteredTeams(previousFiltered);
      toast({
        title: "Error Removing Member",
        description: `Failed to remove "${memberName}" from "${teamName}". Please try again.`,
        variant: "destructive",
      });
    }
  };

  const handleMemberUpdate = async (
    teamId: string,
    memberId: string,
    name: string
  ) => {
    const team = teams.find((t) => t._id === teamId);
    const teamName = team?.teamName || "team";

    // Optimistic update
    const updateMemberName = (teamsList: Team[]) =>
      teamsList.map((t) =>
        t._id === teamId
          ? {
              ...t,
              members: t.members.map((m) =>
                m._id === memberId ? { ...m, name } : m
              ),
            }
          : t
      );

    const previousTeams = teams;
    const previousFiltered = filteredTeams;

    setTeams(updateMemberName(teams));
    setFilteredTeams(updateMemberName(filteredTeams));

    try {
      const response = await fetch(`/api/teams/${teamId}/members/${memberId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await response.json();

      if (data.success) {
        toast({
          title: "Member Updated Successfully",
          description: `Member name changed to "${name}" in "${teamName}".`,
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      // Revert on error
      setTeams(previousTeams);
      setFilteredTeams(previousFiltered);
      toast({
        title: "Error Updating Member",
        description: `Failed to update member in "${teamName}". Please try again.`,
        variant: "destructive",
      });
    }
  };

  const handleSelectTeam = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedTeams);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedTeams(newSelected);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newTeams = [...filteredTeams];
    const draggedTeam = newTeams[draggedIndex];
    newTeams.splice(draggedIndex, 1);
    newTeams.splice(index, 0, draggedTeam);

    setFilteredTeams(newTeams);
    setDraggedIndex(index);
  };

  const handleDragEnd = async () => {
    if (draggedIndex === null) return;

    const previousTeams = teams;

    try {
      const response = await fetch("/api/teams/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teams: filteredTeams }),
      });
      const data = await response.json();

      if (data.success) {
        toast({
          title: "Teams Reordered Successfully",
          description: "The new team order has been saved.",
        });
        setTeams(filteredTeams);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      setFilteredTeams(previousTeams);
      toast({
        title: "Error Reordering Teams",
        description: "Failed to save the new team order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDraggedIndex(null);
    }
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
        <div className="mb-6 sm:mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-slide-in">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent py-2">
              Team Management
            </h1>
            <p className="mt-2 text-sm sm:text-base lg:text-lg text-muted-foreground">
              Manage your teams, members, and approvals efficiently
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
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
          </div>
        </div>

        <div className="mb-4 sm:mb-6 animate-fade-in">
          <div className="relative">
            <svg
              className="absolute left-3 sm:left-4 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search teams or members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border-2 border-input bg-card pl-10 sm:pl-12 pr-4 py-3 sm:py-4 text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all duration-200 shadow-sm hover:shadow-md"
            />
          </div>
        </div>

        <div className="mb-4 sm:hidden flex items-center gap-3 bg-card border-2 border-border rounded-xl px-4 py-3 shadow-sm">
          <input
            type="checkbox"
            checked={
              selectedTeams.size === filteredTeams.length &&
              filteredTeams.length > 0
            }
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedTeams(new Set(filteredTeams.map((t) => t._id!)));
              } else {
                setSelectedTeams(new Set());
              }
            }}
            className="h-5 w-5 rounded-md border-2 border-gray-300 text-primary focus:ring-2 focus:ring-primary/20 cursor-pointer transition-all"
          />
          <label className="text-sm font-semibold text-foreground cursor-pointer">
            Select All Teams ({filteredTeams.length})
          </label>
        </div>

        <div className="overflow-hidden rounded-2xl border-2 border-border bg-card shadow-xl animate-scale-in">
          <div className="overflow-x-auto">
            <table className="w-full mobile-card-table">
              <thead className="bg-gradient-to-r from-muted/80 to-muted/50 border-b-2 border-border">
                <tr>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 text-left">
                    <input
                      type="checkbox"
                      checked={
                        selectedTeams.size === filteredTeams.length &&
                        filteredTeams.length > 0
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTeams(
                            new Set(filteredTeams.map((t) => t._id!))
                          );
                        } else {
                          setSelectedTeams(new Set());
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
                {filteredTeams.map((team, index) => (
                  <TeamRow
                    key={team._id}
                    team={team}
                    isSelected={selectedTeams.has(team._id!)}
                    onSelect={handleSelectTeam}
                    onDelete={handleDelete}
                    onStatusUpdate={handleStatusUpdate}
                    onMemberDelete={handleMemberDelete}
                    onMemberUpdate={handleMemberUpdate}
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
          {filteredTeams.length === 0 && (
            <div className="py-12 sm:py-20 text-center px-4">
              <svg
                className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground/50 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <p className="text-base sm:text-xl font-medium text-muted-foreground">
                {searchQuery
                  ? "No teams found matching your search."
                  : "No teams yet. Create your first team!"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
