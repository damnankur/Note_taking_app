# Note Taking App

A feature-rich note taking application built with **React**, **TypeScript**, and **Vite**. Notes are written in Markdown and all data is persisted in the browser's local storage — no backend required.

## Features

### 📝 Create & Edit Notes
- Create new notes with a **title**, **Markdown body**, and one or more **tags**.
- Edit any existing note at any time — the updated timestamp is recorded automatically.
- Full **Markdown rendering** in the note view (headings, bold, italic, lists, code blocks, links, etc.).

### 🏷️ Tag Management
- Attach any number of tags to a note when creating or editing it.
- Create new tags on the fly directly from the note form.
- Rename or delete existing tags at any time via the **Edit Tags** modal, with changes reflected across all notes instantly.

### 📌 Pin Notes
- Pin important notes so they always appear at the **top** of the list regardless of the current sort order.
- Unpin a note with a single click from either the note list card or the note detail view.

### 🗃️ Archive & Restore Notes
- Archive notes to move them out of the main view without deleting them permanently.
- Toggle between the **Active** and **Archived** views using the tab-style buttons on the note list page.
- Restore an archived note to the active view at any time.

### 📋 Duplicate Notes
- Create an exact copy of any note with one click.
- The duplicate is created with the title suffixed with **(Copy)** and a fresh timestamp.

### 🗑️ Delete Notes
- Permanently delete a note from the note detail view.
- After deletion, the app automatically navigates back to the note list.

### 🔍 Search & Filter
- **Search by title** — filter notes in real time as you type.
- **Filter by tags** — select one or more tags to show only notes that contain all selected tags.

### ↕️ Sort Notes
- Sort the note list by:
  - **Last Updated** (default)
  - **Created Date**
  - **Title** (alphabetical)
- Pinned notes always appear first within the current sort order.

### 💾 Persistent Storage
- All notes and tags are saved to the browser's **local storage** automatically.
- Data survives page refreshes and browser restarts — no account or internet connection required.

### 📱 Responsive Layout
- Notes are displayed in a responsive card grid that adapts from 1 column on mobile up to 4 columns on large screens.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| [React 19](https://react.dev/) | UI library |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Vite](https://vite.dev/) | Build tool & dev server |
| [React Router v7](https://reactrouter.com/) | Client-side routing |
| [React Bootstrap 5](https://react-bootstrap.github.io/docs/getting-started/introduction) | UI components & layout |
| [React Select](https://react-select.com/) | Tag multi-select input |
| [React Markdown](https://github.com/remarkjs/react-markdown) | Markdown rendering |
| [uuid](https://github.com/uuidjs/uuid) | Unique ID generation |

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/damnankur/Note_taking_app.git
cd Note_taking_app

# Install dependencies
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

The compiled output will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

---

## Project Structure

```
src/
├── main.tsx          # Application entry point
├── App.tsx           # Root component, routing & state management
├── NoteList.tsx      # Note list page (search, filter, sort, cards)
├── NewNote.tsx       # Create note page
├── EditNote.tsx      # Edit note page
├── NoteLayout.tsx    # Shared layout wrapper for note detail routes
├── Note.tsx          # Note detail/view page
├── NoteForm.tsx      # Shared form used by NewNote and EditNote
├── useLocalStorage.ts # Custom hook for local storage persistence
└── NoteList.module.css # CSS module for note card styles
```
