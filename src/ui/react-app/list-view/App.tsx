import React, { useState, useEffect } from 'react';

interface List {
  id: string;
  name: string;
  description: string;
  tasks: Array<{
    id: string;
    name: string;
    status: string;
    priority: string;
    assignee: string;
    due_date: string;
    tags: string[];
  }>;
}

export default function App() {
  const [list, setList] = useState<List | null>(null);
  const [sortKey, setSortKey] = useState<'name' | 'priority' | 'due_date'>('due_date');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setList({
        id: '1',
        name: 'Sprint 5 - Product Features',
        description: 'Development tasks for the fifth sprint focused on new product features',
        tasks: [
          { id: 't1', name: 'User authentication', status: 'in progress', priority: 'high', assignee: 'John Doe', due_date: '2024-02-15', tags: ['backend', 'security'] },
          { id: 't2', name: 'Payment integration', status: 'open', priority: 'urgent', assignee: 'Jane Smith', due_date: '2024-02-14', tags: ['backend', 'payments'] },
          { id: 't3', name: 'Dashboard UI', status: 'in progress', priority: 'medium', assignee: 'Bob Johnson', due_date: '2024-02-18', tags: ['frontend', 'ui'] },
          { id: 't4', name: 'API documentation', status: 'open', priority: 'low', assignee: 'Alice Williams', due_date: '2024-02-20', tags: ['docs'] },
          { id: 't5', name: 'Database migration', status: 'closed', priority: 'high', assignee: 'John Doe', due_date: '2024-02-12', tags: ['backend', 'database'] },
          { id: 't6', name: 'Email notifications', status: 'in progress', priority: 'medium', assignee: 'Jane Smith', due_date: '2024-02-16', tags: ['backend', 'notifications'] },
        ]
      });
      setLoading(false);
    }, 500);
  }, []);

  if (loading) return <div className="loading">Loading list...</div>;
  if (!list) return <div className="error">List not found</div>;

  const sortedTasks = [...list.tasks].sort((a, b) => {
    if (sortKey === 'due_date') {
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    }
    return a[sortKey] > b[sortKey] ? 1 : -1;
  });

  const statusCounts = list.tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="app">
      <header>
        <h1>📋 {list.name}</h1>
        <p>{list.description}</p>
      </header>

      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-value">{list.tasks.length}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-item">
          <span className="stat-value" style={{color: '#60a5fa'}}>{statusCounts['open'] || 0}</span>
          <span className="stat-label">Open</span>
        </div>
        <div className="stat-item">
          <span className="stat-value" style={{color: '#a78bfa'}}>{statusCounts['in progress'] || 0}</span>
          <span className="stat-label">In Progress</span>
        </div>
        <div className="stat-item">
          <span className="stat-value" style={{color: '#34d399'}}>{statusCounts['closed'] || 0}</span>
          <span className="stat-label">Closed</span>
        </div>
      </div>

      <div className="controls">
        <label>
          Sort by:
          <select value={sortKey} onChange={(e) => setSortKey(e.target.value as any)}>
            <option value="due_date">Due Date</option>
            <option value="priority">Priority</option>
            <option value="name">Name</option>
          </select>
        </label>
      </div>

      <div className="task-table">
        <div className="table-header">
          <div className="col-task">Task</div>
          <div className="col-status">Status</div>
          <div className="col-priority">Priority</div>
          <div className="col-assignee">Assignee</div>
          <div className="col-due">Due Date</div>
          <div className="col-tags">Tags</div>
        </div>
        {sortedTasks.map(task => (
          <div key={task.id} className="table-row">
            <div className="col-task">{task.name}</div>
            <div className="col-status"><span className={`status-badge ${task.status}`}>{task.status}</span></div>
            <div className="col-priority"><span className={`priority-badge ${task.priority}`}>{task.priority}</span></div>
            <div className="col-assignee">{task.assignee}</div>
            <div className="col-due">{task.due_date}</div>
            <div className="col-tags">
              {task.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
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
        .stats-bar { display: flex; gap: 2rem; background: #1e293b; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem; }
        .stat-item { display: flex; flex-direction: column; align-items: center; }
        .stat-value { font-size: 1.75rem; font-weight: 700; }
        .stat-label { font-size: 0.875rem; color: #94a3b8; }
        .controls { margin-bottom: 1rem; }
        .controls select { padding: 0.5rem; background: #1e293b; border: 1px solid #334155; color: #e2e8f0; border-radius: 4px; margin-left: 0.5rem; }
        .task-table { background: #1e293b; border-radius: 8px; overflow: hidden; }
        .table-header, .table-row { display: grid; grid-template-columns: 2fr 1fr 1fr 1.5fr 1fr 1.5fr; padding: 1rem; gap: 1rem; }
        .table-header { background: #334155; font-weight: 600; border-bottom: 2px solid #475569; }
        .table-row { border-bottom: 1px solid #334155; transition: background 0.2s; }
        .table-row:hover { background: #2d3748; }
        .status-badge, .priority-badge { padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; white-space: nowrap; }
        .status-badge.open { background: #1e40af; color: #93c5fd; }
        .status-badge.in.progress { background: #7c3aed; color: #c4b5fd; }
        .status-badge.closed { background: #065f46; color: #6ee7b7; }
        .priority-badge.urgent { background: #991b1b; color: #fca5a5; }
        .priority-badge.high { background: #9a3412; color: #fdba74; }
        .priority-badge.medium { background: #854d0e; color: #fde047; }
        .priority-badge.low { background: #14532d; color: #86efac; }
        .tag { display: inline-block; padding: 0.25rem 0.5rem; background: #334155; border-radius: 4px; font-size: 0.75rem; margin-right: 0.25rem; }
        .loading, .error { display: flex; justify-content: center; align-items: center; height: 100vh; font-size: 1.25rem; }
      `}</style>
    </div>
  );
}
