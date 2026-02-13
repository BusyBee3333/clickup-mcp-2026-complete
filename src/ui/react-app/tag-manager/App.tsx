import React, { useState, useEffect } from 'react';

interface Tag {
  id: string;
  name: string;
  color: string;
  taskCount: number;
  tasks: Array<{ id: string; name: string; status: string }>;
}

export default function App() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setTags([
        {
          id: 't1',
          name: 'urgent',
          color: '#ef4444',
          taskCount: 8,
          tasks: [
            { id: 'task1', name: 'Fix critical production bug', status: 'in progress' },
            { id: 'task2', name: 'Security vulnerability patch', status: 'open' },
            { id: 'task3', name: 'Database migration', status: 'closed' },
          ]
        },
        {
          id: 't2',
          name: 'backend',
          color: '#3b82f6',
          taskCount: 15,
          tasks: [
            { id: 'task4', name: 'API optimization', status: 'in progress' },
            { id: 'task5', name: 'Implement caching', status: 'open' },
            { id: 'task6', name: 'Database schema update', status: 'in progress' },
          ]
        },
        {
          id: 't3',
          name: 'frontend',
          color: '#10b981',
          taskCount: 12,
          tasks: [
            { id: 'task7', name: 'Redesign dashboard', status: 'in progress' },
            { id: 'task8', name: 'Add dark mode', status: 'open' },
            { id: 'task9', name: 'Responsive layout fixes', status: 'closed' },
          ]
        },
        {
          id: 't4',
          name: 'design',
          color: '#a78bfa',
          taskCount: 9,
          tasks: [
            { id: 'task10', name: 'Create design system', status: 'in progress' },
            { id: 'task11', name: 'UI mockups for new feature', status: 'open' },
          ]
        },
        {
          id: 't5',
          name: 'testing',
          color: '#f59e0b',
          taskCount: 11,
          tasks: [
            { id: 'task12', name: 'Write integration tests', status: 'in progress' },
            { id: 'task13', name: 'E2E test coverage', status: 'open' },
            { id: 'task14', name: 'Performance testing', status: 'open' },
          ]
        },
        {
          id: 't6',
          name: 'documentation',
          color: '#6366f1',
          taskCount: 7,
          tasks: [
            { id: 'task15', name: 'API documentation', status: 'in progress' },
            { id: 'task16', name: 'Update README', status: 'closed' },
          ]
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) return <div className="loading">Loading tags...</div>;

  return (
    <div className="app">
      <div className="sidebar">
        <header>
          <h1>🏷️ Tag Manager</h1>
          <p>{tags.length} tags • {tags.reduce((sum, tag) => sum + tag.taskCount, 0)} tasks</p>
        </header>

        <div className="tags-list">
          {tags.map(tag => (
            <div
              key={tag.id}
              className={`tag-item ${selectedTag?.id === tag.id ? 'active' : ''}`}
              onClick={() => setSelectedTag(tag)}
            >
              <div className="tag-color" style={{ backgroundColor: tag.color }}></div>
              <div className="tag-info">
                <div className="tag-name">{tag.name}</div>
                <div className="tag-count">{tag.taskCount} tasks</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="content-area">
        {selectedTag ? (
          <>
            <div className="tag-header">
              <div className="tag-badge" style={{ backgroundColor: selectedTag.color }}>
                {selectedTag.name}
              </div>
              <div className="tag-stats">
                {selectedTag.taskCount} tasks using this tag
              </div>
            </div>

            <div className="tasks-list">
              {selectedTag.tasks.map(task => (
                <div key={task.id} className="task-card">
                  <div className="task-name">{task.name}</div>
                  <span className={`status-badge ${task.status}`}>{task.status}</span>
                </div>
              ))}
            </div>

            <div className="tag-actions">
              <button className="action-button edit">Edit Tag</button>
              <button className="action-button delete">Delete Tag</button>
            </div>
          </>
        ) : (
          <div className="placeholder">
            <div className="placeholder-icon">🏷️</div>
            <p>Select a tag to view associated tasks</p>
          </div>
        )}
      </div>

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #e2e8f0; }
        .app { display: grid; grid-template-columns: 350px 1fr; height: 100vh; }
        .sidebar { background: #1e293b; border-right: 1px solid #334155; display: flex; flex-direction: column; }
        .sidebar header { padding: 2rem; border-bottom: 1px solid #334155; }
        .sidebar h1 { font-size: 1.5rem; margin-bottom: 0.5rem; }
        .sidebar p { color: #94a3b8; font-size: 0.875rem; }
        .tags-list { flex: 1; overflow-y: auto; padding: 1rem; }
        .tag-item { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: #334155; border-radius: 6px; margin-bottom: 0.75rem; cursor: pointer; transition: all 0.2s; }
        .tag-item:hover { background: #3f4d63; }
        .tag-item.active { background: #1e40af; }
        .tag-color { width: 24px; height: 24px; border-radius: 4px; flex-shrink: 0; }
        .tag-info { flex: 1; }
        .tag-name { font-weight: 600; margin-bottom: 0.25rem; }
        .tag-count { font-size: 0.75rem; color: #94a3b8; }
        .content-area { padding: 2rem; overflow-y: auto; }
        .tag-header { margin-bottom: 2rem; }
        .tag-badge { display: inline-block; padding: 0.5rem 1rem; border-radius: 6px; color: white; font-weight: 600; font-size: 1.25rem; margin-bottom: 0.5rem; }
        .tag-stats { color: #94a3b8; font-size: 0.875rem; }
        .tasks-list { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 2rem; }
        .task-card { display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: #1e293b; border-radius: 6px; }
        .task-name { font-weight: 600; }
        .status-badge { padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; white-space: nowrap; }
        .status-badge.open { background: #1e40af; color: #93c5fd; }
        .status-badge.in.progress { background: #7c3aed; color: #c4b5fd; }
        .status-badge.closed { background: #065f46; color: #6ee7b7; }
        .tag-actions { display: flex; gap: 1rem; }
        .action-button { padding: 0.75rem 1.5rem; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .action-button.edit { background: #3b82f6; color: white; }
        .action-button.edit:hover { background: #2563eb; }
        .action-button.delete { background: #334155; color: #e2e8f0; }
        .action-button.delete:hover { background: #ef4444; }
        .placeholder { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #64748b; }
        .placeholder-icon { font-size: 4rem; margin-bottom: 1rem; }
        .loading { display: flex; justify-content: center; align-items: center; height: 100vh; font-size: 1.25rem; }
      `}</style>
    </div>
  );
}
