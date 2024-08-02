document.addEventListener('DOMContentLoaded', () => {
  const apiUrl = 'http://localhost:3004/tasks'; // Updated port
  const tasksList = document.getElementById('tasks');
  const updateTaskForm = document.getElementById('update-task-form');
  const updateTaskId = document.getElementById('update-task-id');
  const updateStatus = document.getElementById('update-status');
  const taskUpdateDiv = document.getElementById('task-update');

  // Fetch and display tasks
  async function fetchTasks() {
    try {
      const response = await fetch(apiUrl);
      const tasks = await response.json();
      tasksList.innerHTML = tasks.map(task => `
        <li>
          <strong>${task.title}</strong> - ${task.status}
          <button onclick="showUpdateForm(${task.id}, '${task.status}')">Update Status</button>
          <button onclick="deleteTask(${task.id})">Delete</button>
        </li>
      `).join('');
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }

  // Create a new task
  async function createTask(event) {
    event.preventDefault();
    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const status = document.getElementById('status').value;

    // Validate inputs
    if (!title) {
      alert('Title is required.');
      return;
    }
    if (!status) {
      alert('Status is required.');
      return;
    }

    try {
      await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, description, status })
      });
      fetchTasks();
      document.getElementById('create-task-form').reset();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  }

  // Delete a task
  window.deleteTask = async function(id) {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE'
      });
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };
  

  // Update a task status
  async function updateTask(event) {
    event.preventDefault();
    const id = updateTaskId.value;
    const status = updateStatus.value;

    // Validate status
    if (!status) {
      alert('Status is required.');
      return;
    }

    try {
      await fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      fetchTasks();
      taskUpdateDiv.style.display = 'none';
    } catch (error) {
      console.error('Error updating task:', error);
    }
  }

  // Show update form
  window.showUpdateForm = function (id, currentStatus) {
    updateTaskId.value = id;
    updateStatus.value = currentStatus;
    taskUpdateDiv.style.display = 'block';
  };

  // Event listeners
  document.getElementById('create-task-form').addEventListener('submit', createTask);
  updateTaskForm.addEventListener('submit', updateTask);

  // Initial fetch
  fetchTasks();
});
