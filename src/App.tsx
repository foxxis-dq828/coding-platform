import React, { useState, useEffect, useCallback } from 'react';
import { LabelStudioWrapper } from './components/LabelStudioWrapper';
import { GraphPanel } from './components/GraphPanel';
import { LabelStudioAPI } from './utils/api';
import { ResultParser } from './utils/parser';
import { Task, AnnotationResult, ParsedData, LabelStudioConfig } from './types';
import Papa from 'papaparse';
import './App.css';

const DEFAULT_CONFIG = `
<View style="display:flex; gap:16px;">
  <View style="flex: 1;">
    <Relations name="rel" choice="single">
      <!-- moderation -->
      <Relation value="moderation__validated"    background="#ffd54f"/>
      <Relation value="moderation__hypothesized" background="#ffe082"/>
      <Relation value="moderation__null"         background="#fff3c4"/>

      <!-- direction -->
      <Relation value="direction__validated"     background="#90caf9"/>
      <Relation value="direction__hypothesized"  background="#bbdefb"/>
      <Relation value="direction__null"          background="#e3f2fd"/>

      <!-- correlation -->
      <Relation value="correlation__validated"    background="#a5d6a7"/>
      <Relation value="correlation__hypothesized" background="#c8e6c9"/>
      <Relation value="correlation__null"         background="#e8f5e9"/>

      <!-- hierarchy -->
      <Relation value="hierarchy" background="#b39ddb"/>
    </Relations>

    <Labels name="var_label" toName="text" showInline="true">
      <Label value="Variable" background="orange"/>
      <Label value="Sample" background="#64b5f6"/>
      <Label value="Boundary_Condition" background="#80cbc4"/>
      <Label value="Control" background="#f48fb1"/>
    </Labels>

    <Text name="text" value="$AB" granularity="word"/>

    <TextArea
      name="var_name"
      toName="text"
      perRegion="true"
      editable="true"
      transcription="true"
      displayMode="region-list"
      rows="1"
      maxSubmissions="1"
      placeholder="Type variable name…"
    />
  </View>
</View>
`;

// 本地存储的 key
const STORAGE_KEY = 'label-studio-config';

// 从 localStorage 加载配置
const loadConfig = (): LabelStudioConfig | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (err) {
    console.error('Failed to load config from localStorage:', err);
  }
  return null;
};

// 保存配置到 localStorage
const saveConfig = (config: LabelStudioConfig) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Failed to save config to localStorage:', err);
  }
};

function App() {
  const [config, setConfig] = useState<LabelStudioConfig>(() => {
    // 优先从 localStorage 加载
    const savedConfig = loadConfig();
    if (savedConfig && savedConfig.token && savedConfig.projectId) {
      return savedConfig;
    }
    // 否则使用默认值
    return {
      url: import.meta.env.VITE_LABEL_STUDIO_URL || 'http://localhost:8080',
      token: import.meta.env.VITE_LABEL_STUDIO_TOKEN || '',
      refreshToken: import.meta.env.VITE_LABEL_STUDIO_REFRESH_TOKEN || '',
      projectId: parseInt(import.meta.env.VITE_PROJECT_ID || '0'),
      username: '',
    };
  });

  const [api, setApi] = useState<LabelStudioAPI | null>(null);
  const [parser] = useState(() => new ResultParser());
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState<number>(0);
  const [graphData, setGraphData] = useState<ParsedData>({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [configured, setConfigured] = useState(false);
  const [taskIdInput, setTaskIdInput] = useState<string>('');
  const [detecting, setDetecting] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Initialize API when config is set
  useEffect(() => {
    // Allow initialization with either token or refreshToken
    if ((config.token || config.refreshToken) && config.url && config.projectId) {
      console.log('[App] Initializing API with config');
      setApi(new LabelStudioAPI(config));
      setConfigured(true);
    }
  }, [config]);

  // Load all tasks
  useEffect(() => {
    if (!api) return;

    const loadTasks = async () => {
      setLoading(true);
      setError(null);
      try {
        const tasks = await api.getTasks();
        console.log('Loaded', tasks.length, 'tasks');
        setAllTasks(tasks);

        if (tasks.length > 0) {
          const firstTask = tasks[0];
          setCurrentTask(firstTask);
          setCurrentTaskIndex(0);
          console.log('Loaded task:', firstTask?.id, 'with', firstTask?.annotations?.length || 0, 'annotations');

          if (firstTask?.annotations && firstTask.annotations.length > 0) {
            const results = firstTask.annotations[0].result;
            console.log('Initial annotation results:', results.length, 'items');
            updateGraph(results);
          } else {
            console.log('No annotations found, graph will be empty');
          }
        }
      } catch (err) {
        console.error('Failed to load tasks:', err);
        setError(err instanceof Error ? err.message : 'Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [api]);

  const updateGraph = useCallback((results: AnnotationResult[]) => {
    const parsed = parser.parse(results);
    setGraphData(parsed);
  }, [parser]);

  const handleUpdate = useCallback((results: AnnotationResult[]) => {
    updateGraph(results);
  }, [updateGraph]);

  const handleSubmit = useCallback(async (results: AnnotationResult[]) => {
    if (!api || !currentTask) return;

    try {
      await api.createAnnotation(currentTask.id, results);
      alert('Annotation submitted successfully!');

      // Load next task
      const nextTask = await api.getNextTask();
      setCurrentTask(nextTask);
      setGraphData({ nodes: [], edges: [] });
    } catch (err) {
      alert('Failed to submit annotation: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  }, [api, currentTask]);

  // 自动探测 Label Studio
  const handleDetect = async () => {
    setDetecting(true);
    try {
      const detectedUrl = await LabelStudioAPI.detectLabelStudio();
      if (detectedUrl) {
        setConfig(prev => ({ ...prev, url: detectedUrl }));
        alert(`找到 Label Studio: ${detectedUrl}`);
      } else {
        alert('未找到 Label Studio，请确保已启动（运行 label-studio start）');
      }
    } catch (err) {
      alert('探测失败: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setDetecting(false);
    }
  };

  // 解析 CSV 文件 (使用 Papa Parse)
  const parseCSV = async (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      Papa.parse<Record<string, any>>(file, {
        header: true,           // 自动识别表头
        skipEmptyLines: true,   // 跳过空行
        dynamicTyping: false,   // 保持字符串类型
        transformHeader: (header) => header.trim(), // 去除表头空格
        complete: (results) => {
          try {
            // 检查是否有数据
            if (!results.data || results.data.length === 0) {
              reject(new Error('CSV 文件为空或格式不正确'));
              return;
            }

            // 检查是否有 AB 列
            const firstRow = results.data[0] as any;
            if (!('AB' in firstRow)) {
              const availableColumns = Object.keys(firstRow).join(', ');
              reject(new Error(
                `CSV 文件中未找到 AB 列\n` +
                `可用的列：${availableColumns}\n` +
                `请确保 CSV 文件包含名为 "AB" 的列`
              ));
              return;
            }

            // 提取 AB 列的数据
            const tasks = (results.data as any[])
              .filter(row => row.AB && String(row.AB).trim().length > 0)
              .map(row => ({ AB: String(row.AB).trim() }));

            if (tasks.length === 0) {
              reject(new Error('CSV 文件中没有有效的 AB 数据（AB 列为空）'));
              return;
            }

            console.log(`✅ 成功解析 ${tasks.length} 条任务（共 ${results.data.length} 行数据）`);
            resolve(tasks);
          } catch (err) {
            console.error('CSV 解析错误:', err);
            reject(err);
          }
        },
        error: (error) => {
          console.error('Papa Parse 错误:', error);
          reject(new Error(`CSV 解析失败: ${error.message}`));
        }
      });
    });
  };

  const handleConfigSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    const formData = new FormData(e.currentTarget);
    const refreshToken = formData.get('refreshToken') as string;
    const username = formData.get('username') as string;

    // 验证
    if (!refreshToken) {
      alert('请提供 JWT Activation Token (Refresh Token)');
      setUploading(false);
      return;
    }

    // 验证 token 格式（JWT refresh token 应该以 eyJ 开头）
    if (!refreshToken.startsWith('eyJ')) {
      alert('Token 格式不正确！\nJWT Refresh Token 应该以 "eyJ" 开头。\n请确认你复制的是正确的 JWT token。');
      setUploading(false);
      return;
    }

    if (!username) {
      alert('请输入用户名');
      setUploading(false);
      return;
    }

    if (!csvFile) {
      alert('请选择 CSV 文件');
      setUploading(false);
      return;
    }

    try {
      // 创建临时 API 实例（只使用 refreshToken，token 留空，让 API 自动获取）
      const tempConfig: LabelStudioConfig = {
        url: formData.get('url') as string,
        token: '', // 留空，让 API 类自动通过 refreshToken 获取
        refreshToken: refreshToken,
        projectId: 0, // 暂时设为 0
        username: username,
      };

      console.log('[App] Creating API instance with refresh token...');
      const tempApi = new LabelStudioAPI(tempConfig);

      // 等待 API 初始化（会自动调用 /api/token/refresh/ 获取 access token）
      console.log('[App] Waiting for API initialization (token refresh)...');
      // API 构造函数会自动触发 token refresh

      // 1. 创建新项目
      console.log('Creating project...');
      const project = await tempApi.createProject({
        title: `${username}'s Annotation Project`,
        label_config: DEFAULT_CONFIG,
        description: 'Auto-created by Graph Annotator',
      });

      console.log('Project created:', project.id);

      // 2. 解析并导入 CSV
      console.log('Parsing CSV...');
      const tasks = await parseCSV(csvFile);
      console.log(`Parsed ${tasks.length} tasks from CSV`);

      console.log('Importing tasks...');
      await tempApi.importTasks(project.id, tasks);
      console.log('Tasks imported successfully');

      // 3. 保存配置（获取包含 access token 的最新配置）
      const updatedConfig = tempApi.getConfig();
      const newConfig: LabelStudioConfig = {
        ...updatedConfig,
        projectId: project.id,
        username: username,
      };

      console.log('[App] Saving config with access token:', {
        hasAccessToken: !!newConfig.token,
        hasRefreshToken: !!newConfig.refreshToken,
        projectId: newConfig.projectId,
      });

      setConfig(newConfig);
      saveConfig(newConfig);

      alert(`设置完成！\n- 项目 ID: ${project.id}\n- 导入任务数: ${tasks.length}\n\n✅ Access token 已自动获取并保存`);
    } catch (err) {
      console.error('Setup failed:', err);
      alert('设置失败: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setUploading(false);
    }
  };

  const handleRefreshGraph = useCallback(async () => {
    if (!api || !currentTask) return;

    try {
      console.log('Manual refresh triggered for task', currentTask.id);
      const task = await api.getTask(currentTask.id);
      console.log('Fetched task:', task.id, 'with', task.annotations?.length || 0, 'annotations');
      if (task.annotations && task.annotations.length > 0) {
        const results = task.annotations[task.annotations.length - 1].result;
        console.log('Updating graph with', results.length, 'results');
        updateGraph(results);
      } else {
        alert('No annotations found for this task. Please annotate in Label Studio first.');
      }
    } catch (err) {
      console.error('Refresh error:', err);
      alert('Failed to refresh: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  }, [api, currentTask, updateGraph]);

  const handlePreviousTask = useCallback(() => {
    if (currentTaskIndex > 0) {
      const newIndex = currentTaskIndex - 1;
      const task = allTasks[newIndex];
      setCurrentTaskIndex(newIndex);
      setCurrentTask(task);
      console.log('Navigated to previous task:', task.id);

      // Update graph with task's annotations
      if (task?.annotations && task.annotations.length > 0) {
        const results = task.annotations[task.annotations.length - 1].result;
        updateGraph(results);
      } else {
        setGraphData({ nodes: [], edges: [] });
      }
    }
  }, [currentTaskIndex, allTasks, updateGraph]);

  const handleNextTask = useCallback(() => {
    if (currentTaskIndex < allTasks.length - 1) {
      const newIndex = currentTaskIndex + 1;
      const task = allTasks[newIndex];
      setCurrentTaskIndex(newIndex);
      setCurrentTask(task);
      console.log('Navigated to next task:', task.id);

      // Update graph with task's annotations
      if (task?.annotations && task.annotations.length > 0) {
        const results = task.annotations[task.annotations.length - 1].result;
        updateGraph(results);
      } else {
        setGraphData({ nodes: [], edges: [] });
      }
    }
  }, [currentTaskIndex, allTasks, updateGraph]);

  const handleTaskChange = useCallback(async (taskId: number) => {
    if (!api) return;

    try {
      // Find task in allTasks by ID
      const taskIndex = allTasks.findIndex(t => t.id === taskId);

      if (taskIndex !== -1) {
        // Task is in the list, just switch to it
        const task = allTasks[taskIndex];
        setCurrentTaskIndex(taskIndex);
        setCurrentTask(task);
        console.log('Switched to task:', task.id, 'at index:', taskIndex);

        // Fetch fresh data from API
        const freshTask = await api.getTask(taskId);
        if (freshTask.annotations && freshTask.annotations.length > 0) {
          const results = freshTask.annotations[freshTask.annotations.length - 1].result;
          updateGraph(results);
        } else {
          setGraphData({ nodes: [], edges: [] });
        }
      } else {
        // Task not in current list, fetch it and add to the list
        console.log('Task', taskId, 'not in list, fetching...');
        const newTask = await api.getTask(taskId);
        // Add to tasks list
        setAllTasks(prev => [...prev, newTask]);
        setCurrentTaskIndex(allTasks.length);
        setCurrentTask(newTask);

        if (newTask.annotations && newTask.annotations.length > 0) {
          const results = newTask.annotations[newTask.annotations.length - 1].result;
          updateGraph(results);
        } else {
          setGraphData({ nodes: [], edges: [] });
        }
      }
    } catch (err) {
      console.error('Failed to switch task:', err);
    }
  }, [api, allTasks, updateGraph]);

  const handleGoToTask = useCallback(() => {
    const taskId = parseInt(taskIdInput);
    if (isNaN(taskId) || taskId <= 0) {
      alert('Please enter a valid task ID');
      return;
    }
    handleTaskChange(taskId);
  }, [taskIdInput, handleTaskChange]);

  const handleTaskIdKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleGoToTask();
    }
  }, [handleGoToTask]);

  if (!configured) {
    return (
      <div className="config-screen">
        <div className="config-form">
          <h1>Label Studio Graph Annotator</h1>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
            首次使用配置 - 只需设置一次
          </p>
          <form onSubmit={handleConfigSubmit}>
            <div className="form-group">
              <label htmlFor="url">Label Studio 地址:</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  id="url"
                  name="url"
                  value={config.url}
                  onChange={(e) => setConfig({ ...config, url: e.target.value })}
                  placeholder="http://localhost:8080"
                  required
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={handleDetect}
                  disabled={detecting}
                  className="btn-secondary"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {detecting ? '检测中...' : '自动探测'}
                </button>
              </div>
              <small>应用会自动探测本地 Label Studio (端口 8080/8081/8090)</small>
            </div>

            <div className="form-group">
              <label htmlFor="username">用户名:</label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="请输入你的姓名（用于区分标注数据）"
                required
              />
              <small>用于标识你的标注项目</small>
            </div>

            <div className="form-group">
              <label htmlFor="refreshToken">JWT Activation Token (Refresh Token):</label>
              <input
                type="text"
                id="refreshToken"
                name="refreshToken"
                placeholder="粘贴你的 JWT activation token（以 eyJ 开头）"
                required
              />
              <small>
                <strong>如何获取 Token：</strong><br/>
                1. 打开 <a href="http://localhost:8080" target="_blank" rel="noopener noreferrer">Label Studio</a><br/>
                2. 点击右上角头像 → Account Settings<br/>
                3. 点击 "Access Token" 标签 → 复制 JWT token<br/>
                4. Token 应该以 <code>eyJ</code> 开头（这是正确的 JWT refresh token）
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="csvFile">标注数据文件 (CSV):</label>
              <input
                type="file"
                id="csvFile"
                accept=".csv"
                onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                required
              />
              <small>
                CSV 文件必须包含 <strong>AB</strong> 列（摘要文本）<br/>
                示例格式：第一行为表头，包含 AB 列名
              </small>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={uploading}
              style={{ width: '100%', marginTop: '20px' }}
            >
              {uploading ? '正在设置...' : '保存并开始使用'}
            </button>
          </form>

          <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f0f8ff', borderRadius: '8px', fontSize: '14px' }}>
            <strong>💡 使用提示：</strong>
            <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
              <li>确保 Label Studio 已启动（运行 <code>label-studio start</code>）</li>
              <li>配置信息会保存在本地，下次启动无需重新输入</li>
              <li>应用会自动创建项目并导入你的数据</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading task...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-screen">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => setConfigured(false)}>Reconfigure</button>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Label Studio Graph Annotator</h1>
        <div className="header-info">
          <span>Current: Task ID {currentTask?.id || 'N/A'} (#{currentTaskIndex + 1}/{allTasks.length})</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginLeft: '15px' }}>
            <span style={{ fontSize: '14px' }}>Go to:</span>
            <input
              type="number"
              value={taskIdInput}
              onChange={(e) => setTaskIdInput(e.target.value)}
              onKeyDown={handleTaskIdKeyDown}
              placeholder="Task ID"
              style={{
                width: '80px',
                padding: '6px 8px',
                borderRadius: '4px',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                fontSize: '14px',
              }}
            />
            <button
              onClick={handleGoToTask}
              className="btn-secondary"
              style={{ padding: '6px 12px' }}
            >
              Go
            </button>
          </div>
          <button
            onClick={handlePreviousTask}
            className="btn-secondary"
            style={{ marginLeft: '15px', marginRight: '10px' }}
            disabled={currentTaskIndex === 0}
          >
            ← Previous
          </button>
          <button
            onClick={handleNextTask}
            className="btn-secondary"
            style={{ marginRight: '10px' }}
            disabled={currentTaskIndex === allTasks.length - 1}
          >
            Next →
          </button>
          <button onClick={handleRefreshGraph} className="btn-secondary" style={{ marginRight: '10px' }}>
            🔄 Refresh
          </button>
          <button onClick={() => setConfigured(false)} className="btn-secondary">
            Reconfigure
          </button>
        </div>
      </header>
      <div className="app-content">
        <div className="annotation-panel">
          <LabelStudioWrapper
            task={currentTask}
            config={DEFAULT_CONFIG}
            api={api}
            onUpdate={handleUpdate}
            onSubmit={handleSubmit}
          />
        </div>
        <div className="graph-panel-wrapper">
          <GraphPanel data={graphData} />
        </div>
      </div>
    </div>
  );
}

export default App;
