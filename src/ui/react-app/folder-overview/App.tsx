import React, { useState, useEffect } from 'react';

interface Folder {
  id: string;
  name: string;
  lists: Array<{ id: string; name: string; taskCount: number; openTasks: number; closedTasks: number }>;
  totalTasks: number;
}

export default function App() {
  const [folder, setFolder] = useState<Folder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setFolder({
        id: '1',
        name: 'Frontend Development',
        lists: [
          { id: 'l1', name: 'React Components', taskCount: 15, openTasks: 5, closedTasks: 10 },
          { id: 'l2', name: 'UI/UX Implementation', taskCount: 22, openTasks: 12, closedTasks: 10 },
          { id: 'l3', name: 'Bug Fixes', taskCount: 8, openTasks: 3, closedTasks: 5 },
          { id: 'l4', name: 'Performance Optimization', taskCount: 12, openTasks: 8, closedTasks: 4 },
          { id: 'l5', name: 'Testing', taskCount: 18, openTasks: 10, closedTasks: 8 },
        ],
        totalTasks: 75
      });
      setLoading(false);
    }, 500);
  }, []);

  if (loading) return <div className="loading">Loading folder...</div>;
  if (!folder) return <div className="error">Folder not found</div>;

  return (
    <div className="app">
      <header>
        <h1>📁 {folder.name}</h1>
        <p>Folder overview with lists and task summaries</p>
      </header>

      <div className="summary-card">
        <div className="summary-item">
          <div className="summary-value">{folder.lists.length}</div>
          <div className="summary-label">Lists</div>
        </div>
        <div className="summary-item">
          <div className="summary-value">{folder.totalTasks}</div>
          <div className="summary-label">Total Tasks</div>
        </div>
        <div className="summary-item">
          <div className="summary-value">{folder.lists.reduce((sum, l) => sum + l.openTasks, 0)}</div>
          <div className="summary-label">Open</div>
        </div>
        <div className="summary-item">
          <div className="summary-value">{folder.lists.reduce((sum, l) => sum + l.closedTasks, 0)}</div>
          <div className="summary-label">Closed</div>
        </div>
      </div>

      <div className="lists-container">
        {folder.lists.map(list => {
          const completion = (list.closedTasks / list.taskCount) * 100;
          return (
            <div key={list.id} className="list-card">
              <div className="list-header">
                <h3>{list.name}</h3>
                <span className="task-count">{list.taskCount} tasks</span>
              </div>
              <div className="progress-section">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${completion}%` }}></div>
                </div>
                <div className="progress-text">{completion.toFixed(0)}% complete</div>
              </div>
              <div className="list-stats">
                <div className="stat">
                  <span className="stat-label">Open:</span>
                  <span className="stat-value open">{list.openTasks}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Closed:</span>
                  <span className="stat-value closed">{list.closedTasks}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #e2e8f0; }
        .app { max-width: 1200px; margin: 0 auto; padding: 2rem; }
        header { margin-bottom: 2rem; }
        header h1 { font-size: 2rem; margin-bottom: 0.5rem; }
        header p { color: #94a3b8; }
        .summary-card { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; background: #1e293b; padding: 2rem; border-radius: 8px; margin-bottom: 2rem; }
        .summary-item { text-align: center; }
        .summary-value { font-size: 2.5rem; font-weight: 700; color: #60a5fa; }
        .summary-label { font-size: 0.875rem; color: #94a3b8; margin-top: 0.25rem; }
        .lists-container { display: grid; gap: 1.5rem; }
        .list-card { background: #1e293b; padding: 1.5rem; border-radius: 8px; border-left: 4px solid #60a5fa; }
        .list-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .list-header h3 { font-size: 1.25rem; }
        .task-count { font-size: 0.875rem; color: #94a3b8; }
        .progress-section { margin-bottom: 1rem; }
        .progress-bar { height: 8px; background: #334155; border-radius: 4px; overflow: hidden; margin-bottom: 0.5rem; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #60a5fa 0%, #34d399 100%); transition: width 0.3s ease; }
        .progress-text { font-size: 0.875rem; color: #94a3b8; }
        .list-stats { display: flex; gap: 2rem; }
        .stat { display: flex; gap: 0.5rem; align-items: center; }
        .stat-label { font-size: 0.875rem; color: #94a3b8; }
        .stat-value { font-weight: 600; }
        .stat-value.open { color: #60a5fa; }
        .stat-value.closed { color: #34d399; }
        .loading, .error { display: flex; justify-content: center; align-items: center; height: 100vh; font-size: 1.25rem; }
      `}</style>
    </div>
  );
}
