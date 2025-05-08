document.getElementById('task-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const task = {
    id: Date.now(),
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    deadline: new Date(document.getElementById('deadline').value), // Converte para objeto Date
    priority: document.getElementById('priority').value,
    status: 'pendente' // Status padrão ao criar uma tarefa
  };

  // Salva no localStorage
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));

  alert('Tarefa salva com sucesso!');
  displayTasks();
});

function displayTasks(filter = null) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  // Filtra as tarefas com base no parâmetro (status ou prioridade)
  const filteredTasks = filter ? tasks.filter(task => task.status === filter || task.priority === filter) : tasks.filter(task => task.status !== 'concluída');

  const taskList = document.getElementById('task-list');
  taskList.innerHTML = filteredTasks.map(task => `
    <div class="task-item ${task.priority} ${task.status === 'concluída' ? 'completed' : ''}">
      <h3>${task.title} [${task.priority}]</h3>
      <p>${task.description}</p>
      <p><strong>Prazo:</strong> ${new Date(task.deadline).toLocaleDateString()}</p>
      <p><strong>Status:</strong> ${task.status}</p>
      ${task.status !== 'concluída' ? `<button class="complete-btn" onclick="markComplete(${task.id})">Concluir</button>` : ''}
      <button class="delete-btn" onclick="deleteTask(${task.id})">Excluir</button>
    </div>
  `).join('');

  checkForNotifications();
}

function deleteTask(taskId) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const updatedTasks = tasks.filter(task => task.id !== taskId);
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  displayTasks();
}

function markComplete(taskId) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const updatedTasks = tasks.map(task => {
    if (task.id === taskId) {
      task.status = 'concluída'; // Atualiza o status para concluída
    }
    return task;
  });
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  displayTasks();
}

// Sistema de Notificação: Lembretes automáticos
function checkForNotifications() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const now = new Date();
  tasks.forEach(task => {
    const deadline = new Date(task.deadline);
    const timeDifference = (deadline - now) / (1000 * 60 * 60 * 24); // Diferença em dias

    if (timeDifference <= 1 && task.status === 'pendente') {
      alert(`A tarefa "${task.title}" está próxima do prazo!`);
    }
  });
}

// Adiciona filtros de visualização
document.getElementById('filter-priority').addEventListener('change', function() {
  displayTasks(this.value);
});

document.getElementById('filter-status').addEventListener('change', function() {
  displayTasks(this.value);
});

// Chama para exibir as tarefas ao carregar
displayTasks();