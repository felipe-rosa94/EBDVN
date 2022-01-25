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
import {ArrowBack, Download, Search} from '@mui/icons-material'
import '../styles/alunos.css'
import {calculaIdade} from '../Util'
import moment from 'moment'
import exportFromJSON from 'export-from-json'

class Alunos extends React.Component {

    state = {
        alunos: [],
        filtros: [],
        busca: false
    }

    onClickAluno = aluno => this.props.history.push({pathname: '/cadastro_alunos', state: aluno})

    onClickDownload = () => {
        try {
            const {alunos} = this.state
            alunos.forEach(a => {
                delete a['id']
                delete a['mensagemCarregando']
                delete a['imprimir']
                delete a['dialogDeleteAluno']
                delete a['dialogCarregando']
                delete a['foto']
                delete a['dia']
                delete a['imagem']
                a.whatsapp_responsavel_1 = a.whatsapp_responsavel_1 ? 'Sim' : 'Não'
                a.whatsapp_responsavel_2 = a.whatsapp_responsavel_2 ? 'Sim' : 'Não'
                a.whatsapp_responsavel_3 = a.whatsapp_responsavel_3 ? 'Sim' : 'Não'
            })
            const data = alunos
            const fileName = 'alunos_escolinha'
            const exportType = exportFromJSON.types.xls
            exportFromJSON({data, fileName, exportType})
        } catch (e) {
            console.log(e)
        }
    }

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
                            <IconButton edge="start" color="inherit" aria-label="menu" sx={{mr: 2}}
                                        onClick={() => this.props.history.goBack()}>
                                <ArrowBack/>
                            </IconButton>
                            {
                                !busca &&
                                <Typography variant="h6" color="inherit" component="div">
                                    Alunos
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
                            <IconButton color="inherit" onClick={() => this.setState({filtros: alunos, busca: !busca})}>
                                <Search/>
                            </IconButton>
                            <IconButton color="inherit" onClick={this.onClickDownload}>
                                <Download/>
                            </IconButton>
                        </div>
                    </Toolbar>
                </AppBar>
                <div id="div-container-lista">
                    <div id="div-aluno-lista">
                        {
                            filtros.map((f, index) => (
                                <Card key={index} id="card-aluno" onClick={() => this.onClickAluno(f)}>
                                    <CardContent id="card-content-aluno">
                                        <div id="div-descricao-aluno">
                                            <div id="div-aluno">
                                                <FormLabel id="label-aluno">{`Aluno: ${f.aluno}`}</FormLabel>
                                                <Box p={1}/>
                                                <FormLabel
                                                    id="label-aluno">{`Idade: ${calculaIdade(f.nascimento)}`}</FormLabel>
                                            </div>
                                            <FormLabel
                                                id="label-aluno">{`Nasc: ${moment(f.nascimento).format('DD/MM/YYYY')}`}</FormLabel>
                                            <FormLabel id="label-aluno">{`Mãe: ${f.mae}`}</FormLabel>
                                            <FormLabel id="label-aluno">{`Pai: ${f.pai}`}</FormLabel>
                                            <FormLabel
                                                id="label-aluno">{`Parentesco: ${f.parentesco}`}</FormLabel>
                                        </div>
                                        <div>
                                            {
                                                (f.imagem) &&
                                                <CardMedia id="card-media-lista-aluno" image={f.imagem}/>
                                            }
                                        </div>
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

export default Alunos
