import React, { useState, useEffect } from 'react';

interface Task {
  id: string;
  name: string;
  description: string;
  status: string;
  priority: string;
  due_date: string;
  assignees: string[];
  tags: string[];
  custom_fields: Array<{ name: string; value: string }>;
  subtasks: Array<{ id: string; name: string; completed: boolean }>;
  comments: Array<{ id: string; author: string; text: string; timestamp: string }>;
  time_entries: Array<{ id: string; duration: number; user: string; date: string }>;
}

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
  <button className={`tab-button ${active ? 'active' : ''}`} onClick={onClick}>
    {children}
  </button>
);

export default function App() {
  const [task, setTask] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'subtasks' | 'comments' | 'time'>('details');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual MCP tool calls
    setTimeout(() => {
      setTask({
        id: '1',
        name: 'Implement user authentication system',
        description: 'Build a secure authentication system with OAuth2 support, JWT tokens, and password reset functionality.',
        status: 'in progress',
        priority: 'high',
        due_date: '2024-02-20',
        assignees: ['John Doe', 'Jane Smith'],
        tags: ['backend', 'security', 'critical'],
        custom_fields: [
          { name: 'Story Points', value: '8' },
          { name: 'Sprint', value: 'Sprint 5' },
          { name: 'Department', value: 'Engineering' },
        ],
        subtasks: [
          { id: 's1', name: 'Design database schema', completed: true },
          { id: 's2', name: 'Implement OAuth2 flow', completed: true },
          { id: 's3', name: 'Add JWT token generation', completed: false },
          { id: 's4', name: 'Create password reset endpoint', completed: false },
          { id: 's5', name: 'Write unit tests', completed: false },
        ],
        comments: [
          { id: 'c1', author: 'Jane Smith', text: 'Started working on the OAuth2 integration', timestamp: '2024-02-12T10:30:00Z' },
          { id: 'c2', author: 'John Doe', text: 'Database schema looks good, approved!', timestamp: '2024-02-13T14:15:00Z' },
          { id: 'c3', author: 'Jane Smith', text: 'Need to discuss JWT token expiration time with the team', timestamp: '2024-02-14T09:00:00Z' },
        ],
        time_entries: [
          { id: 't1', duration: 7200, user: 'Jane Smith', date: '2024-02-12' },
          { id: 't2', duration: 5400, user: 'John Doe', date: '2024-02-13' },
          { id: 't3', duration: 3600, user: 'Jane Smith', date: '2024-02-14' },
        ],
      });
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return <div className="loading">Loading task details...</div>;
  }

  if (!task) {
    return <div className="error">Task not found</div>;
  }

  const totalTime = task.time_entries.reduce((sum, entry) => sum + entry.duration, 0);
  const completedSubtasks = task.subtasks.filter(st => st.completed).length;

  return (
    <div className="app">
      <header>
        <div className="task-header">
          <h1>{task.name}</h1>
          <div className="task-badges">
            <span className={`status-badge ${task.status}`}>{task.status}</span>
            <span className={`priority-badge ${task.priority}`}>{task.priority}</span>
          </div>
        </div>
        <p className="task-description">{task.description}</p>
      </header>

      <div className="task-meta">
        <div className="meta-item">
          <strong>Due Date:</strong> {task.due_date}
        </div>
        <div className="meta-item">
          <strong>Assignees:</strong> {task.assignees.join(', ')}
        </div>
        <div className="meta-item">
          <strong>Tags:</strong> {task.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
        </div>
      </div>

      <div className="tabs">
        <TabButton active={activeTab === 'details'} onClick={() => setActiveTab('details')}>
          Details & Custom Fields
        </TabButton>
        <TabButton active={activeTab === 'subtasks'} onClick={() => setActiveTab('subtasks')}>
          Subtasks ({completedSubtasks}/{task.subtasks.length})
        </TabButton>
        <TabButton active={activeTab === 'comments'} onClick={() => setActiveTab('comments')}>
          Comments ({task.comments.length})
        </TabButton>
        <TabButton active={activeTab === 'time'} onClick={() => setActiveTab('time')}>
          Time Tracking ({(totalTime / 3600).toFixed(1)}h)
        </TabButton>
      </div>

      <div className="tab-content">
        {activeTab === 'details' && (
          <div className="custom-fields">
            {task.custom_fields.map(field => (
              <div key={field.name} className="field-row">
                <strong>{field.name}:</strong>
                <span>{field.value}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'subtasks' && (
          <div className="subtasks-list">
            {task.subtasks.map(subtask => (
              <div key={subtask.id} className={`subtask-item ${subtask.completed ? 'completed' : ''}`}>
                <input type="checkbox" checked={subtask.completed} readOnly />
                <span>{subtask.name}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'comments' && (
          <div className="comments-list">
            {task.comments.map(comment => (
              <div key={comment.id} className="comment">
                <div className="comment-header">
                  <strong>{comment.author}</strong>
                  <span className="timestamp">{new Date(comment.timestamp).toLocaleString()}</span>
                </div>
                <p>{comment.text}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'time' && (
          <div className="time-entries-list">
            {task.time_entries.map(entry => (
              <div key={entry.id} className="time-entry">
                <div className="time-user">{entry.user}</div>
                <div className="time-duration">{(entry.duration / 3600).toFixed(2)}h</div>
                <div className="time-date">{entry.date}</div>
              </div>
            ))}
            <div className="time-total">
              <strong>Total Time:</strong> {(totalTime / 3600).toFixed(2)} hours
            </div>
          </div>
        )}
      </div>

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #e2e8f0; }
        .app { max-width: 1000px; margin: 0 auto; padding: 2rem; }
        header { margin-bottom: 2rem; }
        .task-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
        .task-header h1 { font-size: 1.75rem; }
        .task-badges { display: flex; gap: 0.5rem; }
        .status-badge, .priority-badge { padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; }
        .status-badge.in.progress { background: #1e40af; color: #93c5fd; }
        .priority-badge.high { background: #9a3412; color: #fdba74; }
        .task-description { color: #94a3b8; line-height: 1.6; }
        .task-meta { display: flex; gap: 2rem; flex-wrap: wrap; margin-bottom: 2rem; padding: 1rem; background: #1e293b; border-radius: 8px; }
        .meta-item { display: flex; gap: 0.5rem; align-items: center; }
        .tag { padding: 0.25rem 0.5rem; background: #334155; border-radius: 4px; font-size: 0.875rem; margin-left: 0.25rem; }
        .tabs { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; border-bottom: 2px solid #334155; }
        .tab-button { padding: 0.75rem 1.5rem; background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 0.875rem; font-weight: 600; border-bottom: 2px solid transparent; margin-bottom: -2px; transition: all 0.2s; }
        .tab-button:hover { color: #e2e8f0; }
        .tab-button.active { color: #60a5fa; border-bottom-color: #60a5fa; }
        .tab-content { background: #1e293b; padding: 1.5rem; border-radius: 8px; min-height: 300px; }
        .custom-fields { display: flex; flex-direction: column; gap: 1rem; }
        .field-row { display: flex; justify-content: space-between; padding: 0.75rem; background: #334155; border-radius: 6px; }
        .subtasks-list { display: flex; flex-direction: column; gap: 0.75rem; }
        .subtask-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; background: #334155; border-radius: 6px; }
        .subtask-item.completed { opacity: 0.6; text-decoration: line-through; }
        .comments-list { display: flex; flex-direction: column; gap: 1rem; }
        .comment { padding: 1rem; background: #334155; border-radius: 6px; }
        .comment-header { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
        .timestamp { font-size: 0.75rem; color: #64748b; }
        .time-entries-list { display: flex; flex-direction: column; gap: 0.75rem; }
        .time-entry { display: grid; grid-template-columns: 1fr auto auto; gap: 1rem; padding: 0.75rem; background: #334155; border-radius: 6px; }
        .time-total { margin-top: 1rem; padding: 1rem; background: #334155; border-radius: 6px; font-size: 1.125rem; }
        .loading, .error { display: flex; justify-content: center; align-items: center; height: 100vh; font-size: 1.25rem; }
      `}</style>
    </div>
  );
}
