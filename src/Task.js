// src/Task.js
export class Task {
  constructor(id, title, done = false) {
    this.id = String(id);
    this.title = String(title).trim();
    this.done = Boolean(done);
  }

  toggle() {
    this.done = !this.done;
  }

  toJSON() {
    // Control how JSON.stringify serializes Task
    return { id: this.id, title: this.title, done: this.done };
  }

  static from(obj) {
    if (!obj) return null;
    return new Task(obj.id, obj.title, obj.done);
  }
}
