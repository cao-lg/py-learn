export const API_BASE = 'https://api.gkss.cc.cd/api';
export const SITE_DB_NAME = 'site_1777469231464';

export interface UUMSUser {
  id: number;
  username: string;
  nickname: string;
  phone?: string;
  role: string;
  school_id?: number;
  school_name?: string;
  class_id?: number;
  class_name?: string;
  status: string;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface AdminLoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    role: string;
  };
}

export interface VerifyResponse {
  valid: boolean;
  user_id: number;
  role: string;
  permissions?: string[];
}

export interface StudyRecordRecord {
  id: number;
}

class UUMSClient {
  private token: string | null = null;

  private async getToken(): Promise<string | null> {
    if (this.token) return this.token;

    // 优先使用管理员 token
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      this.token = adminToken;
      return this.token;
    }

    // 如果没有管理员 token，尝试使用 App ID/App Secret
    const appId = localStorage.getItem('uums_app_id');
    const appSecret = localStorage.getItem('uums_app_secret');

    if (!appId || !appSecret) {
      console.warn('UUMS credentials not configured');
      return null;
    }

    try {
      const response = await fetch(`${API_BASE}/auth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ app_id: appId, app_secret: appSecret }),
      });
      const data: ApiResponse<TokenResponse> = await response.json();
      if (data.code === 200 && data.data.access_token) {
        this.token = data.data.access_token;
        return this.token;
      }
    } catch (error) {
      console.error('Failed to get UUMS token:', error);
    }
    return null;
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<ApiResponse<T> | null> {
    const token = await this.getToken();
    if (!token) return null;

    try {
      const response = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options.headers,
        },
      });
      return await response.json();
    } catch (error) {
      console.error(`UUMS API error for ${path}:`, error);
      return null;
    }
  }

  async adminLogin(username: string, password: string): Promise<ApiResponse<AdminLoginResponse> | null> {
    try {
      const response = await fetch(`${API_BASE}/auth/admin-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const result: ApiResponse<AdminLoginResponse> = await response.json();
      if (result.code === 200 && result.data.token) {
        this.token = result.data.token;
        localStorage.setItem('adminToken', result.data.token);
      }
      return result;
    } catch (error) {
      console.error('UUMS adminLogin error:', error);
      return null;
    }
  }

  async verifyUser(username: string, password: string): Promise<ApiResponse<VerifyResponse> | null> {
    try {
      const response = await fetch(`${API_BASE}/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      return await response.json();
    } catch (error) {
      console.error('UUMS verify error:', error);
      return null;
    }
  }

  async getUser(userId: number): Promise<ApiResponse<UUMSUser> | null> {
    return this.request<UUMSUser>(`/users/${userId}`);
  }

  async getSiteUsers(): Promise<ApiResponse<UUMSUser[]> | null> {
    return this.request<UUMSUser[]>(`/sites/${SITE_DB_NAME}/users`);
  }

  async recordStudyRecord(record: {
    user_id: number;
    class_id?: number;
    exercise_title: string;
    exercise_type: string;
    score: number;
    total_score: number;
    duration: number;
    completed_at: string;
    chapter_id?: string;
    chapter_name?: string;
    question_ids?: string;
    user_answers?: string;
    code_snippets?: string;
    mastery_level?: string;
    question_titles?: string;
  }): Promise<ApiResponse<StudyRecordRecord> | null> {
    try {
      const response = await fetch(`${API_BASE}/site-stats/${SITE_DB_NAME}/study-records`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
      });
      return await response.json();
    } catch (error) {
      console.error('UUMS recordStudyRecord error:', error);
      return null;
    }
  }

  async recordExamRecord(record: {
    user_id: number;
    class_id?: number;
    exam_title: string;
    exam_type: string;
    score: number;
    total_score: number;
    status: string;
    submitted_at: string;
  }): Promise<ApiResponse<any> | null> {
    try {
      const response = await fetch(`${API_BASE}/site-stats/${SITE_DB_NAME}/exam-records`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
      });
      return await response.json();
    } catch (error) {
      console.error('UUMS recordExamRecord error:', error);
      return null;
    }
  }

  async recordHomeworkRecord(record: {
    user_id: number;
    class_id?: number;
    homework_title: string;
    score: number;
    total_score: number;
    status: string;
    submitted_at: string;
  }): Promise<ApiResponse<any> | null> {
    try {
      const response = await fetch(`${API_BASE}/site-stats/${SITE_DB_NAME}/homework-records`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
      });
      return await response.json();
    } catch (error) {
      console.error('UUMS recordHomeworkRecord error:', error);
      return null;
    }
  }

  clearToken(): void {
    this.token = null;
    localStorage.removeItem('adminToken');
  }
}

export const uumsClient = new UUMSClient();

export function getStoredUserId(): string | null {
  return localStorage.getItem('uums_user_id');
}

export function setStoredUserId(userId: string): void {
  localStorage.setItem('uums_user_id', userId);
}

export function getStoredUsername(): string | null {
  return localStorage.getItem('uums_username');
}

export function setStoredUsername(username: string): void {
  localStorage.setItem('uums_username', username);
}

export function clearStoredUser(): void {
  localStorage.removeItem('uums_user_id');
  localStorage.removeItem('uums_username');
  localStorage.removeItem('uums_app_id');
  localStorage.removeItem('uums_app_secret');
}
