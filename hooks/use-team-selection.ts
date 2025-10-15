/**
 * Custom hook for team selection management
 */

import { useCallback, useState } from "react";

export function useTeamSelection() {
  const [selectedTeams, setSelectedTeams] = useState<Set<string>>(new Set());

  const handleSelectTeam = useCallback((id: string, checked: boolean) => {
    setSelectedTeams((prev) => {
      const newSelected = new Set(prev);
      if (checked) {
        newSelected.add(id);
      } else {
        newSelected.delete(id);
      }
      return newSelected;
    });
  }, []);

  const selectAll = useCallback((ids: string[]) => {
    setSelectedTeams(new Set(ids));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedTeams(new Set());
  }, []);

  return {
    selectedTeams,
    handleSelectTeam,
    selectAll,
    clearSelection,
  };
}
