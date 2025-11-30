import { Route, Routes } from 'react-router-dom'
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


function App() {

  return (
    <Routes>
      <Route path="/" element={<FormLogin />} />
      <Route path="/cadastro" element={<FormCadastro />} />
      <Route path='/recSenha' element={<FormRecSenha />} />

      {/* rotas dinamicas, para autenticação */}
      <Route path='/dashboard' element={<Dashboard />}>
        <Route index element={<Mural />}/>
        <Route path="graficos" element={<Graficos />} />
        <Route path="perfil" element={<Perfil />} />
        <Route path="boletim" element={<Boletim />} />
        <Route path="historico" element={<Historico />} />
        <Route path='trocaSenha' element={<TrocaSenha />} />
        <Route path='usuarios' element={<Usuarios />} />
        <Route path='calendario' element={<Calendario />} />
         <Route path="notas" element={<Notas />} />
        <Route path="presenca" element={<Presenca />} />
        <Route path="usuarios" element={<Usuarios />} />
        <Route path="crimural" element={<CriaMural />} />
        <Route path="confNotas" element={<ConfNotas />} />
        <Route path="criCalendario" element={<CriaCalendario />} />
      </Route>
    </Routes>
  )
}

export default App
