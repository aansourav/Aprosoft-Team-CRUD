/**
 * Custom hook for team search functionality
 */

import type { Team } from "@/lib/types";
import { useEffect, useState } from "react";

export function useTeamSearch(teams: Team[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTeams, setFilteredTeams] = useState<Team[]>(teams);

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

  return {
    searchQuery,
    setSearchQuery,
    filteredTeams,
  };
}
