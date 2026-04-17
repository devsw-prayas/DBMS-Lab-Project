export const mockTags = {
  bug: { id: 'bug', name: 'Bug', color: '#ef4444' },
  feature: { id: 'feature', name: 'Feature', color: '#3b82f6' },
  urgent: { id: 'urgent', name: 'Urgent', color: '#f59e0b' },
  design: { id: 'design', name: 'Design', color: '#10b981' }
};

export const mockUsers = {
  u1: { id: 'u1', name: 'Alice Smith', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
  u2: { id: 'u2', name: 'Bob Jones', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
};

export const initialData = {
  tasks: {
    'task-1': { 
      id: 'task-1', 
      title: 'Design Database Schema', 
      description: 'Create the tables for boards, columns, and tasks, including foreign key relationships.',
      dueDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
      tags: [mockTags.design, mockTags.urgent],
      assignees: [mockUsers.u1],
      subtasks: [
        { id: 'st-1', title: 'Write SQL Script', isCompleted: true },
        { id: 'st-2', title: 'Run constraints check', isCompleted: false },
      ],
      comments: [
        { id: 'c-1', user: mockUsers.u2, content: 'Remember to add cascades.', createdAt: new Date().toISOString() }
      ]
    },
    'task-2': { 
      id: 'task-2', 
      title: 'Configure Drag and Drop', 
      description: 'Use @hello-pangea/dnd for fluid movement between columns.',
      dueDate: null,
      tags: [mockTags.feature],
      assignees: [mockUsers.u2],
      subtasks: [],
      comments: []
    },
    'task-3': { 
      id: 'task-3', 
      title: 'Fix Safari Layout Bug', 
      description: 'The scrollbar is overlapping with the column header in Safari. Need to apply `-webkit-scrollbar` fixes.',
      dueDate: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), // Overdue
      tags: [mockTags.bug, mockTags.urgent],
      assignees: [mockUsers.u1, mockUsers.u2],
      subtasks: [
        { id: 'st-3', title: 'Test on iOS', isCompleted: false },
      ],
      comments: []
    },
    'task-4': { 
      id: 'task-4', 
      title: 'Create Dashboard Layout', 
      description: 'Overview page for all boards.',
      dueDate: new Date().toISOString(),
      tags: [mockTags.design],
      assignees: [],
      subtasks: [],
      comments: []
    },
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'To Do',
      taskIds: ['task-1', 'task-2'],
    },
    'column-2': {
      id: 'column-2',
      title: 'In Progress',
      taskIds: ['task-3'],
    },
    'column-3': {
      id: 'column-3',
      title: 'Review',
      taskIds: ['task-4'],
    },
    'column-4': {
      id: 'column-4',
      title: 'Done',
      taskIds: [],
    },
  },
  // Facilitate reordering of the columns
  columnOrder: ['column-1', 'column-2', 'column-3', 'column-4'],
  board: {
    id: 'board-1',
    title: 'DBMS Project Development',
  }
};
