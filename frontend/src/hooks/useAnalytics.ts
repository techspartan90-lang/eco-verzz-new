import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";

export function useComparisonData(symbols: string[]) {
  return useQuery({
    queryKey: ["fundComparison", symbols],
    queryFn: () => (symbols && symbols.length > 0 ? api.runFundComparison(symbols) : null),
    enabled: !!symbols && symbols.length > 0,
  });
}

export function useSavedComparisons() {
  return useQuery({
    queryKey: ["savedComparisons"],
    queryFn: () => api.getSavedAndRecentComparisons(),
  });
}

export function useHistoricalNav(symbols: string[]) {
  return useQuery({
    queryKey: ["historicalNav", symbols],
    queryFn: () => (symbols && symbols.length > 0 ? api.getHistoricalNav(symbols) : null),
    enabled: !!symbols && symbols.length > 0,
  });
}

export function useAnalyticsMutations() {
  const queryClient = useQueryClient();

  const saveComparison = useMutation({
    mutationFn: ({ name, funds }: { name: string; funds: string[] }) =>
      api.saveUserComparison(name, funds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedComparisons"] });
    },
  });

  return {
    saveComparison,
  };
}
