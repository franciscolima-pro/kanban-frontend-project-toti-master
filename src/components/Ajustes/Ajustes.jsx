import React, { useState, useEffect } from 'react';
import LoaderAjustes from '../loadings/LoaderAjustes.jsx';
import './Ajustes.css';
import habilitarInput from './Ajustes.js';
import axios from 'axios'

const formatarData = (dataISO) => {
  const data = new Date(dataISO);
  return data.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
};

export default function Ajustes({ userId }) { // Recebe o ID do usuário como prop
  
  // Estado para armazenar os dados do usuário
  const [userData, setUserData] = useState({
    idUserImage: '',
    bio: '',
    nome: '',
    email: '',
    profissao: '',
    rol: ''
  });

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
  
      // Faça a requisição para o backend para salvar a nova imagem
      axios.post(`http://localhost:3000/users/${userData.idUserImage}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(response => {
        // Atualize o src da imagem com a nova URL recebida
        const newImageUrl = `http://localhost:3000/users/${userData.idUserImage}/image`;
        document.getElementById('profile').src = newImageUrl;
      })
      .catch(error => {
        console.error('Erro ao fazer upload da imagem:', error);
      });
    }
  };

  const handleSave = async () => {
    try {
      // Enviar os dados modificados para o backend
      const response = await axios.put(`http://localhost:3000/users/2`, {
        user_photo: userData.idUserImage,
        name: userData.nome,
        email: userData.email,
        jobTitle: userData.profissao,
        description: userData.bio,
        roleId: userData.rol
      });
      console.log('Dados atualizados com sucesso:', response.data);
      setIsDataChanged(false); // Desabilita o botão "Salvar" após salvar
    } catch (error) {
      console.error('Erro ao salvar os dados:', error);
    }
  };

  // Estado para o controle do loading
  const [loading, setLoading] = useState(true);  

  // Simulando um efeito de carregamento
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); 
    }, 2000);

    return () => clearTimeout(timer); 
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setUserData(prevData => ({
      ...prevData,
      [id]: value
    }));
  };

  // Efeito para buscar os dados do usuário ao montar o componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Faça uma chamada à sua API, incluindo o ID do usuário na URL
        const response = await axios.get(`http://localhost:3000/users/2`);
        const roleValue = response.data.role_name === "Admin" ? 1 : 2;
        // Atualizando os inputs com os dados recebidos
        setUserData({
          idUserImage: response.data.id || 'id do usuario',
          bio: response.data.description || 'Uma breve descrição sua!',
          nome: response.data.name || 'Seu nome',
          email: response.data.email || 'seu@email.com',
          profissao: response.data.job_title || 'Sua profissão',
          userphoto: response.data.user_photo || 'Erro ao carregar Photo',
          rol: roleValue,
          criacao: formatarData(response.data.created_at) || '00/00/00'
        });

        setLoading(false);
        } catch (error) {
          console.error("Erro ao buscar os dados:", error);
          // Caso ocorra um erro, defina um valor padrão
          setUserData({
            idUserImage: data.id || 'erro id do usuario',
            bio: 'Erro ao carregar biografia',
            nome: 'Erro ao carregar nome',
            email: 'Erro ao carregar email',
            profissao: 'Erro ao carregar profissão',
            userphoto: 'Erro ao carregar Photo',
            criacao: 'Erro ao carregar data de criação',
            rol: 0
          });
          setLoading(false);
        }
    };



    fetchData();
  }, [userId]);


  return (
    <div>
      {loading ? (
        <LoaderAjustes/>):
        (
          <>
            <button type='button' id="btn-salvar" className='btn-salvar' onClick={handleSave}>Salvar</button>
            <div className="user-info">
              <div className='image'>
                <img id='profile' src={`http://localhost:3000/users/${userData.idUserImage}/image`} alt="Profile Photo" />

                <button onClick={() => document.getElementById('profile-image-input').click()}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"  width={25}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                  </svg>
                </button>

                <input 
                  type="file" 
                  id="profile-image-input" 
                  accept="image/*" 
                  style={{ display: 'none' }}  // Escondido
                  onChange={handleImageChange}  // Atualiza a imagem quando o arquivo é selecionado
                />
              </div>

              <div className="input-container">
                <div>
                  <label htmlFor="bio" className="floating-label">
                    Biografia
                    <button type='button' onClick={() => habilitarInput('bio')}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" width={17}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                      </svg>
                    </button>
                  </label>
                  <textarea id="bio" className="floating-input auto-expand" maxLength="400" onInput="adjustHeight(this)" onChange={handleChange} value={userData.bio} rows="4" placeholder=" "  disabled></textarea>
                </div>

                <div>
                  <label htmlFor="nome"  className="floating-label">
                    Nome
                    <button type='button' onClick={() => habilitarInput('nome')}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" width={17}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                      </svg>
                    </button>
                  </label>
                  <input type="text" id="nome" className="floating-input" onChange={handleChange} value={userData.nome}  placeholder="" disabled/>
                </div>
                
                <div>
                  <label htmlFor="email"  className="floating-label">
                    E-mail
                    <button  type='button' onClick={() => habilitarInput('email')}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" width={17}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                      </svg>
                    </button>
                  </label>
                  <input type="email" id="email" className="floating-input" onChange={handleChange} value={userData.email}  placeholder=" " disabled/>
                </div>
                
                <div>
                  <label htmlFor="profissao"  className="floating-label">
                    Profissão
                    <button type='button' onClick={() => habilitarInput('profissao')}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" width={17}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                      </svg>
                    </button>
                  </label>
                  <input type="text" id="profissao" className="floating-input" onChange={handleChange} value={userData.profissao}  placeholder=" " disabled/>
                </div>
              </div>
            </div>
            <div>
              <input type="text" id="rol" className='rol' value={userData.rol} onChange={handleChange}/>
            </div>
            

            <footer>
              <p className='creation-date'>© 2024 Kanban</p>
              <span type="text" id="profissao" className="creation-date"   placeholder=" " disabled> Perfil criado em: {userData.criacao}</span>
            </footer>

          </>
        )}
    </div>
    
  );
}



