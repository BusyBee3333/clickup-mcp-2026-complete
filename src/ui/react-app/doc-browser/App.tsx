import React, { useState, useEffect } from 'react';

interface Doc {
  id: string;
  name: string;
  content: string;
  author: string;
  lastModified: string;
  tags: string[];
  folder: string;
}

export default function App() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<Doc | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setDocs([
        { id: '1', name: 'API Documentation', content: '# API Documentation\n\nComplete reference for all API endpoints...', author: 'John Doe', lastModified: '2024-02-15', tags: ['api', 'reference'], folder: 'Development' },
        { id: '2', name: 'Project Requirements', content: '# Project Requirements\n\n## Overview\nThis document outlines...', author: 'Jane Smith', lastModified: '2024-02-14', tags: ['requirements', 'planning'], folder: 'Planning' },
        { id: '3', name: 'Design System Guide', content: '# Design System\n\n## Colors\n\n## Typography...', author: 'Bob Johnson', lastModified: '2024-02-13', tags: ['design', 'ui'], folder: 'Design' },
        { id: '4', name: 'Security Best Practices', content: '# Security Guide\n\n1. Authentication\n2. Authorization...', author: 'Alice Williams', lastModified: '2024-02-12', tags: ['security', 'guidelines'], folder: 'Development' },
        { id: '5', name: 'Onboarding Guide', content: '# Welcome!\n\nThis guide will help you get started...', author: 'Charlie Brown', lastModified: '2024-02-11', tags: ['onboarding', 'hr'], folder: 'HR' },
        { id: '6', name: 'Sprint Retrospective', content: '# Sprint 5 Retrospective\n\n## What went well...', author: 'Diana Prince', lastModified: '2024-02-10', tags: ['agile', 'retrospective'], folder: 'Planning' },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const filteredDocs = docs.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return <div className="loading">Loading documents...</div>;

  return (
    <div className="app">
      <div className="sidebar">
        <header>
          <h1>📚 Documents</h1>
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </header>

        <div className="doc-list">
          {filteredDocs.map(doc => (
            <div 
              key={doc.id} 
              className={`doc-item ${selectedDoc?.id === doc.id ? 'active' : ''}`}
              onClick={() => setSelectedDoc(doc)}
            >
              <div className="doc-name">📄 {doc.name}</div>
              <div className="doc-meta">
                <span>{doc.folder}</span>
                <span>{doc.lastModified}</span>
              </div>
              <div className="doc-tags">
                {doc.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
              </div>
            </div>
          ))}
          {filteredDocs.length === 0 && (
            <div className="empty-state">No documents found</div>
          )}
        </div>
      </div>

      <div className="content-area">
        {selectedDoc ? (
          <>
            <div className="doc-header">
              <h2>{selectedDoc.name}</h2>
              <div className="doc-info">
                <span>By {selectedDoc.author}</span>
                <span>Last modified: {selectedDoc.lastModified}</span>
              </div>
            </div>
            <div className="doc-content">
              <pre>{selectedDoc.content}</pre>
            </div>
          </>
        ) : (
          <div className="placeholder">
            <div className="placeholder-icon">📄</div>
            <p>Select a document to view its content</p>
          </div>
        )}
      </div>

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #e2e8f0; }
        .app { display: grid; grid-template-columns: 400px 1fr; height: 100vh; }
        .sidebar { background: #1e293b; border-right: 1px solid #334155; display: flex; flex-direction: column; }
        .sidebar header { padding: 2rem; border-bottom: 1px solid #334155; }
        .sidebar h1 { font-size: 1.5rem; margin-bottom: 1rem; }
        .search-input { width: 100%; padding: 0.75rem; background: #0f172a; border: 1px solid #334155; border-radius: 6px; color: #e2e8f0; font-size: 0.875rem; }
        .doc-list { flex: 1; overflow-y: auto; padding: 1rem; }
        .doc-item { padding: 1rem; background: #334155; border-radius: 6px; margin-bottom: 0.75rem; cursor: pointer; transition: all 0.2s; }
        .doc-item:hover { background: #3f4d63; }
        .doc-item.active { background: #1e40af; }
        .doc-name { font-weight: 600; margin-bottom: 0.5rem; }
        .doc-meta { display: flex; justify-content: space-between; font-size: 0.75rem; color: #94a3b8; margin-bottom: 0.5rem; }
        .doc-tags { display: flex; gap: 0.25rem; flex-wrap: wrap; }
        .tag { padding: 0.25rem 0.5rem; background: #1e293b; border-radius: 4px; font-size: 0.75rem; }
        .content-area { padding: 2rem; overflow-y: auto; }
        .doc-header { margin-bottom: 2rem; }
        .doc-header h2 { font-size: 2rem; margin-bottom: 0.5rem; }
        .doc-info { display: flex; gap: 2rem; font-size: 0.875rem; color: #94a3b8; }
        .doc-content { background: #1e293b; padding: 2rem; border-radius: 8px; }
        .doc-content pre { white-space: pre-wrap; line-height: 1.6; font-family: inherit; }
        .placeholder { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #64748b; }
        .placeholder-icon { font-size: 4rem; margin-bottom: 1rem; }
        .empty-state { text-align: center; padding: 2rem; color: #64748b; }
        .loading { display: flex; justify-content: center; align-items: center; height: 100vh; font-size: 1.25rem; }
      `}</style>
    </div>
  );
}
