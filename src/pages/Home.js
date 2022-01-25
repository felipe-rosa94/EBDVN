import React from 'react'
import {
    AppBar,
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormLabel,
    TextField,
    Toolbar,
    Typography
} from '@mui/material'
import {
    PersonAdd,
    Event,
    EmojiPeople,
    Add,
    Groups
} from '@mui/icons-material'
import '../styles/home.css'
import firebase from '../firebase'
import moment from 'moment'
import {calculaIdade, enviaEmail, mesAtual} from '../Util'

class Home extends React.Component {

    state = {
        professores: [],
        aniversariantes: [],
        agenda: [],
        nome_evento: '',
        data_evento: '',
        observacao_evento: '',
        editando: false,
        dialogAgenda: false,
        dialogProfessores: false,
    }

    handledInput = e => this.setState({[e.target.name]: e.target.value})

    onClickEvento = () => {
        const {nome_evento, data_evento, observacao_evento, editando, id} = this.state
        if (nome_evento === '')
            return alert('Nome do evento não pode estar vazio')
        if (data_evento === '')
            return alert('Data do evento não pode estar vazia')
        let dt = new Date(data_evento)
        dt.setDate(dt.getDate() + 1)
        let evento = {
            evento: nome_evento,
            data: data_evento,
            observacao: observacao_evento,
            id: editando ? id : new Date().getTime(),
            timestamp: dt.getTime(),
            cor: this.corEvento()
        }
        if (editando) {
            firebase
                .database()
                .ref('agenda')
                .child(id)
                .update(evento)
                .then(d => {

                })
                .catch(e => {
                    console.log(e)
                })
            this.avisaProfessores('Alteração na agenda EBDVN', `${nome_evento} remarcado para o dia ${moment(data_evento).format('DD/MM/YYYY')} ${observacao_evento}`)
        } else {
            firebase
                .database()
                .ref('agenda')
                .child(evento.id)
                .set(evento)
                .then(d => {

                })
                .catch(e => {
                    console.log(e)
                })
            this.avisaProfessores('Agenda EBDVN', `${nome_evento} marcado para o dia ${moment(data_evento).format('DD/MM/YYYY')} ${observacao_evento}`)
        }
        this.onClickLimpa()
        this.buscaAgenda()
    }

    onClickDeleteEvento = (id, nome_evento, data_evento) => {
        firebase
            .database()
            .ref('agenda')
            .child(id)
            .remove()
            .then(d => {

            })
            .catch(e => {
                console.log(e)
            })
        this.avisaProfessores('Cancelamento na agenda EBDVN', `${nome_evento} do dia ${moment(data_evento).format('DD/MM/YYYY')} cancelado`)
        this.onClickLimpa()
        this.buscaAgenda()
    }

    onClickLimpa = () => {
        this.setState({
            dialogAgenda: false,
            editando: false,
            id: '',
            nome_evento: '',
            data_evento: '',
            observacao_evento: ''
        })
    }

    corEvento = () => {
        let index = Math.floor(Math.random() * 19)
        let cores = [
            '#ef5350',
            '#ec407a',
            '#ab47bc',
            '#7e57c2',
            '#5c6bc0',
            '#42a5f5',
            '#29b6f6',
            '#26c6da',
            '#26a69a',
            '#66bb6a',
            '#9ccc65',
            '#d4e157',
            '#ffee58',
            '#ffca28',
            '#ffa726',
            '#ff7043',
            '#8d6e63',
            '#bdbdbd',
            '#78909c'
        ]
        return cores[index]
    }

    avisaProfessores = (assunto, texto) => {
        const {professores} = this.state
        professores.forEach(p => {
            enviaEmail(p.email, assunto, texto)
        })
    }

    verificaLogin = () => {
        if (localStorage.getItem(`ednv:login`) === null)
            this.props.history.replace('/login')
    }

    buscaAgenda = () => {
        firebase
            .database()
            .ref('agenda')
            .once('value')
            .then(d => {
                let agenda = (d.val() !== null) ? Object.values(d.val()) : []
                let array = []
                let data = new Date()
                data.setHours(0)
                agenda.forEach(a => {
                    if (a.timestamp >= data.getTime())
                        array.push(a)
                })
                array.sort((a, b) => {
                    if (a.timestamp > b.timestamp) return 1
                    if (a.timestamp < b.timestamp) return -1
                    return 0
                })
                this.setState({agenda: array})
            })
            .catch((e) => {
                console.log(e)
            })
    }

    buscaAniversariantes = () => {
        firebase
            .database()
            .ref('alunos')
            .once('value')
            .then(d => {
                let aniversariantes = []
                let alunos = (d.val() !== null) ? Object.values(d.val()) : []
                alunos.forEach(a => {
                    let nascimento = new Date(a.nascimento)
                    let dia = nascimento.getDate()
                    let hoje = new Date()
                    if (nascimento.getMonth() === hoje.getMonth()) {
                        a.dia = dia
                        aniversariantes.push(a)
                    }
                })
                aniversariantes.sort((a, b) => {
                    if (a.dia > b.dia) return 1
                    if (a.dia < b.dia) return -1
                    return 0
                })
                this.setState({aniversariantes: aniversariantes})
            })
            .catch((e) => {
                console.log(e)
            })
    }

    buscaProfessores = () => {
        firebase
            .database()
            .ref('professores')
            .once('value')
            .then(d => {
                let professores = (d.val() !== null) ? Object.values(d.val()) : []
                this.setState({professores: professores})
            })
            .catch((e) => {
                console.log(e)
            })
    }


    onClickAluno = aluno => this.props.history.push({pathname: '/cadastro_alunos', state: aluno})

    componentDidMount() {
        this.verificaLogin()
        this.buscaAniversariantes()
        this.buscaAgenda()
        this.buscaProfessores()
    }

    render() {
        const {
            aniversariantes,
            agenda,
            dialogAgenda,
            editando,
            nome_evento,
            data_evento,
            observacao_evento,
            id
        } = this.state
        return (
            <div id="home">
                <AppBar position="static">
                    <Toolbar id="toolbar-dashbord" variant="dense">
                        <Typography variant="h6" color="inherit" component="div">
                            EBD VIDA NOVA
                        </Typography>
                    </Toolbar>
                </AppBar>
                <div id="div-container-home">
                    <div id="div-home">
                        <div id="div-container-agenda">
                            <Typography variant="h6" color="inherit" component="div">
                                Agenda
                            </Typography>
                            <div id="div-agenda">
                                {
                                    agenda.map((a, index) => (
                                        <Card key={index} id="card-agenda" style={{background: `${a.cor}`}}>
                                            <CardContent id="card-content-agenda"
                                                         onClick={() => this.setState({
                                                             dialogAgenda: true,
                                                             editando: true,
                                                             id: a.id,
                                                             nome_evento: a.evento,
                                                             data_evento: a.data,
                                                             observacao_evento: a.observacao
                                                         })}>
                                                <FormLabel id="label-agenda">{a.evento}</FormLabel>
                                                <FormLabel
                                                    id="label-agenda">{moment(a.data).format('DD/MM/YYYY')}</FormLabel>
                                                <FormLabel id="label-agenda">{a.observacao}</FormLabel>
                                            </CardContent>
                                        </Card>
                                    ))
                                }
                            </div>
                        </div>
                        {
                            aniversariantes.length !== 0 &&
                            <div id="div-container-aniversariantes">
                                <Typography variant="h6" color="inherit" component="div">
                                    {`Aniversáriantes de ${mesAtual()}`}
                                </Typography>
                                <div id="div-aniversariantes">
                                    {
                                        aniversariantes.map((a, index) => (
                                            <Card key={index} id="card-aniversariante"
                                                  onClick={() => this.onClickAluno(a)}>
                                                <CardContent id="card-content-aluno">
                                                    <div id="div-descricao-aluno">
                                                        <FormLabel id="label-aluno">{`Aluno: ${a.aluno}`}</FormLabel>
                                                        <FormLabel id="label-aluno">
                                                            {`Idade: ${calculaIdade(a.nascimento)}`}
                                                        </FormLabel>
                                                        <FormLabel
                                                            id="label-aluno">{`Data: ${moment(a.nascimento).format('DD/MM/YYYY')}`}</FormLabel>
                                                    </div>
                                                    <div>
                                                        {
                                                            (a.imagem) &&
                                                            <CardMedia id="card-media-lista-aluno" image={a.imagem}/>
                                                        }
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))
                                    }
                                </div>
                            </div>
                        }
                        <div className="fab-container">
                            <div className="fab fab-icon-holder">
                                <Add id="icone-fab"/>
                            </div>
                            <ul className="fab-options">
                                <li onClick={() => this.props.history.push('/professores')}>
                                    <FormLabel id="fab-label">Lista de Professores</FormLabel>
                                    <div className="fab-icon-holder">
                                        <Groups id="icone-fab"/>
                                    </div>
                                </li>
                                <li onClick={() => this.props.history.push('/cadastro_professores')}>
                                    <FormLabel id="fab-label">Adicionar Professor</FormLabel>
                                    <div className="fab-icon-holder">
                                        <PersonAdd id="icone-fab"/>
                                    </div>
                                </li>
                                <li onClick={() => this.props.history.push('/alunos')}>
                                    <FormLabel id="fab-label">Lista de Alunos</FormLabel>
                                    <div className="fab-icon-holder">
                                        <EmojiPeople id="icone-fab"/>
                                    </div>
                                </li>
                                <li onClick={() => this.props.history.push('/cadastro_alunos')}>
                                    <FormLabel id="fab-label">Adicionar Aluno</FormLabel>
                                    <div className="fab-icon-holder">
                                        <PersonAdd id="icone-fab"/>
                                    </div>
                                </li>
                                <li onClick={() => this.setState({dialogAgenda: true})}>
                                    <FormLabel id="fab-label">Adicionar Evento</FormLabel>
                                    <div className="fab-icon-holder">
                                        <Event id="icone-fab"/>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <Dialog open={dialogAgenda} onClose={this.onClickLimpa}>
                    <DialogTitle>Agenda</DialogTitle>
                    <DialogContent>
                        <DialogContentText>Resgistre as informações na agenda</DialogContentText>
                        <Box p={1}/>
                        <TextField value={nome_evento} variant="outlined" placeholder="Nome evento" fullWidth={true}
                                   name="nome_evento"
                                   onChange={this.handledInput}/>
                        <Box p={1}/>
                        <TextField value={data_evento} variant="outlined" placeholder="Data evento" type="date"
                                   fullWidth={true}
                                   name="data_evento" onChange={this.handledInput}/>
                        <Box p={1}/>
                        <TextField value={observacao_evento} variant="outlined" placeholder="Observação"
                                   fullWidth={true} name="observacao_evento"
                                   onChange={this.handledInput}/>
                    </DialogContent>
                    <DialogActions style={editando ? {flexDirection: 'column', padding: 20} : {}}>
                        <Button fullWidth={editando} variant="outlined"
                                onClick={this.onClickLimpa}>Cancelar</Button>
                        {editando && <Box p={1}/>}
                        <Button fullWidth={editando} style={editando ? {marginLeft: 0} : {}} variant="outlined"
                                onClick={this.onClickEvento}>{editando ? 'Alterar' : 'Confirmar'}</Button>
                        {editando && <Box p={1}/>}
                        {editando && <Box p={1}/>}
                        {
                            editando &&
                            <Button fullWidth={editando} style={editando ? {marginLeft: 0} : {}}
                                    variant="outlined"
                                    onClick={() => this.onClickDeleteEvento(id, nome_evento, data_evento)}>Excluir</Button>
                        }
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

export default Home
