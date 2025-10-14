"use client"

import { useState, useCallback } from "react"

export function useOptimisticUpdate<T>(initialData: T[]) {
  const [data, setData] = useState<T[]>(initialData)
  const [optimisticData, setOptimisticData] = useState<T[]>(initialData)

  const updateOptimistically = useCallback(
    async (
      optimisticUpdate: (current: T[]) => T[],
      apiCall: () => Promise<any>,
      onSuccess?: (result: any) => void,
      onError?: (error: any) => void,
    ) => {
      // Apply optimistic update immediately
      const previousData = data
      const newData = optimisticUpdate(data)
      setOptimisticData(newData)

      try {
        // Make the API call
        const result = await apiCall()

        // Update actual data on success
        setData(newData)
        onSuccess?.(result)

        return { success: true, result }
      } catch (error) {
        // Revert on error
        setOptimisticData(previousData)
        onError?.(error)

        return { success: false, error }
      }
    },
    [data],
  )

  const syncData = useCallback((newData: T[]) => {
    setData(newData)
    setOptimisticData(newData)
  }, [])

  return {
    data: optimisticData,
    updateOptimistically,
    syncData,
  }
}
