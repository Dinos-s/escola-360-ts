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
              placeholder="Nome"
              value={form.nome || ""}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
            />
            <input
              placeholder="E-mail"
              value={form.email || ""}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            {perfil === "alunos" && (
              <input
                placeholder="Matrícula"
                value={form.matricula || ""}
                disabled={modoEdicao}
                onChange={(e) => setForm({ ...form, matricula: e.target.value })}
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
