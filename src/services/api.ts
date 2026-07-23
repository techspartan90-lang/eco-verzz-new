import axios from "axios";

export interface ApiError {
  detail?: string;
  [key: string]: any;
}

const apiClient = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to automatically add authorization headers
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

// Response interceptor to handle token refresh automatically on 401 Unauthorized
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refresh = localStorage.getItem("ecoverzz_refresh_token");
      if (refresh) {
        try {
          const res = await axios.post("/api/auth/token/refresh/", { refresh });
          if (res.status === 200) {
            const data = res.data;
            localStorage.setItem("ecoverzz_access_token", data.access);
            if (data.refresh) {
              localStorage.setItem("ecoverzz_refresh_token", data.refresh);
            }
            apiClient.defaults.headers.common["Authorization"] = `Bearer ${data.access}`;
            processQueue(null, data.access);
            originalRequest.headers.Authorization = `Bearer ${data.access}`;
            return apiClient(originalRequest);
          }
        } catch (refreshError) {
          processQueue(refreshError, null);
          api.logout();
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        api.logout();
      }
    }

    const errorData = error.response ? error.response.data : { detail: "Network error or server unreachable." };
    return Promise.reject(errorData);
  }
);

class ApiService {
  // Token Management
  public async refreshToken(): Promise<boolean> {
    const refresh = localStorage.getItem("ecoverzz_refresh_token");
    if (!refresh) return false;

    try {
      const response = await axios.post("/api/auth/token/refresh/", { refresh });
      if (response.status === 200) {
        const data = response.data;
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

  // Authentication flows
  public async login(username: string, password: string): Promise<any> {
    const response = await apiClient.post("/api/auth/login/", { username, password });
    const data = response.data;
    localStorage.setItem("ecoverzz_access_token", data.access);
    localStorage.setItem("ecoverzz_refresh_token", data.refresh);
    return this.getProfile();
  }

  public async register(payload: any): Promise<any> {
    await apiClient.post("/api/auth/register/", payload);
    // Auto login after registration
    return this.login(payload.username, payload.password);
  }

  public async getProfile(): Promise<any> {
    const response = await apiClient.get("/api/auth/profile/");
    const data = response.data;
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
      apiClient.post("/api/auth/logout/", { refresh }).catch(console.error);
    }
    localStorage.removeItem("ecoverzz_access_token");
    localStorage.removeItem("ecoverzz_refresh_token");
    localStorage.removeItem("ecoverzz_profile");
  }

  // Waste Management module connections
  public async getWasteReports(params?: { category?: string; status?: string; priority?: string; search?: string }): Promise<any[]> {
    const response = await apiClient.get("/api/waste/reports/", { params });
    return response.data;
  }

  public async getWasteReport(id: number): Promise<any> {
    const response = await apiClient.get(`/api/waste/reports/${id}/`);
    return response.data;
  }

  public async createWasteReport(formData: FormData): Promise<any> {
    const response = await apiClient.post("/api/waste/reports/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  public async updateWasteReport(id: number, formData: FormData): Promise<any> {
    const response = await apiClient.patch(`/api/waste/reports/${id}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  public async deleteWasteReport(id: number): Promise<any> {
    const response = await apiClient.delete(`/api/waste/reports/${id}/`);
    return response.data;
  }

  public async getWasteReportComments(id: number): Promise<any[]> {
    const response = await apiClient.get(`/api/waste/reports/${id}/comments/`);
    return response.data;
  }

  public async createWasteReportComment(id: number, content: string): Promise<any> {
    const response = await apiClient.post(`/api/waste/reports/${id}/comments/`, { content });
    return response.data;
  }

  public async rateWasteReportCleanup(id: number, rating: number, feedback: string = ""): Promise<any> {
    const response = await apiClient.post(`/api/waste/reports/${id}/rate/`, { rating, feedback });
    return response.data;
  }

  public async getNearbyWasteReports(latitude: number, longitude: number, radius = 5.0): Promise<any[]> {
    const response = await apiClient.get("/api/waste/reports/nearby/", {
      params: { latitude, longitude, radius },
    });
    return response.data;
  }

  public async completeWasteCleanup(id: number, formData: FormData): Promise<any> {
    const response = await apiClient.post(`/api/waste/reports/${id}/complete_cleanup/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  // Food Donation module connections
  public async getFoodDonations(params?: { status?: string; food_type?: string }): Promise<any[]> {
    const response = await apiClient.get("/api/food/donations/", { params });
    return response.data;
  }

  public async getFoodDonation(id: string): Promise<any> {
    const response = await apiClient.get(`/api/food/donations/${id}/`);
    return response.data;
  }

  public async createFoodDonation(payload: any): Promise<any> {
    const response = await apiClient.post("/api/food/donations/", payload);
    return response.data;
  }

  public async claimFoodDonation(id: string, notes = ""): Promise<any> {
    const response = await apiClient.post(`/api/food/donations/${id}/claim/`, { notes });
    return response.data;
  }

  public async assignFoodDonationVolunteer(id: string, volunteerId: number, notes = ""): Promise<any> {
    const response = await apiClient.post(`/api/food/donations/${id}/assign_volunteer/`, {
      volunteer_id: volunteerId,
      notes,
    });
    return response.data;
  }

  public async updateFoodDonationStatus(id: string, status: string, notes = ""): Promise<any> {
    const response = await apiClient.post(`/api/food/donations/${id}/update_status/`, {
      status,
      notes,
    });
    return response.data;
  }

  public async getFoodDonationNgoDashboard(): Promise<any> {
    const response = await apiClient.get("/api/food/donations/ngo_dashboard/");
    return response.data;
  }
}

export const api = new ApiService();
