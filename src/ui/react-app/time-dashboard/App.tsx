import React, { useState, useEffect } from 'react';

interface TimeData {
  totalHours: number;
  todayHours: number;
  weekHours: number;
  byUser: Array<{ user: string; hours: number }>;
  byProject: Array<{ project: string; hours: number }>;
  recentEntries: Array<{ id: string; user: string; task: string; hours: number; date: string }>;
}

export default function App() {
  const [data, setData] = useState<TimeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setData({
        totalHours: 147.5,
        todayHours: 12.5,
        weekHours: 42.0,
        byUser: [
          { user: 'John Doe', hours: 42.5 },
          { user: 'Jane Smith', hours: 38.0 },
          { user: 'Bob Johnson', hours: 35.5 },
          { user: 'Alice Williams', hours: 31.5 },
        ],
        byProject: [
          { project: 'Product Development', hours: 65.0 },
          { project: 'Bug Fixes', hours: 28.5 },
          { project: 'Research', hours: 22.0 },
          { project: 'Documentation', hours: 18.5 },
          { project: 'Meetings', hours: 13.5 },
        ],
        recentEntries: [
          { id: '1', user: 'John Doe', task: 'API Integration', hours: 3.5, date: '2024-02-15' },
          { id: '2', user: 'Jane Smith', task: 'UI Design', hours: 2.0, date: '2024-02-15' },
          { id: '3', user: 'Bob Johnson', task: 'Code Review', hours: 1.5, date: '2024-02-15' },
          { id: '4', user: 'Alice Williams', task: 'Testing', hours: 4.0, date: '2024-02-14' },
          { id: '5', user: 'John Doe', task: 'Database Optimization', hours: 2.5, date: '2024-02-14' },
        ]
      });
      setLoading(false);
    }, 500);
  }, []);

  if (loading) return <div className="loading">Loading time dashboard...</div>;
  if (!data) return <div className="error">No data available</div>;

  return (
    <div className="app">
      <header>
        <h1>⏱️ Time Tracking Dashboard</h1>
        <p>Overview of time logged across projects and team members</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">⏰</div>
          <div className="stat-value">{data.todayHours}h</div>
          <div className="stat-label">Today</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-value">{data.weekHours}h</div>
          <div className="stat-label">This Week</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-value">{data.totalHours}h</div>
          <div className="stat-label">Total Tracked</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-value">{data.byUser.length}</div>
          <div className="stat-label">Active Users</div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h2>Time by User</h2>
          <div className="chart-list">
            {data.byUser.map(item => (
              <div key={item.user} className="chart-item">
                <div className="chart-label">{item.user}</div>
                <div className="chart-bar-container">
                  <div className="chart-bar" style={{ width: `${(item.hours / Math.max(...data.byUser.map(u => u.hours))) * 100}%` }}></div>
                </div>
                <div className="chart-value">{item.hours}h</div>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <h2>Time by Project</h2>
          <div className="chart-list">
            {data.byProject.map(item => (
              <div key={item.project} className="chart-item">
                <div className="chart-label">{item.project}</div>
                <div className="chart-bar-container">
                  <div className="chart-bar project" style={{ width: `${(item.hours / Math.max(...data.byProject.map(p => p.hours))) * 100}%` }}></div>
                </div>
                <div className="chart-value">{item.hours}h</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="recent-section">
        <h2>Recent Time Entries</h2>
        <div className="entries-list">
          {data.recentEntries.map(entry => (
            <div key={entry.id} className="entry-item">
              <div className="entry-user">{entry.user}</div>
              <div className="entry-task">{entry.task}</div>
              <div className="entry-hours">{entry.hours}h</div>
              <div className="entry-date">{entry.date}</div>
            </div>
          ))}
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
        .stat-icon { font-size: 2rem; margin-bottom: 0.5rem; }
        .stat-value { font-size: 2.5rem; font-weight: 700; color: #60a5fa; margin-bottom: 0.25rem; }
        .stat-label { font-size: 0.875rem; color: #94a3b8; }
        .charts-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
        .chart-card { background: #1e293b; padding: 1.5rem; border-radius: 8px; }
        .chart-card h2 { font-size: 1.25rem; margin-bottom: 1rem; }
        .chart-list { display: flex; flex-direction: column; gap: 0.75rem; }
        .chart-item { display: grid; grid-template-columns: 120px 1fr 60px; gap: 1rem; align-items: center; }
        .chart-label { font-size: 0.875rem; }
        .chart-bar-container { height: 24px; background: #334155; border-radius: 4px; overflow: hidden; }
        .chart-bar { height: 100%; background: linear-gradient(90deg, #60a5fa 0%, #a78bfa 100%); transition: width 0.3s ease; }
        .chart-bar.project { background: linear-gradient(90deg, #34d399 0%, #10b981 100%); }
        .chart-value { font-size: 0.875rem; font-weight: 600; text-align: right; }
        .recent-section { background: #1e293b; padding: 1.5rem; border-radius: 8px; }
        .recent-section h2 { font-size: 1.25rem; margin-bottom: 1rem; }
        .entries-list { display: flex; flex-direction: column; gap: 0.5rem; }
        .entry-item { display: grid; grid-template-columns: 150px 1fr 80px 120px; gap: 1rem; padding: 0.75rem; background: #334155; border-radius: 6px; align-items: center; }
        .entry-user { font-weight: 600; }
        .entry-task { color: #94a3b8; }
        .entry-hours { color: #60a5fa; font-weight: 600; text-align: right; }
        .entry-date { font-size: 0.875rem; color: #64748b; text-align: right; }
        .loading, .error { display: flex; justify-content: center; align-items: center; height: 100vh; font-size: 1.25rem; }
      `}</style>
    </div>
  );
}
