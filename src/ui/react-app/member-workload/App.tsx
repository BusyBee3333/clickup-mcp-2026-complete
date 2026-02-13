import React, { useState, useEffect } from 'react';

interface Member {
  id: string;
  name: string;
  avatar: string;
  taskCounts: { total: number; open: number; inProgress: number; overdue: number };
  timeLogged: number;
  capacity: number;
}

export default function App() {
  const [members, setMembers] = useState<Member[]>([]);
  const [sortBy, setSortBy] = useState<'name' | 'tasks' | 'time' | 'overdue'>('tasks');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setMembers([
        { id: '1', name: 'John Doe', avatar: 'JD', taskCounts: { total: 15, open: 5, inProgress: 8, overdue: 2 }, timeLogged: 42.5, capacity: 40 },
        { id: '2', name: 'Jane Smith', avatar: 'JS', taskCounts: { total: 18, open: 6, inProgress: 10, overdue: 2 }, timeLogged: 38.0, capacity: 40 },
        { id: '3', name: 'Bob Johnson', avatar: 'BJ', taskCounts: { total: 12, open: 4, inProgress: 7, overdue: 1 }, timeLogged: 35.5, capacity: 40 },
        { id: '4', name: 'Alice Williams', avatar: 'AW', taskCounts: { total: 14, open: 3, inProgress: 9, overdue: 2 }, timeLogged: 31.5, capacity: 40 },
        { id: '5', name: 'Charlie Brown', avatar: 'CB', taskCounts: { total: 10, open: 2, inProgress: 8, overdue: 0 }, timeLogged: 40.0, capacity: 40 },
        { id: '6', name: 'Diana Prince', avatar: 'DP', taskCounts: { total: 16, open: 5, inProgress: 9, overdue: 2 }, timeLogged: 36.5, capacity: 40 },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const sortedMembers = [...members].sort((a, b) => {
    switch(sortBy) {
      case 'tasks': return b.taskCounts.total - a.taskCounts.total;
      case 'time': return b.timeLogged - a.timeLogged;
      case 'overdue': return b.taskCounts.overdue - a.taskCounts.overdue;
      default: return a.name.localeCompare(b.name);
    }
  });

  if (loading) return <div className="loading">Loading member workload...</div>;

  return (
    <div className="app">
      <header>
        <h1>👥 Member Workload</h1>
        <p>Per-member task counts, time logged, and overdue tasks</p>
      </header>

      <div className="controls">
        <label>
          Sort by:
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
            <option value="name">Name</option>
            <option value="tasks">Task Count</option>
            <option value="time">Time Logged</option>
            <option value="overdue">Overdue Tasks</option>
          </select>
        </label>
      </div>

      <div className="members-grid">
        {sortedMembers.map(member => {
          const capacityPercent = (member.timeLogged / member.capacity) * 100;
          const isOverCapacity = capacityPercent > 100;
          
          return (
            <div key={member.id} className="member-card">
              <div className="member-header">
                <div className="member-avatar">{member.avatar}</div>
                <div className="member-info">
                  <h3>{member.name}</h3>
                  <div className="member-stats-quick">
                    {member.taskCounts.total} tasks • {member.timeLogged}h logged
                  </div>
                </div>
              </div>

              <div className="capacity-section">
                <div className="capacity-header">
                  <span>Capacity</span>
                  <span className={isOverCapacity ? 'over-capacity' : ''}>
                    {member.timeLogged}h / {member.capacity}h
                  </span>
                </div>
                <div className="capacity-bar">
                  <div 
                    className={`capacity-fill ${isOverCapacity ? 'over' : ''}`}
                    style={{ width: `${Math.min(capacityPercent, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="task-breakdown">
                <div className="breakdown-item">
                  <div className="breakdown-label">Open</div>
                  <div className="breakdown-value open">{member.taskCounts.open}</div>
                </div>
                <div className="breakdown-item">
                  <div className="breakdown-label">In Progress</div>
                  <div className="breakdown-value in-progress">{member.taskCounts.inProgress}</div>
                </div>
                <div className="breakdown-item">
                  <div className="breakdown-label">Overdue</div>
                  <div className="breakdown-value overdue">{member.taskCounts.overdue}</div>
                </div>
              </div>

              {member.taskCounts.overdue > 0 && (
                <div className="warning">
                  ⚠️ {member.taskCounts.overdue} overdue task{member.taskCounts.overdue > 1 ? 's' : ''}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #e2e8f0; }
        .app { max-width: 1400px; margin: 0 auto; padding: 2rem; }
        header { margin-bottom: 2rem; }
        header h1 { font-size: 2rem; margin-bottom: 0.5rem; }
        header p { color: #94a3b8; }
        .controls { margin-bottom: 1.5rem; }
        .controls select { padding: 0.75rem 1rem; background: #1e293b; border: 1px solid #334155; color: #e2e8f0; border-radius: 6px; cursor: pointer; margin-left: 0.5rem; }
        .members-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.5rem; }
        .member-card { background: #1e293b; padding: 1.5rem; border-radius: 8px; border-left: 4px solid #60a5fa; }
        .member-header { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
        .member-avatar { width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; font-size: 1.25rem; font-weight: 700; flex-shrink: 0; }
        .member-info { flex: 1; }
        .member-info h3 { font-size: 1.125rem; margin-bottom: 0.25rem; }
        .member-stats-quick { font-size: 0.875rem; color: #94a3b8; }
        .capacity-section { margin-bottom: 1.5rem; }
        .capacity-header { display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.875rem; }
        .over-capacity { color: #ef4444; font-weight: 600; }
        .capacity-bar { height: 8px; background: #334155; border-radius: 4px; overflow: hidden; }
        .capacity-fill { height: 100%; background: linear-gradient(90deg, #60a5fa 0%, #a78bfa 100%); transition: width 0.3s ease; }
        .capacity-fill.over { background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%); }
        .task-breakdown { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1rem; }
        .breakdown-item { text-align: center; padding: 0.75rem; background: #334155; border-radius: 6px; }
        .breakdown-label { font-size: 0.75rem; color: #94a3b8; margin-bottom: 0.25rem; }
        .breakdown-value { font-size: 1.5rem; font-weight: 700; }
        .breakdown-value.open { color: #60a5fa; }
        .breakdown-value.in-progress { color: #a78bfa; }
        .breakdown-value.overdue { color: #ef4444; }
        .warning { padding: 0.75rem; background: rgba(239, 68, 68, 0.1); border: 1px solid #991b1b; border-radius: 6px; color: #fca5a5; font-size: 0.875rem; text-align: center; }
        .loading { display: flex; justify-content: center; align-items: center; height: 100vh; font-size: 1.25rem; }
      `}</style>
    </div>
  );
}
