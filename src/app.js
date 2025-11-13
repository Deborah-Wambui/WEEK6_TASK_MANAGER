// src/app.js
import { TimedTask } from './TimedTask.js';
import { loadTasks, saveTasks } from './store.js';
import { renderTasks, updateCounts, applyFilterStyles, enableTaskEditing, updateSearchCount } from './view.js';
import { uid } from './utils.js';

let tasks = loadTasks();
let filter = 'all';
let searchTerm = '';

const els = {
  form: document.getElementById('taskForm'),
  input: document.getElementById('taskInput'),
  dueDateInput: document.getElementById('dueDateInput'),
  list: document.getElementById('taskList'),
  counts: document.getElementById('counts'),
  filterGroup: document.getElementById('filterGroup'),
  clearCompleted: document.getElementById('clearCompleted'),
  searchInput: document.getElementById('searchInput'),
  searchCount: document.getElementById('searchCount')
};

function render() {
  renderTasks(els.list, tasks, filter, searchTerm);
  updateCounts(els.counts, tasks);
  applyFilterStyles(els.filterGroup, filter);
  els.clearCompleted.disabled = !tasks.some(t => t.done);
  
  // Update search count
  const visibleTasks = tasks.filter(t => {
    if (filter === 'active') return !t.done;
    if (filter === 'completed') return t.done;
    return true;
  });
  const matchedTasks = searchTerm ? 
    visibleTasks.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase())) : 
    visibleTasks;
  updateSearchCount(els.searchCount, matchedTasks.length, visibleTasks.length);
}

function addTask(title, dueDate = null) {
  const t = new TimedTask(uid(), title, false, dueDate);
  tasks.push(t);
  saveTasks(tasks);
  render();
}

function toggleTaskById(id) {
  const t = tasks.find(x => x.id === id);
  if (t) {
    t.toggle();
    saveTasks(tasks);
    render();
  }
}

function deleteTaskById(id) {
  tasks = tasks.filter(x => x.id !== id);
  saveTasks(tasks);
  render();
}

function editTaskById(id, newTitle) {
  const task = tasks.find(t => t.id === id);
  if (task && newTitle) {
    task.title = newTitle;
    saveTasks(tasks);
    render();
  }
}

function clearCompleted() {
  tasks = tasks.filter(x => !x.done);
  saveTasks(tasks);
  render();
}

// Initial render on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  render();
  els.input.focus();
  enableTaskEditing(els.list, editTaskById);
  
  // Set due date input to today as default
  const today = new Date().toISOString().split('T')[0];
  els.dueDateInput.value = today;
});

// Add task
els.form.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = els.input.value.trim();
  if (!title) return;
  
  const dueDate = els.dueDateInput.value || null;
  addTask(title, dueDate);
  
  els.form.reset();
  // Reset due date to today after form reset
  const today = new Date().toISOString().split('T')[0];
  els.dueDateInput.value = today;
  els.input.focus();
});

// Delegated events on list
els.list.addEventListener('change', (e) => {
  const li = e.target.closest('li.task');
  if (!li) return;
  if (e.target.matches('input[type="checkbox"]')) {
    toggleTaskById(li.dataset.id);
  }
});

els.list.addEventListener('click', (e) => {
  const li = e.target.closest('li.task');
  if (!li) return;
  if (e.target.matches('button.delete')) {
    deleteTaskById(li.dataset.id);
  }
});

// Filters
els.filterGroup.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-filter]');
  if (!btn) return;
  filter = btn.dataset.filter;
  render();
});

// Clear completed
els.clearCompleted.addEventListener('click', clearCompleted);

// Search functionality
els.searchInput.addEventListener('input', (e) => {
  searchTerm = e.target.value.trim();
  render();
});