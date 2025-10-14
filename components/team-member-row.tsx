"use client"

import { useState } from "react"

interface TeamMemberRowProps {
  member: { _id?: string; name: string }
  onUpdate: (name: string) => void
  onRemove: () => void
}

export function TeamMemberRow({ member, onUpdate, onRemove }: TeamMemberRowProps) {
  const [name, setName] = useState(member.name)
  const [error, setError] = useState("")

  const handleNameChange = (value: string) => {
    setName(value)
    setError("")
    onUpdate(value)
  }

  const handleBlur = () => {
    if (!name.trim()) {
      setError("Member name is required")
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <div className="flex-1">
          <input
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            onBlur={handleBlur}
            placeholder="Enter member name"
            className={`w-full rounded border px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 ${
              error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
            }`}
          />
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
        <button type="button" onClick={onRemove} className="rounded bg-red-500 px-3 sm:px-4 py-2 text-sm sm:text-base text-white hover:bg-red-600">
          Remove
        </button>
      </div>
    </div>
  )
}
