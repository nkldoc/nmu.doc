function loadTasks() {
    fetch('apiToDo.php?action=load')
        .then(res => res.json())
        .then(data => {
            const list = document.getElementById('taskList');
            list.innerHTML = '';
            data.forEach((item, index) => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span>${item.task}</span> 
                    <small style="color: gray;">(${item.updated_at})</small>
                    <button onclick="editTask(${index}, '${item.task.replace(/'/g, "\\'")}')">📝</button>
                    <button onclick="deleteTask(${index})">❌</button>
                `;
                list.appendChild(li);
            });
        });
}

function addTask() {
    const input = document.getElementById('taskInput');
    const task = input.value.trim();
    if (task === '') return;

    fetch('apiToDo.php?action=add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task })
    }).then(() => {
        input.value = '';
        loadTasks();
    });
}

function deleteTask(index) {
    fetch('apiToDo.php?action=delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ index })
    }).then(() => loadTasks());
}

function editTask(index, oldTask) {
    const newTask = prompt("แก้ไขรายการ:", oldTask);
    if (newTask === null || newTask.trim() === "") return;

    fetch('apiToDo.php?action=edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ index, task: newTask.trim() })
    }).then(() => loadTasks());
}

document.addEventListener('DOMContentLoaded', loadTasks);
