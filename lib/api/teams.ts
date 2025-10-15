/**
 * Teams API Service
 * Centralized API calls for team management
 */

import type { Team } from "@/lib/types";

export const teamsApi = {
  /**
   * Fetch all teams
   */
  async getAll(): Promise<Team[]> {
    const response = await fetch("/api/teams");
    if (!response.ok) throw new Error("Failed to fetch teams");
    return response.json();
  },

  /**
   * Fetch a single team by ID
   */
  async getById(id: string): Promise<Team> {
    const response = await fetch(`/api/teams/${id}`);
    if (!response.ok) throw new Error("Failed to fetch team");
    return response.json();
  },

  /**
   * Create a new team
   */
  async create(
    team: Omit<Team, "_id">
  ): Promise<{ success: boolean; error?: string }> {
    const response = await fetch("/api/teams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(team),
    });
    return response.json();
  },

  /**
   * Update an existing team
   */
  async update(
    id: string,
    team: Partial<Team>
  ): Promise<{ success: boolean; error?: string }> {
    const response = await fetch(`/api/teams/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(team),
    });
    return response.json();
  },

  /**
   * Delete a team
   */
  async delete(id: string): Promise<{ success: boolean; error?: string }> {
    const response = await fetch(`/api/teams/${id}`, {
      method: "DELETE",
    });
    return response.json();
  },

  /**
   * Bulk delete teams
   */
  async bulkDelete(
    ids: string[]
  ): Promise<{ success: boolean; error?: string }> {
    const response = await fetch("/api/teams/bulk-delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });
    return response.json();
  },

  /**
   * Update team status
   */
  async updateStatus(
    id: string,
    field: string,
    status: string
  ): Promise<{ success: boolean; error?: string }> {
    const response = await fetch(`/api/teams/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ field, status }),
    });
    return response.json();
  },

  /**
   * Delete a team member
   */
  async deleteMember(
    teamId: string,
    memberId: string
  ): Promise<{ success: boolean; error?: string }> {
    const response = await fetch(`/api/teams/${teamId}/members/${memberId}`, {
      method: "DELETE",
    });
    return response.json();
  },

  /**
   * Update a team member
   */
  async updateMember(
    teamId: string,
    memberId: string,
    name: string
  ): Promise<{ success: boolean; error?: string }> {
    const response = await fetch(`/api/teams/${teamId}/members/${memberId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    return response.json();
  },

  /**
   * Reorder teams
   */
  async reorder(teams: Team[]): Promise<{ success: boolean; error?: string }> {
    const response = await fetch("/api/teams/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teams }),
    });
    return response.json();
  },
};
