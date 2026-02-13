import React, { useState, useEffect } from 'react';

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

interface Checklist {
  id: string;
  name: string;
  taskName: string;
  items: ChecklistItem[];
}

export default function App() {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setChecklists([
        {
          id: 'cl1',
          name: 'Pre-launch Checklist',
          taskName: 'Product Launch',
          items: [
            { id: 'i1', text: 'Complete security audit', completed: true },
            { id: 'i2', text: 'Run performance tests', completed: true },
            { id: 'i3', text: 'Update documentation', completed: false },
            { id: 'i4', text: 'Prepare marketing materials', completed: false },
            { id: 'i5', text: 'Deploy to production', completed: false },
          ]
        },
        {
          id: 'cl2',
          name: 'Code Review Checklist',
          taskName: 'Feature: User Authentication',
          items: [
            { id: 'i6', text: 'Check code style consistency', completed: true },
            { id: 'i7', text: 'Verify error handling', completed: true },
            { id: 'i8', text: 'Review test coverage', completed: true },
            { id: 'i9', text: 'Check for security vulnerabilities', completed: false },
            { id: 'i10', text: 'Validate edge cases', completed: false },
          ]
        },
        {
          id: 'cl3',
          name: 'Onboarding Tasks',
          taskName: 'New Team Member - John',
          items: [
            { id: 'i11', text: 'Setup development environment', completed: true },
            { id: 'i12', text: 'Grant access to repositories', completed: true },
            { id: 'i13', text: 'Complete security training', completed: true },
            { id: 'i14', text: 'Review codebase architecture', completed: false },
            { id: 'i15', text: 'First code contribution', completed: false },
            { id: 'i16', text: 'Team introduction meeting', completed: true },
          ]
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const toggleItem = (checklistId: string, itemId: string) => {
    setChecklists(checklists.map(cl => {
      if (cl.id === checklistId) {
        return {
          ...cl,
          items: cl.items.map(item =>
            item.id === itemId ? { ...item, completed: !item.completed } : item
          )
        };
      }
      return cl;
    }));
  };

  if (loading) return <div className="loading">Loading checklists...</div>;

  return (
    <div className="app">
      <header>
        <h1>✅ Checklist Manager</h1>
        <p>Manage checklists with item completion tracking</p>
      </header>

      <div className="checklists-container">
        {checklists.map(checklist => {
          const completedCount = checklist.items.filter(item => item.completed).length;
          const totalCount = checklist.items.length;
          const progressPercent = (completedCount / totalCount) * 100;

          return (
            <div key={checklist.id} className="checklist-card">
              <div className="checklist-header">
                <div>
                  <h2>{checklist.name}</h2>
                  <p className="task-name">📝 {checklist.taskName}</p>
                </div>
                <div className="progress-circle">
                  <svg width="60" height="60">
                    <circle cx="30" cy="30" r="25" fill="none" stroke="#334155" strokeWidth="5" />
                    <circle 
                      cx="30" 
                      cy="30" 
                      r="25" 
                      fill="none" 
                      stroke="#10b981" 
                      strokeWidth="5"
                      strokeDasharray={`${2 * Math.PI * 25}`}
                      strokeDashoffset={`${2 * Math.PI * 25 * (1 - progressPercent / 100)}`}
                      transform="rotate(-90 30 30)"
                    />
                  </svg>
                  <div className="progress-text">{Math.round(progressPercent)}%</div>
                </div>
              </div>

              <div className="progress-bar-section">
                <div className="progress-info">
                  <span>{completedCount} of {totalCount} completed</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
                </div>
              </div>

              <div className="items-list">
                {checklist.items.map(item => (
                  <div 
                    key={item.id} 
                    className={`checklist-item ${item.completed ? 'completed' : ''}`}
                    onClick={() => toggleItem(checklist.id, item.id)}
                  >
                    <div className="checkbox">
                      {item.completed && '✓'}
                    </div>
                    <span className="item-text">{item.text}</span>
                  </div>
                ))}
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
        .checklists-container { display: grid; gap: 2rem; }
        .checklist-card { background: #1e293b; padding: 2rem; border-radius: 8px; border-left: 4px solid #10b981; }
        .checklist-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; }
        .checklist-header h2 { font-size: 1.5rem; margin-bottom: 0.5rem; }
        .task-name { color: #94a3b8; font-size: 0.875rem; }
        .progress-circle { position: relative; width: 60px; height: 60px; }
        .progress-text { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 0.875rem; font-weight: 700; }
        .progress-bar-section { margin-bottom: 1.5rem; }
        .progress-info { display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.875rem; color: #94a3b8; }
        .progress-bar { height: 8px; background: #334155; border-radius: 4px; overflow: hidden; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #10b981 0%, #34d399 100%); transition: width 0.3s ease; }
        .items-list { display: flex; flex-direction: column; gap: 0.75rem; }
        .checklist-item { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: #334155; border-radius: 6px; cursor: pointer; transition: all 0.2s; }
        .checklist-item:hover { background: #3f4d63; }
        .checklist-item.completed { opacity: 0.7; }
        .checklist-item.completed .item-text { text-decoration: line-through; color: #64748b; }
        .checkbox { width: 24px; height: 24px; border: 2px solid #64748b; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 1rem; transition: all 0.2s; flex-shrink: 0; }
        .checklist-item.completed .checkbox { background: #10b981; border-color: #10b981; color: white; }
        .item-text { flex: 1; }
        .loading { display: flex; justify-content: center; align-items: center; height: 100vh; font-size: 1.25rem; }
      `}</style>
    </div>
  );
}
