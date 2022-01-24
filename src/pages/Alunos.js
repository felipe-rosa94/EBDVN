import React from 'react'
import firebase from '../firebase'
import {
    AppBar,
    Box,
    Card,
    CardContent,
    CardMedia,
    FormLabel,
    IconButton,
    Input,
    Toolbar,
    Typography
} from '@mui/material'
import {ArrowBack, Search} from '@mui/icons-material'
import '../styles/lista.css'

class Lista extends React.Component {

    state = {
        alunos: [],
        filtros: [],
        busca: false
    }

    onClickAluno = aluno => this.props.history.push({pathname: '/cadastro', state: aluno})

    handledInput = e => {
        const {alunos} = this.state
        if (e.target.value !== '') {
            let array = []
            for (let i = 0; i < alunos.length; i++) {
                let filto = `${alunos[i].aluno} ${alunos[i].mae} ${alunos[i].pai}`
                if (filto.includes(e.target.value.toUpperCase())) {
                    array.push(alunos[i])
                    this.setState({filtros: array})
                    break
                }
            }
        } else {
            this.setState({filtros: alunos})
        }
    }

    buscaAlunos = () => {
        firebase
            .database()
            .ref('alunos')
            .once('value')
            .then(d => {
                this.setState({
                    filtros: (d.val() !== null) ? Object.values(d.val()) : [],
                    alunos: (d.val() !== null) ? Object.values(d.val()) : []
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

    calculaIdade = (nascimento) => {
        nascimento = nascimento.split('/')
        nascimento = new Date(nascimento[1] + '-' + nascimento[0] + '-' + nascimento[2])
        let hoje = new Date()
        return Math.floor(Math.ceil(Math.abs(nascimento.getTime() - hoje.getTime()) / (1000 * 3600 * 24)) / 365.25);
    }

    componentDidMount() {
        this.verificaLogin()
        this.buscaAlunos()
    }

    render() {
        const {alunos, filtros, busca} = this.state
        return (
            <div>
                <AppBar position="static">
                    <Toolbar id="toolbar-lista" variant="dense">
                        <div className="div-toolbar-lista">
                            <IconButton edge="start" color="inherit" aria-label="menu" sx={{mr: 2}}>
                                <ArrowBack onClick={() => this.props.history.goBack()}/>
                            </IconButton>
                            <Typography variant="h6" color="inherit" component="div">
                                Alunos
                            </Typography>
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
                            <Search onClick={() => this.setState({filtros: alunos, busca: !busca})}/>
                        </div>
                    </Toolbar>
                </AppBar>
                <div id="div-container-lista">
                    <div id="div-aluno-lista">
                        {
                            filtros.map((f, index) => (
                                <div key={index}>
                                    <Card id="card-aluno" onClick={() => this.onClickAluno(f)}>
                                        <CardContent id="card-content-aluno">
                                            <div id="div-descricao-aluno">
                                                <div id="div-aluno">
                                                    <FormLabel id="label-aluno">{`Aluno: ${f.aluno}`}</FormLabel>
                                                    <Box p={1}/>
                                                    <FormLabel
                                                        id="label-aluno">{`Idade: ${this.calculaIdade(f.nascimento)}`}</FormLabel>
                                                </div>
                                                <FormLabel id="label-aluno">{`Nasc: ${f.nascimento}`}</FormLabel>
                                                <FormLabel id="label-aluno">{`Mãe: ${f.mae}`}</FormLabel>
                                                <FormLabel id="label-aluno">{`Pai: ${f.pai}`}</FormLabel>
                                                <FormLabel
                                                    id="label-aluno">{`Responsável: ${f.responsavel}`}</FormLabel>
                                            </div>
                                            <div>
                                                <CardMedia id="card-media-lista-aluno" image={f.imagem}/>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default Lista
