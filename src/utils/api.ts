import { Task, Annotation, LabelStudioConfig, ProjectCreateParams, TaskImportData } from '../types';

export class LabelStudioAPI {
  private config: LabelStudioConfig;
  private isRefreshing: boolean = false;
  private initPromise: Promise<void> | null = null;

  // 静态方法：自动探测 Label Studio 端口
  static async detectLabelStudio(): Promise<string | null> {
    const ports = [8080, 8081, 8090];
    const hosts = ['http://localhost', 'http://127.0.0.1'];

    for (const host of hosts) {
      for (const port of ports) {
        const url = `${host}:${port}`;
        try {
          console.log(`[LabelStudioAPI] Detecting ${url}...`);
          const response = await fetch(`${url}/version`, { method: 'GET' });
          if (response.ok) {
            console.log(`[LabelStudioAPI] ✅ Found Label Studio at ${url}`);
            return url;
          }
        } catch (err) {
          console.log(`[LabelStudioAPI] ❌ Not found at ${url}`);
        }
      }
    }

    console.log('[LabelStudioAPI] No Label Studio instance found');
    return null;
  }

  constructor(config: LabelStudioConfig) {
    this.config = config;
    console.log('[LabelStudioAPI] Initializing with config:', {
      url: config.url,
      hasToken: !!config.token,
      hasRefreshToken: !!config.refreshToken,
      projectId: config.projectId,
    });

    // Auto-refresh token on initialization if refresh token is available and no access token provided
    if (config.refreshToken && !config.token) {
      console.log('[LabelStudioAPI] No access token found, will fetch using refresh token on first request');
      this.initPromise = this.refreshAccessToken().catch(err => {
        console.error('[LabelStudioAPI] Initial token refresh failed:', err);
        throw err;
      });
    } else if (config.token) {
      console.log('[LabelStudioAPI] Using existing access token');
    } else {
      console.warn('[LabelStudioAPI] No token or refresh token provided!');
    }
  }

  private async ensureInitialized(): Promise<void> {
    if (this.initPromise) {
      console.log('[LabelStudioAPI] Waiting for initialization (token refresh)...');
      await this.initPromise;
      this.initPromise = null;
      console.log('[LabelStudioAPI] Initialization complete');
    }
  }

  private async refreshAccessToken(): Promise<void> {
    if (!this.config.refreshToken) {
      console.error('[LabelStudioAPI] Cannot refresh: no refresh token available');
      return;
    }

    if (this.isRefreshing) {
      console.log('[LabelStudioAPI] Already refreshing token, skipping...');
      return;
    }

    this.isRefreshing = true;
    const refreshUrl = `${this.config.url}/api/token/refresh/`;
    console.log('[LabelStudioAPI] Refreshing access token...', refreshUrl);

    try {
      const response = await fetch(refreshUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh: this.config.refreshToken,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        this.config.token = data.access;
        console.log('[LabelStudioAPI] ✅ Access token refreshed successfully');
        console.log('[LabelStudioAPI] New token (first 50 chars):', data.access.substring(0, 50) + '...');
      } else {
        const errorText = await response.text();
        console.error('[LabelStudioAPI] ❌ Failed to refresh access token:', response.status, response.statusText);
        console.error('[LabelStudioAPI] Error response:', errorText);
        throw new Error(`Token refresh failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('[LabelStudioAPI] ❌ Error refreshing access token:', error);
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.config.url}/api${endpoint}`;

    // Detect token type and use appropriate authorization format
    // JWT tokens start with 'eyJ', use Bearer prefix
    // Other tokens use Token prefix
    const authPrefix = this.config.token.startsWith('eyJ') ? 'Bearer' : 'Token';

    const headers = {
      'Authorization': `${authPrefix} ${this.config.token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    console.log(`[LabelStudioAPI] Making request: ${options.method || 'GET'} ${endpoint}`);

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // If 401 and we have a refresh token, try to refresh and retry
    if (response.status === 401 && this.config.refreshToken && !this.isRefreshing) {
      console.log('[LabelStudioAPI] ⚠️ Got 401, access token expired, refreshing...');
      await this.refreshAccessToken();

      // Retry the request with new token
      const retryHeaders = {
        'Authorization': `${this.config.token.startsWith('eyJ') ? 'Bearer' : 'Token'} ${this.config.token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      };

      console.log(`[LabelStudioAPI] Retrying request: ${options.method || 'GET'} ${endpoint}`);

      const retryResponse = await fetch(url, {
        ...options,
        headers: retryHeaders,
      });

      if (!retryResponse.ok) {
        console.error(`[LabelStudioAPI] ❌ Retry failed: ${retryResponse.status} ${retryResponse.statusText}`);
        throw new Error(`API request failed: ${retryResponse.statusText}`);
      }

      console.log(`[LabelStudioAPI] ✅ Retry successful`);
      return retryResponse.json();
    }

    if (!response.ok) {
      console.error(`[LabelStudioAPI] ❌ Request failed: ${response.status} ${response.statusText}`);
      throw new Error(`API request failed: ${response.statusText}`);
    }

    console.log(`[LabelStudioAPI] ✅ Request successful`);
    return response.json();
  }

  async getTasks(): Promise<Task[]> {
    await this.ensureInitialized();
    return this.request(`/projects/${this.config.projectId}/tasks/`);
  }

  async getTask(taskId: number): Promise<Task> {
    await this.ensureInitialized();
    return this.request(`/tasks/${taskId}/`);
  }

  async getNextTask(): Promise<Task | null> {
    await this.ensureInitialized();
    const tasks = await this.getTasks();
    // Find first task without annotations or with incomplete annotations
    const nextTask = tasks.find(task =>
      !task.annotations || task.annotations.length === 0
    );
    return nextTask || tasks[0] || null;
  }

  async createAnnotation(taskId: number, result: any[]): Promise<Annotation> {
    await this.ensureInitialized();
    return this.request(`/tasks/${taskId}/annotations/`, {
      method: 'POST',
      body: JSON.stringify({
        result,
        task: taskId,
      }),
    });
  }

  async updateAnnotation(annotationId: number, result: any[]): Promise<Annotation> {
    await this.ensureInitialized();
    return this.request(`/annotations/${annotationId}/`, {
      method: 'PATCH',
      body: JSON.stringify({
        result,
      }),
    });
  }

  // 创建新项目
  async createProject(params: ProjectCreateParams): Promise<any> {
    await this.ensureInitialized();
    console.log('[LabelStudioAPI] Creating project:', params.title);
    return this.request('/projects/', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // 导入任务到项目
  async importTasks(projectId: number, tasks: TaskImportData[]): Promise<any> {
    await this.ensureInitialized();
    console.log(`[LabelStudioAPI] Importing ${tasks.length} tasks to project ${projectId}`);
    return this.request(`/projects/${projectId}/import`, {
      method: 'POST',
      body: JSON.stringify(tasks),
    });
  }

  // 获取所有项目
  async getProjects(): Promise<any[]> {
    await this.ensureInitialized();
    return this.request('/projects/');
  }
}
