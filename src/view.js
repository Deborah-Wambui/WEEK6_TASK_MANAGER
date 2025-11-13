// src/view.js
import { escapeHTML } from './utils.js';

/**
 * Render the tasks into the provided <ul> element.
 * @param {HTMLUListElement} listEl
 * @param {Array} tasks
 * @param {'all'|'active'|'completed'} filter
 * @param {string} searchTerm
 */
export function renderTasks(listEl, tasks, filter, searchTerm = '') {
  let data = tasks.filter(t => {
    if (filter === 'active') return !t.done;
    if (filter === 'completed') return t.done;
    return true;
  });

  
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    data = data.filter(t => t.title.toLowerCase().includes(term));
  }

  listEl.innerHTML = data.map(t => {
    const isOverdue = t.isOverdue ? t.isOverdue() : false;
    const dueDateText = t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '';
    
    return `
    <li class="task ${t.done ? 'done' : ''} ${isOverdue ? 'overdue' : ''}" data-id="${escapeHTML(t.id)}">
      <div class="left">
        <input type="checkbox" ${t.done ? 'checked' : ''} aria-label="Mark ${escapeHTML(t.title)} as ${t.done ? 'incomplete' : 'complete'}">
        <span class="title">${escapeHTML(t.title)}</span>
        ${t.dueDate ? `<span class="due-date ${isOverdue ? 'overdue-text' : ''}">${dueDateText}</span>` : ''}
      </div>
      <button class="delete" title="Delete task" aria-label="Delete task">✕</button>
    </li>
    `;
  }).join('');
}

/**
 * Update counts text content.
 * @param {HTMLElement} countsEl
 * @param {Array} tasks
 */
export function updateCounts(countsEl, tasks) {
  const total = tasks.length;
  const active = tasks.filter(t => !t.done).length;
  const completed = tasks.filter(t => t.done).length;
  const overdue = tasks.filter(t => t.isOverdue ? t.isOverdue() : false).length;
  countsEl.textContent = `${total} total, ${active} active, ${completed} completed${overdue > 0 ? `, ${overdue} overdue` : ''}`;
}

/**
 * Highlight the active filter button.
 * @param {HTMLElement} groupEl
 * @param {'all'|'active'|'completed'} filter
 */
export function applyFilterStyles(groupEl, filter) {
  const buttons = Array.from(groupEl.querySelectorAll('button[data-filter]'));
  buttons.forEach(btn => {
    const isActive = btn.dataset.filter === filter;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', String(isActive));
  });
}

/**
 * Make task title editable on double click
 * @param {HTMLUListElement} listEl
 * @param {Function} onEdit callback when task is edited
 */
export function enableTaskEditing(listEl, onEdit) {
  listEl.addEventListener('dblclick', (e) => {
    const titleSpan = e.target.closest('.title');
    if (!titleSpan) return;
    
    const li = titleSpan.closest('li.task');
    const taskId = li.dataset.id;
    const currentTitle = titleSpan.textContent;
    
    
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentTitle;
    input.className = 'edit-input';
    
   
    titleSpan.replaceWith(input);
    input.focus();
    input.select();
    
    function saveEdit() {
      const newTitle = input.value.trim();
      if (newTitle && newTitle !== currentTitle) {
        onEdit(taskId, newTitle);
      } else {
        // Restore original title
        const span = document.createElement('span');
        span.className = 'title';
        span.textContent = currentTitle;
        input.replaceWith(span);
      }
    }
    
    input.addEventListener('blur', saveEdit);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        input.blur();
      } else if (e.key === 'Escape') {
        const span = document.createElement('span');
        span.className = 'title';
        span.textContent = currentTitle;
        input.replaceWith(span);
      }
    });
  });
}

/**
 * Update search results count
 * @param {HTMLElement} searchCountEl
 * @param {number} matches
 * @param {number} total
 */
export function updateSearchCount(searchCountEl, matches, total) {
  if (matches === total || total === 0) {
    searchCountEl.textContent = '';
  } else {
    searchCountEl.textContent = `${matches} of ${total} tasks`;
  }
}