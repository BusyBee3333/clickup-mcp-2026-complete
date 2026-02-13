import React, { useState, useEffect } from 'react';

interface Task {
  id: string;
  name: string;
  due_date: string;
  priority: string;
  status: string;
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setTasks([
        { id: '1', name: 'Project proposal', due_date: '2024-02-15', priority: 'high', status: 'in progress' },
        { id: '2', name: 'Design review', due_date: '2024-02-14', priority: 'medium', status: 'open' },
        { id: '3', name: 'Critical bug fix', due_date: '2024-02-12', priority: 'urgent', status: 'in progress' },
        { id: '4', name: 'Documentation update', due_date: '2024-02-18', priority: 'low', status: 'open' },
        { id: '5', name: 'Team meeting', due_date: '2024-02-16', priority: 'medium', status: 'open' },
        { id: '6', name: 'API refactor', due_date: '2024-02-20', priority: 'high', status: 'open' },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const getTasksForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return tasks.filter(task => task.due_date.startsWith(dateStr));
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: startingDayOfWeek }, (_, i) => i);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  if (loading) return <div className="loading">Loading calendar...</div>;

  return (
    <div className="app">
      <header>
        <h1>📅 Calendar View</h1>
        <p>Tasks organized by due date</p>
      </header>

      <div className="calendar-header">
        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}>
          ←
        </button>
        <h2>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}>
          →
        </button>
      </div>

      <div className="calendar">
        <div className="day-header">Sun</div>
        <div className="day-header">Mon</div>
        <div className="day-header">Tue</div>
        <div className="day-header">Wed</div>
        <div className="day-header">Thu</div>
        <div className="day-header">Fri</div>
        <div className="day-header">Sat</div>

        {blanks.map(blank => <div key={`blank-${blank}`} className="day blank"></div>)}
        
        {days.map(day => {
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
          const dayTasks = getTasksForDate(date);
          const isToday = date.toDateString() === new Date().toDateString();
          
          return (
            <div key={day} className={`day ${isToday ? 'today' : ''}`}>
              <div className="day-number">{day}</div>
              <div className="day-tasks">
                {dayTasks.map(task => (
                  <div key={task.id} className={`task-item priority-${task.priority}`}>
                    {task.name}
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
        .app { max-width: 1400px; margin: 0 auto; padding: 2rem; }
        header { margin-bottom: 2rem; }
        header h1 { font-size: 2rem; margin-bottom: 0.5rem; }
        header p { color: #94a3b8; }
        .calendar-header { display: flex; justify-content: space-between; align-items: center; background: #1e293b; padding: 1rem 2rem; border-radius: 8px; margin-bottom: 1.5rem; }
        .calendar-header button { background: #334155; border: none; color: #e2e8f0; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font-size: 1.25rem; }
        .calendar-header button:hover { background: #475569; }
        .calendar-header h2 { font-size: 1.5rem; }
        .calendar { display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; background: #334155; border-radius: 8px; overflow: hidden; }
        .day-header { background: #1e293b; padding: 1rem; text-align: center; font-weight: 600; font-size: 0.875rem; }
        .day { background: #1e293b; padding: 0.75rem; min-height: 120px; }
        .day.blank { background: #0f172a; }
        .day.today { background: #1e3a5f; border: 2px solid #3b82f6; }
        .day-number { font-weight: 600; margin-bottom: 0.5rem; }
        .day-tasks { display: flex; flex-direction: column; gap: 0.25rem; }
        .task-item { font-size: 0.75rem; padding: 0.25rem 0.5rem; border-radius: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; cursor: pointer; }
        .task-item.priority-urgent { background: #991b1b; color: #fca5a5; }
        .task-item.priority-high { background: #9a3412; color: #fdba74; }
        .task-item.priority-medium { background: #854d0e; color: #fde047; }
        .task-item.priority-low { background: #14532d; color: #86efac; }
        .loading { display: flex; justify-content: center; align-items: center; height: 100vh; font-size: 1.25rem; }
      `}</style>
    </div>
  );
}
