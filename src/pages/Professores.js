import React from 'react'
import firebase from '../firebase'
import '../styles/professores.css'
import {
    AppBar,
    Card,
    CardContent,
    FormLabel,
    IconButton,
    Input,
    Toolbar,
    Typography
} from '@mui/material'
import {ArrowBack, Search} from '@mui/icons-material'
import moment from 'moment'

class Professores extends React.Component {

    state = {
        professores: [],
        filtros: [],
        busca: false
    }

    onClickProfessor = professor => this.props.history.push({pathname: '/cadastro_professores', state: professor})

    handledInput = e => {
        const {professores} = this.state
        if (e.target.value !== '') {
            let array = []
            for (let i = 0; i < professores.length; i++) {
                let filto = `${professores[i].professor} ${professores[i].telefone}`
                if (filto.includes(e.target.value.toUpperCase())) {
                    array.push(professores[i])
                    this.setState({filtros: array})
                    break
                }
            }
        } else {
            this.setState({filtros: professores})
        }
    }

    buscaProfessores = () => {
        firebase
            .database()
            .ref('professores')
            .once('value')
            .then(d => {
                this.setState({
                    filtros: (d.val() !== null) ? Object.values(d.val()) : [],
                    professores: (d.val() !== null) ? Object.values(d.val()) : []
                })
            })
            .catch((e) => {
                console.log(e)
            })
    }

    verificaLogin = () => {
        if (localStorage.getItem(`ednv:login`) === null)
            this.props.history.replace('/login')
    }

    componentDidMount() {
        this.verificaLogin()
        this.buscaProfessores()

    }

    render() {
        const {busca, professores, filtros} = this.state
        return (
            <div>
                <AppBar position="static">
                    <Toolbar id="toolbar-lista" variant="dense">
                        <div className="div-toolbar-lista">
                            <IconButton edge="start" color="inherit" aria-label="menu" sx={{mr: 2}}
                                        onClick={() => this.props.history.goBack()}>
                                <ArrowBack/>
                            </IconButton>
                            {
                                !busca &&
                                <Typography variant="h6" color="inherit" component="div">
                                    Professores
                                </Typography>
                            }
                        </div>
                        <div className="div-toolbar-lista">
                            {
                                busca &&
                                <Card>
                                    <CardContent id="card-content-toolbar-search">
                                        <Input autoFocus={true} onChange={this.handledInput}/>
                                    </CardContent>
                                </Card>
                            }
                            <Search onClick={() => this.setState({filtros: professores, busca: !busca})}/>
                        </div>
                    </Toolbar>
                </AppBar>
                <div id="div-container-lista">
                    <div id="div-professor-lista">
                        {
                            filtros.map((f, index) => (
                                <Card key={index} id="card-professor" onClick={() => this.onClickProfessor(f)}>
                                    <CardContent id="card-content-professor">
                                        <FormLabel>{`Professor: ${f.professor}`}</FormLabel>
                                        <FormLabel>{`E-mail: ${f.email}`}</FormLabel>
                                        <FormLabel>{`Nasc: ${moment(f.nascimento).format('DD/MM/YYYY')}`}</FormLabel>
                                        <FormLabel>{`Telefone: ${f.telefone}`}</FormLabel>
                                    </CardContent>
                                </Card>
                            ))
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default Professores
