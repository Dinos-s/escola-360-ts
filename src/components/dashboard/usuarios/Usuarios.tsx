import { useState, useEffect } from "react";
import axios from "axios";
import "./Usuarios.css";

const alunos = [
  {
    id: 1,
    matricula: "2025001",
    turma: "6º Ano A",
    nome: "Bruno Ferreira Lima",
    email: "bruno.lima@escola.com",
    tipo: "Aluno",
    status: "Ativo"
  },
  {
    id: 2,
    matricula: "2025002",
    turma: "7º Ano B",
    nome: "Diana Pereira Alves",
    email: "diana.alves@escola.com",
    tipo: "Aluno",
    status: "Inativo"
  },
  {
    id: 3,
    matricula: "2025003",
    turma: "8º Ano C",
    nome: "Eduardo Costa Ramos",
    email: "eduardo.ramos@escola.com",
    tipo: "Aluno",
    status: "Pre-cadastro"
  }
];

const professores = [
  {
    id: 4,
    disciplina: "Matemática",
    nome: "Ana Carolina Souza",
    email: "ana.souza@escola.com",
    tipo: "Professor",
    status: "Ativo"
  },
  {
    id: 5,
    disciplina: "História",
    nome: "Carlos Eduardo Mendes",
    email: "carlos.mendes@escola.com",
    tipo: "Professor",
    status: "Ativo"
  }
];

// Aluno
interface Aluno {
  id: number;
  nome: string;
  email: string;
  password?: string;
  cpf: string;
  matricula: string;
  status: string;
  deficiencia: string;
  tipoDeficiencia?: string;
  dataNasc: string;
  tipo: "Aluno";
}

// Professor
interface Professor {
  id: number;
  nome: string;
  email: string;
  password?: string;
  cpf: string;
  matricula: string;
  status: string;
  dataAdmissao: string;
  formacaoAcad: string;
  titulacao: string;
  deficiencia: string;
  tipoDeficiencia?: string;
  tipo: "Professor";
}


function Usuarios() {
  // Estado para controlar qual lista está sendo exibida/filtrada (alunos, professores, todos)
  const [perfilExibido, setPerfilExibido] = useState("todos");
  // Estado para controlar o filtro de status
  const [filtroStatus, setFiltroStatus] = useState("Todos");
  // Estado para controlar qual formulário de cadastro deve aparecer (Aluno ou Professor)
  const [perfilCadastro, setPerfilCadastro] = useState("");

  const [termoBusca, setTermoBusca] = useState("");
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{

    const carregarDados = async () => {
      setLoading(true)

      try {
        const [resAlunos, resProfessores] = await Promise.all([
          axios.get("http://localhost:3000/aluno"),
          axios.get("http://localhost:3000/professor"),
        ])

        // Normalização dos dados
        const alunosFormatados = resAlunos.data.map(aluno => ({
          ...aluno,
          tipo: "Aluno"
        }));

        const professoresFormatados = resProfessores.data.map(prof => ({
          ...prof,
          tipo: "Professor"
        }));

        setAlunos(alunosFormatados)
        setProfessores(professoresFormatados)

      } catch (error) {
        console.error("Error ao carregar Usuários", error);
      } finally {
        setLoading(false)
      }
    }

    carregarDados();
  }, [])

  // Combinei as listas para a aba 'Todos'
  const todosUsuarios = [...alunos, ...professores];

  // Opções de filtro de Status (Todos, Ativo, Inativo, Pre-cadastro)
  const statusDeFiltro = ["Todos", "Ativo", "Inativo", "Pre-cadastro"];

  // Define a lista de dados base para o filtro
  const listaBase = perfilExibido === 'alunos' 
    ? alunos 
    : perfilExibido === 'professores' 
      ? professores 
      : todosUsuarios;

  // Lógica de Filtragem pelo Status Selecionado
  const usuariosPorStatus = listaBase.filter(usuario => {
    if (filtroStatus === "Todos") {
      return true;
    }
    return usuario.status === filtroStatus;
  });

  const usuariosFiltrados = usuariosPorStatus.filter(usuario => {
    const termoLower = termoBusca.toLowerCase();
    
    // Se o termo de busca estiver vazio, retorna todos os usuários filtrados por status
    if (!termoLower) {
      return true;
    }

    // Campos a serem buscados, unificados em string minúscula
    const nome = usuario.nome.toLowerCase();
    const email = usuario.email.toLowerCase();
    // Adicione outros campos relevantes dependendo do TIPO (Aluno ou Professor)
    
    // Campos específicos de Aluno
    const matricula = usuario.matricula ? usuario.matricula.toLowerCase() : '';
    // CPF (se existir, adicione-o no objeto de dados e use aqui)
    // const cpf = usuario.cpf ? usuario.cpf.toLowerCase() : '';

    // Verifica se o termo existe em qualquer um dos campos
    const encontrado = nome.includes(termoLower) || email.includes(termoLower) || matricula.includes(termoLower);
    
    return encontrado;
  });

  // Função para lidar com a seleção do FORMULÁRIO de cadastro
  const handleCadastroChange = (e) => {
    setPerfilCadastro(e.target.value);
  };
  
  // Função para lidar com a TABELA de exibição
  const handleAbaChange = (tipo:string) => {
    setPerfilExibido(tipo.toLowerCase());
    setFiltroStatus("Todos");
    setTermoBusca(""); // Resetar busca ao mudar de aba
  };

  const handleBuscaChange = (e) => {
    setTermoBusca(e.target.value);
  };

  const handleInativar = async (id: number, tipo: string, statusAtual: string) => {
  try {
    const novoStatus = statusAtual === "Ativo" ? "Inativo" : "Ativo";

    const endpoint =
      tipo === "Aluno"
        ? `http://localhost:3000/aluno/${id}/status`
        : `http://localhost:3000/professor/${id}/status`;

    await axios.patch(endpoint, { status: novoStatus });

    if (tipo === "Aluno") {
      setAlunos(prev =>
        prev.map(u =>
          u.id === id ? { ...u, status: novoStatus } : u
        )
      );
    } else {
      setProfessores(prev =>
        prev.map(u =>
          u.id === id ? { ...u, status: novoStatus } : u
        )
      );
    }

  } catch (error) {
    console.error("Erro ao alterar status do usuário", error);
  }
};

  
  // Componente auxiliar para renderizar a tabela
  const TabelaDeUsuarios = ({ dados, tipo }) => (
    <div className="table-responsive-users">
      <table className="user-table">
        <thead>
          <tr>
            {/* <th>ID</th> */}
            <th>Nome</th>
            <th>E-mail</th>
            {tipo === 'alunos' && <th>Matrícula / Turma</th>}
            {/* {tipo === 'professores' && <th>Disciplina</th>} */}
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {dados.length > 0 ? (
            dados.map((usuario) => (
              <tr key={`${usuario.tipo}-${usuario.id}`}>
                {/* <td>{usuario.id}</td> */}
                <td>{usuario.nome}</td>
                <td>{usuario.email}</td>
                {/* Informações específicas de Aluno */}
                {tipo === 'alunos' && 
                  <td>
                    {usuario.matricula} ({usuario.turma})
                  </td>
                }
                {/* Informações específicas de Professor */}
                {/* {tipo === 'professores' && <td>{usuario.disciplina}</td>} */}
                
                <td>
                  <span className={`status status-${usuario.status.toLowerCase().replace('-', '')}`}>{usuario.status}</span>
                </td>
                <td>
                  <div className="acoes">
                    <button className="action-btn edit-btn">Editar</button>
                    <button 
                    className="action-btn delete-btn" 
                    onClick={() => handleInativar(usuario.id, usuario.tipo, usuario.status)}>
                      {usuario.status === "Ativo" ? "Inativar" : "Ativar"}
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={tipo === 'alunos' ? 6 : tipo === 'professores' ? 5 : 6} style={{ textAlign: 'center', padding: '20px' }}>
                Nenhum(a) {tipo.slice(0, -1)} encontrado(a) com este status.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="container">
      <h2>Gerenciamento de Usuários</h2>
      
      {/* ------------------ Abas de Navegação (Lista) ------------------ */}
      <div className="tabs-container">
        {['Todos','Alunos', 'Professores'].map(tipo => (
          <button
            key={tipo}
            className={`tab-button ${perfilExibido === tipo.toLowerCase() ? 'active' : ''}`}
            onClick={() => handleAbaChange(tipo)}
          >
            {tipo}
          </button>
        ))}
      </div>
      
      {/* ------------------ Filtro de Status ------------------ */}
      <div className="search-filter-area">
        {/* NOVO INPUT DE BUSCA */}
        <input 
            type="text"
            placeholder="Buscar por nome, e-mail, matrícula..."
            value={termoBusca}
            onChange={handleBuscaChange}
            className="search-input"
        />
        
        <div className="filtro-area">
            <label htmlFor="filtroStatus">Filtrar por Status:</label>
            <select 
              id="filtroStatus" 
              value={filtroStatus} 
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="filtro-select"
            >
              {statusDeFiltro.map(status => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
        </div>
      </div>

      {/* ------------------ Tabela de Exibição ------------------ */}
      <TabelaDeUsuarios dados={usuariosFiltrados} tipo={perfilExibido} />

      <hr style={{ margin: '40px 0' }}/> 

      {/* ------------------ Seleção de Formulário (Cadastro) ------------------ */}
      <h3>Novo Cadastro</h3>
      <select className="select" name="perfil" id="perfil" value={perfilCadastro} onChange={handleCadastroChange}>
        <option value="">Escolha um perfil para cadastrar</option>
        <option value="alunos">Aluno</option>
        <option value="professores">Professor</option>
      </select>

      {/* Formulário de Aluno */}
      {perfilCadastro === "alunos" && (
        <div style={{ marginTop: "20px" }} className="cadastro-form">
          <h4>Cadastro de Aluno</h4>
          {/* ... (Seu formulário de aluno) ... */}
          <form id="form">
            <div className="form-group">
              <label>Nome do Aluno:</label>
              <input type="text" name="nomeAluno" />
            </div>
            <div className="form-group">
              <label>Matrícula:</label>
              <input type="text" name="matricula" />
            </div>
            <div className="form-group">
              <label>Turma:</label>
              <input type="text" name="turma" />
            </div>
            <button type="submit" className="button-primary">Cadastrar Aluno</button>
          </form>
        </div>
      )}

      {/* Formulário de Professor */}
      {perfilCadastro === "professores" && (
        <div style={{ marginTop: "20px" }} className="cadastro-form">
          <h4>Cadastro de Professor</h4>
          {/* ... (Seu formulário de professor) ... */}
          <form id="form">
            <div className="form-group">
              <label>Nome do Professor:</label>
              <input type="text" name="nomeProfessor" />
            </div>
            <div className="form-group">
              <label>Disciplina:</label>
              <input type="text" name="disciplina" />
            </div>
            <div className="form-group">
              <label>E-mail:</label>
              <input type="email" name="email" />
            </div>
            <button type="submit" className="button-primary">Cadastrar Professor</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Usuarios;