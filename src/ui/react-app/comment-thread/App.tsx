import React, { useState, useEffect } from 'react';

interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
  replies: Comment[];
}

const CommentItem: React.FC<{ comment: Comment; level: number }> = ({ comment, level }) => (
  <div className="comment" style={{ marginLeft: `${level * 2}rem` }}>
    <div className="comment-header">
      <div className="comment-avatar">{comment.author[0]}</div>
      <div className="comment-meta">
        <strong>{comment.author}</strong>
        <span className="comment-time">{new Date(comment.timestamp).toLocaleString()}</span>
      </div>
    </div>
    <div className="comment-text">{comment.text}</div>
    {comment.replies.length > 0 && (
      <div className="comment-replies">
        {comment.replies.map(reply => (
          <CommentItem key={reply.id} comment={reply} level={level + 1} />
        ))}
      </div>
    )}
  </div>
);

export default function App() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [taskName, setTaskName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setTaskName('Implement user authentication system');
      setComments([
        {
          id: 'c1',
          author: 'Jane Smith',
          text: 'Started working on the OAuth2 integration. Looking good so far!',
          timestamp: '2024-02-12T10:30:00Z',
          replies: [
            {
              id: 'c1-r1',
              author: 'John Doe',
              text: 'Great! Make sure to add proper error handling for token refresh.',
              timestamp: '2024-02-12T11:00:00Z',
              replies: [
                {
                  id: 'c1-r1-r1',
                  author: 'Jane Smith',
                  text: 'Will do! Already added retry logic with exponential backoff.',
                  timestamp: '2024-02-12T11:15:00Z',
                  replies: []
                }
              ]
            },
            {
              id: 'c1-r2',
              author: 'Bob Johnson',
              text: 'Also remember to test with different OAuth providers.',
              timestamp: '2024-02-12T14:30:00Z',
              replies: []
            }
          ]
        },
        {
          id: 'c2',
          author: 'John Doe',
          text: 'Database schema looks good, approved! Just one suggestion: consider adding an index on the email column for faster lookups.',
          timestamp: '2024-02-13T14:15:00Z',
          replies: [
            {
              id: 'c2-r1',
              author: 'Jane Smith',
              text: 'Good catch! Added the index. Also added a unique constraint.',
              timestamp: '2024-02-13T15:00:00Z',
              replies: []
            }
          ]
        },
        {
          id: 'c3',
          author: 'Alice Williams',
          text: 'Need to discuss JWT token expiration time with the team. Current setting of 1 hour seems too short for our use case.',
          timestamp: '2024-02-14T09:00:00Z',
          replies: [
            {
              id: 'c3-r1',
              author: 'John Doe',
              text: "Let's schedule a quick call to discuss. I think we should keep access tokens short but implement refresh tokens.",
              timestamp: '2024-02-14T09:30:00Z',
              replies: []
            },
            {
              id: 'c3-r2',
              author: 'Jane Smith',
              text: 'Agreed. I can implement refresh token rotation for better security.',
              timestamp: '2024-02-14T10:00:00Z',
              replies: []
            }
          ]
        },
        {
          id: 'c4',
          author: 'Bob Johnson',
          text: 'Completed code review. Everything looks solid. Just a few minor style suggestions in the PR comments.',
          timestamp: '2024-02-15T16:00:00Z',
          replies: []
        }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) return <div className="loading">Loading comments...</div>;

  return (
    <div className="app">
      <header>
        <h1>💬 Comment Thread</h1>
        <h2>{taskName}</h2>
        <p>{comments.length} comments</p>
      </header>

      <div className="comments-container">
        {comments.map(comment => (
          <CommentItem key={comment.id} comment={comment} level={0} />
        ))}
      </div>

      <div className="new-comment-section">
        <textarea placeholder="Add a comment..." className="comment-input"></textarea>
        <button className="submit-button">Post Comment</button>
      </div>

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #e2e8f0; }
        .app { max-width: 900px; margin: 0 auto; padding: 2rem; }
        header { margin-bottom: 2rem; }
        header h1 { font-size: 2rem; margin-bottom: 0.5rem; }
        header h2 { font-size: 1.25rem; color: #94a3b8; margin-bottom: 0.25rem; }
        header p { color: #64748b; font-size: 0.875rem; }
        .comments-container { display: flex; flex-direction: column; gap: 1.5rem; margin-bottom: 2rem; }
        .comment { background: #1e293b; padding: 1.5rem; border-radius: 8px; border-left: 3px solid #60a5fa; }
        .comment-header { display: flex; gap: 1rem; margin-bottom: 1rem; }
        .comment-avatar { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0; }
        .comment-meta { flex: 1; }
        .comment-meta strong { display: block; margin-bottom: 0.25rem; }
        .comment-time { font-size: 0.75rem; color: #64748b; }
        .comment-text { line-height: 1.6; color: #e2e8f0; }
        .comment-replies { margin-top: 1rem; display: flex; flex-direction: column; gap: 1rem; }
        .new-comment-section { background: #1e293b; padding: 1.5rem; border-radius: 8px; }
        .comment-input { width: 100%; min-height: 100px; padding: 1rem; background: #334155; border: 1px solid #475569; border-radius: 6px; color: #e2e8f0; font-family: inherit; font-size: 0.875rem; resize: vertical; margin-bottom: 1rem; }
        .submit-button { padding: 0.75rem 2rem; background: #3b82f6; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
        .submit-button:hover { background: #2563eb; }
        .loading { display: flex; justify-content: center; align-items: center; height: 100vh; font-size: 1.25rem; }
      `}</style>
    </div>
  );
}
