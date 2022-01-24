import React from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'

import Login from './pages/Login'
import Home from './pages/Home'
import CadastroAlunos from './pages/CadastroAlunos'
import Alunos from './pages/Alunos'
import Professores from './pages/Professores'
import CadastroProfessores from './pages/CadastroProfessores'

const App = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Login}/>
                <Route exact path="/home" component={Home}/>
                <Route exact path="/cadastro_alunos" component={CadastroAlunos}/>
                <Route exact path="/alunos" component={Alunos}/>
                <Route exact path="/professores" component={Professores}/>
                <Route exact path="/cadastro_professores" component={CadastroProfessores}/>
            </Switch>
        </BrowserRouter>
    )
}

export default App
