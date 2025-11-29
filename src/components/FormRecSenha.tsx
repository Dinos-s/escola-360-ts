import { useState } from 'react'
import { Link } from 'react-router-dom';
import logoTipo from '../assets/LOGOTIPO.png';
import '../components/Form.css';
// import '../App.css';

function FormRecSenha() {
    const [email, setEmail] = useState('')
    const [cpf, setCpf] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('Form submitted:', { email, cpf })
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
                        <label htmlFor="cpf">CPF:</label>
                        <input
                            type="text"
                            id="cpf"
                            value={cpf}
                            onChange={(e) => setCpf(e.target.value)}
                        />
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

                    <div className="forgot-password">
                        <a href="#">Um e-mail será envido, para criar uma nova senha</a>
                    </div>

                    <button className='btn-login' type="submit">Entrar</button>
                </form>

                <div className="signup-link">
                    <p>
                        <Link to="/">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default FormRecSenha;
