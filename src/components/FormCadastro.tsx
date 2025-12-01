import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import logoTipo from '../assets/LOGOTIPO.png';
import '../components/Form.css';
// import '../App.css';

function FormCadastro() {
    const navigate = useNavigate();
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
    }

    // const buscarCep = async (cep) => {
    //     const cepLimpo = cep.replace(/\D/g, '');
    //     if (cepLimpo.length === 8) {
    //         try {
    //             const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    //             const data = await response.json();
    //             if (!data.erro) {
    //                 setFormData(prevData => ({
    //                     ...prevData,
    //                     logradouro: data.logradouro || '',
    //                     bairro: data.bairro || '',
    //                     cidade: data.localidade || '',
    //                     estado: data.uf || '',
    //                     complemento: data.complemento || '',
    //                 }));
    //             } else {
    //                 alert('CEP inválido ou não encontrado. Tente novamente.');
    //             }
    //         } catch (error) {
    //             console.error('Erro ao buscar CEP:', error);
    //             alert('CEP inválido ou não encontrado. Tente novamente.');
    //         }
    //     }
    // }

    // const handleCepChange = (dados) => {
    //     const { value } = dados.target;
    //     setFormData({ ...formData, cep: value });

    //     if (value.replace(/\D/g, '').length === 8) {
    //         buscarCep(value);
    //     }
    // }

    const handleSubmit = (e) => {
        e.preventDefault()
        // Aqui você pode fazer o que quiser com os dados do formulário
        if (formData.password == formData.confirmPass) {
            console.log(formData);
            navigate('/');
        } else {
            alert("As senhas não coincidem. Por favor, tente novamente.");
        }
    }

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
                        <input type="text" id="cpf" name='cpf' value={formData.cpf} onChange={handleChange} required />
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

                    {/* Seção para Endereço */}
                    {/* <div className="input-group">
                        <label htmlFor="cep">CEP:</label>
                        <input type="text" id="cep" name='cep' value={formData.cep} onChange={handleCepChange} placeholder='Digite o CEP' required />
                    </div>

                    <div className="input-group">
                        <label htmlFor="logradouro">Logradouro:</label>
                        <input type="text" id="logradouro" name='logradouro' value={formData.logradouro} placeholder='Rua, Avenida, etc.' onChange={handleChange} required />
                    </div>

                    <div className="input-group">
                        <label htmlFor="numero">Número:</label>
                        <input type="text" id="numero" name='numero' value={formData.numero} onChange={handleChange} placeholder='Número' required />
                    </div>

                    <div className="input-group">
                        <label htmlFor="complemento">Complemento:</label>
                        <input type="text" id="complemento" name='complemento' value={formData.complemento} onChange={handleChange} placeholder='Apto, Bloco, etc.' />
                    </div>

                    <div className="input-group">
                        <label htmlFor="bairro">Bairro:</label>
                        <input type="text" id="bairro" name='bairro' value={formData.bairro} onChange={handleChange} placeholder='Bairro' required />
                    </div>

                    <div className="input-group">
                        <label htmlFor="cidade">Cidade:</label>
                        <input type="text" id="cidade" name='cidade' value={formData.cidade} onChange={handleChange} placeholder='Cidade' required />
                    </div>

                    <div className="input-group">
                        <label htmlFor="estado">Estado:</label>
                        <input type="text" id="estado" name='estado' value={formData.estado} onChange={handleChange} placeholder='Estado UF' required />
                    </div> */}

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