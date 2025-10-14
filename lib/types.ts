export interface TeamMember {
  _id?: string
  name: string
}

export interface Team {
  _id?: string
  teamName: string
  manager: string
  director: string
  members: TeamMember[]
  managerApprovalStatus: "pending" | "approved" | "not-approved"
  directorApprovalStatus: "pending" | "approved" | "not-approved"
  order: number
  createdAt: Date
  updatedAt: Date
}

export type ApprovalStatus = "pending" | "approved" | "not-approved"
