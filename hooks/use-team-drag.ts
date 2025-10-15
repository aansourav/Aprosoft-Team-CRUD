/**
 * Custom hook for team drag and drop functionality
 */

import type { Team } from "@/lib/types";
import type React from "react";
import { useCallback, useState } from "react";

export function useTeamDrag(
  filteredTeams: Team[],
  setFilteredTeams: (teams: Team[]) => void,
  onReorder: (teams: Team[]) => Promise<void>
) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = useCallback((index: number) => {
    setDraggedIndex(index);
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      if (draggedIndex === null || draggedIndex === index) return;

      const newTeams = [...filteredTeams];
      const draggedTeam = newTeams[draggedIndex];
      newTeams.splice(draggedIndex, 1);
      newTeams.splice(index, 0, draggedTeam);

      setFilteredTeams(newTeams);
      setDraggedIndex(index);
    },
    [draggedIndex, filteredTeams, setFilteredTeams]
  );

  const handleDragEnd = useCallback(async () => {
    if (draggedIndex === null) return;

    try {
      await onReorder(filteredTeams);
    } finally {
      setDraggedIndex(null);
    }
  }, [draggedIndex, filteredTeams, onReorder]);

  return {
    draggedIndex,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
}
