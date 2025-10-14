"use client"

import { useState } from "react"
import type { ApprovalStatus } from "@/lib/types"

interface ThreeStateCheckboxProps {
  status: ApprovalStatus
  onStatusChange: (newStatus: ApprovalStatus) => Promise<void>
  label: string
}

export function ThreeStateCheckbox({ status, onStatusChange, label }: ThreeStateCheckboxProps) {
  const [optimisticStatus, setOptimisticStatus] = useState<ApprovalStatus>(status)
  const [isLoading, setIsLoading] = useState(false)

  const getNextStatus = (current: ApprovalStatus): ApprovalStatus => {
    if (current === "pending") return "approved"
    if (current === "approved") return "not-approved"
    return "pending"
  }

  const handleClick = async () => {
    const nextStatus = getNextStatus(optimisticStatus)

    setOptimisticStatus(nextStatus)
    setIsLoading(true)

    try {
      await onStatusChange(nextStatus)
    } catch (error) {
      setOptimisticStatus(status)
    } finally {
      setIsLoading(false)
    }
  }

  const getTooltipText = () => {
    if (optimisticStatus === "pending") return "No Action Taken"
    if (optimisticStatus === "approved") return "Approved"
    return "Not Approved"
  }

  const getIcon = () => {
    if (optimisticStatus === "pending") {
      return (
        <div
          className="h-6 w-6 rounded-full border-2 border-gray-400 bg-gray-300 transition-all duration-200 hover:scale-110"
          title={getTooltipText()}
        />
      )
    }
    if (optimisticStatus === "approved") {
      return (
        <div
          className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-success bg-success transition-all duration-200 hover:scale-110 shadow-sm"
          title={getTooltipText()}
        >
          <svg className="h-3.5 w-3.5 text-success-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )
    }
    return (
      <div
        className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-destructive bg-destructive transition-all duration-200 hover:scale-110 shadow-sm"
        title={getTooltipText()}
      >
        <svg className="h-3.5 w-3.5 text-destructive-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    )
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className="flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-50 group"
      type="button"
    >
      {getIcon()}
      <span className="sr-only">{label}</span>
    </button>
  )
}
