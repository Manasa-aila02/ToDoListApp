const newTodoForm = document.getElementById('new-todo-form');
const newTodoInput = document.getElementById('new-todo');
const newTodoDeadline = document.getElementById('new-todo-deadline');
const filterButtons = document.querySelectorAll('.filter-btn');
const filterMessage = document.getElementById('filter-message');
const todoTable = document.getElementById('todo-table');
const todoList = document.getElementById('todo-list');
const message = document.getElementById('message');

const TODOS_KEY = 'todos';

function getTodos() {
    const storedTodos = localStorage.getItem(TODOS_KEY);
    return JSON.parse(storedTodos) || [];
}

function setTodos(todos) {
    localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
}

function displayTodos(todos = getTodos(), filter = 'all') {
    todoList.innerHTML = '';
    let filteredTodos = todos.filter(todo => filter === 'all' || (filter === 'pending' && !todo.completed) || (filter === 'completed' && todo.completed));

    if (filteredTodos.length === 0) {
        filterMessage.innerText = filter === 'pending' ? 'No pending tasks' : filter === 'completed' ? 'No completed tasks' : 'No tasks available';
        todoTable.classList.add('hidden');
    } else {
        filterMessage.innerText = '';
        todoTable.classList.remove('hidden');
    }

    filteredTodos.forEach(todo => {
        const todoRow = document.createElement('tr');
        todoRow.classList.toggle('completed', todo.completed);

        const taskCell = document.createElement('td');
        taskCell.textContent = todo.text;
        todoRow.appendChild(taskCell);

        const deadlineCell = document.createElement('td');
        deadlineCell.textContent = todo.deadline;
        todoRow.appendChild(deadlineCell);

        const actionsCell = document.createElement('td');

        const completeButton = document.createElement('button');
        completeButton.textContent = todo.completed ? 'Undo' : 'Complete';
        completeButton.classList.add('complete-btn');
        completeButton.addEventListener('click', function() {
            todo.completed = !todo.completed;
            setTodos(todos);
            displayTodos(todos, filter);
        });
        actionsCell.appendChild(completeButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-btn');
        deleteButton.addEventListener('click', function() {
            todos = todos.filter(t => t !== todo);
            setTodos(todos);
            displayTodos(todos, filter);
        });
        actionsCell.appendChild(deleteButton);

        todoRow.appendChild(actionsCell);
        todoList.appendChild(todoRow);
    });
}

filterButtons.forEach(button => {
    button.addEventListener('click', function() {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        displayTodos(getTodos(), button.dataset.filter);
    });
});

newTodoForm.addEventListener('submit', function(event) {
    event.preventDefault();
    if (newTodoInput.value.trim() === '' || newTodoDeadline.value.trim() === '') {
        message.innerText = 'Please fill in both the task and the deadline.';
        return;
    }
    const newTodo = {
        text: newTodoInput.value.trim(),
        deadline: newTodoDeadline.value,
        completed: false
    };
    const todos = getTodos();
    todos.push(newTodo);
    setTodos(todos);
    displayTodos(todos);
    newTodoInput.value = '';
    newTodoDeadline.value = '';
    message.innerText = 'Task added successfully!';
    setTimeout(() => message.innerText = '', 3000);
});

// Initial display
displayTodos();

