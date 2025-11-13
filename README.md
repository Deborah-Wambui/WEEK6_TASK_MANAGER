Introduction

A simple web-based task management application that lets users create, organize, and track their tasks. Built with vanilla JavaScript using a modular architecture.

Features

Add Tasks - Create new tasks with titles and due dates

Complete Tasks - Mark tasks as done/undone with checkboxes

Edit Tasks - Double-click to edit task titles directly

Delete Tasks - Remove tasks individually

Filter Tasks - View All, Active, or Completed tasks

Search Tasks - Real-time search through task titles

Due Dates - Set deadlines with overdue highlighting

Data Persistence - Tasks saved automatically in browser storage

Technology Used

HTML5 - Page structure and semantic markup

CSS3 - Styling and responsive layout

Vanilla JavaScript - Application logic (no frameworks)

ES6 Modules - Modular code organization

Local Storage - Data persistence in browser

CSS Grid/Flexbox - Modern layout techniques

Key Concepts Implemented

Modular Architecture

Task.js - Defines the task object structure and methods

TimedTask.js - Extends Task with due date functionality

store.js - Handles saving/loading from local storage

view.js - Manages all HTML rendering and updates

utils.js - Contains helper functions (ID generation, HTML safety)

app.js - Main application that connects everything together

Data Flow

User interacts with interface

App updates task data

Data saves to local storage

View re-renders the display

User sees updated interface

Safety Features
HTML escaping prevents script injection

Input validation and trimming

Error handling for storage operations
