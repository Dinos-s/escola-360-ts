import { useState } from "react";
import { Link } from "react-router-dom";
import logoTipo from '../assets/LOGOTIPO.png'
import axios from "axios";
import '../components/Form.css'

function FormLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [tipoUser, setTipoUser] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessage('');
    setError('');

    try {
      const response = await axios.post(
        'http://localhost:3000/user/login', {
        email,
        password,
        tipoUser
      })

      const token = response.data.access_token;
      localStorage.setItem('authToken', token);
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

  return (
    <div className="form-container">
      <div className="logo">
        <img src={logoTipo} alt="Escola 360" />
      </div>

      <div className="login-card">
        <h2>Formulário de Login</h2>
        {/* Mensagens de erro ou sucesso */}
        {error && <p className="error message">{error}</p>}
        {message && <p className="success message">{message}</p>}
        <form onSubmit={handleSubmit}>

          <div className="tipoUser-group">
            <label className="tipoUser-label">Qual o seu tipo de usuário?</label>
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
          </div>

          <div className='input-group'>
            <label htmlFor="email">E-mail:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className='input-group'>
            <label htmlFor="password">Senha:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="forgot-password">
            <Link to="/recSenha">Esqueceu sua senha?</Link>
          </div>

          <button className='btn-login' type="submit">Entrar</button>
        </form>

        <div className="signup-link">
          <p>
            <Link to="/cadastro">Cadastre-se</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
export default FormLogin