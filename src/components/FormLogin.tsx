import { useState } from "react";
import { Link } from "react-router-dom";
import logoTipo from '../assets/LOGOTIPO.png'
import '../components/Form.css'

function FormLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  }

  return (
    <div className="form-container">
      <div className="logo">
        <img src={logoTipo} alt="Escola 360" />
      </div>

      <div className="login-card">
        <h2>Formulário de Login</h2>
        <form onSubmit={handleSubmit}>
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