import useSWR from 'swr'
import type { FamilyMember } from '@prisma/client'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function useMembers(familyId: string | undefined, query?: string) {
  const url = familyId
    ? `/api/families/${familyId}/members${query ? `?q=${encodeURIComponent(query)}` : ''}`
    : null

  const { data, error, isLoading, mutate } = useSWR<{ members: FamilyMember[] }>(url, fetcher)

  return {
    members: data?.members ?? [],
    isLoading,
    error,
    mutate,
  }
}

export function useMember(familyId: string | undefined, memberId: string | undefined) {
  const { data, error, isLoading, mutate } = useSWR(
    familyId && memberId ? `/api/families/${familyId}/members/${memberId}` : null,
    fetcher
  )

  return {
    member: data?.member,
    isLoading,
    error,
    mutate,
  }
}
