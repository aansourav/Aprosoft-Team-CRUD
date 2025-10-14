"use client";

import { ConfirmationModal } from "@/components/confirmation-modal";
import { LoadingSpinner } from "@/components/loading-spinner";
import { TeamMemberRow } from "@/components/team-member-row";
import { useConfirmation } from "@/hooks/use-confirmation";
import { useToast } from "@/hooks/use-toast";
import type { Team } from "@/lib/types";
import { useParams, useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";

export default function EditTeamPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const { confirm, isOpen, options, handleConfirm, handleCancel } =
    useConfirmation();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    teamName: "",
    manager: "",
    director: "",
  });
  const [members, setMembers] = useState<Array<{ _id?: string; name: string }>>(
    [{ name: "" }]
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (params.id) {
      fetchTeam();
    }
  }, [params.id]);

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/teams/${params.id}`);
      const team: Team = await response.json();

      setFormData({
        teamName: team.teamName,
        manager: team.manager,
        director: team.director,
      });
      setMembers(team.members.length > 0 ? team.members : [{ name: "" }]);
    } catch (error) {
      console.error("[v0] Error fetching team:", error);
      toast({
        title: "Error",
        description: "Failed to fetch team",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.teamName.trim()) {
      newErrors.teamName = "Team name is required";
    }
    if (!formData.manager.trim()) {
      newErrors.manager = "Manager is required";
    }
    if (!formData.director.trim()) {
      newErrors.director = "Director is required";
    }

    members.forEach((member, index) => {
      if (!member.name.trim()) {
        newErrors[`member-${index}`] = "Member name is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const confirmed = await confirm({
      title: "Update Team",
      message: `Are you sure you want to update team "${formData.teamName}"?\n\nThis will save all changes including ${members.length} member(s).`,
      confirmText: "Update Team",
      cancelText: "Cancel",
      variant: "default",
    });

    if (!confirmed) return;

    setLoading(true);
    try {
      const membersWithIds = members.map((member) => ({
        ...member,
        _id: member._id || Math.random().toString(36).substring(2, 15),
      }));

      const response = await fetch(`/api/teams/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          members: membersWithIds,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Team Updated Successfully",
          description: `"${formData.teamName}" has been updated with ${members.length} member(s).`,
        });
        router.push("/");
      } else {
        toast({
          title: "Error",
          description:
            data.error ||
            `Failed to update team "${formData.teamName}". Please try again.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to update team "${formData.teamName}". Please try again.`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = () => {
    setMembers([...members, { name: "" }]);
  };

  const handleRemoveMember = (index: number) => {
    if (members.length > 1) {
      const newMembers = members.filter((_, i) => i !== index);
      setMembers(newMembers);
    }
  };

  const handleMemberUpdate = (index: number, name: string) => {
    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], name };
    setMembers(newMembers);
  };

  const handleExit = async () => {
    const confirmed = await confirm({
      title: "Exit Without Saving",
      message:
        "Are you sure you want to exit without saving?\n\nAll your changes will be lost.",
      confirmText: "Exit",
      cancelText: "Stay",
      variant: "danger",
    });

    if (confirmed) {
      router.push("/");
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
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 sm:mb-8 animate-slide-in">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Edit Team
          </h1>
          <p className="mt-2 text-sm sm:text-base lg:text-lg text-muted-foreground">
            Update team details and members
          </p>
        </div>

        <div className="rounded-2xl border-2 border-border bg-card p-4 sm:p-6 lg:p-8 shadow-xl animate-scale-in">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 sm:space-y-6">
              <div>
                <label
                  htmlFor="teamName"
                  className="mb-1.5 sm:mb-2 block text-xs sm:text-sm font-semibold text-foreground"
                >
                  Team Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  id="teamName"
                  value={formData.teamName}
                  onChange={(e) => {
                    setFormData({ ...formData, teamName: e.target.value });
                    setErrors({ ...errors, teamName: "" });
                  }}
                  className={`w-full rounded-xl border-2 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-4 transition-all ${
                    errors.teamName
                      ? "border-destructive focus:ring-destructive/20"
                      : "border-input focus:border-primary focus:ring-primary/10"
                  }`}
                  placeholder="Enter team name"
                />
                {errors.teamName && (
                  <p className="mt-1.5 text-xs sm:text-sm text-destructive font-medium">
                    {errors.teamName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="manager"
                  className="mb-1.5 sm:mb-2 block text-xs sm:text-sm font-semibold text-foreground"
                >
                  Manager <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  id="manager"
                  value={formData.manager}
                  onChange={(e) => {
                    setFormData({ ...formData, manager: e.target.value });
                    setErrors({ ...errors, manager: "" });
                  }}
                  className={`w-full rounded-xl border-2 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-4 transition-all ${
                    errors.manager
                      ? "border-destructive focus:ring-destructive/20"
                      : "border-input focus:border-primary focus:ring-primary/10"
                  }`}
                  placeholder="Enter manager name"
                />
                {errors.manager && (
                  <p className="mt-1.5 text-xs sm:text-sm text-destructive font-medium">
                    {errors.manager}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="director"
                  className="mb-1.5 sm:mb-2 block text-xs sm:text-sm font-semibold text-foreground"
                >
                  Director <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  id="director"
                  value={formData.director}
                  onChange={(e) => {
                    setFormData({ ...formData, director: e.target.value });
                    setErrors({ ...errors, director: "" });
                  }}
                  className={`w-full rounded-xl border-2 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-4 transition-all ${
                    errors.director
                      ? "border-destructive focus:ring-destructive/20"
                      : "border-input focus:border-primary focus:ring-primary/10"
                  }`}
                  placeholder="Enter director name"
                />
                {errors.director && (
                  <p className="mt-1.5 text-xs sm:text-sm text-destructive font-medium">
                    {errors.director}
                  </p>
                )}
              </div>

              <div>
                <div className="mb-2 sm:mb-3 flex items-center justify-between gap-2">
                  <label className="block text-xs sm:text-sm font-semibold text-foreground">
                    Team Members <span className="text-destructive">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddMember}
                    className="rounded-xl bg-success px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-success-foreground shadow-md hover:bg-success/90 hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 whitespace-nowrap"
                  >
                    + Add Member
                  </button>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  {members.map((member, index) => (
                    <TeamMemberRow
                      key={index}
                      member={member}
                      onUpdate={(name) => handleMemberUpdate(index, name)}
                      onRemove={() => handleRemoveMember(index)}
                      error={errors[`member-${index}`]}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                type="submit"
                className="rounded-xl bg-primary px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-primary-foreground shadow-lg hover:bg-primary/90 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Save Team
              </button>
              <button
                type="button"
                onClick={handleExit}
                className="rounded-xl bg-secondary px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-secondary-foreground shadow-lg hover:bg-secondary/80 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Exit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
