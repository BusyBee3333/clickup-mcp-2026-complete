import React, { useState, useEffect } from 'react';

interface Task {
  id: string;
  name: string;
  status: string;
  priority: string;
  assignee: string;
  due_date: string;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

export default function App() {
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data
    setTimeout(() => {
      const mockTasks: Task[] = [
        { id: '1', name: 'Complete project proposal', status: 'To Do', priority: 'high', assignee: 'John Doe', due_date: '2024-02-15' },
        { id: '2', name: 'Review design mockups', status: 'To Do', priority: 'medium', assignee: 'Jane Smith', due_date: '2024-02-14' },
        { id: '3', name: 'Fix critical bug', status: 'In Progress', priority: 'urgent', assignee: 'Alice Williams', due_date: '2024-02-12' },
        { id: '4', name: 'Refactor API endpoints', status: 'In Progress', priority: 'high', assignee: 'Jane Smith', due_date: '2024-02-18' },
        { id: '5', name: 'Update documentation', status: 'In Review', priority: 'low', assignee: 'Bob Johnson', due_date: '2024-02-10' },
        { id: '6', name: 'Deploy to staging', status: 'Done', priority: 'medium', assignee: 'John Doe', due_date: '2024-02-08' },
        { id: '7', name: 'Write unit tests', status: 'To Do', priority: 'medium', assignee: 'Bob Johnson', due_date: '2024-02-20' },
      ];

      const statuses = ['To Do', 'In Progress', 'In Review', 'Done'];
      const cols = statuses.map(status => ({
        id: status,
        title: status,
        tasks: mockTasks.filter(task => task.status === status)
      }));
      setColumns(cols);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return <div className="loading">Loading board...</div>;
  }

  return (
    <div className="app">
      <header>
        <h1>📊 Task Board</h1>
        <p>Kanban board view organized by status</p>
      </header>

      <div className="board">
        {columns.map(column => (
          <div key={column.id} className="column">
            <div className="column-header">
              <h3>{column.title}</h3>
              <span className="task-count">{column.tasks.length}</span>
            </div>
            <div className="task-list">
              {column.tasks.map(task => (
                <div key={task.id} className={`task-card priority-${task.priority}`}>
                  <div className="task-title">{task.name}</div>
                  <div className="task-meta">
                    <span className={`priority-badge ${task.priority}`}>{task.priority}</span>
                    <span className="assignee">👤 {task.assignee}</span>
                  </div>
                  <div className="task-due">📅 {task.due_date}</div>
                </div>
              ))}
              {column.tasks.length === 0 && (
                <div className="empty-column">No tasks</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #e2e8f0; }
        .app { padding: 2rem; }
        header { margin-bottom: 2rem; }
        header h1 { font-size: 2rem; margin-bottom: 0.5rem; }
        header p { color: #94a3b8; }
        .board { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; }
        .column { background: #1e293b; border-radius: 8px; padding: 1rem; min-height: 400px; display: flex; flex-direction: column; }
        .column-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 2px solid #334155; }
        .column-header h3 { font-size: 1.125rem; }
        .task-count { background: #334155; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.875rem; font-weight: 600; }
        .task-list { display: flex; flex-direction: column; gap: 0.75rem; flex: 1; }
        .task-card { background: #334155; padding: 1rem; border-radius: 6px; border-left: 3px solid; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; }
        .task-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
        .task-card.priority-urgent { border-left-color: #ef4444; }
        .task-card.priority-high { border-left-color: #f97316; }
        .task-card.priority-medium { border-left-color: #eab308; }
        .task-card.priority-low { border-left-color: #22c55e; }
        .task-title { font-weight: 600; margin-bottom: 0.5rem; }
        .task-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; font-size: 0.875rem; }
        .priority-badge { padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; }
        .priority-badge.urgent { background: #991b1b; color: #fca5a5; }
        .priority-badge.high { background: #9a3412; color: #fdba74; }
        .priority-badge.medium { background: #854d0e; color: #fde047; }
        .priority-badge.low { background: #14532d; color: #86efac; }
        .assignee { color: #94a3b8; }
        .task-due { font-size: 0.75rem; color: #64748b; }
        .empty-column { text-align: center; padding: 2rem; color: #64748b; }
        .loading { display: flex; justify-content: center; align-items: center; height: 100vh; font-size: 1.25rem; }
      `}</style>
    </div>
  );
}
