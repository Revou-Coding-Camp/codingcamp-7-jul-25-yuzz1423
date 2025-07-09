const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const date = document.getElementById('todo-date');
const list = document.getElementById('todo-list');
const filter = document.getElementById('filter-select');

let todos = [];
let editingId = null;

form.addEventListener('submit', function (e) {
    e.preventDefault();

    const text = input.value.trim();
    const dateVal = date.value;

    if (text === "" || dateVal === "") return;

    if (editingId !== null) {
        // MODE EDIT
        const index = todos.findIndex(t => t.id === editingId);
        if (index !== -1) {
            todos[index].text = text;
            todos[index].date = dateVal;
        }
        editingId = null;
        form.querySelector('button').textContent = "Add";
    } else {
        // MODE TAMBAH
        const todo = {
            id: Date.now(),
            text,
            date: dateVal,
        };
        todos.push(todo);
    }

    input.value = "";
    date.value = "";
    renderList(todos);
});

function renderList(items) {
    list.innerHTML = "";
    items.forEach(todo => {
        const li = document.createElement('li');
        li.className = `flex justify-between items-center ${todo.done ? 'bg-green-200' : 'bg-gray-100'} px-4 py-2 rounded-md`;

    li.innerHTML = `
      <span style="flex:1; ${todo.done ? 'text-decoration: line-through; opacity: 0.6;' : ''}">
        ${todo.text} - <span class="text-sm text-gray-500">${todo.date}</span>
      </span>
      <div style="display: flex; gap: 5px;">
        ${!todo.done ? `<button onclick="toggleDone(${todo.id})" class="text-green-600">Done</button>` : ""}
        <button onclick="startEdit(${todo.id})" class="text-blue-500">Edit</button>
        <button onclick="deleteTodo(${todo.id})" class="text-red-500">Delete</button>
      </div>
    `;

        list.appendChild(li);
    });
}

function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    renderList(todos);
}

function editTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    const newText = prompt("Edit your task:", todo.text);
    const newDate = prompt("Edit date (YYYY-MM-DD):", todo.date);

    if (newText && newDate) {
        todo.text = newText.trim();
        todo.date = newDate;
        renderList(todos);
    }
}

filter.addEventListener('change', function () {
    const now = new Date().toISOString().slice(0, 10);
    if (this.value === 'today') {
        renderList(todos.filter(t => t.date === now));
    } else if (this.value === 'upcoming') {
        renderList(todos.filter(t => t.date > now));
    } else {
        renderList(todos);
    }
});

function startEdit(id) {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    input.value = todo.text;
    date.value = todo.date;
    editingId = id;

    form.querySelector('button').textContent = "Update";
}

const todo = {
    id: Date.now(),
    text,
    date: dateVal,
    done: false
};

function toggleDone(id) {
  const todo = todos.find(t => t.id === id);
  if (!todo) return;

  todo.done = !todo.done;
  renderList(todos);
}