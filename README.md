# JavaScript To-Do List

A lightweight, client-side To-Do List application built from scratch to practice standard JavaScript DOM manipulation, event handling, local storage persistence, and dynamic list filtering. This project follows clean, semantic HTML practices and native CSS styling to create a responsive, keyboard-accessible user experience.

## Features

- **Create**: Add new tasks to the list.
- **Read**: View existing tasks loaded from local memory.
- **Update**: Edit the text content of a task using a pre-filled dialog.
- **Delete**: Permanently remove individual tasks.
- **Task Completion**: Toggle completion status with checkboxes.
- **Active Task Counter**: Displays the total number of incomplete tasks remaining.
- **Task Filtering**: Filter task list view by *All*, *Active*, or *Completed*.
- **Data Persistence**: Automatically stores task state using the browser's localStorage.
- **Responsive Layout**: Designed to work on desktop, tablet, and mobile (including small screens).
- **Accessibility (A11y)**: Screen-reader friendly using custom input labelling and tab-accessible focus markers.
- **Security**: Utilizes safe text insertion (`textContent`) to prevent HTML/XSS injection vulnerabilities.

## Technologies Used

- **HTML5**: Structured semantically using tags like `<header>`, `<main>`, `<form>`, and list elements.
- **CSS3**: Crafted with custom CSS variables, clean styling, and media query breakpoints for responsiveness.
- **JavaScript (ES6+)**: Handles user interaction, application state representation, and event bindings.
- **Web Storage API**: Leverages the browser's native `localStorage` for cross-session task persistence.

## Project Structure

```text
javascript-todo-list/
├── index.html       # The main markup container layout
├── css/
│   └── style.css    # Clean, responsive styles with design variables
├── js/
│   └── script.js    # Application state, CRUD operations, and event handling logic
└── README.md        # Project documentation
```

- `index.html`: Houses the semantic layout shell where tasks are dynamically injected.
- `css/style.css`: Implements color schemes, focus outlines, visual completed styling, and media queries.
- `js/script.js`: Coordinates the tasks array state, dynamic rendering, input validations, and storage operations.

## How It Works

1. **User Input**: The user enters a description in the text field and submits the form (by clicking the button or pressing Enter).
2. **Object Instantiation**: JavaScript constructs a task object containing a unique timestamp ID, the trimmed text value, and a `completed: false` state.
3. **State Push**: The new task object is pushed into the `tasks` state array in memory.
4. **LocalStorage Sync**: The `tasks` array is saved into browser storage.
5. **Dynamic Rendering**: The list container's HTML is cleared, and elements are recreated using DOM methods based on the current filter view.
6. **Persistence Load**: On page launch, the app retrieves and parses the tasks to rebuild the list exactly where the user left off.
7. **View Filtering**: Buttons toggle which subset of tasks are painted, keeping the active list unchanged behind the scenes.

## CRUD Operations

- **Create**: Forms submit trimmed task entries. Checks are performed to prevent adding empty spaces.
- **Read**: Loop through task objects and generate structural DOM tree nodes for display.
- **Update**: Opens a browser `prompt()` filled with current text. Saves only valid, non-empty changes.
- **Delete**: Filters out the selected task object by comparing unique IDs, removing it from the array.

## Local Storage

`localStorage` is used to persist data between browser sessions:
*   Before writing to storage, the `tasks` array is serialized into a JSON text string using `JSON.stringify()`.
*   During application boot, the string is loaded and deserialized back into a live JavaScript array using `JSON.parse()`.
*   `try/catch` wrapping checks for corrupted data, falling back to a clean array `[]` to avoid application failure.

## Filtering

- **All**: Displays every item in the state array.
- **Active**: Renders only tasks where `completed === false`.
- **Completed**: Renders only tasks where `completed === true`.
*Note: Selecting a filter only affects the visual output. The underlying `tasks` array is never altered.*

## Accessibility

- **Semantic Shell**: Wraps markup structure cleanly in logical landmarks.
- **Screen Reader Links**: Dynamically generates unique IDs on task text nodes and points checkbox inputs to them via `aria-labelledby`.
- **Descriptive Labels**: Assigns unique labels to buttons (e.g., `aria-label="Delete task: Buy Groceries"`).
- **Keyboard Navigation**: Native checkboxes and button tags ensure natural `Tab` sequencing and keyboard activators.
- **Visual Outlines**: Distinct indigo focus rings (`:focus-visible`) help users identify focused items.
- **Color Contrast**: Complies with readable text-to-background contrast constraints.

## Testing

Use this checklist to verify application correctness:
- [ ] Add a new task (check that it trims spaces and prevents empty submissions).
- [ ] Toggle checkmark status (check that counter updates and text styles toggle).
- [ ] Edit a task (verify cancel returns original state, empty strings are blocked).
- [ ] Delete a task (first, middle, and last).
- [ ] Toggle All / Active / Completed filters.
- [ ] Refresh the page to verify that all tasks, status checkmarks, and edits persist.
- [ ] Verify keyboard tab focus styling and activation on all buttons.
- [ ] Test layout wrapping on simulated mobile screen resolutions.

## How to Run

1. Clone or download the repository files.
2. Open the project folder.
3. Open `index.html` in any modern web browser.
4. *Optional*: Use a local development server like VS Code's **Live Server** to run the application on a local loopback IP.

## Future Improvements

*   **Custom Inline Editing**: Replace the native browser prompt with an in-place input editing text field.
*   **Due Dates**: Attach dates and sort tasks by expiration proximity.
*   **Categorization**: Assign labels (e.g., "Personal", "Work") to task objects.
*   **Drag-and-Drop**: Enable manual sorting of tasks inside the list.

## Author

Developed by: Saiganesh

## License

This project is licensed under the MIT License. Feel free to use and modify it for educational purposes.
