import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function useFamily(familyId: string | undefined) {
  const { data, error, isLoading, mutate } = useSWR(
    familyId ? `/api/families/${familyId}` : null,
    fetcher
  )

  return {
    family: data?.family,
    isLoading,
    error,
    mutate,
  }
}

export function useFamilies() {
  const { data, error, isLoading, mutate } = useSWR('/api/families', fetcher)

  return {
    families: data?.families ?? [],
    isLoading,
    error,
    mutate,
  }
}
