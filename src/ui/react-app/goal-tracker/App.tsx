import React, { useState, useEffect } from 'react';

interface Goal {
  id: string;
  name: string;
  description: string;
  progress: number;
  target: number;
  unit: string;
  keyResults: Array<{ id: string; name: string; current: number; target: number; unit: string }>;
  dueDate: string;
  owner: string;
}

export default function App() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setGoals([
        {
          id: 'g1',
          name: 'Launch New Product Features',
          description: 'Complete and launch all planned features for Q1 2024',
          progress: 12,
          target: 20,
          unit: 'features',
          dueDate: '2024-03-31',
          owner: 'Product Team',
          keyResults: [
            { id: 'kr1', name: 'User authentication system', current: 100, target: 100, unit: '%' },
            { id: 'kr2', name: 'Payment integration', current: 75, target: 100, unit: '%' },
            { id: 'kr3', name: 'Dashboard redesign', current: 50, target: 100, unit: '%' },
            { id: 'kr4', name: 'Mobile app features', current: 30, target: 100, unit: '%' },
          ]
        },
        {
          id: 'g2',
          name: 'Improve Performance Metrics',
          description: 'Reduce page load time and improve app responsiveness',
          progress: 1500,
          target: 2000,
          unit: 'ms saved',
          dueDate: '2024-02-28',
          owner: 'Engineering Team',
          keyResults: [
            { id: 'kr5', name: 'Reduce initial load time', current: 800, target: 1000, unit: 'ms saved' },
            { id: 'kr6', name: 'Optimize API responses', current: 500, target: 700, unit: 'ms saved' },
            { id: 'kr7', name: 'Implement caching', current: 200, target: 300, unit: 'ms saved' },
          ]
        },
        {
          id: 'g3',
          name: 'Increase Test Coverage',
          description: 'Achieve 80% code coverage across all modules',
          progress: 65,
          target: 80,
          unit: '%',
          dueDate: '2024-03-15',
          owner: 'QA Team',
          keyResults: [
            { id: 'kr8', name: 'Frontend unit tests', current: 70, target: 80, unit: '%' },
            { id: 'kr9', name: 'Backend unit tests', current: 75, target: 85, unit: '%' },
            { id: 'kr10', name: 'Integration tests', current: 50, target: 75, unit: '%' },
          ]
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) return <div className="loading">Loading goals...</div>;

  return (
    <div className="app">
      <header>
        <h1>🎯 Goal Tracker</h1>
        <p>Track goals with key results and progress bars</p>
      </header>

      <div className="goals-list">
        {goals.map(goal => {
          const progressPercent = (goal.progress / goal.target) * 100;
          
          return (
            <div key={goal.id} className="goal-card">
              <div className="goal-header">
                <div>
                  <h2>{goal.name}</h2>
                  <p className="goal-description">{goal.description}</p>
                </div>
                <div className="goal-meta">
                  <div className="goal-owner">👤 {goal.owner}</div>
                  <div className="goal-due">📅 {goal.dueDate}</div>
                </div>
              </div>

              <div className="goal-progress">
                <div className="progress-header">
                  <span className="progress-label">Overall Progress</span>
                  <span className="progress-value">{goal.progress} / {goal.target} {goal.unit}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
                </div>
                <div className="progress-percent">{progressPercent.toFixed(0)}% complete</div>
              </div>

              <div className="key-results">
                <h3>Key Results</h3>
                {goal.keyResults.map(kr => {
                  const krPercent = (kr.current / kr.target) * 100;
                  
                  return (
                    <div key={kr.id} className="key-result">
                      <div className="kr-header">
                        <span className="kr-name">{kr.name}</span>
                        <span className="kr-value">{kr.current} / {kr.target} {kr.unit}</span>
                      </div>
                      <div className="kr-progress-bar">
                        <div className="kr-progress-fill" style={{ width: `${krPercent}%` }}></div>
                      </div>
                    </div>
                  );
                })}
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
        .goals-list { display: flex; flex-direction: column; gap: 2rem; }
        .goal-card { background: #1e293b; padding: 2rem; border-radius: 8px; border-left: 4px solid #7c3aed; }
        .goal-header { display: flex; justify-content: space-between; margin-bottom: 1.5rem; gap: 2rem; }
        .goal-header h2 { font-size: 1.5rem; margin-bottom: 0.5rem; }
        .goal-description { color: #94a3b8; line-height: 1.6; }
        .goal-meta { display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.875rem; color: #94a3b8; white-space: nowrap; }
        .goal-progress { margin-bottom: 2rem; }
        .progress-header { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
        .progress-label { font-weight: 600; }
        .progress-value { color: #94a3b8; }
        .progress-bar { height: 12px; background: #334155; border-radius: 6px; overflow: hidden; margin-bottom: 0.5rem; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #7c3aed 0%, #a78bfa 100%); transition: width 0.3s ease; }
        .progress-percent { font-size: 0.875rem; color: #94a3b8; }
        .key-results h3 { font-size: 1.125rem; margin-bottom: 1rem; }
        .key-result { margin-bottom: 1rem; }
        .kr-header { display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.875rem; }
        .kr-name { font-weight: 600; }
        .kr-value { color: #94a3b8; }
        .kr-progress-bar { height: 6px; background: #334155; border-radius: 3px; overflow: hidden; }
        .kr-progress-fill { height: 100%; background: #60a5fa; transition: width 0.3s ease; }
        .loading { display: flex; justify-content: center; align-items: center; height: 100vh; font-size: 1.25rem; }
      `}</style>
    </div>
  );
}
