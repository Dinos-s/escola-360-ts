import { useEffect, useState } from 'react';
import axios from 'axios';
import './CriaAluno.css';

function CriaAluno() {
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [turmas, setTurmas] = useState<{ id: number; nome: string; turno: string }[]>([]);
    const [form, setForm] = useState({
        nome: "",
        email: "",
        password: "",
        cpf: "",
        matricula: "",
        id_turma: "",
        status: "",
        deficiencia: "",
        tipoDeficiencia: "",
        dataNasc: ""
    });

    useEffect(() => {
        axios.get('http://localhost:3000/turma')
            .then(response => {
                setTurmas(response.data);
            })
            .catch(() => {
                setError('Erro ao carregar turmas');
            });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

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
                id_turma: "",
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
                                value={form.nome}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>CPF</label>
                            <input
                                type="text"
                                name="cpf"
                                value={form.cpf}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Matrícula</label>
                            <input
                                type="text"
                                name="matricula"
                                value={form.matricula}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Data de Nascimento</label>
                            <input
                                type="date"
                                name="dataNasc"
                                value={form.dataNasc}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* ---------- COLUNA 2 ---------- */}
                    <div className="column">

                        <div className="form-group">
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
                        </div>

                        <div className="form-group">
                            <label>Status</label>
                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                            >
                                <option value="">Selecione</option>
                                <option value="Ativo">Ativo</option>
                                <option value="Inativo">Inativo</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Deficiência</label>
                            <input
                                type="text"
                                name="deficiencia"
                                value={form.deficiencia}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Tipo de Deficiência</label>
                            <input
                                type="text"
                                name="tipoDeficiencia"
                                value={form.tipoDeficiencia}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Senha</label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>
        {/* ---------- BOTÕES ---------- */ }
        < div className = "action-buttons" >
                    <button type="submit" className="save-btn">Cadastrar</button>
                    <button type="button" className="cancel-btn">Cancelar</button>
                </div >
            </form >

        </div >
    );
}

export default CriaAluno;