// * key localStorage
const lsTasksKey = "tasks";

// * HTML ELEMENTS
const taskForm = document.querySelector("#todo-form");
const taskTitleInput = document.querySelector("#task-title-input");
const addTaskButton = document.querySelector("#add-task-button");
const todoListUl = document.querySelector("#todo-list");

let tasks = [];

window.onload = () => {
  const taskOnLocalStorage = localStorage.getItem(lsTasksKey);

  if (!taskOnLocalStorage) return;

  tasks = JSON.parse(taskOnLocalStorage);

  for (task of tasks) {
    renderTaskOnHtml(task.title, task.done);
  }
};

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const taskTitle = taskTitleInput.value;

  if (taskTitle.length < 3) {
    alert("The task title must be longer than 2 characters");
    taskTitleInput.focus();
    return;
  }

  if (taskTitle.length > 25) {
    alert("The task title cannot contain more than 25 characters");
    taskTitleInput.focus();
    return;
  }

  tasks.push({
    title: taskTitle,
    done: false,
  });
  localStorage.setItem(lsTasksKey, JSON.stringify(tasks));

  renderTaskOnHtml(taskTitle);

  taskTitleInput.value = "";
});

function renderTaskOnHtml(taskTitle, done = false) {
  const li = document.createElement("li");

  const input = document.createElement("input");
  input.setAttribute("type", "checkbox");
  input.addEventListener("change", (event) => {
    const liToToggle = event.target.parentElement;
    const spanToToggle = liToToggle.querySelector("span");
    const done = event.target.checked;

    if (done) {
      spanToToggle.style.textDecoration = "line-through";
    } else {
      spanToToggle.style.textDecoration = "none";
    }

    tasks = tasks.map((task) => {
      if (task.title === spanToToggle.textContent) {
        return {
          title: task.title,
          done: !task.done,
        };
      }
      return task;
    });
    localStorage.setItem(lsTasksKey, JSON.stringify(tasks));
  });
  input.checked = done;

  const span = document.createElement("span");
  span.textContent = taskTitle;
  if (done) {
    span.style.textDecoration = "line-through";
  }

  const button = document.createElement("button");
  button.textContent = "X";
  button.addEventListener("click", (event) => {
    const liToRemove = event.target.parentElement;
    const titleToRemove = liToRemove.querySelector("span").textContent;

    tasks = tasks.filter((task) => task.title !== titleToRemove);

    todoListUl.removeChild(liToRemove);
    localStorage.setItem(lsTasksKey, JSON.stringify(tasks));
  });

  li.appendChild(input);
  li.appendChild(span);
  li.appendChild(button);

  todoListUl.appendChild(li);
}
