"use client"

import { useEffect, useState } from "react"

interface ConfirmationModalProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: "default" | "danger"
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    } else {
      const timer = setTimeout(() => setIsVisible(false), 200)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!isVisible) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-200 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onCancel} />

      {/* Modal */}
      <div
        className={`relative w-full max-w-md transform transition-all duration-200 ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="rounded-2xl border-2 border-border bg-card shadow-2xl overflow-hidden">
          {/* Header with gradient */}
          <div
            className={`px-6 py-5 ${
              variant === "danger"
                ? "bg-gradient-to-r from-destructive/10 to-destructive/5 border-b-2 border-destructive/20"
                : "bg-gradient-to-r from-primary/10 to-primary/5 border-b-2 border-primary/20"
            }`}
          >
            <div className="flex items-center gap-3">
              {variant === "danger" ? (
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10 ring-2 ring-destructive/20">
                  <svg className="h-6 w-6 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 ring-2 ring-primary/20">
                  <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              )}
              <h3 className="text-xl font-bold text-foreground">{title}</h3>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            <p className="text-base leading-relaxed text-muted-foreground whitespace-pre-line">{message}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 px-6 pb-6">
            <button
              onClick={onCancel}
              className="flex-1 rounded-xl border-2 border-border bg-background px-6 py-3 font-semibold text-foreground transition-all duration-200 hover:bg-muted hover:scale-105 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-primary/20"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 rounded-xl px-6 py-3 font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 ${
                variant === "danger"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive/20"
                  : "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary/20"
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
