import { Navigate, Route, Routes } from 'react-router-dom'
import FormCadastro from './components/FormCadastro'
import FormLogin from './components/FormLogin'
import './App.css'

import FormRecSenha from './components/FormRecSenha'
import Dashboard from './components/dashboard/Dashboard'
import Mural from './components/dashboard/Mural'
import Perfil from './components/dashboard/perfil/Perfil'
import TrocaSenha from './components/dashboard/trocaSenha/TrocaSenha'
import Graficos from './components/dashboard/graficos/Graficos'
import Usuarios from './components/dashboard/usuarios/Usuarios'
import Calendario from './components/dashboard/calendario/Calendario'
import CriaCalendario from './components/dashboard/criaCalendario/CriaCalendario'
import Notas from './components/dashboard/notas/Notas'
import Boletim from './components/dashboard/boletim/Boletim'
import Historico from './components/dashboard/historico/Historico'
import Presenca from './components/dashboard/presenca/Presenca'
import CriaMural from './components/dashboard/criaMural/CriaMural'
import ConfNotas from './components/dashboard/confNotas/ConfNotas'
import CriaAluno from './components/dashboard/criaAluno/CriaAluno'
import CriaProfessor from './components/dashboard/criaProfessor/CriaProfessor'
import Disciplina from './components/dashboard/disciplina/Disciplina'

function ProtectedRoute({ children }: any) {
  const token = localStorage.getItem("authToken");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function RoleBasedRoute({ children, allowed }: any) {
  const tipoUser = localStorage.getItem("tipoUser");

  if (!allowed.includes(tipoUser)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function App() {

  return (
    <Routes>
      <Route path="/" element={<FormLogin />} />
      <Route path="/cadastro" element={<FormCadastro />} />
      <Route path='/recSenha' element={<FormRecSenha />} />

      {/* rotas dinamicas, para autenticação */}
      <Route path='/dashboard' element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }>
        <Route index element={<Mural />}/>

        {/* ALUNO */}
        <Route path="graficos" element={
          <RoleBasedRoute allowed={["aluno"]}>
            <Graficos />
          </RoleBasedRoute>
        } />

        <Route path="boletim" element={
          <RoleBasedRoute allowed={["aluno"]}>
            <Boletim />
          </RoleBasedRoute>
        } />

        <Route path="historico" element={
          <RoleBasedRoute allowed={["aluno"]}>
            <Historico />
          </RoleBasedRoute>
        } />

        {/* PROFESSOR */}
        <Route path="notas" element={
          <RoleBasedRoute allowed={["professor"]}>
            <Notas />
          </RoleBasedRoute>
        } />

        <Route path="presenca" element={
          <RoleBasedRoute allowed={["professor"]}>
            <Presenca />
          </RoleBasedRoute>
        } />

        {/* COORDENADOR */}
        <Route path="usuarios" element={
          <RoleBasedRoute allowed={["coordenador"]}>
            <Usuarios />
          </RoleBasedRoute>
        } />

        <Route path='usuarios' element={
          <RoleBasedRoute allowed={["coordenador"]}>
            <Usuarios />
          </RoleBasedRoute>
        } />

        <Route path="crimural" element={
          <RoleBasedRoute allowed={["coordenador"]}>
            <CriaMural />
          </RoleBasedRoute>
        } />

        <Route path="confNotas" element={
          <RoleBasedRoute allowed={["coordenador"]}>
            <ConfNotas />
          </RoleBasedRoute>
        } />
        <Route path="criCalendario" element={
          <RoleBasedRoute allowed={["coordenador"]}>
            <CriaCalendario />
          </RoleBasedRoute>
        } />

        <Route path="criaAluno" element={
          <RoleBasedRoute allowed={["coordenador"]}>
            <CriaAluno />
          </RoleBasedRoute>
        } />

        <Route path="criaProfessor" element={
          <RoleBasedRoute allowed={["coordenador"]}>
            <CriaProfessor />
          </RoleBasedRoute>
        } />

        <Route path="disciplina" element={
          <RoleBasedRoute allowed={["coordenador"]}>
            <Disciplina />
          </RoleBasedRoute>
        } />
        
        {/* ROTAS ACESSÍVEIS PARA TODOS OS USUÁRIOS */}
        <Route path='trocaSenha' element={<TrocaSenha />} />
        <Route path="perfil" element={<Perfil />} />
        <Route path='calendario' element={<Calendario />} />
      </Route>
    </Routes>
  )
}

export default App





// // ============================================
// // 1. ROTA PROTEGIDA
// // ============================================
// function ProtectedRoute({ children }: any) {
//   const token = localStorage.getItem("authToken");

//   if (!token) {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// }

// // ============================================
// // 2. ROTA PROTEGIDA POR PERFIL
// // ============================================
// function RoleBasedRoute({ children, allowed }: any) {
//   const tipoUser = localStorage.getItem("tipoUser");

//   if (!allowed.includes(tipoUser)) {
//     return <Navigate to="/dashboard" replace />;
//   }

//   return children;
// }

// // ============================================
// // 3. APP PRINCIPAL
// // ============================================
// function App() {

//   return (
//     <Routes>
//       {/* TELAS LIVRES */}
//       <Route path="/" element={<FormLogin />} />
//       <Route path="/cadastro" element={<FormCadastro />} />
//       <Route path="/recSenha" element={<FormRecSenha />} />

//       {/* DASHBOARD PROTEGIDO */}
//       <Route
//         path="/dashboard"
//         element={
//           <ProtectedRoute>
//             <Dashboard />
//           </ProtectedRoute>
//         }
//       >

//         {/* ROTA PADRÃO */}
//         <Route index element={<Mural />} />

//         {/* ALUNO */}
//         <Route path="graficos" element={<RoleBasedRoute allowed={["aluno"]}><Graficos /></RoleBasedRoute>} />
//         <Route path="boletim" element={<RoleBasedRoute allowed={["aluno"]}><Boletim /></RoleBasedRoute>} />
//         <Route path="historico" element={<RoleBasedRoute allowed={["aluno"]}><Historico /></RoleBasedRoute>} />

//         {/* PROFESSOR */}
//         <Route path="notas" element={<RoleBasedRoute allowed={["professor"]}><Notas /></RoleBasedRoute>} />
//         <Route path="presenca" element={<RoleBasedRoute allowed={["professor"]}><Presenca /></RoleBasedRoute>} />

//         {/* COORDENADOR */}
//         <Route path="usuarios" element={<RoleBasedRoute allowed={["coordenador"]}><Usuarios /></RoleBasedRoute>} />
//         <Route path="crimural" element={<RoleBasedRoute allowed={["coordenador"]}><CriaMural /></RoleBasedRoute>} />
//         <Route path="confNotas" element={<RoleBasedRoute allowed={["coordenador"]}><ConfNotas /></RoleBasedRoute>} />
//         <Route path="criCalendario" element={<RoleBasedRoute allowed={["coordenador"]}><CriaCalendario /></RoleBasedRoute>} />
//         <Route path="criaAluno" element={<RoleBasedRoute allowed={["coordenador"]}><CriaAluno /></RoleBasedRoute>} />
//         <Route path="criaProfessor" element={<RoleBasedRoute allowed={["coordenador"]}><CriaProfessor /></RoleBasedRoute>} />
//         <Route path="disciplina" element={<RoleBasedRoute allowed={["coordenador"]}><Disciplina /></RoleBasedRoute>} />

//         {/* ROTAS DE TODOS OS USUÁRIOS */}
//         <Route path="perfil" element={<Perfil />} />
//         <Route path="trocaSenha" element={<TrocaSenha />} />
//         <Route path="calendario" element={<Calendario />} />

//       </Route>
//     </Routes>
//   );
// }
