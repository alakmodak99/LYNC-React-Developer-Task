# Online Drive

A React-based file management system with features similar to Google Drive.

## Features

- Create, delete, and rename files/folders
- Navigate through folder hierarchy
- Breadcrumb navigation
- File/folder search
- Grid/List view toggle
- Persistent storage
- Keyboard accessibility
- Modified timestamps

## Tech Stack

- React (Hooks)
- ShadcnUI components
- Lucide Icons
- LocalStorage for persistence
- TailwindCSS

## Installation

```bash
npm install
# Required shadcn/ui components
npm install @radix-ui/react-dialog
npm install @radix-ui/react-alert
```

## Usage

```jsx
import Drive from './components/home';

function App() {
  return <Drive />;
}
```

## Component Structure

- `Drive`: Main component
- `useFileSystem`: Custom hook for file system operations
- `Breadcrumb`: Navigation component
- `Item`: File/folder display component
- `SearchResults`: Search results display

## File System Structure

```javascript
{
  root: {
    id: string,
    name: string,
    type: 'folder',
    children: Object,
    parent: string | null,
    createdAt: number,
    modifiedAt: number
  }
}
```

## Key Features

### File Operations
- Create files/folders
- Delete with recursive folder deletion
- Rename with duplicate prevention
- Double-click navigation

### UI Features
- Responsive grid/list layouts
- Search functionality
- Error notifications
- Keyboard navigation
- Modified timestamps

### Data Persistence
- Automatic local storage saving
- State restoration on page reload

## Security Features

- Path traversal prevention
- Duplicate name validation
- Recursive deletion safety

## Performance Optimizations

- Memoized callbacks
- Computed value memoization
- Efficient state updates