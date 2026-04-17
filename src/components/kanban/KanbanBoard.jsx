import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { mockTags, mockUsers, initialData } from '../../data/mockData';
import { Calendar, MessageSquare, CheckSquare, Plus, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';

const TaskCard = ({ task, index }) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`glass-card animate-fade-in ${snapshot.isDragging ? 'dragging' : ''}`}
          style={{
            padding: '16px',
            marginBottom: '12px',
            userSelect: 'none',
            ...provided.draggableProps.style,
          }}
        >
          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
              {task.tags.map(tag => (
                <span 
                  key={tag.id} 
                  style={{ 
                    background: `${tag.color}20`, 
                    color: tag.color,
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '600'
                  }}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
          
          <h4 style={{ margin: '0 0 8px 0', fontSize: '15px', color: 'var(--text-primary)' }}>
            {task.title}
          </h4>
          
          {task.description && (
            <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {task.description}
            </p>
          )}

          {/* Footer of Card: Due Date, Comments count, Subtasks, Assignees */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', borderTop: '1px solid var(--glass-border)', paddingTop: '10px' }}>
            <div style={{ display: 'flex', gap: '12px', color: 'var(--text-muted)' }}>
              {task.dueDate && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: new Date(task.dueDate) < new Date() ? 'var(--danger)' : 'var(--text-muted)' }}>
                  <Calendar size={14} />
                  <span>{format(new Date(task.dueDate), 'MMM d')}</span>
                </div>
              )}
              {task.comments && task.comments.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                  <MessageSquare size={14} />
                  <span>{task.comments.length}</span>
                </div>
              )}
              {task.subtasks && task.subtasks.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                  <CheckSquare size={14} />
                  <span>{task.subtasks.filter(st => st.isCompleted).length}/{task.subtasks.length}</span>
                </div>
              )}
            </div>

            {/* Assignees */}
            {task.assignees && task.assignees.length > 0 && (
              <div style={{ display: 'flex' }}>
                {task.assignees.map((assignee, i) => (
                  <img 
                    key={assignee.id}
                    src={assignee.avatar}
                    alt={assignee.name}
                    style={{
                      width: '24px', height: '24px', borderRadius: '50%',
                      marginLeft: i > 0 ? '-8px' : '0',
                      border: '2px solid var(--bg-tertiary)'
                    }}
                    title={assignee.name}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

const BoardColumn = ({ column, tasks }) => {
  return (
    <div 
      className="glass-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '320px',
        minWidth: '320px',
        borderRadius: 'var(--rounded-lg)',
        padding: '16px',
        height: '100%',
        maxHeight: 'calc(100vh - 120px)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '16px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {column.title}
          <span style={{ fontSize: '12px', background: 'var(--bg-primary)', padding: '2px 8px', borderRadius: '12px', color: 'var(--text-secondary)' }}>
            {tasks.length}
          </span>
        </h3>
        <button style={{ color: 'var(--text-muted)' }}><MoreHorizontal size={18} /></button>
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              flexGrow: 1,
              minHeight: '100px',
              paddingBottom: '20px',
              overflowY: 'auto',
              overflowX: 'hidden',
              transition: 'background-color 0.2s ease',
              backgroundColor: snapshot.isDraggingOver ? 'var(--bg-secondary)' : 'transparent',
              borderRadius: 'var(--rounded-md)',
            }}
          >
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <button 
        style={{
          display: 'flex', alignItems: 'center', gap: '8px', 
          width: '100%', padding: '12px', marginTop: '8px',
          color: 'var(--text-muted)', background: 'transparent',
          borderRadius: 'var(--rounded-md)',
          transition: 'all 0.2s'
        }}
        onMouseOver={e => { e.currentTarget.style.background = 'var(--bg-secondary)'; e.currentTarget.style.color = 'var(--text-primary)' }}
        onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)' }}
      >
        <Plus size={16} /> Add a card
      </button>
    </div>
  );
};

export default function KanbanBoard() {
  const [data, setData] = useState(initialData);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    // Moving within the same column
    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = { ...start, taskIds: newTaskIds };

      setData({
        ...data,
        columns: { ...data.columns, [newColumn.id]: newColumn },
      });
      return;
    }

    // Moving from one column to another
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = { ...start, taskIds: startTaskIds };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = { ...finish, taskIds: finishTaskIds };

    setData({
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    });
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', marginBottom: '4px' }}>{data.board.title}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Manage your tasks effectively with drag and drop.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {/* Avatar Stack for Shared Board */}
          <div style={{ display: 'flex', alignItems: 'center', marginRight: '16px' }}>
             {Object.values(mockUsers).map((user, i) => (
                <img 
                  key={user.id} src={user.avatar} title={user.name} alt={user.name}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid var(--bg-primary)', marginLeft: i > 0 ? '-10px' : '0' }}
                />
             ))}
             <button style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px dashed var(--text-muted)', marginLeft: '-10px', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>+</button>
          </div>
          <button style={{ padding: '8px 16px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--rounded-md)', color: 'white' }}>Settings</button>
          <button style={{ padding: '8px 16px', background: 'var(--accent-primary)', borderRadius: 'var(--rounded-md)', color: 'white', fontWeight: '500' }}>Share</button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: 'flex', gap: '20px', flexGrow: 1, overflowX: 'auto', paddingBottom: '20px' }}>
          {data.columnOrder.map((columnId) => {
            const column = data.columns[columnId];
            const tasks = column.taskIds.map(taskId => data.tasks[taskId]);
            return <BoardColumn key={column.id} column={column} tasks={tasks} />;
          })}
          
          <div style={{ minWidth: '320px' }}>
             <button style={{ width: '100%', padding: '16px', background: 'var(--bg-secondary)', border: '1px dashed var(--glass-border)', borderRadius: 'var(--rounded-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                <Plus size={18} /> Add another list
             </button>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
}
