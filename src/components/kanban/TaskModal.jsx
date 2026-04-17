import React, { useState } from 'react';
import { X, Calendar, AlignLeft, CheckSquare, MessageSquare, Tag } from 'lucide-react';

export default function TaskModal({ task, onClose, onUpdateTask }) {
  if (!task) return null;

  // Local state for instant input feeling, though we fire updates upward on blur/change
  const [title, setTitle] = useState(task.title || '');
  const [description, setDescription] = useState(task.description || '');
  const [dueDate, setDueDate] = useState(task.dueDate ? task.dueDate.split('T')[0] : '');
  const [newSubtask, setNewSubtask] = useState('');
  
  // Tag creation state
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#10b981'); // default green

  const handleTitleBlur = () => {
    if (title !== task.title) onUpdateTask({ ...task, title });
  };

  const handleDescBlur = () => {
    if (description !== task.description) onUpdateTask({ ...task, description });
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setDueDate(newDate);
    onUpdateTask({ ...task, dueDate: newDate ? new Date(newDate).toISOString() : null });
  };

  /** Subtask Logic */
  const toggleSubtask = (stId) => {
    const updatedSubtasks = task.subtasks.map(st => 
      st.id === stId ? { ...st, isCompleted: !st.isCompleted } : st
    );
    onUpdateTask({ ...task, subtasks: updatedSubtasks });
  };

  const addSubtask = (e) => {
    e.preventDefault();
    if (!newSubtask.trim()) return;
    
    const newSt = { id: 'st-' + Date.now(), title: newSubtask, isCompleted: false };
    onUpdateTask({ ...task, subtasks: [...(task.subtasks || []), newSt] });
    setNewSubtask('');
  };

  /** Tag Logic */
  const addTag = () => {
    if (!newTagName.trim()) return;
    const newTag = { id: 'tag-' + Date.now(), name: newTagName, color: newTagColor };
    onUpdateTask({ ...task, tags: [...(task.tags || []), newTag] });
    setNewTagName('');
  };

  const removeTag = (tagId) => {
    onUpdateTask({ ...task, tags: task.tags.filter(t => t.id !== tagId) });
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 2000,
      padding: '20px'
    }} onClick={onClose}>
      
      <div style={{
        background: 'var(--bg-primary)',
        width: '100%', maxWidth: '700px',
        maxHeight: '90vh', overflowY: 'auto',
        borderRadius: 'var(--rounded-lg)',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex', flexDirection: 'column'
      }} onClick={e => e.stopPropagation()}>
        
        {/* Header Ribbon */}
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
           <input 
             value={title}
             onChange={e => setTitle(e.target.value)}
             onBlur={handleTitleBlur}
             style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text-primary)', width: '100%', background: 'transparent', outline: 'none', border: 'none' }}
             placeholder="Task Name"
           />
           <button onClick={onClose} style={{ color: 'var(--text-muted)' }}><X size={20} /></button>
        </div>

        <div style={{ padding: '24px', display: 'flex', gap: '32px' }}>
          
          {/* Main Column */}
          <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Description */}
            <div>
              <h3 style={{ fontSize: '15px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <AlignLeft size={16} /> Description
              </h3>
              <textarea 
                value={description}
                onChange={e => setDescription(e.target.value)}
                onBlur={handleDescBlur}
                placeholder="Add a more detailed description..."
                style={{ width: '100%', minHeight: '100px', padding: '12px', borderRadius: 'var(--rounded-md)', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '14px', resize: 'vertical' }}
              />
            </div>

            {/* Checklists */}
            <div>
              <h3 style={{ fontSize: '15px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <CheckSquare size={16} /> Subtasks
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                {(task.subtasks || []).map(st => (
                  <div key={st.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input 
                      type="checkbox" 
                      checked={st.isCompleted} 
                      onChange={() => toggleSubtask(st.id)} 
                      style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                    />
                    <span style={{ fontSize: '14px', color: st.isCompleted ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: st.isCompleted ? 'line-through' : 'none' }}>
                      {st.title}
                    </span>
                  </div>
                ))}
              </div>

              <form onSubmit={addSubtask} style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  value={newSubtask} 
                  onChange={e => setNewSubtask(e.target.value)}
                  placeholder="Add an item"
                  style={{ flexGrow: 1, padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: 'var(--rounded-md)', fontSize: '13px' }}
                />
                <button type="submit" style={{ padding: '8px 16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--rounded-md)', fontSize: '13px' }}>Add</button>
              </form>
            </div>

            {/* Comments Placeholder */}
            <div>
              <h3 style={{ fontSize: '15px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <MessageSquare size={16} /> Activity
              </h3>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}></div>
                <input type="text" placeholder="Write a comment..." style={{ flexGrow: 1, padding: '10px 12px', border: '1px solid var(--border-color)', borderRadius: 'var(--rounded-md)', fontSize: '13px' }} readOnly />
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div style={{ width: '200px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Due Date Editor */}
            <div>
              <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                 <Calendar size={14}/> Due Date
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', padding: '8px', borderRadius: 'var(--rounded-md)', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                <input 
                  type="date" 
                  value={dueDate}
                  onChange={handleDateChange}
                  style={{ fontSize: '13px', color: 'var(--text-primary)', width: '100%', background: 'transparent', border: 'none', outline: 'none' }}
                />
              </div>
            </div>

            {/* Tags Configurator */}
            <div>
              <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                 <Tag size={14}/> Tags & Colors
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px', marginBottom: '12px' }}>
                {(task.tags || []).map(tag => (
                   <span key={tag.id} style={{ display: 'flex', alignItems: 'center', gap: '4px', border: `1px solid ${tag.color}`, background: `${tag.color}15`, color: tag.color, padding: '4px 8px', borderRadius: 'var(--rounded-md)', fontSize: '11px', fontWeight: '500' }}>
                     {tag.name}
                     <button onClick={() => removeTag(tag.id)} style={{ display: 'flex', color: tag.color }}><X size={12} /></button>
                   </span>
                ))}
                {(task.tags || []).length === 0 && <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No tags applied</span>}
              </div>

              {/* Tag Creation Form */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--rounded-md)', padding: '8px' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input 
                    type="color" 
                    value={newTagColor}
                    onChange={e => setNewTagColor(e.target.value)}
                    style={{ width: '24px', height: '24px', padding: 0, border: 'none', cursor: 'pointer', borderRadius: '4px', overflow: 'hidden' }}
                  />
                  <input 
                    type="text"
                    value={newTagName}
                    onChange={e => setNewTagName(e.target.value)}
                    placeholder="New tag label..."
                    style={{ flexGrow: 1, fontSize: '12px', border: '1px solid var(--border-color)', borderRadius: 'var(--rounded-sm)', padding: '2px 6px' }}
                  />
                </div>
                <button 
                  onClick={addTag}
                  style={{ width: '100%', padding: '4px', fontSize: '11px', fontWeight: '500', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--rounded-sm)' }}
                >
                  Create Custom Tag
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
