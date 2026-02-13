import React, { useState, useEffect } from 'react';

interface Space {
  id: string;
  name: string;
  folders: Array<{ id: string; name: string; listCount: number }>;
  lists: Array<{ id: string; name: string; taskCount: number }>;
  members: Array<{ id: string; name: string; role: string }>;
  taskStats: { total: number; open: number; inProgress: number; closed: number };
}

export default function App() {
  const [space, setSpace] = useState<Space | null>(null);
  const [activeTab, setActiveTab] = useState<'folders' | 'lists' | 'members'>('folders');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setSpace({
        id: '1',
        name: 'Product Development',
        folders: [
          { id: 'f1', name: 'Frontend', listCount: 5 },
          { id: 'f2', name: 'Backend', listCount: 7 },
          { id: 'f3', name: 'Design', listCount: 3 },
          { id: 'f4', name: 'QA', listCount: 4 },
        ],
        lists: [
          { id: 'l1', name: 'Sprint Planning', taskCount: 12 },
          { id: 'l2', name: 'Backlog', taskCount: 45 },
          { id: 'l3', name: 'Bugs', taskCount: 8 },
        ],
        members: [
          { id: 'm1', name: 'John Doe', role: 'Admin' },
          { id: 'm2', name: 'Jane Smith', role: 'Member' },
          { id: 'm3', name: 'Bob Johnson', role: 'Member' },
          { id: 'm4', name: 'Alice Williams', role: 'Guest' },
        ],
        taskStats: { total: 65, open: 25, inProgress: 18, closed: 22 }
      });
      setLoading(false);
    }, 500);
  }, []);

  if (loading) return <div className="loading">Loading space...</div>;
  if (!space) return <div className="error">Space not found</div>;

  return (
    <div className="app">
      <header>
        <h1>🚀 {space.name}</h1>
        <p>Space overview with folders, lists, and team members</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Tasks</div>
          <div className="stat-value">{space.taskStats.total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Open</div>
          <div className="stat-value" style={{color: '#60a5fa'}}>{space.taskStats.open}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">In Progress</div>
          <div className="stat-value" style={{color: '#a78bfa'}}>{space.taskStats.inProgress}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Closed</div>
          <div className="stat-value" style={{color: '#34d399'}}>{space.taskStats.closed}</div>
        </div>
      </div>

      <div className="tabs">
        <button className={activeTab === 'folders' ? 'active' : ''} onClick={() => setActiveTab('folders')}>
          📁 Folders ({space.folders.length})
        </button>
        <button className={activeTab === 'lists' ? 'active' : ''} onClick={() => setActiveTab('lists')}>
          📋 Lists ({space.lists.length})
        </button>
        <button className={activeTab === 'members' ? 'active' : ''} onClick={() => setActiveTab('members')}>
          👥 Members ({space.members.length})
        </button>
      </div>

      <div className="content">
        {activeTab === 'folders' && (
          <div className="grid">
            {space.folders.map(folder => (
              <div key={folder.id} className="card">
                <div className="card-icon">📁</div>
                <div className="card-title">{folder.name}</div>
                <div className="card-subtitle">{folder.listCount} lists</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'lists' && (
          <div className="grid">
            {space.lists.map(list => (
              <div key={list.id} className="card">
                <div className="card-icon">📋</div>
                <div className="card-title">{list.name}</div>
                <div className="card-subtitle">{list.taskCount} tasks</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'members' && (
          <div className="members-list">
            {space.members.map(member => (
              <div key={member.id} className="member-item">
                <div className="member-avatar">{member.name[0]}</div>
                <div className="member-info">
                  <div className="member-name">{member.name}</div>
                  <div className="member-role">{member.role}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #e2e8f0; }
        .app { max-width: 1200px; margin: 0 auto; padding: 2rem; }
        header { margin-bottom: 2rem; }
        header h1 { font-size: 2rem; margin-bottom: 0.5rem; }
        header p { color: #94a3b8; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
        .stat-card { background: #1e293b; padding: 1.5rem; border-radius: 8px; }
        .stat-label { font-size: 0.875rem; color: #94a3b8; margin-bottom: 0.5rem; }
        .stat-value { font-size: 2rem; font-weight: 700; }
        .tabs { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; border-bottom: 2px solid #334155; }
        .tabs button { padding: 0.75rem 1.5rem; background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 0.875rem; font-weight: 600; border-bottom: 2px solid transparent; margin-bottom: -2px; transition: all 0.2s; }
        .tabs button:hover { color: #e2e8f0; }
        .tabs button.active { color: #60a5fa; border-bottom-color: #60a5fa; }
        .content { background: #1e293b; padding: 1.5rem; border-radius: 8px; min-height: 300px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
        .card { background: #334155; padding: 1.5rem; border-radius: 8px; text-align: center; cursor: pointer; transition: transform 0.2s; }
        .card:hover { transform: translateY(-4px); }
        .card-icon { font-size: 2.5rem; margin-bottom: 0.5rem; }
        .card-title { font-weight: 600; margin-bottom: 0.25rem; }
        .card-subtitle { font-size: 0.875rem; color: #94a3b8; }
        .members-list { display: flex; flex-direction: column; gap: 1rem; }
        .member-item { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: #334155; border-radius: 8px; }
        .member-avatar { width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; font-size: 1.25rem; font-weight: 600; }
        .member-info { flex: 1; }
        .member-name { font-weight: 600; }
        .member-role { font-size: 0.875rem; color: #94a3b8; }
        .loading, .error { display: flex; justify-content: center; align-items: center; height: 100vh; font-size: 1.25rem; }
      `}</style>
    </div>
  );
}
