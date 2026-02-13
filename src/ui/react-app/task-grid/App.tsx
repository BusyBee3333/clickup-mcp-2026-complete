import React, { useState, useEffect } from 'react';

interface Task {
  id: string;
  name: string;
  status: string;
  priority: string;
  assignee: string;
  due_date: string;
  tags: string[];
}

type SortKey = 'name' | 'status' | 'priority' | 'due_date';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>('due_date');
  const [sortAsc, setSortAsc] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data
    setTimeout(() => {
      setTasks([
        { id: '1', name: 'Complete project proposal', status: 'in progress', priority: 'high', assignee: 'John Doe', due_date: '2024-02-15', tags: ['design', 'planning'] },
        { id: '2', name: 'Review design mockups', status: 'open', priority: 'medium', assignee: 'Jane Smith', due_date: '2024-02-14', tags: ['design'] },
        { id: '3', name: 'Update documentation', status: 'closed', priority: 'low', assignee: 'Bob Johnson', due_date: '2024-02-10', tags: ['docs'] },
        { id: '4', name: 'Fix critical bug', status: 'in progress', priority: 'urgent', assignee: 'Alice Williams', due_date: '2024-02-12', tags: ['bug', 'urgent'] },
        { id: '5', name: 'Team meeting prep', status: 'open', priority: 'medium', assignee: 'John Doe', due_date: '2024-02-16', tags: ['meeting'] },
        { id: '6', name: 'Refactor API endpoints', status: 'in progress', priority: 'high', assignee: 'Jane Smith', due_date: '2024-02-18', tags: ['backend', 'refactor'] },
        { id: '7', name: 'Write unit tests', status: 'open', priority: 'medium', assignee: 'Bob Johnson', due_date: '2024-02-20', tags: ['testing'] },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filterStatus !== 'all' && task.status !== filterStatus) return false;
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
    if (searchTerm && !task.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let aVal = a[sortKey];
    let bVal = b[sortKey];
    if (sortKey === 'due_date') {
      aVal = new Date(a.due_date).getTime();
      bVal = new Date(b.due_date).getTime();
    }
    if (aVal < bVal) return sortAsc ? -1 : 1;
    if (aVal > bVal) return sortAsc ? 1 : -1;
    return 0;
  });

  if (loading) {
    return <div className="loading">Loading tasks...</div>;
  }

  return (
    <div className="app">
      <header>
        <h1>📋 Task Grid</h1>
        <p>Sortable and filterable task list</p>
      </header>

      <div className="controls">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
          <option value="all">All Statuses</option>
          <option value="open">Open</option>
          <option value="in progress">In Progress</option>
          <option value="closed">Closed</option>
        </select>
        <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="filter-select">
          <option value="all">All Priorities</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div className="table-container">
        <table className="task-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')} className="sortable">
                Task Name {sortKey === 'name' && (sortAsc ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('status')} className="sortable">
                Status {sortKey === 'status' && (sortAsc ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('priority')} className="sortable">
                Priority {sortKey === 'priority' && (sortAsc ? '↑' : '↓')}
              </th>
              <th>Assignee</th>
              <th onClick={() => handleSort('due_date')} className="sortable">
                Due Date {sortKey === 'due_date' && (sortAsc ? '↑' : '↓')}
              </th>
              <th>Tags</th>
            </tr>
          </thead>
          <tbody>
            {sortedTasks.map(task => (
              <tr key={task.id}>
                <td className="task-name">{task.name}</td>
                <td><span className={`status-badge ${task.status}`}>{task.status}</span></td>
                <td><span className={`priority-badge ${task.priority}`}>{task.priority}</span></td>
                <td>{task.assignee}</td>
                <td>{task.due_date}</td>
                <td>
                  {task.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {sortedTasks.length === 0 && (
          <div className="empty-state">No tasks match your filters</div>
        )}
      </div>

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #e2e8f0; }
        .app { max-width: 1400px; margin: 0 auto; padding: 2rem; }
        header { margin-bottom: 2rem; }
        header h1 { font-size: 2rem; margin-bottom: 0.5rem; }
        header p { color: #94a3b8; }
        .controls { display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
        .search-input { flex: 1; min-width: 250px; padding: 0.75rem; background: #1e293b; border: 1px solid #334155; border-radius: 6px; color: #e2e8f0; font-size: 0.875rem; }
        .filter-select { padding: 0.75rem 1rem; background: #1e293b; border: 1px solid #334155; border-radius: 6px; color: #e2e8f0; font-size: 0.875rem; cursor: pointer; }
        .table-container { background: #1e293b; border-radius: 8px; overflow-x: auto; }
        .task-table { width: 100%; border-collapse: collapse; }
        .task-table th { padding: 1rem; text-align: left; font-weight: 600; background: #334155; border-bottom: 2px solid #475569; }
        .task-table th.sortable { cursor: pointer; user-select: none; }
        .task-table th.sortable:hover { background: #3f4d63; }
        .task-table td { padding: 1rem; border-bottom: 1px solid #334155; }
        .task-table tr:hover { background: #2d3748; }
        .task-name { font-weight: 600; }
        .status-badge, .priority-badge { padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; white-space: nowrap; }
        .status-badge.open { background: #1e40af; color: #93c5fd; }
        .status-badge.in.progress { background: #7c3aed; color: #c4b5fd; }
        .status-badge.closed { background: #065f46; color: #6ee7b7; }
        .priority-badge.urgent { background: #991b1b; color: #fca5a5; }
        .priority-badge.high { background: #9a3412; color: #fdba74; }
        .priority-badge.medium { background: #854d0e; color: #fde047; }
        .priority-badge.low { background: #14532d; color: #86efac; }
        .tag { display: inline-block; padding: 0.25rem 0.5rem; background: #334155; border-radius: 4px; font-size: 0.75rem; margin-right: 0.25rem; }
        .empty-state { text-align: center; padding: 3rem; color: #64748b; }
        .loading { display: flex; justify-content: center; align-items: center; height: 100vh; font-size: 1.25rem; }
      `}</style>
    </div>
  );
}
