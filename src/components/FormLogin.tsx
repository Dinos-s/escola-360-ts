import { useState } from "react";
import { Link } from "react-router-dom";
import logoTipo from '../assets/LOGOTIPO.png'
import axios from "axios";
import '../components/Form.css'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function FormLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessage('');
    setError('');

    try {
      const response = await axios.post(
        'http://localhost:3000/login/login', {
        email,
        password
      })

      const token = response.data.access_token;      
      localStorage.setItem('authToken', token);


      // Desestruturando os dados do backend
      const { access_token, role } = response.data;

      // Salva token + tipo do usuário
      localStorage.setItem('authToken', access_token);
      localStorage.setItem('tipoUser', role);

      // setMessage('Login realizado com sucesso!');
      // setEmail('');
      // setPassword('');

      // Redirecionamento por perfil
      if (role === "coordenador") {
        window.location.href = "/dashboard";
      } else if (role === "professor") {
        window.location.href = "/dashboard";
      } else if (role === "aluno") {
        window.location.href = "/dashboard";
      } else {
        window.location.href = "/";
      }

      setMessage('Login realizado com sucesso!');
      setEmail('');
      setPassword('');

    } catch (err: any) {
      if (err.response && err.response.data) {

        const errorMessage = err.response.data.message;

        if (Array.isArray(errorMessage)) {
          setError(errorMessage.join(', '));
        } else {
          setError(errorMessage || 'Erro desconhecido');
        }

      } else {
        setError('Ocorreu um erro ao tentar fazer login.');
      }
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div className="form-container">
      <div className="logo">
        <img src={logoTipo} alt="Escola 360" />
      </div>

      <div className="login-card">
        <h2>Login</h2>
        {/* Mensagens de erro ou sucesso */}
        {error && <p className="error message">{error}</p>}
        {message && <p className="success message">{message}</p>}
        <form onSubmit={handleSubmit}>

          {/* <div className="tipoUser-group">
            {/* <label className="tipoUser-label">Qual o seu tipo de usuário?</label> *}
            <div className="radio-options">
              <label className={`radio-label ${tipoUser === 'Aluno' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="tipoUser"
                  value="Aluno"
                  className="radio-input"
                  checked={tipoUser === 'Aluno'}
                  onChange={(e) => setTipoUser(e.target.value)}
                />
                Aluno
              </label>
              <label className={`radio-label ${tipoUser === 'Professor' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="tipoUser"
                  value="Professor"
                  className="radio-input"
                  checked={tipoUser === 'Professor'}
                  onChange={(e) => setTipoUser(e.target.value)}
                />
                Professor
              </label>
              <label className={`radio-label ${tipoUser === 'Coordenador' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="tipoUser"
                  value="Coordenador"
                  className="radio-input"
                  checked={tipoUser === 'Coordenador'}
                  onChange={(e) => setTipoUser(e.target.value)}
                />
                Coordenador
              </label>
            </div>
          </div> */}

          <div className='input-group'>
            <label htmlFor="email">E-mail / Matrícula:</label>
            <input
              type="text"
              id="email"
              placeholder="ex: email@example.com.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
               required
            />
          </div>

          <div className="input-group password-group">
            <label htmlFor="password">Senha:</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="password-toggle-btn"
                onClick={togglePasswordVisibility}
                aria-label={
                  showPassword
                    ? "Esconder senha"
                    : "Mostrar senha"
                }
              >
                {
                  <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                  />
                }
              </button>
            </div>
          </div>

          {/* <div className="forgot-password">
            <Link to="/recSenha">Esqueceu sua senha?</Link>
          </div> */}

          <button className='btn-login' type="submit">Entrar</button>
        </form>

        {/* <div className="signup-link">
          <p>
            <Link to="/cadastro">Cadastre-se</Link>
          </p>
        </div> */}
      </div>
    </div>
  )
}
export default FormLogin