import React, { useState, useEffect } from 'react';
import './styles.css';

// Shared Components
const Card: React.FC<{ title: string; value: number; color: string }> = ({ title, value, color }) => (
  <div className="stat-card" style={{ borderLeft: `4px solid ${color}` }}>
    <h3>{title}</h3>
    <div className="stat-value">{value}</div>
  </div>
);

const ProgressBar: React.FC<{ label: string; value: number; max: number; color: string }> = ({ label, value, max, color }) => (
  <div className="progress-container">
    <div className="progress-label">
      <span>{label}</span>
      <span>{value}/{max}</span>
    </div>
    <div className="progress-bar">
      <div className="progress-fill" style={{ width: `${(value / max) * 100}%`, backgroundColor: color }} />
    </div>
  </div>
);

interface Task {
  id: string;
  name: string;
  status: string;
  priority: string;
  due_date: string;
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual MCP tool calls
    setTimeout(() => {
      setTasks([
        { id: '1', name: 'Complete project proposal', status: 'in progress', priority: 'high', due_date: '2024-02-15' },
        { id: '2', name: 'Review design mockups', status: 'open', priority: 'medium', due_date: '2024-02-14' },
        { id: '3', name: 'Update documentation', status: 'closed', priority: 'low', due_date: '2024-02-10' },
        { id: '4', name: 'Fix critical bug', status: 'in progress', priority: 'urgent', due_date: '2024-02-12' },
        { id: '5', name: 'Team meeting prep', status: 'open', priority: 'medium', due_date: '2024-02-16' },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const statusCounts = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const priorityCounts = tasks.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const overdueTasks = tasks.filter(task => new Date(task.due_date) < new Date() && task.status !== 'closed');

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="app">
      <header>
        <h1>📊 Task Dashboard</h1>
        <p>Overview of your tasks and progress</p>
      </header>

      <section className="stats-grid">
        <Card title="Total Tasks" value={tasks.length} color="#7c3aed" />
        <Card title="In Progress" value={statusCounts['in progress'] || 0} color="#3b82f6" />
        <Card title="Completed" value={statusCounts['closed'] || 0} color="#10b981" />
        <Card title="Overdue" value={overdueTasks.length} color="#ef4444" />
      </section>

      <section className="section">
        <h2>Status Breakdown</h2>
        <div className="progress-list">
          <ProgressBar label="Open" value={statusCounts['open'] || 0} max={tasks.length} color="#6366f1" />
          <ProgressBar label="In Progress" value={statusCounts['in progress'] || 0} max={tasks.length} color="#3b82f6" />
          <ProgressBar label="Closed" value={statusCounts['closed'] || 0} max={tasks.length} color="#10b981" />
        </div>
      </section>

      <section className="section">
        <h2>Priority Distribution</h2>
        <div className="priority-grid">
          <div className="priority-item urgent">
            <span>Urgent</span>
            <strong>{priorityCounts['urgent'] || 0}</strong>
          </div>
          <div className="priority-item high">
            <span>High</span>
            <strong>{priorityCounts['high'] || 0}</strong>
          </div>
          <div className="priority-item medium">
            <span>Medium</span>
            <strong>{priorityCounts['medium'] || 0}</strong>
          </div>
          <div className="priority-item low">
            <span>Low</span>
            <strong>{priorityCounts['low'] || 0}</strong>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Overdue Tasks</h2>
        {overdueTasks.length === 0 ? (
          <p className="empty-state">No overdue tasks! 🎉</p>
        ) : (
          <div className="task-list">
            {overdueTasks.map(task => (
              <div key={task.id} className="task-item overdue">
                <div className="task-name">{task.name}</div>
                <div className="task-meta">
                  <span className={`priority-badge ${task.priority}`}>{task.priority}</span>
                  <span className="due-date">Due: {task.due_date}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
