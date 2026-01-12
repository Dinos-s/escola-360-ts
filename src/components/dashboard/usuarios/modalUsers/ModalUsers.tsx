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
        {/* Botão X Superior */}
        <button
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Fechar"
        >
          &times;
        </button>

        <div className="modal-header">
          <h3>{modoEdicao ? "Editar Usuário" : "Novo Usuário"}</h3>
          {/* <p>
            Preencha as informações abaixo para{" "}
            {modoEdicao ? "atualizar" : "cadastrar"} os dados.
          </p> */}
        </div>

        <div className="modal-body">
          {!modoEdicao && (
            <div className="form-group-modal">
              <label>Tipo de Perfil</label>
              <select
                value={perfil}
                onChange={(e) => setPerfil(e.target.value)}
              >
                <option value="">Selecione o tipo</option>
                <option value="alunos">Aluno</option>
                <option value="professores">Professor</option>
              </select>
            </div>
          )}

          {perfil && (
            <div className="form-grid">
              <div className="form-group-modal full-width">
                <label>Nome Completo</label>
                <input
                  type="text"
                  placeholder="Ex: João Silva"
                  value={form.nome || ""}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                />
              </div>

              {!modoEdicao && (
                <div className="form-group-modal">
                  <label>CPF</label>
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    value={form.cpf || ""}
                    onChange={(e) => setForm({ ...form, cpf: e.target.value })}
                  />
                </div>
              )}

              <div className="form-group-modal">
                <label>E-mail</label>
                <input
                  type="email"
                  placeholder="email@escola.com"
                  value={form.email || ""}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              {/* Lógica condicional para campos específicos */}
              {perfil === "alunos" && (
                <div className="form-group-modal">
                  <label>Data de Nascimento</label>
                  <input
                    type="date"
                    value={form.dataNascimento || ""}
                    onChange={(e) =>
                      setForm({ ...form, dataNascimento: e.target.value })
                    }
                  />
                </div>
              )}

              <div className="form-group-modal">
                <label>Matrícula</label>
                <input
                  type="number"
                  placeholder="Nº Matrícula"
                  value={form.matricula || ""}
                  disabled={modoEdicao}
                  onChange={(e) =>
                    setForm({ ...form, matricula: e.target.value })
                  }
                />
              </div>

              {perfil === "professores" && (
                <>
                  <div className="form-group-modal">
                    <label>Data de Admissão</label>
                    <input
                      type="date"
                      value={form.dataAdmissao || ""}
                      onChange={(e) =>
                        setForm({ ...form, dataAdmissao: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group-modal full-width">
                    <label>Titulação</label>
                    <input
                      type="text"
                      placeholder="Ex: Mestre"
                      value={form.titulacao || ""}
                      onChange={(e) =>
                        setForm({ ...form, titulacao: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group-modal full-width">
                    <label>Formação Acadêmica</label>
                    <input
                      type="text"
                      placeholder="Ex: Licenciatura em Matemática"
                      value={form.formacaoAcademica || ""}
                      onChange={(e) =>
                        setForm({ ...form, formacaoAcademica: e.target.value })
                      }
                    />
                  </div>
                </>
              )}

              {!modoEdicao && (
                <>
                  <div className="form-group-modal">
                    <label>Status</label>
                    <select
                      value={form.status || ""}
                      onChange={(e) =>
                        setForm({ ...form, status: e.target.value })
                      }
                    >
                      <option value="">Selecione</option>
                      <option value="Ativo">Ativo</option>
                      <option value="Inativo">Inativo</option>
                    </select>
                  </div>

                  <div className="form-group-modal">
                    <label>Possui Deficiência?</label>
                    <select
                      value={form.deficiencia || ""}
                      onChange={(e) =>
                        setForm({ ...form, deficiencia: e.target.value })
                      }
                    >
                      <option value="">Selecione</option>
                      <option value="sim">Sim</option>
                      <option value="nao">Não</option>
                    </select>
                  </div>
                </>
              )}

              {form.deficiencia === "sim" && (
                <div className="form-group-modal full-width">
                  <label>Tipo de Deficiência</label>
                  <input
                    type="text"
                    value={form.tipoDeficiencia || ""}
                    onChange={(e) =>
                      setForm({ ...form, tipoDeficiencia: e.target.value })
                    }
                  />
                </div>
              )}

              {!modoEdicao && (
                <div className="form-group-modal full-width">
                  <label>Senha Provisória</label>
                  <input
                    type="password"
                    placeholder="********"
                    value={form.senha || ""}
                    onChange={(e) =>
                      setForm({ ...form, senha: e.target.value })
                    }
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-submit" onClick={onSubmit}>
            {modoEdicao ? "Salvar Alterações" : "Finalizar Cadastro"}
          </button>
        </div>
      </div>
    </div>
  );
}
