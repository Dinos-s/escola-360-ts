import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import logoTipo from '../assets/LOGOTIPO.png';
import '../components/Form.css';
// import '../App.css';

function FormCadastro() {
    const navigate = useNavigate();
    const [cpfError, setCpfError] = useState("");
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        dataNascimento: '',
        cpf: '',
        password: '',
        confirmPass: ''
    })

    // Função genérica para atualizar o estado quando qualquer campo do formulário mudar.
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })

        if (name === "cpf") {
            const cpfLimpo = value.replace(/\D/g, "");

            if (cpfLimpo.length === 11) {
                if (!validarCPF(cpfLimpo)) {
                    setCpfError("CPF inválido");
                } else {
                    setCpfError("");
                }
            } else {
                setCpfError("CPF deve conter 11 dígitos");
            }
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // Aqui você pode fazer o que quiser com os dados do formulário
        if (formData.password == formData.confirmPass) {
            console.log(formData);
            if (cpfError) {
                alert("Por favor, corrija o CPF antes de continuar.");
                return;
            }
            navigate('/');
        } else {
            alert("As senhas não coincidem. Por favor, tente novamente.");
        }
    }

    const validarCPF = (cpf) => {
        cpf = cpf.replace(/\D/g, '');

        if (cpf.length !== 11) return false;

        // Impede CPFs repetidos: 00000000000, 11111111111, etc.
        if (/^(\d)\1{10}$/.test(cpf)) return false;

        let soma = 0;
        let resto;

        // Primeiro dígito
        for (let i = 1; i <= 9; i++) {
            soma += parseInt(cpf[i - 1]) * (11 - i);
        }
        resto = (soma * 10) % 11;

        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf[9])) return false;

        // Segundo dígito
        soma = 0;
        for (let i = 1; i <= 10; i++) {
            soma += parseInt(cpf[i - 1]) * (12 - i);
        }
        resto = (soma * 10) % 11;

        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf[10])) return false;

        return true;
    };


    return (
        <div className='form-container'>
            <div className="logo">
                <img src={logoTipo} alt="logotipo" />
            </div>

            <div className="login-card">
                <h2>Formulário de Cadastro</h2>
                <form onSubmit={handleSubmit}>
                    <div className='input-group'>
                        <label htmlFor="name">Nome:</label>
                        <input type="text" id="name" name='name' value={formData.name} onChange={handleChange} required />
                    </div>

                    <div className='input-group'>
                        <label htmlFor="cpf">CPF:</label>
                        <input type="text" id="cpf" name='cpf' className={cpfError ? "error" : ""} value={formData.cpf} onChange={handleChange} required />
                        {cpfError && <span className='spanErro'>{cpfError}</span>}
                    </div>

                    <div className='input-group'>
                        <label htmlFor="dataNascimento">Data de Nascimento:</label>
                        <input type="date" id="dataNascimento" name='dataNascimento' value={formData.dataNascimento} onChange={handleChange} required />
                    </div>

                    <div className='input-group'>
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" name='email' value={formData.email} onChange={handleChange} required />
                    </div>

                    <div className='input-group'>
                        <label htmlFor="password">Senha:</label>
                        <input type="password" id="password" name='password' value={formData.password} onChange={handleChange} required />
                    </div>

                    <div className='input-group'>
                        <label htmlFor="confirmPass">Confirmar Senha:</label>
                        <input type="password" id="confirmPass" name='confirmPass' value={formData.confirmPass} onChange={handleChange} required />
                    </div>

                    <button className='btn-login' type="submit">Cadastrar</button>
                </form>

                <div className="signup-link">
                    <p>
                        <Link to="/">Faça login</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default FormCadastro;