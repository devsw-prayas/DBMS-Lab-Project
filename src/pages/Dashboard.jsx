import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import KanbanBoard from '../components/kanban/KanbanBoard'
import { LayoutDashboard, LogOut, Bell, Search, Plus } from 'lucide-react'
import { initialData } from '../data/mockData'

export default function Dashboard() {
  const { user, logout } = useAuth()

  // Local Storage State Management
  const [boardsState, setBoardsState] = useState(() => {
    try {
      const saved = localStorage.getItem('mykanban_boards');
      if (saved) return JSON.parse(saved);
    } catch (e) { console.error('Failed to parse boards from localstorage'); }
    
    // Default mock board
    return { [initialData.board.id]: initialData };
  });

  const [activeBoardId, setActiveBoardId] = useState(initialData.board.id);

  // Sync state to local storage automatically
  useEffect(() => {
    localStorage.setItem('mykanban_boards', JSON.stringify(boardsState));
  }, [boardsState]);

  const updateBoard = (newData) => {
    setBoardsState(prev => ({ ...prev, [newData.board.id]: newData }));
  };

  const createBlankBoard = () => {
    const title = window.prompt("Enter new board name:");
    if (!title || title.trim() === '') return;

    const id = 'board-' + Date.now();
    const newBoard = {
      board: { id, title },
      tasks: {},
      columns: {},
      columnOrder: []
    };

    setBoardsState(prev => ({ ...prev, [id]: newBoard }));
    setActiveBoardId(id);
  };

  const activeBoardData = boardsState[activeBoardId];

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', background: 'var(--bg-primary)' }}>
      
      {/* Sidebar Navigation - Minimalist */}
      <aside style={{ width: '220px', background: 'var(--bg-secondary)', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '28px', height: '28px', background: 'var(--text-primary)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bg-primary)', fontWeight: 'bold', fontSize: '14px' }}>M</div>
          <h1 style={{ fontSize: '16px', margin: 0, fontWeight: '600', letterSpacing: '-0.3px', color: 'var(--text-primary)' }}>MyKanban</h1>
        </div>
        
        <nav style={{ flexGrow: 1, padding: '16px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingLeft: '8px', paddingRight: '8px' }}>
             <p style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px', margin: 0 }}>Your Boards</p>
             <button onClick={createBlankBoard} style={{ color: 'var(--text-secondary)' }}><Plus size={14} /></button>
          </div>

          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {Object.values(boardsState).map(b => (
              <li key={b.board.id}>
                <button 
                  onClick={() => setActiveBoardId(b.board.id)}
                  style={{ 
                    width: '100%', textAlign: 'left', padding: '8px 10px', 
                    background: activeBoardId === b.board.id ? 'var(--bg-tertiary)' : 'transparent',
                    borderRadius: 'var(--rounded-md)', 
                    color: activeBoardId === b.board.id ? 'var(--text-primary)' : 'var(--text-secondary)', 
                    display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '500', fontSize: '13px' 
                  }}
                >
                  <LayoutDashboard size={16} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.board.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        <div style={{ padding: '20px', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <img src={user?.avatar || 'https://i.pravatar.cc/150?u=current_user'} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border-color)' }} alt="User" />
            <div style={{ overflow: 'hidden' }}>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: '500', whiteSpace: 'nowrap', textOverflow: 'ellipsis', color: 'var(--text-primary)' }}>{user?.name || user?.email || 'Guest'}</p>
              <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>Pro Plan</p>
            </div>
          </div>
          <button onClick={logout} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '8px', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', borderRadius: 'var(--rounded-md)', fontSize: '13px', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.color = 'var(--danger)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flexGrow: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        
        {/* Top Header - Minimalist */}
        <header style={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-primary)', flexShrink: 0 }}>
          
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', borderRadius: 'var(--rounded-md)', padding: '6px 12px', width: '280px', border: '1px solid var(--border-color)' }}>
            <Search size={16} color="var(--text-muted)" style={{ marginRight: '8px' }} />
            <input type="text" placeholder="Search tasks, tags..." style={{ width: '100%', fontSize: '13px', background: 'transparent' }} />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button style={{ position: 'relative', padding: '8px' }}>
              <Bell size={18} color="var(--text-secondary)" />
              <span style={{ position: 'absolute', top: '7px', right: '9px', width: '6px', height: '6px', background: 'var(--danger)', borderRadius: '50%' }}></span>
            </button>
          </div>
        </header>

        {/* Board Content Workspace */}
        <div style={{ flexGrow: 1, padding: '32px', overflow: 'hidden', background: 'var(--bg-secondary)' }}>
          {activeBoardData ? (
             <KanbanBoard data={activeBoardData} updateBoard={updateBoard} />
          ) : (
             <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                Select or create a board to get started.
             </div>
          )}
        </div>
        
      </main>
    </div>
  )
}
