const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const SYNC_ENABLED = import.meta.env.VITE_SYNC_ENABLED !== 'false';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = this.getTokenFromStorage();
    this.syncEnabled = SYNC_ENABLED;
  }

  setSyncEnabled(enabled) {
    this.syncEnabled = enabled;
  }

  getSyncEnabled() {
    return this.syncEnabled;
  }

  getTokenFromStorage() {
    try {
      return localStorage.getItem('token');
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return null;
    }
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  getAuthHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  async request(endpoint, options = {}) {
    if (!this.syncEnabled) {
      throw new Error('Sync is disabled - working in offline mode');
    }

    const url = `${this.baseURL}${endpoint}`;

    const config = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }

      return response;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: { email, password },
    });

    if (response.success && response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  async register(name, email, password) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: { name, email, password },
    });

    if (response.success && response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  async getMe() {
    return this.request('/auth/me');
  }

  async updateProfile(profileData) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: profileData,
    });
  }

  async logout() {
    try {
      await this.request('/auth/logout');
    } finally {
      this.setToken(null);
    }
  }

  async getCalendars() {
    const response = await this.request('/calendars');
    return response.data || [];
  }

  async getCalendar(id) {
    const response = await this.request(`/calendars/${id}`);
    return response.data;
  }

  async createCalendar(calendarData) {
    const response = await this.request('/calendars', {
      method: 'POST',
      body: calendarData,
    });
    return response.data;
  }

  async createDefaultCalendar() {
    const response = await this.request('/calendars/create-default', {
      method: 'POST',
    });
    return response.data;
  }

  async updateCalendar(id, calendarData) {
    const response = await this.request(`/calendars/${id}`, {
      method: 'PUT',
      body: calendarData,
    });
    return response.data;
  }

  async deleteCalendar(id) {
    return this.request(`/calendars/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleCalendarVisibility(id) {
    const response = await this.request(`/calendars/${id}/visibility`, {
      method: 'PATCH',
    });
    return response.data;
  }

  async shareCalendar(id, email, permission = 'read') {
    return this.request(`/calendars/${id}/share`, {
      method: 'POST',
      body: { email, permission },
    });
  }

  async getEvents(filters = {}) {
    const params = new URLSearchParams();

    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.calendarId) params.append('calendarId', filters.calendarId);

    const queryString = params.toString();
    const endpoint = queryString ? `/events?${queryString}` : '/events';

    const response = await this.request(endpoint);
    return response.data || [];
  }

  async getEvent(id) {
    const response = await this.request(`/events/${id}`);
    return response.data;
  }

  async createEvent(eventData) {
    const response = await this.request('/events', {
      method: 'POST',
      body: eventData,
    });
    return response.data;
  }

  async updateEvent(id, eventData) {
    const response = await this.request(`/events/${id}`, {
      method: 'PUT',
      body: eventData,
    });
    return response.data;
  }

  async deleteEvent(id) {
    return this.request(`/events/${id}`, {
      method: 'DELETE',
    });
  }

  async moveEvent(id, newCalendarId) {
    const response = await this.request(`/events/${id}/move`, {
      method: 'PATCH',
      body: { newCalendarId },
    });
    return response.data;
  }

  async duplicateEvent(id, newId, newCalendarId) {
    const response = await this.request(`/events/${id}/duplicate`, {
      method: 'POST',
      body: { newId, newCalendarId },
    });
    return response.data;
  }

  async healthCheck() {
    return this.request('/health');
  }
}

export const apiService = new ApiService();
export default ApiService;
