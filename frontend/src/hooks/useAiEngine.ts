import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";

export function useAiProfile() {
  return useQuery({
    queryKey: ["aiProfile"],
    queryFn: () => api.getAiProfile(),
  });
}

export function useAiRecommendations() {
  return useQuery({
    queryKey: ["aiRecommendations"],
    queryFn: () => api.getAiRecommendations(),
  });
}

export function usePortfolioAnalysis() {
  return useQuery({
    queryKey: ["portfolioAnalysis"],
    queryFn: () => api.getAiPortfolioAnalysis(),
  });
}

export function useRiskAnalysis() {
  return useQuery({
    queryKey: ["riskAnalysis"],
    queryFn: () => api.getAiRiskAnalysis(),
  });
}

export function useDiversificationReport() {
  return useQuery({
    queryKey: ["diversificationReport"],
    queryFn: () => api.getAiDiversificationReport(),
  });
}

export function useRebalanceSuggestions() {
  return useQuery({
    queryKey: ["rebalanceSuggestions"],
    queryFn: () => api.getAiRebalanceSuggestions(),
  });
}

export function useAiMutations() {
  const queryClient = useQueryClient();

  const updateProfile = useMutation({
    mutationFn: (payload: any) => api.updateAiProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aiProfile"] });
    },
  });

  const generateRecommendation = useMutation({
    mutationFn: (payload: any = {}) => api.requestAiRecommendation(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aiRecommendations"] });
      queryClient.invalidateQueries({ queryKey: ["portfolioAnalysis"] });
      queryClient.invalidateQueries({ queryKey: ["riskAnalysis"] });
      queryClient.invalidateQueries({ queryKey: ["rebalanceSuggestions"] });
    },
  });

  return {
    updateProfile,
    generateRecommendation,
  };
}
