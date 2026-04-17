import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

const TaskCard = ({ task, columnId, onRightClick }) => {
  return (
    <div
      onContextMenu={(e) => onRightClick(e, task.id, columnId)}
      style={{
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--rounded-md)',
        padding: '12px',
        marginBottom: '8px',
        cursor: 'context-menu',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)', wordBreak: 'break-word' }}>
        {task.title}
      </h4>
      
      {task.description && (
        <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', wordBreak: 'break-word' }}>
          {task.description}
        </p>
      )}

      {/* Tags Minimalist */}
      {task.tags && task.tags.length > 0 && (
        <div style={{ display: 'flex', gap: '4px', marginBottom: '10px', flexWrap: 'wrap' }}>
          {task.tags.map(tag => (
            <span 
              key={tag.id} 
              style={{ 
                border: `1px solid ${tag.color}40`, 
                color: tag.color,
                padding: '2px 6px',
                borderRadius: 'var(--rounded-sm)',
                fontSize: '10px',
                fontWeight: '500'
              }}
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          {task.dueDate && <span>Due: {format(new Date(task.dueDate), 'MMM d')}</span>}
        </div>
        
        {task.assignees && task.assignees.length > 0 && (
          <div style={{ display: 'flex' }}>
            {task.assignees.map((assignee, i) => (
              <img 
                key={assignee.id}
                src={assignee.avatar}
                alt={assignee.name}
                style={{
                  width: '20px', height: '20px', borderRadius: '50%',
                  marginLeft: i > 0 ? '-6px' : '0',
                  border: '1px solid var(--bg-primary)'
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const BoardColumn = ({ column, tasks, onRightClick, onAddTask }) => {
  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '280px',
        minWidth: '280px',
        flexShrink: 0,
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--rounded-lg)',
        padding: '12px',
        height: '100%',
        maxHeight: 'calc(100vh - 120px)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', padding: '0 4px' }}>
        <h3 style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {column.title} <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>({tasks.length})</span>
        </h3>
      </div>

      <div style={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} columnId={column.id} onRightClick={onRightClick} />
        ))}
      </div>

      <button 
        onClick={() => onAddTask(column.id)}
        style={{
          width: '100%', padding: '8px', marginTop: '8px',
          color: 'var(--text-muted)', background: 'transparent',
          border: '1px dashed var(--border-color)',
          borderRadius: 'var(--rounded-md)', fontSize: '13px'
        }}
      >
        + Add Card
      </button>
    </div>
  );
};

export default function KanbanBoard({ data, updateBoard }) {
  const [contextMenu, setContextMenu] = useState(null); // { x, y, taskId, columnId }

  // Global click to close context menu
  useEffect(() => {
    const closeMenu = () => setContextMenu(null);
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, []);

  const handleRightClick = (e, taskId, columnId) => {
    e.preventDefault(); // Stop native browser menu
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      taskId,
      columnId
    });
  };

  const moveTask = (targetColumnId) => {
    if (!contextMenu) return;
    const { taskId, columnId: sourceColumnId } = contextMenu;
    
    if (sourceColumnId === targetColumnId) {
      setContextMenu(null);
      return;
    }

    const startCol = data.columns[sourceColumnId];
    const finishCol = data.columns[targetColumnId];

    const startTaskIds = Array.from(startCol.taskIds);
    startTaskIds.splice(startTaskIds.indexOf(taskId), 1);
    const newStart = { ...startCol, taskIds: startTaskIds };

    const finishTaskIds = Array.from(finishCol.taskIds);
    finishTaskIds.push(taskId); // Move to bottom
    const newFinish = { ...finishCol, taskIds: finishTaskIds };

    updateBoard({
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    });

    setContextMenu(null);
  };

  const deleteTask = () => {
    if (!contextMenu) return;
    const { taskId, columnId } = contextMenu;
    
    const col = data.columns[columnId];
    const newTaskIds = col.taskIds.filter(id => id !== taskId);
    
    const newTasks = { ...data.tasks };
    delete newTasks[taskId];

    updateBoard({
      ...data,
      columns: { ...data.columns, [col.id]: { ...col, taskIds: newTaskIds } },
      tasks: newTasks
    });

    setContextMenu(null);
  };

  const addColumn = () => {
    const title = window.prompt("Enter new column name:");
    if (!title || title.trim() === '') return;
    
    const id = 'col-' + Date.now();
    updateBoard({
      ...data,
      columns: {
        ...data.columns,
        [id]: { id, title, taskIds: [] }
      },
      columnOrder: [...data.columnOrder, id]
    });
  };

  const addTask = (columnId) => {
    const title = window.prompt("Enter task title:");
    if (!title || title.trim() === '') return;

    const id = 'task-' + Date.now();
    const newTask = {
      id,
      title,
      description: '',
      tags: [],
      assignees: [],
      subtasks: [],
      comments: []
    };

    const col = data.columns[columnId];
    updateBoard({
      ...data,
      tasks: { ...data.tasks, [id]: newTask },
      columns: { ...data.columns, [col.id]: { ...col, taskIds: [...col.taskIds, id] } }
    });
  };

  const clearBoard = () => {
    if(window.confirm("Are you sure you want to clear this board completely?")) {
      updateBoard({
        ...data,
        tasks: {},
        columns: {},
        columnOrder: []
      });
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header Minimalist */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' }}>{data.board.title}</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={clearBoard} style={{ padding: '6px 12px', background: 'transparent', color: 'var(--danger)', border: '1px solid var(--danger)', borderRadius: 'var(--rounded-md)', fontSize: '13px' }}>Clear</button>
          <button style={{ padding: '6px 12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--rounded-md)', fontSize: '13px' }}>Settings</button>
          <button style={{ padding: '6px 12px', background: 'var(--text-primary)', color: 'var(--bg-primary)', border: 'none', borderRadius: 'var(--rounded-md)', fontSize: '13px', fontWeight: '500' }}>Share</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', flexGrow: 1, overflowX: 'auto', paddingBottom: '16px' }}>
        {data.columnOrder.map((columnId) => {
          const column = data.columns[columnId];
          const tasks = column.taskIds.map(taskId => data.tasks[taskId]);
          return <BoardColumn key={column.id} column={column} tasks={tasks} onRightClick={handleRightClick} onAddTask={addTask} />;
        })}

        <div style={{ minWidth: '280px' }}>
           <button 
              onClick={addColumn}
              style={{ width: '100%', padding: '16px', background: 'var(--bg-primary)', border: '1px dashed var(--border-color)', borderRadius: 'var(--rounded-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '14px', transition: 'all 0.2s ease' }}
           >
              + Add a custom list
           </button>
        </div>
      </div>

      {/* Floating Context Menu */}
      {contextMenu && (
        <div 
          className="context-menu" 
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ padding: '4px 8px', fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Move To</div>
          {data.columnOrder.filter(id => id !== contextMenu.columnId).map(colId => (
            <button 
              key={colId} 
              className="context-menu-item"
              onClick={() => moveTask(colId)}
            >
              {data.columns[colId].title}
            </button>
          ))}
          {data.columnOrder.length <= 1 && (
            <div style={{ padding: '4px 8px', fontSize: '11px', color: 'var(--text-muted)' }}>No other columns</div>
          )}
          <div style={{ borderTop: '1px solid var(--border-color)', margin: '4px 0' }}></div>
          <button 
            className="context-menu-item" 
            style={{ color: 'var(--danger)' }}
            onClick={deleteTask}
          >
            Delete Task
          </button>
        </div>
      )}

    </div>
  );
}
