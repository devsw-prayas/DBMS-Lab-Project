import React from 'react'
import { useAuth } from '../context/AuthContext'
import KanbanBoard from '../components/kanban/KanbanBoard'
import { LayoutDashboard, LogOut, Bell, Search } from 'lucide-react'

export default function Dashboard() {
  const { user, logout } = useAuth()

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', background: 'var(--bg-primary)' }}>
      
      {/* Sidebar Navigation */}
      <aside style={{ width: '250px', background: 'var(--bg-secondary)', borderRight: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', backdropFilter: 'blur(10px)' }}>
        <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, var(--accent-primary), var(--info))', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>S</div>
          <h1 style={{ fontSize: '20px', margin: 0, fontWeight: '600', letterSpacing: '-0.5px' }}>StormBoard</h1>
        </div>
        
        <nav style={{ flexGrow: 1, padding: '16px' }}>
          <p style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '12px', paddingLeft: '12px' }}>Your Boards</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li>
              <button style={{ width: '100%', textAlign: 'left', padding: '10px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--rounded-md)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <LayoutDashboard size={18} className="animate-fade-in" />
                DBMS Project
              </button>
            </li>
          </ul>
        </nav>
        
        <div style={{ padding: '24px', borderTop: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <img src={user?.avatar || 'https://i.pravatar.cc/150?u=current_user'} style={{ width: '36px', height: '36px', borderRadius: '50%' }} alt="User" />
            <div style={{ overflow: 'hidden' }}>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: '500', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{user?.name || user?.email || 'Guest User'}</p>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>Pro Plan</p>
            </div>
          </div>
          <button onClick={logout} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: 'var(--rounded-md)', transition: 'background 0.2s' }}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Top Header */}
        <header style={{ height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', borderBottom: '1px solid var(--glass-border)', background: 'var(--bg-tertiary)', backdropFilter: 'blur(10px)' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-primary)', borderRadius: 'var(--rounded-md)', padding: '8px 16px', width: '300px', border: '1px solid var(--glass-border)' }}>
            <Search size={18} color="var(--text-muted)" style={{ marginRight: '8px' }} />
            <input type="text" placeholder="Search tasks, tags..." style={{ width: '100%', fontSize: '14px' }} />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button style={{ position: 'relative', padding: '8px' }}>
              <Bell size={20} color="var(--text-secondary)" />
              <span style={{ position: 'absolute', top: '6px', right: '8px', width: '8px', height: '8px', background: 'var(--danger)', borderRadius: '50%', boxShadow: '0 0 10px var(--danger)' }}></span>
            </button>
          </div>
        </header>

        {/* Board Content Workspace */}
        <div style={{ flexGrow: 1, padding: '32px', overflow: 'hidden' }}>
          <KanbanBoard />
        </div>
        
      </main>
    </div>
  )
}
