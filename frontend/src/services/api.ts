import axios from "axios";
import { User, UserProfile, LoginCredentials, RegisterPayload } from "../types/auth";
import { supabase } from "./supabaseClient";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: attach Authorization: Bearer <token>
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("ecoverzz_access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Helper function to extract human-readable FastAPI error message
const extractErrorMessage = (error: any): string => {
  if (!error) return "An unexpected error occurred.";
  if (typeof error === "string") return error;
  
  if (error.response?.data) {
    const data = error.response.data;
    if (typeof data.detail === "string") return data.detail;
    if (Array.isArray(data.detail)) {
      return data.detail
        .map((err: any) => `${err.loc ? err.loc.join(" -> ") : "Error"}: ${err.msg}`)
        .join("; ");
    }
    if (data.message) return data.message;
  }
  
  if (error.message) return error.message;
  return "Network error or server unreachable. Please check backend connection.";
};

// Response interceptor: handle 401 Unauthorized token expirations
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("ecoverzz_access_token");
      localStorage.removeItem("ecoverzz_profile");
    }
    const formattedError = new Error(extractErrorMessage(error));
    (formattedError as any).response = error.response;
    return Promise.reject(formattedError);
  }
);

class ApiService {
  // Authentication flows connected to FastAPI Backend
  public async login(emailOrCredentials: string | LoginCredentials, password?: string): Promise<User> {
    let payload: LoginCredentials;
    if (typeof emailOrCredentials === "string") {
      payload = { email: emailOrCredentials, password: password || "" };
    } else {
      payload = emailOrCredentials;
    }

    const response = await apiClient.post("/auth/login", payload);
    const data = response.data;
    if (data.access_token) {
      localStorage.setItem("ecoverzz_access_token", data.access_token);
    }
    return this.getProfile();
  }

  public async register(payload: RegisterPayload): Promise<User> {
    const { full_name, email, password, phone, role } = payload as any;
    const body: RegisterPayload = {
      full_name,
      email,
      password,
      phone: phone || undefined,
      role: role || "Investor",
    };

    const response = await apiClient.post("/auth/register", body);
    const data = response.data;
    if (data.access_token) {
      localStorage.setItem("ecoverzz_access_token", data.access_token);
    }
    return this.getProfile();
  }

  public async getProfile(): Promise<User> {
    try {
      const response = await apiClient.get("/user/profile");
      const data = response.data;
      const profile: User = {
        id: data.id,
        name: data.name || data.full_name || data.email.split("@")[0],
        full_name: data.name || data.full_name,
        username: data.name || data.email.split("@")[0],
        email: data.email,
        phone: data.phone || "",
        role: data.role || "Investor",
        ecoPoints: 480,
        scannedItemsCount: 65,
        rank: data.role ? `${data.role} Guardian` : "Citizen Guardian",
        joinedAt: new Date().toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        }),
      };
      localStorage.setItem("ecoverzz_profile", JSON.stringify(profile));
      return profile;
    } catch (e) {
      const saved = localStorage.getItem("ecoverzz_profile");
      if (saved) return JSON.parse(saved);
      throw e;
    }
  }

  public logout(): void {
    localStorage.removeItem("ecoverzz_access_token");
    localStorage.removeItem("ecoverzz_profile");
  }

  // Role-Protected Endpoints
  public async getAdminDashboard(): Promise<any> {
    const response = await apiClient.get("/user/admin-dashboard");
    return response.data;
  }

  public async getAnalystReports(): Promise<any> {
    const response = await apiClient.get("/user/analyst-reports");
    return response.data;
  }

  public async getInvestorPortfolio(): Promise<any> {
    const response = await apiClient.get("/user/investor-portfolio");
    return response.data;
  }

  // AI Recommendation Engine
  public async generateAiRecommendation(payload: {
    risk_profile: string;
    investment_goal: string;
    monthly_investment: number;
    investment_period: number;
  }): Promise<any> {
    const response = await apiClient.post("/recommendations/generate", payload);
    return response.data;
  }

  // Fund Comparison
  public async compareFunds(symbols: string[]): Promise<any> {
    const response = await apiClient.post("/funds/compare", { symbols });
    return response.data;
  }

  // Notifications System
  public async getNotifications(): Promise<any> {
    const response = await apiClient.get("/notifications/");
    return response.data;
  }

  public async markNotificationRead(id: string): Promise<any> {
    try {
      const response = await apiClient.post("/notifications/mark-read", { notification_id: id });
      return response.data;
    } catch (e) {
      return { success: true, id };
    }
  }

  // Waste Management module connections
  public async getWasteReports(params?: { category?: string; status?: string; priority?: string; search?: string }): Promise<any[]> {
    try {
      const response = await apiClient.get("/api/waste/reports/", { params });
      return response.data;
    } catch (e) {
      return [];
    }
  }

  public async getWasteReport(id: number | string): Promise<any> {
    const response = await apiClient.get(`/api/waste/reports/${id}/`);
    return response.data;
  }

  public async createWasteReport(formData: FormData, ...args: any[]): Promise<any> {
    const response = await apiClient.post("/api/waste/reports/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }

  public async createWasteReportComment(reportId: number | string, comment: string, ...args: any[]): Promise<any> {
    const response = await apiClient.post(`/api/waste/reports/${reportId}/comments/`, { comment });
    return response.data;
  }

  public async rateWasteReportCleanup(reportId: number | string, rating: number, ...args: any[]): Promise<any> {
    const response = await apiClient.post(`/api/waste/reports/${reportId}/rate/`, { rating });
    return response.data;
  }

  public async completeWasteCleanup(reportId: number | string, ...args: any[]): Promise<any> {
    const response = await apiClient.post(`/api/waste/reports/${reportId}/complete/`);
    return response.data;
  }

  public async deleteWasteReport(id: number | string, ...args: any[]): Promise<any> {
    const response = await apiClient.delete(`/api/waste/reports/${id}/`);
    return response.data;
  }

  // Food Donation module connections
  public async getFoodDonations(params?: { status?: string; food_type?: string }): Promise<any[]> {
    try {
      const response = await apiClient.get("/api/food/donations/", { params });
      return response.data;
    } catch (e) {
      return [];
    }
  }

  public async createFoodDonation(payload: any): Promise<any> {
    const response = await apiClient.post("/api/food/donations/", payload);
    return response.data;
  }

  public async claimFoodDonation(id: number | string, ...args: any[]): Promise<any> {
    const response = await apiClient.post(`/api/food/donations/${id}/claim/`);
    return response.data;
  }

  // Portfolio Management Endpoints
  public async getPortfolios(): Promise<any[]> {
    try {
      const response = await apiClient.get("/portfolio");
      return response.data;
    } catch (e) {
      return [];
    }
  }

  public async getPortfolio(id: string): Promise<any> {
    const response = await apiClient.get(`/portfolio/${id}`);
    return response.data;
  }

  public async createPortfolio(payload: { name: string; description?: string }): Promise<any> {
    const response = await apiClient.post("/portfolio", payload);
    return response.data;
  }

  public async updatePortfolio(id: string, payload: { name?: string; description?: string }): Promise<any> {
    const response = await apiClient.put(`/portfolio/${id}`, payload);
    return response.data;
  }

  public async deletePortfolio(id: string): Promise<any> {
    const response = await apiClient.delete(`/portfolio/${id}`);
    return response.data;
  }

  public async getHoldings(portfolioId: string): Promise<any[]> {
    try {
      const response = await apiClient.get(`/portfolio/${portfolioId}/holdings`);
      return response.data;
    } catch (e) {
      return [];
    }
  }

  public async addHolding(portfolioId: string, payload: any): Promise<any> {
    const response = await apiClient.post(`/portfolio/${portfolioId}/holdings`, payload);
    return response.data;
  }

  public async updateHolding(portfolioId: string, holdingId: string, payload: any): Promise<any> {
    const response = await apiClient.put(`/portfolio/${portfolioId}/holdings/${holdingId}`, payload);
    return response.data;
  }

  public async deleteHolding(portfolioId: string, holdingId: string): Promise<any> {
    const response = await apiClient.delete(`/portfolio/${portfolioId}/holdings/${holdingId}`);
    return response.data;
  }

  public async getTransactions(portfolioId: string, params?: { type?: string; search?: string }): Promise<any[]> {
    try {
      const response = await apiClient.get(`/portfolio/${portfolioId}/transactions`, { params });
      return response.data;
    } catch (e) {
      return [];
    }
  }

  public async createTransaction(portfolioId: string, payload: any): Promise<any> {
    const response = await apiClient.post(`/portfolio/${portfolioId}/transactions`, payload);
    return response.data;
  }

  // AI Engine Endpoints
  public async getAiProfile(): Promise<any> {
    const response = await apiClient.get("/ai/profile");
    return response.data;
  }

  public async updateAiProfile(payload: any): Promise<any> {
    const response = await apiClient.put("/ai/profile", payload);
    return response.data;
  }

  public async getAiRecommendations(): Promise<any[]> {
    try {
      const response = await apiClient.get("/ai/recommendations");
      return response.data;
    } catch (e) {
      return [];
    }
  }

  public async requestAiRecommendation(payload?: any): Promise<any> {
    const response = await apiClient.post("/ai/recommend", payload || {});
    return response.data;
  }

  public async getAiPortfolioAnalysis(): Promise<any> {
    const response = await apiClient.get("/ai/portfolio-analysis");
    return response.data;
  }

  public async getAiRiskAnalysis(): Promise<any> {
    const response = await apiClient.get("/ai/risk-analysis");
    return response.data;
  }

  public async getAiDiversificationReport(): Promise<any> {
    const response = await apiClient.get("/ai/diversification");
    return response.data;
  }

  public async getAiRebalanceSuggestions(): Promise<any> {
    const response = await apiClient.get("/ai/rebalance");
    return response.data;
  }

  // Fund Comparison & Analytics Endpoints
  public async getSavedAndRecentComparisons(): Promise<any> {
    try {
      const response = await apiClient.get("/analytics/compare");
      return response.data;
    } catch (e) {
      return { saved_comparisons: [], recent_history: [] };
    }
  }

  public async runFundComparison(fundSymbols: string[]): Promise<any> {
    const response = await apiClient.post("/analytics/compare", { fund_symbols: fundSymbols });
    return response.data;
  }

  public async saveUserComparison(comparisonName: string, selectedFunds: string[]): Promise<any> {
    const response = await apiClient.post("/analytics/save-comparison", {
      comparison_name: comparisonName,
      selected_funds: selectedFunds,
    });
    return response.data;
  }

  public async getPerformanceAnalytics(symbols: string[]): Promise<any> {
    const response = await apiClient.get("/analytics/performance", { params: { symbols } });
    return response.data;
  }

  public async getRiskAnalytics(symbols: string[]): Promise<any> {
    const response = await apiClient.get("/analytics/risk", { params: { symbols } });
    return response.data;
  }

  public async getHistoricalNav(symbols: string[]): Promise<any> {
    const response = await apiClient.get("/analytics/returns", { params: { symbols } });
    return response.data;
  }

  public async getSingleFundAnalytics(symbol: string): Promise<any> {
    const response = await apiClient.get(`/analytics/fund/${symbol}`);
    return response.data;
  }

  public async getBenchmarkComparison(): Promise<any> {
    const response = await apiClient.get("/analytics/benchmark");
    return response.data;
  }

  // Supabase Table Integration
  public async getEcoVerzzDataFromSupabase(): Promise<any[]> {
    try {
      const { data, error } = await supabase.from("eco verzz").select("*");
      if (error) {
        console.warn("Supabase query error for 'eco verzz':", error);
        return [];
      }
      return data || [];
    } catch (err) {
      console.warn("Supabase request failed", err);
      return [];
    }
  }
}

export const api = new ApiService();
