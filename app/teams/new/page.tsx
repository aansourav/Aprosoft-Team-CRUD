"use client";

import { ConfirmationModal } from "@/components/confirmation-modal";
import { FormActions } from "@/components/form-actions";
import { FormField } from "@/components/form-field";
import { LoadingSpinner } from "@/components/loading-spinner";
import { TeamMembersSection } from "@/components/team-members-section";
import { useConfirmation } from "@/hooks/use-confirmation";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";

export default function NewTeamPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { confirm, isOpen, options, handleConfirm, handleCancel } =
    useConfirmation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    teamName: "",
    manager: "",
    director: "",
  });
  const [members, setMembers] = useState<Array<{ _id?: string; name: string }>>(
    [{ name: "" }]
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

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
      title: "Create Team",
      message: `Are you sure you want to create team "${formData.teamName}"?\n\nThis will add a new team with ${members.length} member(s).`,
      confirmText: "Create Team",
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

      const response = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          members: membersWithIds,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Team Created Successfully",
          description: `"${formData.teamName}" has been created with ${members.length} member(s).`,
        });
        router.push("/");
      } else {
        toast({
          title: "Error",
          description:
            data.error ||
            `Failed to create team "${formData.teamName}". Please try again.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to create team "${formData.teamName}". Please try again.`,
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
            Create New Team
          </h1>
          <p className="mt-2 text-sm sm:text-base lg:text-lg text-muted-foreground">
            Fill in the details to create a new team
          </p>
        </div>

        <div className="rounded-2xl border-2 border-border bg-card p-4 sm:p-6 lg:p-8 shadow-xl animate-scale-in">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 sm:space-y-6">
              <FormField
                id="teamName"
                label="Team Name"
                value={formData.teamName}
                onChange={(value) => {
                  setFormData({ ...formData, teamName: value });
                  setErrors({ ...errors, teamName: "" });
                }}
                error={errors.teamName}
                placeholder="Enter team name"
              />

              <FormField
                id="manager"
                label="Manager"
                value={formData.manager}
                onChange={(value) => {
                  setFormData({ ...formData, manager: value });
                  setErrors({ ...errors, manager: "" });
                }}
                error={errors.manager}
                placeholder="Enter manager name"
              />

              <FormField
                id="director"
                label="Director"
                value={formData.director}
                onChange={(value) => {
                  setFormData({ ...formData, director: value });
                  setErrors({ ...errors, director: "" });
                }}
                error={errors.director}
                placeholder="Enter director name"
              />

              <TeamMembersSection
                members={members}
                errors={errors}
                onMemberUpdate={handleMemberUpdate}
                onRemoveMember={handleRemoveMember}
                onAddMember={handleAddMember}
              />
            </div>

            <FormActions onSubmit={() => {}} onExit={handleExit} />
          </form>
        </div>
      </div>
    </div>
  );
}
