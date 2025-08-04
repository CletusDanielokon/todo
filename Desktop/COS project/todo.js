// ==========================================
// 1. Setup
// ==========================================
document.addEventListener('DOMContentLoaded', initAddTask);

// ==========================================
// 2. Main Init Function
// ==========================================
function initAddTask() {
  const form = document.getElementById('taskForm');

  form.addEventListener('submit', handleAddTaskSubmit);
}

// ==========================================
// 3. Form Submission Handler
// ==========================================
function handleAddTaskSubmit(e) {
  e.preventDefault();

  const task = document.getElementById('taskText').value.trim();
  const date = document.getElementById('taskDate').value;
  const time = document.getElementById('taskTime').value;

  if (!task || !date || !time) {
    alert('Please fill out all fields.');
    return;
  }

  const newTask = {
    text: task,
    due: `${date}T${time}`,
    completed: false
  };

  saveTaskToStorage(newTask);

  // Redirect to task list page
  window.location.href = 'tasks.html';
}

// ==========================================
// 4. LocalStorage Save
// ==========================================
function saveTaskToStorage(task) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}


// ==========================================
// 1. Setup
// ==========================================
document.addEventListener('DOMContentLoaded', initTasks);

// ==========================================
// 2. Main Init Function
// ==========================================
//function initTasks() {
  //const tasks = getTasksFromStorage();

  //tasks.forEach((task, index) => {
    //renderTask(task, index);
 // });
//}

function initTasks() {
  const searchInput = document.getElementById('searchInput');
  const tasks = getTasksFromStorage();

  renderTasks(tasks);

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const filtered = tasks.filter(task =>
        task.text.toLowerCase().includes(searchInput.value.toLowerCase())
      );
      renderTasks(filtered);
    });
  }
}


// ==========================================
// 3. Get Tasks
// ==========================================
function getTasksFromStorage() {
  return JSON.parse(localStorage.getItem('tasks')) || [];
}

// ==========================================
// 4. Render Task
// ==========================================
function renderTasks(taskArray) {
  const pendingList = document.getElementById('pendingList');
  const completedList = document.getElementById('completedList');
  pendingList.innerHTML = '';
  completedList.innerHTML = '';

  taskArray.forEach((task, index) => {
    renderSingleTask(task, index);
  });
}


// ==========================================
// 5. Toggle Completion
// ==========================================
function toggleTaskCompletion(index) {
  const tasks = getTasksFromStorage();
  tasks[index].completed = !tasks[index].completed;
  localStorage.setItem('tasks', JSON.stringify(tasks));
  location.reload();
}
//render task
function renderSingleTask(task, index) {
  const pendingList = document.getElementById('pendingList');
  const completedList = document.getElementById('completedList');

  const li = document.createElement('li');
  li.className = 'todo-item';
  if (task.completed) li.classList.add('completed');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = task.completed;
  checkbox.addEventListener('change', () => toggleTaskCompletion(index));

  const label = document.createElement('label');
  label.innerHTML = `
    ${task.text}
    <span class="timestamp">Due: ${new Date(task.due).toLocaleString()}</span>
  `;

  const editBtn = document.createElement('button');
  editBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
  editBtn.className = 'info-btn';
  editBtn.title = 'Edit';
  editBtn.onclick = () => editTask(index);

  const deleteBtn = document.createElement('button');
  deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
  deleteBtn.className = 'info-btn';
  deleteBtn.title = 'Delete';
  deleteBtn.style.color = 'crimson';
  deleteBtn.onclick = () => deleteTask(index);

  li.appendChild(checkbox);
  li.appendChild(label);
  li.appendChild(editBtn);
  li.appendChild(deleteBtn);

  if (task.completed) {
    completedList.appendChild(li);
  } else {
    pendingList.appendChild(li);
    scheduleAlarm(task.text, task.due);
  }
}
//edit task
function editTask(index) {
  const tasks = getTasksFromStorage();
  const task = tasks[index];

  const newText = prompt("Edit task:", task.text);
  if (newText !== null && newText.trim() !== "") {
    tasks[index].text = newText.trim();
    localStorage.setItem('tasks', JSON.stringify(tasks));
    location.reload();
  }
}

// ==========================================
// 6. Delete Task
// ==========================================
function deleteTask(index) {
  const tasks = getTasksFromStorage();
  tasks.splice(index, 1);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  location.reload();
}

// ==========================================
// 7. Reminder + Alarm
// ==========================================
function scheduleAlarm(text, dueTime) {
  const alarm = new Audio("https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg");
  alarm.volume = 1;

  const delay = new Date(dueTime).getTime() - Date.now();
  if (delay > 0) {
    setTimeout(() => {
      alarm.play();
      if (Notification.permission === 'granted') {
        new Notification("⏰ Task Reminder", { body: text });
      } else {
        alert(`Reminder: ${text}`);
      }
    }, delay);
  }
}
