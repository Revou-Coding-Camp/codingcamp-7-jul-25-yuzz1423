const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const date = document.getElementById('todo-date');
const list = document.getElementById('todo-list');
const filter = document.getElementById('filter-select');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const clearBtn = document.getElementById('clear-btn');


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
        submitBtn.textContent = "Add";
        cancelBtn.style.display = "none";
    } else {
        // MODE TAMBAH
        const todo = {
            id: Date.now(),
            text,
            date: dateVal,
            done: false
        };
        todos.push(todo);
    }

    input.value = "";
    date.value = "";
    renderList(todos);
});


function renderList(items) {
    list.innerHTML = "";
    // pisahkan yang done dan not-done
    const notDone = items.filter(t => !t.done).sort((a, b) => new Date(a.date) - new Date(b.date));
    const done = items.filter(t => t.done).sort((a, b) => new Date(a.date) - new Date(b.date));

    // gabungkan ulang: not-done dulu, baru done
    const sortedItems = [...notDone, ...done];

    sortedItems.forEach(todo => {
        const tr = document.createElement('tr');
        const statusText = todo.done ? "Sudah Selesai" : "Belum Selesai";

        let actionButtons = `
  <div class="action-buttons">
    ${todo.done
                ? `<button onclick="toggleDone(${todo.id})" class="text-yellow-500">Batal</button>`
                : `
        <button onclick="toggleDone(${todo.id})" class="text-green-600">Done</button>
        <button onclick="startEdit(${todo.id})" class="text-blue-500">Edit</button>
      `
            }
    <button onclick="deleteTodo(${todo.id})" class="text-red-500">Delete</button>
  </div>
`;


        tr.innerHTML = `
      <td>${todo.text}</td>
      <td>${todo.date}</td>
      <td>${statusText}</td>
      <td>${actionButtons}</td>
    `;

        list.appendChild(tr);
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
    if (this.value === 'done') {
        renderList(todos.filter(t => t.done));
    } else if (this.value === 'not-done') {
        renderList(todos.filter(t => !t.done));
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

    submitBtn.textContent = "Update";
    cancelBtn.style.display = "inline";
}


function toggleDone(id) {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    todo.done = !todo.done;
    renderList(todos);
}

cancelBtn.addEventListener('click', function () {
    editingId = null;
    input.value = "";
    date.value = "";
    submitBtn.textContent = "Add";
    cancelBtn.style.display = "none";
});

clearBtn.addEventListener('click', function () {
    const confirmClear = confirm("Yakin mau hapus semua tasks?");
    if (confirmClear) {
        todos = [];
        renderList(todos);
    }
});
