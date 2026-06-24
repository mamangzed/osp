/**
 * Todo App Frontend
 * Using OSP Browser SDK (WebSocket + Protobuf)
 */

// Initialize OSP client
const osp = new OSP.OSPBrowserClient({
  url: 'ws://192.168.110.5:9421', // WebSocket URL
  token: 'your-secret-token'
});

// Todo state
const todos = new Map();

// DOM elements
const statusEl = document.getElementById('status');
const statusTextEl = document.getElementById('statusText');
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const totalTodosEl = document.getElementById('totalTodos');
const completedTodosEl = document.getElementById('completedTodos');
const pendingTodosEl = document.getElementById('pendingTodos');

// Event handlers
addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTodo();
});

// OSP event handlers
osp.on('patch', handlePatch);
osp.on('delete', handleDelete);
osp.on('error', (error) => {
  console.error('[OSP Error]', error);
});

// Connect to OSP
async function init() {
  try {
    await osp.connect();
    updateStatus('Connected', true);

    // Subscribe to collections
    await osp.subscribe('todos');
    await osp.subscribe('stats');

    console.log('[App] Subscribed to collections');

  } catch (error) {
    console.error('[App] Failed to connect:', error);
    updateStatus('Disconnected', false);
  }
}

// Add new todo
async function addTodo() {
  const title = todoInput.value.trim();
  if (!title) return;

  const todoId = `todo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  try {
    // Send to OSP (worker will process it)
    await osp.set('todos', todoId, {
      title,
      completed: false,
      status: 'pending'
    });

    // Clear input
    todoInput.value = '';

    console.log('[App] Todo added:', todoId);

  } catch (error) {
    console.error('[App] Failed to add todo:', error);
    alert('Failed to add todo: ' + error.message);
  }
}

// Handle PATCH from OSP
function handlePatch(data) {
  const { collection, recordId, fields } = data;

  if (collection === 'todos') {
    const todo = todos.get(recordId) || { id: recordId };
    Object.assign(todo, fields);
    todos.set(recordId, todo);

    renderTodos();
    updateStats();

    console.log('[App] Todo updated:', recordId, fields);
  }

  if (collection === 'stats') {
    console.log('[App] Stats updated:', fields);
  }
}

// Handle DELETE from OSP
function handleDelete(data) {
  const { collection, recordId } = data;

  if (collection === 'todos') {
    todos.delete(recordId);
    renderTodos();
    updateStats();

    console.log('[App] Todo deleted:', recordId);
  }
}

// Toggle todo completion
async function toggleTodo(todoId) {
  const todo = todos.get(todoId);
  if (!todo) return;

  try {
    await osp.set('todos', todoId, {
      completed: !todo.completed
    });

    console.log('[App] Todo toggled:', todoId);

  } catch (error) {
    console.error('[App] Failed to toggle todo:', error);
  }
}

// Delete todo
async function deleteTodo(todoId) {
  if (!confirm('Delete this todo?')) return;

  try {
    await osp.delete('todos', todoId);
    console.log('[App] Todo deleted:', todoId);

  } catch (error) {
    console.error('[App] Failed to delete todo:', error);
  }
}

// Render todo list
function renderTodos() {
  if (todos.size === 0) {
    todoList.innerHTML = '<li class="empty-state">No todos yet. Add one above!</li>';
    return;
  }

  const todoArray = Array.from(todos.values())
    .sort((a, b) => b.createdAt - a.createdAt);

  todoList.innerHTML = todoArray.map(todo => {
    const statusClass = todo.status || 'pending';
    const completedClass = todo.completed ? 'completed' : '';

    return `
      <li class="todo-item ${completedClass}">
        <input
          type="checkbox"
          class="todo-checkbox"
          ${todo.completed ? 'checked' : ''}
          onchange="toggleTodo('${todo.id}')"
        />
        <span class="todo-text">${escapeHtml(todo.title)}</span>
        <span class="todo-status ${statusClass}">${statusClass}</span>
        <button class="todo-delete" onclick="deleteTodo('${todo.id}')">Delete</button>
      </li>
    `;
  }).join('');
}

// Update stats
function updateStats() {
  const total = todos.size;
  const completed = Array.from(todos.values()).filter(t => t.completed).length;
  const pending = total - completed;

  totalTodosEl.textContent = total;
  completedTodosEl.textContent = completed;
  pendingTodosEl.textContent = pending;
}

// Update connection status
function updateStatus(text, connected) {
  statusTextEl.textContent = text;
  statusEl.className = `status ${connected ? 'connected' : 'disconnected'}`;
}

// Escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Make functions available globally
window.toggleTodo = toggleTodo;
window.deleteTodo = deleteTodo;

// Start the app
init();
