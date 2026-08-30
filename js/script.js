// Wait for the DOM (Document Object Model) to be fully loaded before running script
document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       1. Application State & Storage Keys
       ========================================================================== */
    // The key used to identify our to-do list data in the browser's localStorage
    const STORAGE_KEY = 'todoTasks';

    // The single source of truth for our to-do task data
    let tasks = [];

    // --- What currentFilter represents ---
    // Stores the currently selected view filter: 'all', 'active', or 'completed'.
    // Initially set to 'all' on application startup.
    let currentFilter = 'all';

    /* ==========================================================================
       2. DOM Element References
       ========================================================================== */
    const todoForm = document.getElementById('todoForm');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const taskCounter = document.getElementById('taskCounter');
    const filterBtns = document.querySelectorAll('.filter-btn');

    /* ==========================================================================
       3. Functions
       ========================================================================== */

    // Function: Save Tasks
    // Saves our state tasks array into the browser's persistent localStorage
    function saveTasks() {
        // localStorage can only store raw strings, not JavaScript arrays or objects.
        // JSON.stringify() converts our tasks array into a standard JSON text string.
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }

    // Function: Load Tasks
    // Loads tasks from the browser's localStorage back into our tasks array state
    function loadTasks() {
        // Retrieve the stored string using our unique storage key
        const savedData = localStorage.getItem(STORAGE_KEY);

        // If no data exists yet in the browser storage, initialize with an empty array
        if (!savedData) {
            tasks = [];
            return;
        }

        // Safely parse the stored string to protect against corrupted data
        try {
            // JSON.parse() converts the saved JSON text string back into a real JavaScript array of objects.
            const parsedData = JSON.parse(savedData);

            // Verify the parsed result is a valid array before assigning
            if (Array.isArray(parsedData)) {
                tasks = parsedData;
            } else {
                tasks = [];
            }
        } catch (error) {
            // If the JSON is invalid or corrupted, fallback safely to an empty list instead of crashing
            console.error('Failed to load or parse task data from localStorage:', error);
            tasks = [];
        }
    }

    // Function: Render Tasks
    // Reads all tasks from the array, filters them based on currentFilter, and builds the DOM.
    function renderTasks() {
        taskList.innerHTML = '';

        // --- How the filtered task list is created ---
        // We create a temporary array of tasks that match the selected filter.
        // --- Why the original tasks array should not be modified ---
        // We must not modify the original 'tasks' array itself when filtering because 
        // doing so would destroy or permanently delete tasks that don't match the active filter.
        const filteredTasks = tasks.filter((task) => {
            if (currentFilter === 'active') {
                return !task.completed; // Display only incomplete tasks
            }
            if (currentFilter === 'completed') {
                return task.completed;  // Display only completed tasks
            }
            return true; // Display all tasks
        });

        // Loop through the filtered tasks list to render elements
        filteredTasks.forEach((task) => {
            
            // 1. Create the container list item (<li>)
            const li = document.createElement('li');
            li.classList.add('task-item');

            // Generate a unique ID to associate the checkbox with the text description for screen readers
            const textId = `task-text-${task.id}`;

            // 2. Create the checkbox input element (<input type="checkbox">)
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.classList.add('task-checkbox');
            checkbox.checked = task.completed;
            checkbox.dataset.id = task.id;
            checkbox.setAttribute('aria-labelledby', textId);

            // 3. Create the text container element (<span>)
            const textSpan = document.createElement('span');
            textSpan.id = textId;
            textSpan.classList.add('task-text');
            textSpan.textContent = task.text;

            // 4. Create the Edit button (<button>)
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.classList.add('edit-btn');
            editBtn.dataset.id = task.id;
            editBtn.setAttribute('aria-label', `Edit task: ${task.text}`);

            // 5. Create the Delete button (<button>)
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.classList.add('delete-btn');
            deleteBtn.dataset.id = task.id;
            deleteBtn.setAttribute('aria-label', `Delete task: ${task.text}`);

            if (task.completed) {
                li.classList.add('completed');
            }

            // Checkbox 'change' event listener
            checkbox.addEventListener('change', (event) => {
                const targetId = event.target.dataset.id;
                const matchedTask = tasks.find(t => t.id === targetId);
                
                if (matchedTask) {
                    matchedTask.completed = !matchedTask.completed;
                    saveTasks();
                }

                renderTasks();
            });

            // Edit button event listener
            editBtn.addEventListener('click', (event) => {
                const targetId = event.target.dataset.id;
                const matchedTask = tasks.find(t => t.id === targetId);

                if (matchedTask) {
                    const newText = prompt('Edit task:', matchedTask.text);
                    
                    if (newText !== null) {
                        const trimmedText = newText.trim();
                        
                        if (trimmedText !== '') {
                            matchedTask.text = trimmedText;
                            saveTasks();
                            renderTasks();
                        }
                    }
                }
            });

            // Delete button event listener
            deleteBtn.addEventListener('click', (event) => {
                const targetId = event.target.dataset.id;

                tasks = tasks.filter(t => t.id !== targetId);
                saveTasks();
                renderTasks();
            });

            // Assemble the elements
            li.appendChild(checkbox);
            li.appendChild(textSpan);
            li.appendChild(editBtn);
            li.appendChild(deleteBtn);

            taskList.appendChild(li);
        });

        updateTaskCounter();
    }

    // Function: Update Task Counter
    // Counts and displays how many tasks are incomplete in the ENTIRE array (not just the filtered view)
    function updateTaskCounter() {
        const incompleteCount = tasks.filter(task => !task.completed).length;

        let countText = '';
        if (incompleteCount === 1) {
            countText = '1 task remaining';
        } else {
            countText = `${incompleteCount} tasks remaining`;
        }

        taskCounter.textContent = countText;
    }

    /* ==========================================================================
       4. Event Listeners
       ========================================================================== */
    
    // Task Creation Form submit listener
    todoForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const taskText = taskInput.value.trim();

        if (taskText !== '') {
            const newTask = {
                id: Date.now().toString(),
                text: taskText,
                completed: false
            };

            tasks.push(newTask);
            saveTasks();
            renderTasks();

            taskInput.value = '';
            taskInput.focus();
        }
    });

    // Click event listeners for the filter buttons
    filterBtns.forEach((btn) => {
        btn.addEventListener('click', (event) => {
            // Update the filter state to match the data-filter attribute on the clicked button
            currentFilter = event.target.dataset.filter;

            // --- How the active filter button is updated ---
            // Remove 'active' class from all buttons, then add it to the clicked button
            filterBtns.forEach(b => b.classList.remove('active'));
            event.target.classList.add('active');

            // Re-render tasks to apply the newly selected filter to the view
            renderTasks();
        });
    });

    // Load tasks from localStorage when the application starts, before rendering
    loadTasks();
    renderTasks();
    updateTaskCounter();
});
