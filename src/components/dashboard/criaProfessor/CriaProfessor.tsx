import { useState } from 'react';
import './CriaProfessor.css';

function CriaProfessor() {
    const [form, setForm] = useState({
        nome: "",
        cpf: "",
        matricula: "",
        turma: "",
        disciplina: "",
        status: "",
        deficiencia: "",
        nascimento: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Dados enviados:", form);
        // Aqui você poderá usar axios.post("/alunos", form)
    };

    return (
        <div className="main-container">
            <h1 className="profile-title">Cadastro Aluno</h1>

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
                                placeholder="Digite o nome do aluno"
                            />
                        </div>

                        <div className="form-group">
                            <label>CPF</label>
                            <input 
                                type="text"
                                name="cpf"
                                value={form.cpf}
                                onChange={handleChange}
                                placeholder="Digite o CPF"
                            />
                        </div>

                        <div className="form-group">
                            <label>Disciplina</label>
                            <input 
                                type="text"
                                name="disciplina"
                                value={form.disciplina}
                                onChange={handleChange}
                                placeholder="Digite a disciplina"
                            />
                        </div>

                        <div className="form-group">
                            <label>Matrícula</label>
                            <input 
                                type="text"
                                name="matricula"
                                value={form.matricula}
                                onChange={handleChange}
                                placeholder="Número da matrícula"
                            />
                        </div>

                    </div>

                    {/* ---------- COLUNA 2 ---------- */}
                    <div className="column">

                        <div className="form-group">
                            <label>Turma</label>
                            <input 
                                type="text"
                                name="turma"
                                value={form.turma}
                                onChange={handleChange}
                                placeholder="Digite a turma"
                            />
                        </div>

                        <div className="form-group">
                            <label>Status</label>
                            <select 
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                            >
                                <option value="">Selecione status</option>
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
                                placeholder="Caso tenha, descreva"
                            />
                        </div>

                    </div>
                </div>

                {/* ---------- BOTÕES ---------- */}
                <div className="action-buttons">
                    <button type="submit" className="save-btn">Cadastrar</button>
                    <button type="button" className="cancel-btn">Cancelar</button>
                </div>
            </form>

        </div>
    );
}

export default CriaProfessor;