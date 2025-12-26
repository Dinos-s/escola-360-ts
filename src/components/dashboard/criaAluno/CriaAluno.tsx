import { useState } from 'react';
import axios from 'axios';
import './CriaAluno.css';

function CriaAluno() {
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');    
    const [cpfError, setCpfError] = useState("");
    const [form, setForm] = useState({
        nome: "",
        email: "",
        password: "",
        cpf: "",
        matricula: "",
        status: "",
        deficiencia: "",
        tipoDeficiencia: "",
        dataNasc: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === 'deficiencia' && value === 'Não') {
            setForm(
                { 
                    ...form, 
                    [name]: value, 
                    tipoDeficiencia: '' 
                }
            );
            return
        }

        setForm({ ...form, [name]: value });

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
                setTimeout(() => { setCpfError("") }, 5000);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        if (cpfError) {
            setError("Corrija os erros do formulário antes de enviar.");
            return;
        }

        if (form.password.length < 6) {
            setError("A senha deve ter pelo menos 6 caracteres.");
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:3000/aluno/registro', form
            );

            setMessage(`Usuário ${response.data.nome} cadastrado com sucesso!`);

            setForm({
                nome: "",
                email: "",
                password: "",
                cpf: "",
                matricula: "",
                status: "",
                deficiencia: "",
                tipoDeficiencia: "",
                dataNasc: ""
            });

        } catch (err: any) {
            if (err.response && err.response.data) {
                const errorMessage = err.response.data.message;

                if (Array.isArray(errorMessage)) {
                    setError(errorMessage.join(', '));
                } else {
                    setError(errorMessage || 'Erro desconhecido');
                }
            } else {
                setError('Ocorreu um erro ao tentar cadastrar o aluno.');
            }
        }
        console.log("Dados enviados:", form);
        // Aqui você poderá usar axios.post("/alunos", form)
    };

    const limparForm = () => {
        setForm({
            nome: "",
            email: "",
            password: "",
            cpf: "",
            matricula: "",
            status: "",
            deficiencia: "",
            tipoDeficiencia: "",
            dataNasc: ""
        });
        setError('');
        setMessage('');
    };

    const validarCPF = (cpf:string) => {
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
        <div className="main-container">
            <h1 className="profile-title">Cadastro Aluno</h1>
            {/* Mensagens de erro ou sucesso */}
            {error && <p className="error message">{error}</p>}
            {message && <p className="success message">{message}</p>}
            <form onSubmit={handleSubmit}>
                <div className="profile-fields">

                    {/* ---------- COLUNA 1 ---------- */}
                    <div className="column">
                        <div className="form-group">
                            <label>Nome completo</label>
                            <input
                                type="text"
                                name="nome"
                                placeholder='Digite o nome completo do Aluno'
                                value={form.nome}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>CPF</label>
                            <input
                                type="text"
                                name="cpf"
                                placeholder="Digite o cpf do Aluno"
                                value={form.cpf}
                                onChange={handleChange}
                                className={cpfError ? "error" : ""}
                                required
                            />
                            {cpfError && <span className='spanErro'>{cpfError}</span>}
                        </div>

                        <div className="form-group">
                            <label>Matrícula</label>
                            <input
                                type="text"
                                name="matricula"
                                placeholder="Digite a matrícula do Aluno"
                                value={form.matricula}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>E-mail</label>
                            <input
                                type="email"
                                name="email"
                                placeholder='E-mail do Aluno'
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Data de Nascimento</label>
                            <input
                                type="date"
                                name="dataNasc"
                                value={form.dataNasc}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* ---------- COLUNA 2 ---------- */}
                    <div className="column">

                        {/* <div className="form-group">
                            <label>Turma</label>
                            <select
                                name="id_turma"
                                value={form.id_turma}
                                onChange={handleChange}
                            >
                                <option value="">Selecione a turma</option>
                                {turmas.map((turma) => (
                                    <option key={turma.id} value={turma.id}>
                                        {turma.nome} - {turma.turno}
                                    </option>
                                ))}
                            </select>
                        </div> */}

                        <div className="form-group">
                            <label>Status</label>
                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Selecione</option>
                                <option value="Ativo">Ativo</option>
                                <option value="Inativo">Inativo</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Deficiência</label>
                            <select name="deficiencia" value={form.deficiencia} onChange={handleChange}>
                                <option value="">Selecione</option>
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Tipo de Deficiência</label>
                            <input
                                type="text"
                                name="tipoDeficiencia"
                                placeholder='Especifique o tipo de deficiência'
                                value={form.tipoDeficiencia}
                                onChange={handleChange}
                                disabled={form.deficiencia !== 'Sim'}
                                required
                                className={`
                                    border rounded px-3 py-2 w-full
                                    ${form.deficiencia !== "Sim"
                                        ? "cursor-not-allowed bg-gray-100 opacity-50 text-gray-400"
                                        : "cursor-text bg-white"}
                                `}
                            />
                        </div>

                        <div className="form-group">
                            <label>Senha</label>
                            <input
                                type="password"
                                name="password"
                                placeholder='Senha de acesso do Aluno'
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                </div>
        {/* ---------- BOTÕES ---------- */ }
        < div className = "action-buttons" >
                    <button type="submit" className="save-btn">Cadastrar</button>
                    <button type="button" className="cancel-btn" onClick={limparForm}>Cancelar</button>
                </div >
            </form >

        </div >
    );
}

export default CriaAluno;