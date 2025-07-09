const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const date = document.getElementById('todo-date');
const list = document.getElementById('todo-list');
const filter = document.getElementById('filter-select');

let todos = [];

form.addEventListener('submit', function (e) {
  e.preventDefault();
  
  const text = input.value.trim();
  const dateVal = date.value;

  if (text === "" || dateVal === "") return;

  const todo = {
    id: Date.now(),
    text,
    date: dateVal,
  };

  todos.push(todo);
  input.value = "";
  date.value = "";
  renderList(todos);
});

function renderList(items) {
  list.innerHTML = "";
  items.forEach(todo => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${todo.text} - ${todo.date}
      <button onclick="deleteTodo(${todo.id})">Delete</button>
    `;
    list.appendChild(li);
  });
}

function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  renderList(todos);
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
