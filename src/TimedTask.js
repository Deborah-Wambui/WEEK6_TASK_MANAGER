// src/TimedTask.js
import { Task } from './Task.js';

export class TimedTask extends Task {
  constructor(id, title, done = false, dueDate = null) {
    super(id, title, done);
    this.dueDate = dueDate ? new Date(dueDate) : null;
  }

  isOverdue() {
    if (this.done || !this.dueDate) return false;
    return new Date() > this.dueDate;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      dueDate: this.dueDate ? this.dueDate.toISOString() : null
    };
  }

  static from(obj) {
    if (!obj) return null;
    const task = new TimedTask(obj.id, obj.title, obj.done, obj.dueDate);
    return task;
  }
}