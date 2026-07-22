const BASE_URL = ""; // Empty string because Vite server acts as the proxy (configured in vite.config.ts)

export interface ApiError {
  detail?: string;
  [key: string]: any;
}

class ApiService {
  private getHeaders(isMultipart = false): HeadersInit {
    const headers: Record<string, string> = {};
    if (!isMultipart) {
      headers["Content-Type"] = "application/json";
    }
    
    const token = localStorage.getItem("ecoverzz_access_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    
    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorData: ApiError = {};
      try {
        errorData = await response.json();
      } catch {
        errorData = { detail: "An unknown HTTP error occurred." };
      }
      throw errorData;
    }
    
    if (response.status === 204) {
      return {} as T;
    }
    
    return response.json();
  }

  // Token Management
  public async refreshToken(): Promise<boolean> {
    const refresh = localStorage.getItem("ecoverzz_refresh_token");
    if (!refresh) return false;

    try {
      const response = await fetch("/api/auth/token/refresh/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("ecoverzz_access_token", data.access);
        if (data.refresh) {
          localStorage.setItem("ecoverzz_refresh_token", data.refresh);
        }
        return true;
      }
    } catch (e) {
      console.error("Token refresh failed", e);
    }
    
    this.logout();
    return false;
  }

  private async fetchWithRetry<T>(
    url: string,
    options: RequestInit,
    isMultipart = false
  ): Promise<T> {
    options.headers = this.getHeaders(isMultipart);
    
    let response = await fetch(url, options);
    
    // Auto-refresh token once if unauthorized (401)
    if (response.status === 401) {
      const refreshed = await this.refreshToken();
      if (refreshed) {
        options.headers = this.getHeaders(isMultipart);
        response = await fetch(url, options);
      }
    }
    
    return this.handleResponse<T>(response);
  }

  public async get<T>(url: string): Promise<T> {
    return this.fetchWithRetry<T>(url, { method: "GET" });
  }

  public async post<T>(url: string, body: any, isMultipart = false): Promise<T> {
    const options: RequestInit = { method: "POST" };
    if (isMultipart) {
      options.body = body;
    } else {
      options.body = JSON.stringify(body);
    }
    return this.fetchWithRetry<T>(url, options, isMultipart);
  }

  public async patch<T>(url: string, body: any, isMultipart = false): Promise<T> {
    const options: RequestInit = { method: "PATCH" };
    if (isMultipart) {
      options.body = body;
    } else {
      options.body = JSON.stringify(body);
    }
    return this.fetchWithRetry<T>(url, options, isMultipart);
  }

  public async delete<T>(url: string): Promise<T> {
    return this.fetchWithRetry<T>(url, { method: "DELETE" });
  }

  // Authentication flows
  public async login(username: string, password: string): Promise<any> {
    const data = await this.post<any>("/api/auth/login/", { username, password });
    localStorage.setItem("ecoverzz_access_token", data.access);
    localStorage.setItem("ecoverzz_refresh_token", data.refresh);
    return this.getProfile();
  }

  public async register(payload: any): Promise<any> {
    await this.post<any>("/api/auth/register/", payload);
    // Auto login after registration
    return this.login(payload.username, payload.password);
  }

  public async getProfile(): Promise<any> {
    const data = await this.get<any>("/api/auth/profile/");
    // Map backend User data to expected UserProfile structure in frontend
    const profile = {
      username: data.username,
      email: data.email,
      ecoPoints: data.reward_points || 0,
      scannedItemsCount: Math.round(data.carbon_score) || 0,
      rank: data.role || "Citizen",
      joinedAt: new Date(data.created_at || Date.now()).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
    };
    localStorage.setItem("ecoverzz_profile", JSON.stringify(profile));
    return profile;
  }

  public logout(): void {
    const refresh = localStorage.getItem("ecoverzz_refresh_token");
    if (refresh) {
      fetch("/api/auth/logout/", {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({ refresh }),
      }).catch(console.error);
    }
    localStorage.removeItem("ecoverzz_access_token");
    localStorage.removeItem("ecoverzz_refresh_token");
    localStorage.removeItem("ecoverzz_profile");
  }

  // Waste Management module connections
  public async getWasteReports(): Promise<any[]> {
    return this.get<any[]>("/api/waste/reports/");
  }

  public async createWasteReport(formData: FormData): Promise<any> {
    return this.post<any>("/api/waste/reports/", formData, true);
  }

  // Food Donation module connections
  public async getFoodDonations(): Promise<any[]> {
    return this.get<any[]>("/api/food/donations/");
  }

  public async createFoodDonation(payload: any): Promise<any> {
    return this.post<any>("/api/food/donations/", payload);
  }

  public async claimFoodDonation(id: string, notes = ""): Promise<any> {
    return this.post<any>(`/api/food/donations/${id}/claim/`, { notes });
  }
}

export const api = new ApiService();
