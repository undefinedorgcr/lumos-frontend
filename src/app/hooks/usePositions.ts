// hooks/usePositions.ts
import { useQuery } from '@tanstack/react-query';

async function fetchPositions(protocol: string) {
    //TODO: implement fetch functionality
    console.log(protocol);
}

export function usePositions(protocol: string) {
  return useQuery({
    queryKey: ['positions', protocol],
    queryFn: () => fetchPositions(protocol),
    staleTime: 30000,
    refetchInterval: 60000,
  });
}