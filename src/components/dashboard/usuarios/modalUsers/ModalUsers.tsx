import "./UsuarioModal.css";

interface Props {
  aberto: boolean;
  modoEdicao: boolean;
  perfil: string;
  form: any;
  setForm: (v: any) => void;
  setPerfil: (v: any) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export default function UsuarioModal({
  aberto,
  modoEdicao,
  perfil,
  form,
  setForm,
  setPerfil,
  onClose,
  onSubmit,
}: Props) {
  if (!aberto) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{modoEdicao ? "Editar Usuário" : "Novo Usuário"}</h3>

        {!modoEdicao && (
          <select value={perfil} onChange={(e) => setPerfil(e.target.value)}>
            <option value="">Selecione o tipo</option>
            <option value="alunos">Aluno</option>
            <option value="professores">Professor</option>
          </select>
        )}

        {perfil && (
          <>
            <input
              type="text"
              placeholder="Nome"
              value={form.nome || ""}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
            />

            {!modoEdicao && (
              <input
                type="text"
                placeholder="CPF"
                value={form.cpf || ""}
                onChange={(e) => setForm({ ...form, cpf: e.target.value })}
              />
            )}

            <input
              type="email"
              placeholder="E-mail"
              value={form.email || ""}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            {!modoEdicao && perfil === "alunos" && (
              <input
                type="date"
                placeholder="data de nascimento"
                value={form.dataNascimento || ""}
                onChange={(e) => setForm({ ...form, dataNascimento: e.target.value })}
              />
            )}

            
            <input
              type="number"
              placeholder="Matrícula"
              value={form.matricula || ""}
              disabled={modoEdicao}
              onChange={(e) => setForm({ ...form, matricula: e.target.value })}
            />

            {perfil === "professores" && (
              <input
                type="date"
                placeholder="Data de Adimissão"
                value={form.dataAdmissao || ""}
                onChange={(e) => setForm({ ...form, dataAdmissao: e.target.value })}
              />
            )}

            {perfil === "professores" && (
              <input
                type="text"
                placeholder="Titularidade"
                value={form.titulacao || ""}
                onChange={(e) => setForm({ ...form, titulacao: e.target.value })}
              />
            )}

            {perfil === "professores" && (
              <input
                type="text"
                placeholder="Formação Acadêmica"
                value={form.formacaoAcademica || ""}
                onChange={(e) => setForm({ ...form, formacaoAcademica: e.target.value })}
              />
            )}

            {!modoEdicao && (
              <select
                value={form.status || ""}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="">Selecione o status</option>
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>
            )}

            {!modoEdicao && (
              <select
                value={form.deficiencia || ""}
                onChange={(e) => setForm({ ...form, deficiencia: e.target.value })}
              >
                <option value="">Possui Deficiência?</option>
                <option value="sim">Sim</option>
                <option value="nao">Não</option>
              </select>
            )}

            {!modoEdicao && form.deficiencia === "sim" && (
              <input
                type="text"
                placeholder="Tipo de Deficiência"
                value={form.tipoDeficiencia || ""}
                onChange={(e) => setForm({ ...form, tipoDeficiencia: e.target.value })}
              />
            )}

            {!modoEdicao && (
              <input
                type="password"
                placeholder="Senha"
                value={form.senha || ""}
                onChange={(e) => setForm({ ...form, senha: e.target.value })}
              />
            )}

            <div className="modal-actions">
              <button className="btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button className="btn-primary" onClick={onSubmit}>
                {modoEdicao ? "Atualizar" : "Cadastrar"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
