import useSWR from 'swr'
import type { TreeData } from '@/types'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function useFamilyTree(familyId: string | undefined) {
  const { data, error, isLoading, mutate } = useSWR<TreeData>(
    familyId ? `/api/families/${familyId}/tree` : null,
    fetcher,
    { refreshInterval: 0 } // Tree is heavy — don't auto-refresh
  )

  return {
    treeData: data,
    isLoading,
    error,
    mutate,
  }
}
