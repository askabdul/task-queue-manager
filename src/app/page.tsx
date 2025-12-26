"use client";

import { useState, useEffect } from "react";
import {
  Queue,
  Job,
  JobStatus,
  SystemStats,
  QueueMetrics,
  DashboardData,
  Alert,
  Worker,
} from "@/types";

export default function TaskQueueManager() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    queues: [],
    workers: [],
    systemStats: {
      totalQueues: 0,
      totalJobs: 0,
      totalWorkers: 0,
      systemUptime: 0,
      memoryUsage: {
        used: 0,
        total: 0,
        percentage: 0,
        heap: { used: 0, total: 0 },
        external: 0,
      },
      cpuUsage: {
        percentage: 0,
        loadAverage: [0, 0, 0],
        cores: 0,
      },
      redisStats: {
        connected: true,
        totalConnections: 0,
        usedMemory: 0,
        keyspaceHits: 0,
        keyspaceMisses: 0,
        commandsProcessed: 0,
      },
      throughput: {
        jobsPerSecond: 0,
        jobsPerMinute: 0,
        jobsPerHour: 0,
        avgResponseTime: 0,
      },
      errors: {
        totalErrors: 0,
        errorRate: 0,
        recentErrors: [],
      },
    },
    recentJobs: [],
    alerts: [],
    metrics: [],
  });

  const [activeTab, setActiveTab] = useState<
    "overview" | "queues" | "jobs" | "workers" | "alerts"
  >("overview");
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [newJobForm, setNewJobForm] = useState({
    queueName: "",
    jobName: "",
    data: "",
    priority: 0,
    delay: 0,
  });
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Theme persistence
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("task-queue-theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Keyboard support and focus management for modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && showCreateJob) {
        closeCreateJobModal();
      }
    };

    if (showCreateJob) {
      document.addEventListener("keydown", handleKeyDown);
      // Prevent background scrolling
      document.body.style.overflow = "hidden";
      // Focus first form input
      setTimeout(() => {
        const firstInput = document.querySelector(
          ".modal-content input, .modal-content select",
        ) as HTMLElement;
        if (firstInput) {
          firstInput.focus();
        }
      }, 100);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [showCreateJob]);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("task-queue-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("task-queue-theme", "light");
    }
  };

  // Simulate real-time data updates
  useEffect(() => {
    if (!mounted) return;

    const generateMockData = (): DashboardData => {
      const queues: Queue[] = [
        {
          name: "email-queue",
          isPaused: false,
          waiting: Math.floor(Math.random() * 50),
          active: Math.floor(Math.random() * 10),
          completed: Math.floor(Math.random() * 1000) + 500,
          failed: Math.floor(Math.random() * 20),
          delayed: Math.floor(Math.random() * 15),
          paused: 0,
          stuck: 0,
          total: 0,
          processingRate: Math.random() * 100,
          completionRate: 85 + Math.random() * 10,
          failureRate: Math.random() * 5,
          avgProcessingTime: Math.random() * 2000 + 500,
          createdAt: "2024-01-01T00:00:00Z",
          lastActivity: new Date().toISOString(),
        },
        {
          name: "image-processing",
          isPaused: false,
          waiting: Math.floor(Math.random() * 30),
          active: Math.floor(Math.random() * 5),
          completed: Math.floor(Math.random() * 800) + 300,
          failed: Math.floor(Math.random() * 10),
          delayed: Math.floor(Math.random() * 8),
          paused: 0,
          stuck: 0,
          total: 0,
          processingRate: Math.random() * 80,
          completionRate: 90 + Math.random() * 8,
          failureRate: Math.random() * 3,
          avgProcessingTime: Math.random() * 5000 + 1000,
          createdAt: "2024-01-01T00:00:00Z",
          lastActivity: new Date().toISOString(),
        },
        {
          name: "data-export",
          isPaused: false,
          waiting: Math.floor(Math.random() * 20),
          active: Math.floor(Math.random() * 3),
          completed: Math.floor(Math.random() * 500) + 200,
          failed: Math.floor(Math.random() * 8),
          delayed: Math.floor(Math.random() * 5),
          paused: 0,
          stuck: 0,
          total: 0,
          processingRate: Math.random() * 60,
          completionRate: 88 + Math.random() * 7,
          failureRate: Math.random() * 4,
          avgProcessingTime: Math.random() * 3000 + 800,
          createdAt: "2024-01-01T00:00:00Z",
          lastActivity: new Date().toISOString(),
        },
      ];

      // Calculate totals
      queues.forEach((queue) => {
        queue.total =
          queue.waiting +
          queue.active +
          queue.completed +
          queue.failed +
          queue.delayed;
      });

      const workers: Worker[] = [
        {
          id: "worker-1",
          name: "Email Worker #1",
          queues: ["email-queue"],
          status: "active",
          processedJobs: Math.floor(Math.random() * 1000) + 500,
          failedJobs: Math.floor(Math.random() * 20),
          lastActivity: new Date().toISOString(),
          uptime: Math.floor(Math.random() * 86400000) + 3600000,
          memoryUsage: Math.random() * 100 + 50,
          cpuUsage: Math.random() * 50 + 10,
        },
        {
          id: "worker-2",
          name: "Image Processor #1",
          queues: ["image-processing"],
          status: "active",
          processedJobs: Math.floor(Math.random() * 800) + 300,
          failedJobs: Math.floor(Math.random() * 15),
          lastActivity: new Date().toISOString(),
          uptime: Math.floor(Math.random() * 86400000) + 3600000,
          memoryUsage: Math.random() * 150 + 80,
          cpuUsage: Math.random() * 70 + 20,
        },
      ];

      const recentJobs: Job[] = [
        {
          id: "job-1",
          name: "send-welcome-email",
          data: { userId: "123", email: "user@example.com" },
          opts: { attempts: 3, delay: 0 },
          progress: 100,
          processedOn: Date.now() - 1000,
          finishedOn: Date.now(),
          attemptsMade: 1,
          delay: 0,
          timestamp: Date.now() - 2000,
          status: "completed",
          queueName: "email-queue",
        },
        {
          id: "job-2",
          name: "resize-avatar",
          data: { imageId: "456", size: "200x200" },
          opts: { attempts: 3, delay: 0 },
          progress: 75,
          processedOn: Date.now() - 500,
          attemptsMade: 1,
          delay: 0,
          timestamp: Date.now() - 1500,
          status: "active",
          queueName: "image-processing",
        },
        {
          id: "job-3",
          name: "export-user-data",
          data: { userId: "789", format: "csv" },
          opts: { attempts: 3, delay: 0 },
          progress: 0,
          attemptsMade: 2,
          delay: 0,
          timestamp: Date.now() - 3000,
          status: "failed",
          queueName: "data-export",
          failedReason: "Database connection timeout",
        },
      ];

      const alerts: Alert[] = [
        {
          id: "alert-1",
          type: "high_failure_rate",
          severity: "high",
          message: "High failure rate detected in email-queue",
          details: "Failure rate has exceeded 5% threshold",
          timestamp: new Date().toISOString(),
          acknowledged: false,
          queueName: "email-queue",
        },
        {
          id: "alert-2",
          type: "memory_high",
          severity: "critical",
          message: "Critical memory usage detected",
          details: "Memory usage has reached 95% on worker-1",
          timestamp: new Date(Date.now() - 300000).toISOString(),
          acknowledged: false,
        },
        {
          id: "alert-3",
          type: "queue_stalled",
          severity: "medium",
          message: "Queue processing stalled",
          details: "image-processing queue has been inactive for 10 minutes",
          timestamp: new Date(Date.now() - 600000).toISOString(),
          acknowledged: false,
          queueName: "image-processing",
        },
        {
          id: "alert-4",
          type: "cpu_high",
          severity: "low",
          message: "Elevated CPU usage",
          details: "CPU usage consistently above 80% for the last 5 minutes",
          timestamp: new Date(Date.now() - 900000).toISOString(),
          acknowledged: false,
        },
      ];

      const totalJobs = queues.reduce((sum, queue) => sum + queue.total, 0);
      const totalWorkers = workers.length;

      return {
        queues,
        workers,
        systemStats: {
          totalQueues: queues.length,
          totalJobs,
          totalWorkers,
          systemUptime: Math.floor(Math.random() * 86400000) + 3600000,
          memoryUsage: {
            used: Math.random() * 2048 + 512,
            total: 4096,
            percentage: Math.random() * 50 + 25,
            heap: {
              used: Math.random() * 1024 + 256,
              total: 2048,
            },
            external: Math.random() * 100 + 50,
          },
          cpuUsage: {
            percentage: Math.random() * 60 + 20,
            loadAverage: [
              Math.random() * 2,
              Math.random() * 2,
              Math.random() * 2,
            ],
            cores: 8,
          },
          redisStats: {
            connected: true,
            totalConnections: Math.floor(Math.random() * 100) + 50,
            usedMemory: Math.random() * 500 + 100,
            keyspaceHits: Math.floor(Math.random() * 10000) + 5000,
            keyspaceMisses: Math.floor(Math.random() * 1000) + 200,
            commandsProcessed: Math.floor(Math.random() * 100000) + 50000,
          },
          throughput: {
            jobsPerSecond: Math.random() * 50 + 10,
            jobsPerMinute: Math.random() * 3000 + 600,
            jobsPerHour: Math.random() * 180000 + 36000,
            avgResponseTime: Math.random() * 1000 + 200,
          },
          errors: {
            totalErrors: Math.floor(Math.random() * 100) + 20,
            errorRate: Math.random() * 5,
            recentErrors: [],
          },
        },
        recentJobs,
        alerts,
        metrics: [],
      };
    };

    const updateData = () => {
      setDashboardData(generateMockData());
      setIsConnected(true);
    };

    // Initial load
    updateData();

    // Update every 3 seconds
    const interval = setInterval(updateData, 3000);

    return () => clearInterval(interval);
  }, [mounted]);

  const [isCreatingJob, setIsCreatingJob] = useState(false);
  const [jobCreationError, setJobCreationError] = useState<string>("");

  const openCreateJobModal = () => {
    setShowCreateJob(true);
    setJobCreationError("");
  };

  const closeCreateJobModal = () => {
    setShowCreateJob(false);
    setNewJobForm({
      queueName: "",
      jobName: "",
      data: "",
      priority: 0,
      delay: 0,
    });
    setJobCreationError("");
  };

  const createJob = async () => {
    try {
      setIsCreatingJob(true);
      setJobCreationError("");

      // Validate form
      if (!newJobForm.queueName.trim()) {
        throw new Error("Queue name is required");
      }
      if (!newJobForm.jobName.trim()) {
        throw new Error("Job name is required");
      }

      // Parse JSON data if provided
      let parsedData = {};
      if (newJobForm.data.trim()) {
        try {
          parsedData = JSON.parse(newJobForm.data);
        } catch {
          throw new Error("Invalid JSON format in job data");
        }
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newJob: Job = {
        id: `job-${Date.now()}`,
        name: newJobForm.jobName,
        data: parsedData,
        opts: {
          priority: newJobForm.priority,
          delay: newJobForm.delay,
          attempts: 3,
        },
        progress: 0,
        attemptsMade: 0,
        delay: newJobForm.delay,
        timestamp: Date.now(),
        status: "waiting",
        queueName: newJobForm.queueName,
      };

      // Add job to recent jobs
      setDashboardData((prevData) => ({
        ...prevData,
        recentJobs: [newJob, ...prevData.recentJobs.slice(0, 19)],
      }));

      closeCreateJobModal();

      // Show success message
      setSuccessMessage(
        `Job "${newJob.name}" created successfully in ${newJob.queueName}!`,
      );
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      setJobCreationError(
        error instanceof Error ? error.message : "Failed to create job",
      );
    } finally {
      setIsCreatingJob(false);
    }
  };

  const pauseQueue = (queueName: string) => {
    console.log("Pausing queue:", queueName);
    setDashboardData((prevData) => ({
      ...prevData,
      queues: prevData.queues.map((queue) =>
        queue.name === queueName ? { ...queue, isPaused: true } : queue,
      ),
    }));
    setSuccessMessage(`Queue "${queueName}" has been paused`);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const resumeQueue = (queueName: string) => {
    console.log("Resuming queue:", queueName);
    setDashboardData((prevData) => ({
      ...prevData,
      queues: prevData.queues.map((queue) =>
        queue.name === queueName ? { ...queue, isPaused: false } : queue,
      ),
    }));
    setSuccessMessage(`Queue "${queueName}" has been resumed`);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const retryJob = (jobId: string) => {
    console.log("Retrying job:", jobId);
    setDashboardData((prevData) => ({
      ...prevData,
      recentJobs: prevData.recentJobs.map((job) =>
        job.id === jobId
          ? {
              ...job,
              status: "waiting" as JobStatus,
              progress: 0,
              attemptsMade: 0,
            }
          : job,
      ),
    }));
    setSuccessMessage(`Job "${jobId}" has been queued for retry`);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const removeJob = (jobId: string) => {
    console.log("Removing job:", jobId);
    setDashboardData((prevData) => ({
      ...prevData,
      recentJobs: prevData.recentJobs.filter((job) => job.id !== jobId),
    }));
    setSuccessMessage(`Job "${jobId}" has been removed`);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const formatUptime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  const getStatusBadge = (status: JobStatus) => {
    const statusStyles = {
      waiting: "badge-neutral",
      active: "badge-info",
      completed: "badge-success",
      failed: "badge-error",
      delayed: "badge-warning",
      paused: "badge-warning",
      stuck: "badge-error",
    };

    const statusIcons = {
      waiting: "⏳",
      active: "⚡",
      completed: "✅",
      failed: "❌",
      delayed: "⏰",
      paused: "⏸️",
      stuck: "🚫",
    };

    return (
      <span className={`badge ${statusStyles[status]}`}>
        {statusIcons[status]} {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (!mounted) {
    return (
      <div
        className="flex items-center justify-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p>Loading Task Queue Manager...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Header */}
      <header className="header">
        <div className="container" style={{ padding: "1rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  fontSize: "1.5rem",
                  width: "2.5rem",
                  height: "2.5rem",
                  background: "linear-gradient(135deg, #6366f1, #3b82f6)",
                  borderRadius: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ⚡
              </div>
              <div>
                <h1 className="text-xl font-bold">Task Queue Manager</h1>
                <div className="flex items-center gap-2 text-sm">
                  <span
                    className={`badge ${isConnected ? "badge-success" : "badge-error"}`}
                  >
                    {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
                  </span>
                  <span className="text-gray-500">
                    Uptime:{" "}
                    {formatUptime(dashboardData.systemStats.systemUptime)}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <button onClick={toggleDarkMode} className="btn btn-ghost btn-sm">
                {darkMode ? "☀️" : "🌙"}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Success notification */}
      {successMessage && (
        <div className="notification">
          <div className="alert alert-success">
            <span>✅</span>
            {successMessage}
            <button
              onClick={() => setSuccessMessage("")}
              className="ml-2 text-success-600 hover:text-success-800 bg-transparent border-none cursor-pointer p-1 rounded"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="container" style={{ padding: "0 1rem" }}>
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid",
            borderColor: darkMode ? "#374151" : "#e5e7eb",
            marginBottom: "2rem",
          }}
        >
          {[
            { id: "overview", label: "📊 Overview" },
            { id: "queues", label: "📋 Queue Management" },
            { id: "jobs", label: "🔧 Job Management" },
            { id: "workers", label: "👷 Workers" },
            { id: "alerts", label: "🚨 Alerts" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              style={{
                padding: "0.75rem 1rem",
                border: "none",
                background: "none",
                cursor: "pointer",
                borderBottom: "2px solid",
                borderBottomColor:
                  activeTab === tab.id ? "#3b82f6" : "transparent",
                color:
                  activeTab === tab.id
                    ? "#3b82f6"
                    : darkMode
                      ? "#9ca3af"
                      : "#6b7280",
                fontSize: "0.875rem",
                fontWeight: "500",
                transition: "all 0.2s",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="container" style={{ padding: "0 1rem 2rem" }}>
        {activeTab === "overview" && (
          <div>
            {/* System Stats */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1rem",
                marginBottom: "2rem",
              }}
            >
              <div className="card" style={{ padding: "1.5rem" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <div style={{ fontSize: "1.5rem" }}>📋</div>
                  <div>
                    <div
                      style={{
                        fontSize: "0.875rem",
                        color: darkMode ? "#9ca3af" : "#6b7280",
                      }}
                    >
                      Total Queues
                    </div>
                    <div style={{ fontSize: "1.5rem", fontWeight: "600" }}>
                      {dashboardData.systemStats.totalQueues}
                    </div>
                  </div>
                </div>
              </div>
              <div className="card" style={{ padding: "1.5rem" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <div style={{ fontSize: "1.5rem" }}>💼</div>
                  <div>
                    <div
                      style={{
                        fontSize: "0.875rem",
                        color: darkMode ? "#9ca3af" : "#6b7280",
                      }}
                    >
                      Total Jobs
                    </div>
                    <div style={{ fontSize: "1.5rem", fontWeight: "600" }}>
                      {dashboardData.systemStats.totalJobs}
                    </div>
                  </div>
                </div>
              </div>
              <div className="card" style={{ padding: "1.5rem" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <div style={{ fontSize: "1.5rem" }}>👷</div>
                  <div>
                    <div
                      style={{
                        fontSize: "0.875rem",
                        color: darkMode ? "#9ca3af" : "#6b7280",
                      }}
                    >
                      Active Workers
                    </div>
                    <div style={{ fontSize: "1.5rem", fontWeight: "600" }}>
                      {dashboardData.systemStats.totalWorkers}
                    </div>
                  </div>
                </div>
              </div>
              <div className="card" style={{ padding: "1.5rem" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <div style={{ fontSize: "1.5rem" }}>⚡</div>
                  <div>
                    <div
                      style={{
                        fontSize: "0.875rem",
                        color: darkMode ? "#9ca3af" : "#6b7280",
                      }}
                    >
                      Jobs/Second
                    </div>
                    <div style={{ fontSize: "1.5rem", fontWeight: "600" }}>
                      {dashboardData.systemStats.throughput.jobsPerSecond.toFixed(
                        1,
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* System Overview Cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
                gap: "1.5rem",
                marginBottom: "1.5rem",
              }}
            >
              {/* Memory Usage */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">🧠 Memory Usage</h3>
                </div>
                <div className="card-body">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Used Memory</span>
                        <span>
                          {dashboardData.systemStats.memoryUsage.used.toFixed(
                            0,
                          )}
                          MB / {dashboardData.systemStats.memoryUsage.total}MB
                        </span>
                      </div>
                      <div className="progress">
                        <div
                          className="progress-bar"
                          style={{
                            width: `${dashboardData.systemStats.memoryUsage.percentage}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Heap Memory</span>
                        <span>
                          {dashboardData.systemStats.memoryUsage.heap.used.toFixed(
                            0,
                          )}
                          MB /{" "}
                          {dashboardData.systemStats.memoryUsage.heap.total}MB
                        </span>
                      </div>
                      <div className="progress">
                        <div
                          className="progress-bar progress-bar-info"
                          style={{
                            width: `${(dashboardData.systemStats.memoryUsage.heap.used / dashboardData.systemStats.memoryUsage.heap.total) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CPU Usage */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">⚙️ CPU Usage</h3>
                </div>
                <div className="card-body">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>CPU Load</span>
                        <span>
                          {dashboardData.systemStats.cpuUsage.percentage.toFixed(
                            1,
                          )}
                          %
                        </span>
                      </div>
                      <div className="progress">
                        <div
                          className="progress-bar progress-bar-warning"
                          style={{
                            width: `${dashboardData.systemStats.cpuUsage.percentage}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">1m avg</div>
                        <div className="font-medium">
                          {dashboardData.systemStats.cpuUsage.loadAverage[0].toFixed(
                            2,
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">5m avg</div>
                        <div className="font-medium">
                          {dashboardData.systemStats.cpuUsage.loadAverage[1].toFixed(
                            2,
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">15m avg</div>
                        <div className="font-medium">
                          {dashboardData.systemStats.cpuUsage.loadAverage[2].toFixed(
                            2,
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Jobs */}
            <div className="card mb-6">
              <div className="card-header">
                <h3 className="card-title">📝 Recent Jobs</h3>
              </div>
              <div className="card-body">
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Job ID</th>
                        <th>Name</th>
                        <th>Queue</th>
                        <th>Status</th>
                        <th>Progress</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.recentJobs.slice(0, 5).map((job) => (
                        <tr key={job.id}>
                          <td>
                            <code className="text-xs">{job.id}</code>
                          </td>
                          <td>
                            <div className="font-medium">{job.name}</div>
                          </td>
                          <td>
                            <span className="badge badge-neutral">
                              {job.queueName}
                            </span>
                          </td>
                          <td>{getStatusBadge(job.status)}</td>
                          <td>
                            <div className="flex items-center gap-2">
                              <div
                                className="progress"
                                style={{ width: "60px" }}
                              >
                                <div
                                  className="progress-bar"
                                  style={{ width: `${job.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-sm">{job.progress}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "queues" && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h2 style={{ fontSize: "1.25rem", fontWeight: "600", margin: 0 }}>
                Queue Management
              </h2>
            </div>

            <div className="card">
              <div className="card-body">
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Queue Name</th>
                        <th>Status</th>
                        <th>Waiting</th>
                        <th>Active</th>
                        <th>Completed</th>
                        <th>Failed</th>
                        <th>Success Rate</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.queues.map((queue) => (
                        <tr key={queue.name}>
                          <td>
                            <div>
                              <div className="font-medium">{queue.name}</div>
                              <div className="text-xs text-gray-500">
                                Avg: {queue.avgProcessingTime.toFixed(0)}ms
                              </div>
                            </div>
                          </td>
                          <td>
                            <span
                              className={`badge ${queue.isPaused ? "badge-warning" : "badge-success"}`}
                            >
                              {queue.isPaused ? "⏸️ Paused" : "▶️ Active"}
                            </span>
                          </td>
                          <td>
                            <span className="badge badge-neutral">
                              {queue.waiting}
                            </span>
                          </td>
                          <td>
                            <span className="badge badge-info">
                              {queue.active}
                            </span>
                          </td>
                          <td>
                            <span className="badge badge-success">
                              {queue.completed}
                            </span>
                          </td>
                          <td>
                            <span className="badge badge-error">
                              {queue.failed}
                            </span>
                          </td>
                          <td>
                            <div className="flex items-center gap-2">
                              <div
                                className="progress"
                                style={{ width: "60px" }}
                              >
                                <div
                                  className="progress-bar"
                                  style={{
                                    width: `${queue.completionRate}%`,
                                  }}
                                ></div>
                              </div>
                              <span className="text-sm">
                                {queue.completionRate.toFixed(1)}%
                              </span>
                            </div>
                          </td>
                          <td>
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  queue.isPaused
                                    ? resumeQueue(queue.name)
                                    : pauseQueue(queue.name)
                                }
                                className={`btn btn-sm ${queue.isPaused ? "btn-success" : "btn-warning"}`}
                              >
                                {queue.isPaused ? "▶️" : "⏸️"}
                              </button>
                              <button
                                className="btn btn-sm btn-secondary"
                                onClick={() => {
                                  setSuccessMessage(
                                    `Viewing stats for "${queue.name}" queue`,
                                  );
                                  setTimeout(() => setSuccessMessage(""), 3000);
                                }}
                              >
                                📊
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "jobs" && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h2 style={{ fontSize: "1.25rem", fontWeight: "600", margin: 0 }}>
                Job Management
              </h2>
              <button onClick={openCreateJobModal} className="btn btn-primary">
                ➕ Create Job
              </button>
            </div>

            <div className="card">
              <div className="card-body">
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Job ID</th>
                        <th>Name</th>
                        <th>Queue</th>
                        <th>Status</th>
                        <th>Progress</th>
                        <th>Attempts</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.recentJobs.map((job) => (
                        <tr key={job.id}>
                          <td>
                            <code className="text-xs">{job.id}</code>
                          </td>
                          <td>
                            <div className="font-medium">{job.name}</div>
                          </td>
                          <td>
                            <span className="badge badge-neutral">
                              {job.queueName}
                            </span>
                          </td>
                          <td>{getStatusBadge(job.status)}</td>
                          <td>
                            <div className="flex items-center gap-2">
                              <div
                                className="progress"
                                style={{ width: "60px" }}
                              >
                                <div
                                  className="progress-bar"
                                  style={{ width: `${job.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-sm">{job.progress}%</span>
                            </div>
                          </td>
                          <td>
                            <span className="text-sm">
                              {job.attemptsMade}/{job.opts.attempts || 1}
                            </span>
                          </td>
                          <td>
                            <span className="text-sm">
                              {new Date(job.timestamp).toLocaleTimeString()}
                            </span>
                          </td>
                          <td>
                            <div className="flex gap-2">
                              {job.status === "failed" && (
                                <button
                                  onClick={() => retryJob(job.id)}
                                  className="btn btn-sm btn-warning"
                                  title="Retry Job"
                                >
                                  🔄
                                </button>
                              )}
                              <button
                                onClick={() => removeJob(job.id)}
                                className="btn btn-sm btn-danger"
                                title="Remove Job"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "workers" && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h2 style={{ fontSize: "1.25rem", fontWeight: "600", margin: 0 }}>
                Worker Management
              </h2>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {dashboardData.workers.map((worker) => (
                <div key={worker.id} className="card">
                  <div className="card-header">
                    <div className="flex justify-between items-center">
                      <h3 className="card-title">{worker.name}</h3>
                      <span
                        className={`badge ${
                          worker.status === "active"
                            ? "badge-success"
                            : "badge-warning"
                        }`}
                      >
                        {worker.status === "active" ? "🟢" : "🟡"}{" "}
                        {worker.status}
                      </span>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Queues</div>
                        <div className="flex flex-wrap gap-1">
                          {worker.queues.map((queue) => (
                            <span
                              key={queue}
                              className="badge badge-neutral text-xs"
                            >
                              {queue}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-500">
                            Processed Jobs
                          </div>
                          <div className="font-medium">
                            {worker.processedJobs.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">
                            Failed Jobs
                          </div>
                          <div className="font-medium text-red-600">
                            {worker.failedJobs}
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-500 mb-2">
                          Memory Usage
                        </div>
                        <div className="progress">
                          <div
                            className="progress-bar"
                            style={{
                              width: `${(worker.memoryUsage / 200) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {worker.memoryUsage.toFixed(1)}MB / 200MB
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-500 mb-2">
                          CPU Usage
                        </div>
                        <div className="progress">
                          <div
                            className="progress-bar progress-bar-warning"
                            style={{ width: `${worker.cpuUsage}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {worker.cpuUsage.toFixed(1)}%
                        </div>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Uptime</span>
                        <span>{formatUptime(worker.uptime)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "alerts" && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h2 style={{ fontSize: "1.25rem", fontWeight: "600", margin: 0 }}>
                System Alerts
              </h2>
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {dashboardData.alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`alert ${
                    alert.severity === "critical"
                      ? "alert-error"
                      : alert.severity === "high"
                        ? "alert-warning"
                        : alert.severity === "medium"
                          ? "alert-info"
                          : "alert-success"
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{alert.message}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs">
                          {new Date(alert.timestamp).toLocaleString()}
                        </span>
                        <span
                          className={`badge ${
                            alert.severity === "critical"
                              ? "badge-error"
                              : alert.severity === "high"
                                ? "badge-warning"
                                : alert.severity === "medium"
                                  ? "badge-info"
                                  : "badge-neutral"
                          }`}
                        >
                          {alert.severity.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    {alert.details && (
                      <p className="text-sm opacity-75 mt-1">{alert.details}</p>
                    )}
                    {alert.queueName && (
                      <div className="mt-2">
                        <span className="badge badge-neutral text-xs">
                          Queue: {alert.queueName}
                        </span>
                      </div>
                    )}
                  </div>
                  <button className="btn btn-sm btn-ghost">
                    {alert.acknowledged ? "✅" : "⚠️"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Create Job Modal */}
      {showCreateJob && (
        <div className="modal-backdrop" onClick={closeCreateJobModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 id="modal-title" className="font-bold text-lg">
                Create New Job
              </h3>
              <button
                onClick={closeCreateJobModal}
                className="modal-close"
                disabled={isCreatingJob}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div id="modal-description" className="space-y-4">
              {jobCreationError && (
                <div className="alert alert-error" role="alert">
                  <span>❌</span>
                  {jobCreationError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label" htmlFor="queue-select">
                    Queue Name
                  </label>
                  <select
                    id="queue-select"
                    value={newJobForm.queueName}
                    onChange={(e) =>
                      setNewJobForm({
                        ...newJobForm,
                        queueName: e.target.value,
                      })
                    }
                    className="form-input"
                    required
                  >
                    <option value="">Select a queue</option>
                    {dashboardData.queues.map((queue) => (
                      <option key={queue.name} value={queue.name}>
                        {queue.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="job-name">
                    Job Name
                  </label>
                  <input
                    id="job-name"
                    type="text"
                    value={newJobForm.jobName}
                    onChange={(e) =>
                      setNewJobForm({ ...newJobForm, jobName: e.target.value })
                    }
                    className="form-input"
                    placeholder="e.g., send-email, process-image"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="job-data">
                  Job Data (JSON)
                </label>
                <textarea
                  id="job-data"
                  value={newJobForm.data}
                  onChange={(e) =>
                    setNewJobForm({ ...newJobForm, data: e.target.value })
                  }
                  className="form-input"
                  rows={4}
                  placeholder='{"userId": "123", "email": "user@example.com"}'
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label" htmlFor="job-priority">
                    Priority
                  </label>
                  <input
                    id="job-priority"
                    type="number"
                    value={newJobForm.priority}
                    onChange={(e) =>
                      setNewJobForm({
                        ...newJobForm,
                        priority: parseInt(e.target.value),
                      })
                    }
                    className="form-input"
                    min="0"
                    max="10"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="job-delay">
                    Delay (ms)
                  </label>
                  <input
                    id="job-delay"
                    type="number"
                    value={newJobForm.delay}
                    onChange={(e) =>
                      setNewJobForm({
                        ...newJobForm,
                        delay: parseInt(e.target.value),
                      })
                    }
                    className="form-input"
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={closeCreateJobModal}
                className="btn btn-secondary"
                disabled={isCreatingJob}
              >
                Cancel
              </button>
              <button
                onClick={createJob}
                className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={
                  !newJobForm.queueName || !newJobForm.jobName || isCreatingJob
                }
              >
                {isCreatingJob ? (
                  <span className="flex items-center gap-2">
                    <div
                      className="spinner"
                      style={{ width: "14px", height: "14px" }}
                    ></div>
                    Creating...
                  </span>
                ) : (
                  "Create Job"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
