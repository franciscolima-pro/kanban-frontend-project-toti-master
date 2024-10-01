import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Boards.css'

const Boards = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null); // Tarefa selecionada para exibição
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Define se o usuário está em modo de edição
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [listTask, setListTask] = useState([]);
  const [suggestions, setSuggestions] = useState([])
  const [categorySuggestions, setCategorySuggestions] = useState([]);
  ;

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    due_date: '',
    status: 'pending',
    priority: 'low',
    user_id: '',
    category_id: '',
    task_list_id: 'Para Fazer',
    file: null
  });

  // Busca lista de usuários
const fetchUsers = async () => {
  try {
    const response = await axios.get('http://localhost:3000/users'); // Assumindo um endpoint que retorna os usuários
    setUsers(response.data);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
  }
};
// Filtrar sugestões conforme o input do usuário
const handleUserInput = (e) => {
  const input = e.target.value;
  setSelectedTask({ ...selectedTask, user_id: input });
  setNewTask({ ...newTask, user_id: input });

  if (input.trim() === '') {
    setSuggestions([]); // Não mostrar sugestões se o input estiver vazio
  } else {
    // Filtrar os usuários que começam com o valor digitado
    const filteredSuggestions = users.filter((user) =>
      user.name.toLowerCase().startsWith(input.toLowerCase())
    );
    
    setSuggestions(filteredSuggestions);
  }
};

// Função para quando o usuário clicar em uma sugestão
const handleSuggestionClick = (user) => {
  setSelectedTask({ ...selectedTask, user_id: user.name });
  setNewTask({ ...newTask, user_id: user.name });

  setSuggestions([]); // Esconder as sugestões
};

const fetchCategories = async () => {
  try {
    const response = await axios.get("http://localhost:3000/task-categories");
    setCategories(response.data);
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
  }
};
// Filtrar sugestões de categorias conforme o input
const handleCategoryInput = (e) => {
  const input = e.target.value;
  setSelectedTask({ ...selectedTask, category_id: input });
  setNewTask({ ...newTask, category_id: input });

  if (input.trim() === '') {
    setCategorySuggestions([]); // Não mostrar sugestões se o input estiver vazio
  } else {
    // Filtrar as categorias que começam com o valor digitado
    const filteredSuggestions = categories.filter((category) =>
      category.name.toLowerCase().startsWith(input.toLowerCase())
    );
    setCategorySuggestions(filteredSuggestions);
  }
};

// Função para quando o usuário clicar em uma sugestão de categoria
const handleCategorySuggestionClick = (category) => {
  setSelectedTask({ ...selectedTask, category_id: category.name }); // Definir a categoria selecionada
  setNewTask({ ...newTask, category_id: category.name });
  setCategorySuggestions([]); // Esconder as sugestões
};

const fetchListTask = async () => {
  try {
    const response = await axios.get("http://localhost:3000/task-lists");
    setListTask(response.data);
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
  }
};

  // Função para buscar todas as tarefas
  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:3000/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
    }
  };

  // Função para buscar detalhes de uma tarefa específica
  const fetchTaskDetails = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3000/tasks/${id}`);
      setSelectedTask(response.data); // Exibir detalhes da tarefa
      setIsEditing(false); // Não entra em modo de edição diretamente
      setShowTaskModal(true);
    } catch (error) {
      console.error('Erro ao buscar detalhes da tarefa:', error);
    }
  };

    // Função para editar a tarefa
    const editTask = async () => {
      try {
        const response = await axios.put(`http://localhost:3000/tasks/1/tasks/${selectedTask.id}`, selectedTask, {
          headers: {
            'Content-Type': 'multipart/form-data',  // Garantir que o tipo de conteúdo seja multipart
          },
        });

        setSelectedTask(response.data);
        setShowTaskModal(false); // Fechar o modal após edição
        fetchTasks(); // Atualizar a lista de tarefas
      } catch (error) {
        console.error('Erro ao editar a tarefa:', error);
      }
    };
  

  const deleteTask = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3000/tasks/${id}`);
      setSelectedTask(response.data);
      setShowTaskModal(false);
      fetchTasks(); // Atualizar tarefas após a criação
    } catch (error) {
      console.error('Erro ao apagar a tarefa:', error);
    }
  };

  // Função para criar uma nova tarefa
  const createTask = async () => {
    try {
      // Criar uma instância de FormData para enviar o arquivo e os outros campos
      const formData = new FormData();
      formData.append('title', newTask.title);
      formData.append('description', newTask.description);
      formData.append('due_date', newTask.due_date);
      formData.append('status', newTask.status);
      formData.append('priority', newTask.priority);
      formData.append('user_id', newTask.user_id);
      formData.append('category_id', newTask.category_id);
      formData.append('task_list_id', newTask.task_list_id);
  
      // Adicionar o arquivo apenas se existir
      if (newTask.file) {
        formData.append('file', newTask.file);
      }
  
      // Fazer a requisição com o FormData
      await axios.post('http://localhost:3000/tasks', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',  // Garantir que o tipo de conteúdo seja multipart
        },
      });
  
      fetchTasks(); // Atualizar tarefas após a criação
      setShowNewTaskModal(false); // Fechar modal de nova tarefa
    } catch (error) {
      console.error('Erro ao criar nova tarefa:', error);
    }
  };
  

  useEffect(() => {
    fetchTasks();
    fetchCategories();
    fetchListTask();
    fetchUsers();
  }, []);

  // Função para renderizar as colunas de acordo com o `task_list_name`
  const renderColumns = (status) => {
    return tasks
      .filter(task => task.task_list_name === status)
      .map(task => (
        <div key={task.id} className="task-card" onClick={() => fetchTaskDetails(task.id)}>
          <h3>{task.title}</h3>
          <div className="container-due_date-usuario">
          <p className="relatorio-due-date">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"  stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0  1 18 0Z" />
            </svg>
            {new Date(task.due_date).toLocaleDateString()}
          </p>
          <img src={`http://localhost:3000/users/${task.user_id}/image`} alt={`${task.user_photo}`} className='user-photo'/>
          </div>

          <div className="container-categoria-e-prioridade">
                    <p>
                      <span className={`prioridade ${
                        task.priority === "low"
                          ? "prioridade-low"
                          : task.priority === "medium"
                          ? "prioridade-medium"
                          : task.priority === "high"
                          ? "prioridade-high"
                          : ""
                      }`}>{task.priority}</span>
                    </p>
                    <p>
                      <span
                        className={`categoria ${
                          categories.find((category) => category.name === task.category_name)
                            ? `categoria-${task.category_name.toLowerCase()}`
                            : ""
                        }`}
                      >
                        {task.category_name}
                      </span>
                    </p>

                    </div>
          
        </div>
      ));
  };

  return (
    <>
    <div className="kanban-board">

      {/* Colunas */}
      {listTask.map((listTaskName) => (
        <div className="kanban-column" key={listTaskName.name}>
                <div className="column-header">
                <h2 value={listTaskName.name}>
                  {listTaskName.name} 
                  {/* <span>{(tasks.filter(tarefa => tarefa.task_list_name === `${listTaskName.name}`)).length}</span> */}

                </h2>
                <button className="add-task-button" onClick={() => setShowNewTaskModal(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill='#333333'><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/></svg>
                </button>
                </div>
                {renderColumns(`${listTaskName.name}`)}
        </div>
              ))}

      {/* Modal para visualizar tarefa existente */}
      {showTaskModal && selectedTask && (
        <div className="modal">
          <div className="modal-content">
            {/* Editar */}
            {isEditing ? (
              <>
              
              <div className='edicao'>
                {/* <div className='edicaoBut'>
                    <button className='fechar'  onClick={() => setShowTaskModal(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={18}><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/></svg>
                    </button>
                    
                    
                
                    <button className='salvar' onClick={editTask} >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={18}><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>
                    </button>
                </div> */}
                <label>Título</label>
                <input
                  type="text"
                  value={selectedTask.title}
                  onChange={(e) => setSelectedTask({ ...selectedTask, title: e.target.value })}
                />
                
                <label>Descrição</label>
                <textarea
                  value={selectedTask.description}
                  onChange={(e) => setSelectedTask({ ...selectedTask, description: e.target.value })}
                />

                <label>Data de Entrega</label>
                <input
                  type="date"
                  value={new Date(selectedTask.due_date).toISOString().substr(0, 10)}
                  onChange={(e) => setSelectedTask({ ...selectedTask, due_date: e.target.value })}
                />

                <label>Status</label>
                <select
                  value={selectedTask.task_list_id}
                  onChange={(e) => setSelectedTask({ ...selectedTask, task_list_id: e.target.value })}
                >
                  <option value="Para Fazer">Para Fazer</option>
                  <option value="Em Progresso">Em Progresso</option>
                  <option value="Concluído">Concluído</option>
                </select>

                <label>Prioridade</label>
                <select
                  value={selectedTask.priority}
                  onChange={(e) => setSelectedTask({ ...selectedTask, priority: e.target.value })}
                >
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                </select>

                <label>Responsável</label>
                <div style={{ position: 'relative', marginBottom: '20px' }}>
                <input
                  type="text"
                  value={selectedTask.user_id}
                  onChange={handleUserInput}
                  placeholder="Digite o nome do usuário"
                />
                {suggestions.length > 0 && (
                  <ul style={{ position: 'absolute',
                    top: '100%', // Posicionar logo abaixo do input
                    left: 0,
                    width: '100%',
                    border: '1px solid #ccc',
                    backgroundColor: '#fff',
                    listStyleType: 'none',
                    padding: '0',
                    margin: '0',
                    zIndex: 1000}}>
                    {suggestions.map((user) => (
                      <li
                        key={user.id}
                        style={{ padding: '8px', cursor: 'pointer' }}
                        onClick={() => handleSuggestionClick(user)} className="sugestoes-users"
                      >
                        <img src={`http://localhost:3000/users/${user.id}/image`}
                        alt={`${user.user_photo}`} className="user-photo"/>
                        <p>{user.name}</p>
                      </li>
                    ))}
                  </ul>
                )}

                </div>
                
                <div style={{ position: 'relative', marginBottom: '20px' }}>
                  <label>Categoria</label>
                  <input
                    type="text"
                    value={selectedTask.category_id}
                    onChange={handleCategoryInput}
                    placeholder="Digite a categoria"
                  />

                  {/* Mostrar sugestões de categorias */}
                  {categorySuggestions.length > 0 && (
                    <ul style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      width: '100%',
                      border: '1px solid #ccc',
                      backgroundColor: '#fff',
                      listStyleType: 'none',
                      padding: '0',
                      margin: '0',
                      zIndex: 1000
                    }}>
                      {categorySuggestions.map((category) => (
                        <li
                          key={category.id}
                          style={{ padding: '8px', cursor: 'pointer'}}
                          onClick={() => handleCategorySuggestionClick(category)} className="sugestoes-users"
                        >
                          {category.name}
                        </li>
                      ))}
                    </ul>
                  )}
                 </div>

                <label>Arquivo</label>
                <input
                  type="file"
                  onChange={(e) => setSelectedTask({ ...selectedTask, file: e.target.files[0] })} 
                />
                
            </div>
              </>
            
            ) : (
                // Exibir
              <>
                <div className='exibir'>
                    <label>Título:</label>
                    <p>{selectedTask.title}</p>
                    <label>Descrição:</label>
                    <p>{selectedTask.description}</p>

                    <label>Data da Entrega:</label>
                    <p>{new Date(selectedTask.due_date).toLocaleDateString()}</p>
                    <label>Status:</label>
                    <p>{selectedTask.task_list_id}</p>
                    <label>Prioridade:</label>
                    <p>{selectedTask.priority}</p>
                    <label>Responsável:</label>
                    <p>{selectedTask.user_id}</p>
                    <label>Categoria:</label>
                    <p>{selectedTask.category_id}</p>
                    <label>Arquivo:</label>
                    <p>{selectedTask.file_path}</p>
                </div>
              </>
            )}      
                <aside className='but'>
                {/* <button onClick={editTask}>Salvar alterações</button> */}

                    <button className='fechar'  onClick={() => setShowTaskModal(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={18}><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/></svg>
                    </button>

                    {!isEditing ? (
                        <button className='editar' onClick={() => setIsEditing(true)}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={18}><path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"/></svg>
                        </button>
                    ) : (
                        <>
                            <button onClick={() => setIsEditing(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={18}><path d="M512 256A256 256 0 1 0 0 256a256 256 0 1 0 512 0zM215 127c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-71 71L392 232c13.3 0 24 10.7 24 24s-10.7 24-24 24l-214.1 0 71 71c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L103 273c-9.4-9.4-9.4-24.6 0-33.9L215 127z"/></svg>
                            </button>
                            <button onClick={editTask}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={18}><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>
                            </button>
                        </>
                    )}

                    {!isEditing && <button className='excluir' onClick={() => deleteTask(selectedTask.id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6" width={18}>
                        <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                    </svg>
                    </button>}

                </aside>
            <p className='criacao'><em>Criado em: {new Date(selectedTask.created_at).toLocaleDateString()}</em></p>
          </div>
        </div>
      )}
     

      {/* Modal para criar nova tarefa */}
      {showNewTaskModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Criar Nova Tarefa</h2>
            <label>Título</label>
            <input
              type="text"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
            <label>Descrição</label>
            <textarea
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
            <label>Data de Entrega</label>
            <input
              type="date"
              value={newTask.due_date}
              onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
            />
            <label>Status</label>
            <select
              value={newTask.task_list_id}
              onChange={(e) => setNewTask({ ...newTask, task_list_id: e.target.value })}
            >
              <option value="Para Fazer">Para Fazer</option>
              <option value="Em Progresso">Em Progresso</option>
              <option value="Concluído">Concluído</option>
            </select>
            <label>Prioridade</label>
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
            >
              <option value="low">Baixa</option>
              <option value="medium">Média</option>
              <option value="high">Alta</option>
            </select>

            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <label>Responsável</label>
              <input
                type="text"
                value={newTask.user_id} // Usando o valor de newTask
                onChange={handleUserInput} // Chama a função de mudança do input
                placeholder="Digite o nome do usuário"
              />

              {/* Mostrar sugestões de usuários */}
              {suggestions.length > 0 && (
                <ul style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  width: '100%',
                  border: '1px solid #ccc',
                  backgroundColor: '#fff',
                  listStyleType: 'none',
                  padding: '0',
                  margin: '0',
                  zIndex: 1000 // Sobrepor a outros elementos
                }}>
                  {suggestions.map((user) => (
                    <li
                      key={user.id}
                      style={{ padding: '8px', cursor: 'pointer'}}
                      onClick={() => handleSuggestionClick(user)} className="sugestoes-users"
                    >
                      <img src={`http://localhost:3000/users/${user.id}/image`}
                        alt={`${user.user_photo}`} className="user-photo"/>
                        <p>{user.name}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <label>Categoria</label>
              <input
                type="text"
                value={newTask.category_id} // Usando o valor de newTask
                onChange={handleCategoryInput} // Chama a função de mudança do input
                placeholder="Digite a categoria"
              />

              {/* Mostrar sugestões de categorias */}
              {categorySuggestions.length > 0 && (
                <ul style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  width: '100%',
                  border: '1px solid #ccc',
                  backgroundColor: '#fff',
                  listStyleType: 'none',
                  padding: '0',
                  margin: '0',
                  zIndex: 1000 // Sobrepor a outros elementos
                }}>
                  {categorySuggestions.map((category) => (
                    <li
                      key={category.id}
                      style={{ padding: '8px', cursor: 'pointer'}}
                      onClick={() => handleCategorySuggestionClick(category)} className="sugestoes-users"
                    >
                      {category.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <label>Arquivo</label>
            <input
              type="file"
              onChange={(e) => setNewTask({ ...newTask, file: e.target.files[0] })}
            />
            <button onClick={createTask}>Criar Tarefa</button>
            <button onClick={() => setShowNewTaskModal(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default Boards;