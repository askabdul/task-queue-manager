// Task Queue Manager - Type Definitions
export interface Job {
  id: string;
  name: string;
  data: any;
  opts: JobOptions;
  progress: number;
  processedOn?: number;
  finishedOn?: number;
  failedReason?: string;
  returnvalue?: any;
  attemptsMade: number;
  delay: number;
  timestamp: number;
  status: JobStatus;
  queueName: string;
}

export interface JobOptions {
  priority?: number;
  delay?: number;
  attempts?: number;
  backoff?: BackoffSettings | BackoffType;
  lifo?: boolean;
  timeout?: number;
  removeOnComplete?: number | boolean;
  removeOnFail?: number | boolean;
  jobId?: string;
  repeat?: RepeatOptions;
}

export interface BackoffSettings {
  type: BackoffType;
  delay?: number;
  settings?: any;
}

export type BackoffType = 'fixed' | 'exponential' | 'custom';

export interface RepeatOptions {
  cron?: string;
  tz?: string;
  startDate?: Date | string | number;
  endDate?: Date | string | number;
  limit?: number;
  every?: number;
  count?: number;
}

export type JobStatus =
  | 'waiting'
  | 'active'
  | 'completed'
  | 'failed'
  | 'delayed'
  | 'paused'
  | 'stuck';

export interface Queue {
  name: string;
  isPaused: boolean;
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
  paused: number;
  stuck: number;
  total: number;
  processingRate: number;
  completionRate: number;
  failureRate: number;
  avgProcessingTime: number;
  createdAt: string;
  lastActivity?: string;
}

export interface QueueMetrics {
  queueName: string;
  totalJobs: number;
  completedJobs: number;
  failedJobs: number;
  activeJobs: number;
  waitingJobs: number;
  delayedJobs: number;
  throughput: number;
  avgProcessingTime: number;
  errorRate: number;
  memoryUsage: number;
  cpuUsage: number;
  timestamp: string;
}

export interface Worker {
  id: string;
  name: string;
  queues: string[];
  status: WorkerStatus;
  processedJobs: number;
  failedJobs: number;
  lastActivity: string;
  uptime: number;
  memoryUsage: number;
  cpuUsage: number;
}

export type WorkerStatus = 'active' | 'idle' | 'paused' | 'stopped' | 'error';

export interface JobProcessor {
  name: string;
  concurrency: number;
  processor: (job: Job) => Promise<any>;
}

export interface CreateJobRequest {
  queueName: string;
  jobName: string;
  data: any;
  options?: JobOptions;
}

export interface CreateQueueRequest {
  name: string;
  options?: QueueOptions;
}

export interface QueueOptions {
  defaultJobOptions?: JobOptions;
  redis?: RedisOptions;
  prefix?: string;
  maxStalledCount?: number;
  stalledInterval?: number;
  maxmemoryPolicy?: string;
}

export interface RedisOptions {
  host?: string;
  port?: number;
  password?: string;
  db?: number;
  maxRetriesPerRequest?: number;
  lazyConnect?: boolean;
  keepAlive?: number;
}

export interface JobEvent {
  eventType: JobEventType;
  jobId: string;
  queueName: string;
  timestamp: string;
  data?: any;
  error?: string;
}

export type JobEventType =
  | 'job.created'
  | 'job.started'
  | 'job.progress'
  | 'job.completed'
  | 'job.failed'
  | 'job.stalled'
  | 'job.removed';

export interface QueueEvent {
  eventType: QueueEventType;
  queueName: string;
  timestamp: string;
  data?: any;
}

export type QueueEventType =
  | 'queue.created'
  | 'queue.paused'
  | 'queue.resumed'
  | 'queue.cleaned'
  | 'queue.drained'
  | 'queue.error';

export interface SystemStats {
  totalQueues: number;
  totalJobs: number;
  totalWorkers: number;
  systemUptime: number;
  memoryUsage: MemoryUsage;
  cpuUsage: CpuUsage;
  redisStats: RedisStats;
  throughput: ThroughputStats;
  errors: ErrorStats;
}

export interface MemoryUsage {
  used: number;
  total: number;
  percentage: number;
  heap: {
    used: number;
    total: number;
  };
  external: number;
}

export interface CpuUsage {
  percentage: number;
  loadAverage: number[];
  cores: number;
}

export interface RedisStats {
  connected: boolean;
  totalConnections: number;
  usedMemory: number;
  keyspaceHits: number;
  keyspaceMisses: number;
  commandsProcessed: number;
}

export interface ThroughputStats {
  jobsPerSecond: number;
  jobsPerMinute: number;
  jobsPerHour: number;
  avgResponseTime: number;
}

export interface ErrorStats {
  totalErrors: number;
  errorRate: number;
  recentErrors: Array<{
    timestamp: string;
    error: string;
    context?: any;
  }>;
}

export interface DashboardData {
  queues: Queue[];
  workers: Worker[];
  systemStats: SystemStats;
  recentJobs: Job[];
  alerts: Alert[];
  metrics: QueueMetrics[];
}

export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  details?: string;
  timestamp: string;
  acknowledged: boolean;
  queueName?: string;
  jobId?: string;
}

export type AlertType =
  | 'high_failure_rate'
  | 'queue_stalled'
  | 'worker_down'
  | 'memory_high'
  | 'cpu_high'
  | 'redis_disconnected'
  | 'job_timeout'
  | 'queue_backlog';

export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface JobQuery {
  status?: JobStatus;
  queue?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'timestamp' | 'progress' | 'attempts';
  sortOrder?: 'asc' | 'desc';
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface QueueQuery {
  status?: 'active' | 'paused';
  sortBy?: 'name' | 'total' | 'active' | 'failed';
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface WebSocketMessage {
  type: WebSocketMessageType;
  payload: any;
  timestamp: string;
}

export type WebSocketMessageType =
  | 'job.update'
  | 'queue.update'
  | 'metrics.update'
  | 'alert.new'
  | 'system.stats'
  | 'worker.update'
  | 'connection.established'
  | 'error';

export interface RetryPolicy {
  attempts: number;
  backoff: BackoffSettings;
  onFailedAttempt?: (error: Error, attemptNumber: number) => void;
}

export interface RateLimitOptions {
  windowMs: number;
  max: number;
  message?: string;
  standardHeaders?: boolean;
  legacyHeaders?: boolean;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
  createdAt: string;
  lastLogin?: string;
}

export type UserRole = 'admin' | 'operator' | 'viewer';

export type Permission =
  | 'queue.create'
  | 'queue.delete'
  | 'queue.pause'
  | 'queue.resume'
  | 'job.create'
  | 'job.retry'
  | 'job.remove'
  | 'metrics.view'
  | 'system.configure';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
  expiresAt: string;
}

export interface JobProcessorConfig {
  name: string;
  queueName: string;
  concurrency: number;
  processor: string; // Function name or file path
  enabled: boolean;
}

export interface QueueConfig {
  name: string;
  processors: JobProcessorConfig[];
  defaultOptions: JobOptions;
  redisConfig: RedisOptions;
}

export interface SystemConfig {
  redis: RedisOptions;
  queues: QueueConfig[];
  workers: {
    maxConcurrency: number;
    stalledInterval: number;
    maxStalledCount: number;
  };
  monitoring: {
    metricsInterval: number;
    retentionPeriod: number;
    alertThresholds: {
      failureRate: number;
      responseTime: number;
      memoryUsage: number;
      cpuUsage: number;
    };
  };
  api: {
    port: number;
    cors: boolean;
    rateLimit: RateLimitOptions;
  };
}

// Chart.js compatible data structures
export interface ChartDataset {
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
  fill?: boolean;
  tension?: number;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface MetricChart {
  id: string;
  title: string;
  type: 'line' | 'bar' | 'doughnut' | 'pie';
  data: ChartData;
  options?: any;
}
