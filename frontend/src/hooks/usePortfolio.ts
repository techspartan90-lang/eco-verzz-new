import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";

export function usePortfolios() {
  return useQuery({
    queryKey: ["portfolios"],
    queryFn: () => api.getPortfolios(),
  });
}

export function usePortfolioDetails(portfolioId?: string) {
  return useQuery({
    queryKey: ["portfolio", portfolioId],
    queryFn: () => (portfolioId ? api.getPortfolio(portfolioId) : null),
    enabled: !!portfolioId,
  });
}

export function useHoldings(portfolioId?: string) {
  return useQuery({
    queryKey: ["holdings", portfolioId],
    queryFn: () => (portfolioId ? api.getHoldings(portfolioId) : []),
    enabled: !!portfolioId,
  });
}

export function useTransactions(portfolioId?: string, typeFilter?: string, search?: string) {
  return useQuery({
    queryKey: ["transactions", portfolioId, typeFilter, search],
    queryFn: () =>
      portfolioId
        ? api.getTransactions(portfolioId, { type: typeFilter, search })
        : [],
    enabled: !!portfolioId,
  });
}

export function usePortfolioMutations(portfolioId?: string) {
  const queryClient = useQueryClient();

  const addHolding = useMutation({
    mutationFn: (payload: any) => api.addHolding(portfolioId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio", portfolioId] });
      queryClient.invalidateQueries({ queryKey: ["holdings", portfolioId] });
      queryClient.invalidateQueries({ queryKey: ["transactions", portfolioId] });
    },
  });

  const updateHolding = useMutation({
    mutationFn: ({ holdingId, data }: { holdingId: string; data: any }) =>
      api.updateHolding(portfolioId!, holdingId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio", portfolioId] });
      queryClient.invalidateQueries({ queryKey: ["holdings", portfolioId] });
    },
  });

  const deleteHolding = useMutation({
    mutationFn: (holdingId: string) => api.deleteHolding(portfolioId!, holdingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio", portfolioId] });
      queryClient.invalidateQueries({ queryKey: ["holdings", portfolioId] });
    },
  });

  const createTransaction = useMutation({
    mutationFn: (payload: any) => api.createTransaction(portfolioId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio", portfolioId] });
      queryClient.invalidateQueries({ queryKey: ["holdings", portfolioId] });
      queryClient.invalidateQueries({ queryKey: ["transactions", portfolioId] });
    },
  });

  return {
    addHolding,
    updateHolding,
    deleteHolding,
    createTransaction,
  };
}
