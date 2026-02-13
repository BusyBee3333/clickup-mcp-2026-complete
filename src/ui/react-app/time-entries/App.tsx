import React, { useState, useEffect } from 'react';

interface TimeEntry {
  id: string;
  user: string;
  task: string;
  taskId: string;
  duration: number;
  date: string;
  description: string;
  billable: boolean;
}

export default function App() {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [filterUser, setFilterUser] = useState<string>('all');
  const [filterBillable, setFilterBillable] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setEntries([
        { id: '1', user: 'John Doe', task: 'API Integration', taskId: 'T-123', duration: 12600, date: '2024-02-15', description: 'Integrated payment gateway API', billable: true },
        { id: '2', user: 'Jane Smith', task: 'UI Design', taskId: 'T-124', duration: 7200, date: '2024-02-15', description: 'Designed new dashboard layout', billable: true },
        { id: '3', user: 'Bob Johnson', task: 'Code Review', taskId: 'T-125', duration: 5400, date: '2024-02-15', description: 'Reviewed pull requests', billable: false },
        { id: '4', user: 'Alice Williams', task: 'Testing', taskId: 'T-126', duration: 14400, date: '2024-02-14', description: 'QA testing for new features', billable: true },
        { id: '5', user: 'John Doe', task: 'Database Optimization', taskId: 'T-127', duration: 9000, date: '2024-02-14', description: 'Optimized database queries', billable: true },
        { id: '6', user: 'Jane Smith', task: 'Team Meeting', taskId: 'T-128', duration: 3600, date: '2024-02-14', description: 'Sprint planning meeting', billable: false },
        { id: '7', user: 'Bob Johnson', task: 'Documentation', taskId: 'T-129', duration: 7200, date: '2024-02-13', description: 'Updated API documentation', billable: true },
        { id: '8', user: 'Alice Williams', task: 'Bug Fixes', taskId: 'T-130', duration: 10800, date: '2024-02-13', description: 'Fixed critical production bugs', billable: true },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const filteredEntries = entries.filter(entry => {
    if (filterUser !== 'all' && entry.user !== filterUser) return false;
    if (filterBillable === 'billable' && !entry.billable) return false;
    if (filterBillable === 'non-billable' && entry.billable) return false;
    return true;
  });

  const totalHours = filteredEntries.reduce((sum, entry) => sum + entry.duration, 0) / 3600;
  const billableHours = filteredEntries.filter(e => e.billable).reduce((sum, entry) => sum + entry.duration, 0) / 3600;

  const uniqueUsers = Array.from(new Set(entries.map(e => e.user)));

  if (loading) return <div className="loading">Loading time entries...</div>;

  return (
    <div className="app">
      <header>
        <h1>⏰ Time Entries</h1>
        <p>Detailed time entry list with task associations</p>
      </header>

      <div className="summary">
        <div className="summary-item">
          <span className="summary-label">Total Hours:</span>
          <span className="summary-value">{totalHours.toFixed(2)}h</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Billable:</span>
          <span className="summary-value billable">{billableHours.toFixed(2)}h</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Non-Billable:</span>
          <span className="summary-value non-billable">{(totalHours - billableHours).toFixed(2)}h</span>
        </div>
      </div>

      <div className="controls">
        <select value={filterUser} onChange={(e) => setFilterUser(e.target.value)}>
          <option value="all">All Users</option>
          {uniqueUsers.map(user => <option key={user} value={user}>{user}</option>)}
        </select>
        <select value={filterBillable} onChange={(e) => setFilterBillable(e.target.value)}>
          <option value="all">All Entries</option>
          <option value="billable">Billable Only</option>
          <option value="non-billable">Non-Billable Only</option>
        </select>
      </div>

      <div className="entries-table">
        <div className="table-header">
          <div>User</div>
          <div>Task</div>
          <div>Description</div>
          <div>Duration</div>
          <div>Date</div>
          <div>Billable</div>
        </div>
        {filteredEntries.map(entry => (
          <div key={entry.id} className="table-row">
            <div className="cell-user">{entry.user}</div>
            <div className="cell-task">
              <div className="task-name">{entry.task}</div>
              <div className="task-id">{entry.taskId}</div>
            </div>
            <div className="cell-description">{entry.description}</div>
            <div className="cell-duration">{(entry.duration / 3600).toFixed(2)}h</div>
            <div className="cell-date">{entry.date}</div>
            <div className="cell-billable">
              {entry.billable ? 
                <span className="badge billable">✓ Billable</span> : 
                <span className="badge non-billable">○ Non-Billable</span>
              }
            </div>
          </div>
        ))}
      </div>

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #e2e8f0; }
        .app { max-width: 1400px; margin: 0 auto; padding: 2rem; }
        header { margin-bottom: 2rem; }
        header h1 { font-size: 2rem; margin-bottom: 0.5rem; }
        header p { color: #94a3b8; }
        .summary { display: flex; gap: 2rem; background: #1e293b; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem; }
        .summary-item { display: flex; flex-direction: column; gap: 0.25rem; }
        .summary-label { font-size: 0.875rem; color: #94a3b8; }
        .summary-value { font-size: 1.5rem; font-weight: 700; }
        .summary-value.billable { color: #34d399; }
        .summary-value.non-billable { color: #94a3b8; }
        .controls { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
        .controls select { padding: 0.75rem 1rem; background: #1e293b; border: 1px solid #334155; color: #e2e8f0; border-radius: 6px; cursor: pointer; }
        .entries-table { background: #1e293b; border-radius: 8px; overflow: hidden; }
        .table-header, .table-row { display: grid; grid-template-columns: 150px 200px 1fr 100px 120px 140px; padding: 1rem; gap: 1rem; }
        .table-header { background: #334155; font-weight: 600; border-bottom: 2px solid #475569; }
        .table-row { border-bottom: 1px solid #334155; transition: background 0.2s; }
        .table-row:hover { background: #2d3748; }
        .cell-user { font-weight: 600; }
        .task-name { font-weight: 600; }
        .task-id { font-size: 0.75rem; color: #64748b; }
        .cell-description { color: #94a3b8; font-size: 0.875rem; }
        .cell-duration { font-weight: 600; color: #60a5fa; }
        .cell-date { font-size: 0.875rem; color: #94a3b8; }
        .badge { padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600; white-space: nowrap; }
        .badge.billable { background: #065f46; color: #6ee7b7; }
        .badge.non-billable { background: #334155; color: #94a3b8; }
        .loading { display: flex; justify-content: center; align-items: center; height: 100vh; font-size: 1.25rem; }
      `}</style>
    </div>
  );
}
