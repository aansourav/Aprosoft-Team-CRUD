/**
 * Custom hook for team management operations
 * Handles all team-related state and API calls with optimistic updates
 */

import { teamsApi } from "@/lib/api/teams";
import type { Team } from "@/lib/types";
import { useCallback, useState } from "react";

interface UseTeamsReturn {
  teams: Team[];
  filteredTeams: Team[];
  loading: boolean;
  setFilteredTeams: (teams: Team[]) => void;
  fetchTeams: () => Promise<void>;
  deleteTeam: (id: string) => Promise<void>;
  bulkDeleteTeams: (ids: string[]) => Promise<void>;
  updateTeamStatus: (
    id: string,
    field: string,
    status: string
  ) => Promise<void>;
  deleteMember: (teamId: string, memberId: string) => Promise<void>;
  updateMember: (
    teamId: string,
    memberId: string,
    name: string
  ) => Promise<void>;
  reorderTeams: (newTeams: Team[]) => Promise<void>;
}

export function useTeams(
  onSuccess: (message: string, description: string) => void,
  onError: (message: string, description: string) => void
): UseTeamsReturn {
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTeams = useCallback(async () => {
    setLoading(true);
    try {
      const data = await teamsApi.getAll();
      setTeams(data);
      setFilteredTeams(data);
    } catch (error) {
      onError(
        "Error Loading Teams",
        "Unable to fetch teams from the server. Please refresh the page."
      );
    } finally {
      setLoading(false);
    }
  }, [onError]);

  const deleteTeam = useCallback(
    async (id: string) => {
      const team = teams.find((t) => t._id === id);
      const teamName = team?.teamName || "Team";

      // Optimistic update
      const previousTeams = teams;
      const previousFiltered = filteredTeams;
      setTeams(teams.filter((t) => t._id !== id));
      setFilteredTeams(filteredTeams.filter((t) => t._id !== id));

      try {
        const data = await teamsApi.delete(id);

        if (data.success) {
          onSuccess(
            "Team Deleted Successfully",
            `"${teamName}" has been removed from the system.`
          );
        } else {
          throw new Error(data.error);
        }
      } catch (error) {
        // Revert on error
        setTeams(previousTeams);
        setFilteredTeams(previousFiltered);
        onError(
          "Error Deleting Team",
          `Failed to delete "${teamName}". Please try again.`
        );
      }
    },
    [teams, filteredTeams, onSuccess, onError]
  );

  const bulkDeleteTeams = useCallback(
    async (ids: string[]) => {
      const selectedTeamNames = teams
        .filter((t) => ids.includes(t._id!))
        .map((t) => t.teamName)
        .join(", ");

      // Optimistic update
      const previousTeams = teams;
      const previousFiltered = filteredTeams;
      setTeams(teams.filter((t) => !ids.includes(t._id!)));
      setFilteredTeams(filteredTeams.filter((t) => !ids.includes(t._id!)));

      try {
        const data = await teamsApi.bulkDelete(ids);

        if (data.success) {
          onSuccess(
            "Teams Deleted Successfully",
            `${ids.length} team(s) removed: ${selectedTeamNames}`
          );
        } else {
          throw new Error(data.error);
        }
      } catch (error) {
        // Revert on error
        setTeams(previousTeams);
        setFilteredTeams(previousFiltered);
        onError(
          "Error Deleting Teams",
          `Failed to delete ${ids.length} team(s). Please try again.`
        );
      }
    },
    [teams, filteredTeams, onSuccess, onError]
  );

  const updateTeamStatus = useCallback(
    async (id: string, field: string, status: string) => {
      const team = teams.find((t) => t._id === id);
      const teamName = team?.teamName || "team";

      // Optimistic update
      const updateTeamStatus = (teamsList: Team[]) =>
        teamsList.map((t) => (t._id === id ? { ...t, [field]: status } : t));

      const previousTeams = teams;
      const previousFiltered = filteredTeams;

      setTeams(updateTeamStatus(teams));
      setFilteredTeams(updateTeamStatus(filteredTeams));

      try {
        const data = await teamsApi.updateStatus(id, field, status);

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

          onSuccess("Status Updated Successfully", statusMessage);
        } else {
          throw new Error(data.error);
        }
      } catch (error) {
        // Revert on error
        setTeams(previousTeams);
        setFilteredTeams(previousFiltered);
        onError(
          "Error Updating Status",
          `Failed to update approval status for "${teamName}". Please try again.`
        );
      }
    },
    [teams, filteredTeams, onSuccess, onError]
  );

  const deleteMember = useCallback(
    async (teamId: string, memberId: string) => {
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
        const data = await teamsApi.deleteMember(teamId, memberId);

        if (data.success) {
          onSuccess(
            "Member Removed Successfully",
            `"${memberName}" has been removed from "${teamName}".`
          );
        } else {
          throw new Error(data.error);
        }
      } catch (error) {
        // Revert on error
        setTeams(previousTeams);
        setFilteredTeams(previousFiltered);
        onError(
          "Error Removing Member",
          `Failed to remove "${memberName}" from "${teamName}". Please try again.`
        );
      }
    },
    [teams, filteredTeams, onSuccess, onError]
  );

  const updateMember = useCallback(
    async (teamId: string, memberId: string, name: string) => {
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
        const data = await teamsApi.updateMember(teamId, memberId, name);

        if (data.success) {
          onSuccess(
            "Member Updated Successfully",
            `Member name changed to "${name}" in "${teamName}".`
          );
        } else {
          throw new Error(data.error);
        }
      } catch (error) {
        // Revert on error
        setTeams(previousTeams);
        setFilteredTeams(previousFiltered);
        onError(
          "Error Updating Member",
          `Failed to update member in "${teamName}". Please try again.`
        );
      }
    },
    [teams, filteredTeams, onSuccess, onError]
  );

  const reorderTeams = useCallback(
    async (newTeams: Team[]) => {
      const previousTeams = teams;

      try {
        const data = await teamsApi.reorder(newTeams);

        if (data.success) {
          onSuccess(
            "Teams Reordered Successfully",
            "The new team order has been saved."
          );
          setTeams(newTeams);
        } else {
          throw new Error(data.error);
        }
      } catch (error) {
        setFilteredTeams(previousTeams);
        onError(
          "Error Reordering Teams",
          "Failed to save the new team order. Please try again."
        );
      }
    },
    [teams, onSuccess, onError]
  );

  return {
    teams,
    filteredTeams,
    loading,
    setFilteredTeams,
    fetchTeams,
    deleteTeam,
    bulkDeleteTeams,
    updateTeamStatus,
    deleteMember,
    updateMember,
    reorderTeams,
  };
}
