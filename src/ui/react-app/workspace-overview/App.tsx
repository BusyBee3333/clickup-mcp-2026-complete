import React, { useState, useEffect } from 'react';

interface WorkspaceStats {
  name: string;
  spaces: number;
  lists: number;
  tasks: number;
  members: number;
  activeProjects: number;
  completionRate: number;
  recentActivity: Array<{
    id: string;
    user: string;
    action: string;
    target: string;
    timestamp: string;
  }>;
  topSpaces: Array<{
    id: string;
    name: string;
    taskCount: number;
    completion: number;
  }>;
}

export default function App() {
  const [stats, setStats] = useState<WorkspaceStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setStats({
        name: 'Acme Corporation',
        spaces: 12,
        lists: 48,
        tasks: 327,
        members: 24,
        activeProjects: 15,
        completionRate: 68,
        recentActivity: [
          { id: '1', user: 'John Doe', action: 'completed', target: 'API Integration', timestamp: '2 minutes ago' },
          { id: '2', user: 'Jane Smith', action: 'commented on', target: 'Design System', timestamp: '15 minutes ago' },
          { id: '3', user: 'Bob Johnson', action: 'created', target: 'Bug Fix Sprint', timestamp: '1 hour ago' },
          { id: '4', user: 'Alice Williams', action: 'assigned', target: 'Security Audit to John', timestamp: '2 hours ago' },
          { id: '5', user: 'Charlie Brown', action: 'updated', target: 'Project Timeline', timestamp: '3 hours ago' },
        ],
        topSpaces: [
          { id: 's1', name: 'Product Development', taskCount: 89, completion: 72 },
          { id: 's2', name: 'Marketing', taskCount: 56, completion: 65 },
          { id: 's3', name: 'Engineering', taskCount: 112, completion: 58 },
          { id: 's4', name: 'Design', taskCount: 42, completion: 81 },
          { id: 's5', name: 'Operations', taskCount: 28, completion: 75 },
        ]
      });
      setLoading(false);
    }, 500);
  }, []);

  if (loading) return <div className="loading">Loading workspace...</div>;
  if (!stats) return <div className="error">Workspace not found</div>;

  return (
    <div className="app">
      <header>
        <h1>🏢 {stats.name}</h1>
        <p>High-level workspace statistics and activity</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🚀</div>
          <div className="stat-value">{stats.spaces}</div>
          <div className="stat-label">Spaces</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-value">{stats.lists}</div>
          <div className="stat-label">Lists</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{stats.tasks}</div>
          <div className="stat-label">Tasks</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-value">{stats.members}</div>
          <div className="stat-label">Members</div>
        </div>
      </div>

      <div className="overview-grid">
        <div className="card large">
          <h2>Active Projects</h2>
          <div className="big-stat">{stats.activeProjects}</div>
          <p className="card-description">Projects currently in progress</p>
        </div>
        <div className="card large">
          <h2>Completion Rate</h2>
          <div className="big-stat">{stats.completionRate}%</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${stats.completionRate}%` }}></div>
          </div>
        </div>
      </div>

      <div className="content-grid">
        <div className="card">
          <h2>Top Spaces by Task Count</h2>
          <div className="spaces-list">
            {stats.topSpaces.map(space => (
              <div key={space.id} className="space-item">
                <div className="space-info">
                  <div className="space-name">{space.name}</div>
                  <div className="space-meta">
                    <span>{space.taskCount} tasks</span>
                    <span>{space.completion}% complete</span>
                  </div>
                </div>
                <div className="space-progress">
                  <div className="mini-progress-bar">
                    <div className="mini-progress-fill" style={{ width: `${space.completion}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            {stats.recentActivity.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className="activity-avatar">{activity.user[0]}</div>
                <div className="activity-content">
                  <div className="activity-text">
                    <strong>{activity.user}</strong> {activity.action} <span className="activity-target">{activity.target}</span>
                  </div>
                  <div className="activity-time">{activity.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #e2e8f0; }
        .app { max-width: 1400px; margin: 0 auto; padding: 2rem; }
        header { margin-bottom: 2rem; }
        header h1 { font-size: 2rem; margin-bottom: 0.5rem; }
        header p { color: #94a3b8; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
        .stat-card { background: #1e293b; padding: 1.5rem; border-radius: 8px; text-align: center; }
        .stat-icon { font-size: 2.5rem; margin-bottom: 0.5rem; }
        .stat-value { font-size: 2.5rem; font-weight: 700; color: #60a5fa; margin-bottom: 0.25rem; }
        .stat-label { font-size: 0.875rem; color: #94a3b8; }
        .overview-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
        .content-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 1.5rem; }
        .card { background: #1e293b; padding: 1.5rem; border-radius: 8px; }
        .card.large { padding: 2rem; }
        .card h2 { font-size: 1.125rem; margin-bottom: 1rem; }
        .card-description { color: #94a3b8; font-size: 0.875rem; margin-top: 0.5rem; }
        .big-stat { font-size: 3.5rem; font-weight: 700; color: #10b981; margin-bottom: 1rem; }
        .progress-bar { height: 12px; background: #334155; border-radius: 6px; overflow: hidden; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #10b981 0%, #34d399 100%); transition: width 0.3s ease; }
        .spaces-list { display: flex; flex-direction: column; gap: 1rem; }
        .space-item { padding: 1rem; background: #334155; border-radius: 6px; }
        .space-info { margin-bottom: 0.5rem; }
        .space-name { font-weight: 600; margin-bottom: 0.25rem; }
        .space-meta { display: flex; gap: 1rem; font-size: 0.75rem; color: #94a3b8; }
        .mini-progress-bar { height: 4px; background: #475569; border-radius: 2px; overflow: hidden; }
        .mini-progress-fill { height: 100%; background: #60a5fa; transition: width 0.3s ease; }
        .activity-list { display: flex; flex-direction: column; gap: 1rem; }
        .activity-item { display: flex; gap: 1rem; padding: 1rem; background: #334155; border-radius: 6px; }
        .activity-avatar { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0; }
        .activity-content { flex: 1; min-width: 0; }
        .activity-text { margin-bottom: 0.25rem; }
        .activity-target { color: #60a5fa; }
        .activity-time { font-size: 0.75rem; color: #64748b; }
        .loading, .error { display: flex; justify-content: center; align-items: center; height: 100vh; font-size: 1.25rem; }
      `}</style>
    </div>
  );
}
