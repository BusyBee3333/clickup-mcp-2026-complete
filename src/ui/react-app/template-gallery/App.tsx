import React, { useState, useEffect } from 'react';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  tasks: number;
  icon: string;
  color: string;
}

export default function App() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setTemplates([
        { id: '1', name: 'Sprint Planning', description: 'Standard two-week sprint template with planning, execution, and review phases', category: 'Agile', tasks: 15, icon: '🏃', color: '#3b82f6' },
        { id: '2', name: 'Product Launch', description: 'Comprehensive product launch checklist with marketing, engineering, and operations tasks', category: 'Product', tasks: 32, icon: '🚀', color: '#10b981' },
        { id: '3', name: 'Bug Tracking', description: 'Structured bug reporting and resolution workflow', category: 'Engineering', tasks: 8, icon: '🐛', color: '#ef4444' },
        { id: '4', name: 'Content Calendar', description: 'Monthly content planning and publication schedule', category: 'Marketing', tasks: 20, icon: '📅', color: '#a78bfa' },
        { id: '5', name: 'Onboarding Checklist', description: 'New employee onboarding with all necessary setup tasks', category: 'HR', tasks: 18, icon: '👋', color: '#f59e0b' },
        { id: '6', name: 'Design Sprint', description: 'Five-day design sprint methodology for rapid prototyping', category: 'Design', tasks: 25, icon: '🎨', color: '#ec4899' },
        { id: '7', name: 'Sales Pipeline', description: 'Lead tracking and sales funnel management', category: 'Sales', tasks: 12, icon: '💰', color: '#14b8a6' },
        { id: '8', name: 'Event Planning', description: 'Complete event planning from concept to execution', category: 'Operations', tasks: 28, icon: '🎉', color: '#8b5cf6' },
        { id: '9', name: 'Code Review', description: 'Systematic code review process with quality checkpoints', category: 'Engineering', tasks: 10, icon: '👀', color: '#6366f1' },
        { id: '10', name: 'Customer Feedback', description: 'Collect, analyze, and act on customer feedback', category: 'Product', tasks: 14, icon: '💬', color: '#06b6d4' },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const categories = ['all', ...Array.from(new Set(templates.map(t => t.category)))];
  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  if (loading) return <div className="loading">Loading templates...</div>;

  return (
    <div className="app">
      <header>
        <h1>📋 Template Gallery</h1>
        <p>Browse and use pre-built project templates</p>
      </header>

      <div className="filters">
        {categories.map(category => (
          <button
            key={category}
            className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="templates-grid">
        {filteredTemplates.map(template => (
          <div key={template.id} className="template-card" style={{ borderTopColor: template.color }}>
            <div className="template-icon" style={{ background: template.color }}>
              {template.icon}
            </div>
            <div className="template-content">
              <div className="template-header">
                <h3>{template.name}</h3>
                <span className="category-badge" style={{ backgroundColor: `${template.color}20`, color: template.color }}>
                  {template.category}
                </span>
              </div>
              <p className="template-description">{template.description}</p>
              <div className="template-footer">
                <span className="task-count">📝 {template.tasks} tasks</span>
                <button className="use-button" style={{ backgroundColor: template.color }}>
                  Use Template
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="empty-state">No templates found in this category</div>
      )}

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #e2e8f0; }
        .app { max-width: 1400px; margin: 0 auto; padding: 2rem; }
        header { margin-bottom: 2rem; }
        header h1 { font-size: 2rem; margin-bottom: 0.5rem; }
        header p { color: #94a3b8; }
        .filters { display: flex; gap: 0.75rem; margin-bottom: 2rem; flex-wrap: wrap; }
        .filter-btn { padding: 0.75rem 1.5rem; background: #1e293b; border: 1px solid #334155; color: #e2e8f0; border-radius: 6px; cursor: pointer; font-weight: 600; text-transform: capitalize; transition: all 0.2s; }
        .filter-btn:hover { background: #334155; }
        .filter-btn.active { background: #3b82f6; border-color: #3b82f6; color: white; }
        .templates-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.5rem; }
        .template-card { background: #1e293b; border-radius: 8px; overflow: hidden; border-top: 4px solid; transition: transform 0.2s, box-shadow 0.2s; cursor: pointer; }
        .template-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.3); }
        .template-icon { font-size: 3rem; padding: 2rem; text-align: center; }
        .template-content { padding: 0 1.5rem 1.5rem; }
        .template-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; gap: 1rem; }
        .template-header h3 { font-size: 1.25rem; }
        .category-badge { padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600; white-space: nowrap; }
        .template-description { color: #94a3b8; line-height: 1.6; margin-bottom: 1.5rem; min-height: 3rem; }
        .template-footer { display: flex; justify-content: space-between; align-items: center; }
        .task-count { font-size: 0.875rem; color: #94a3b8; }
        .use-button { padding: 0.5rem 1rem; border: none; border-radius: 6px; color: white; font-weight: 600; cursor: pointer; transition: opacity 0.2s; }
        .use-button:hover { opacity: 0.9; }
        .empty-state { text-align: center; padding: 4rem; color: #64748b; font-size: 1.125rem; }
        .loading { display: flex; justify-content: center; align-items: center; height: 100vh; font-size: 1.25rem; }
      `}</style>
    </div>
  );
}
