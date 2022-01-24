import React from 'react'
import '../styles/cadastro_professores.css'
import {
    AppBar,
    Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    FormControl, FormControlLabel,
    FormLabel,
    IconButton, Radio,
    RadioGroup,
    TextField,
    Toolbar,
    Typography
} from '@mui/material'
import {ArrowBack, Delete} from '@mui/icons-material'
import firebase from '../firebase'
import {isEmptyObject, mascaraTelefone} from '../Util'

class CadastroProfessores extends React.Component {

    state = {
        professor: '',
        email: '',
        nascimento: '',
        telefone: '',
        whatsapp: false,
        editando: false,
        dialogDeleteProfessor: false
    }

    handledInput = e => {
        if (e.target.name.includes('telefone') || e.target.name.includes('whatsapp'))
            this.setState({[e.target.name]: mascaraTelefone(e.target.value)})
        else if (e.target.name === 'email')
            this.setState({[e.target.name]: e.target.value.toLowerCase()})
        else
            this.setState({[e.target.name]: e.target.value.toUpperCase()})
    }

    onRadioWhatsapp = (e, opcao) => this.setState({[e.target.name]: opcao})

    onClickCadastro = async () => {
        let professor = this.state
        if (professor.editando) {
            delete professor['editando']
            firebase
                .database()
                .ref('professores')
                .child(professor.id)
                .update(professor)
                .then(d => {
                    console.log(d)
                })
                .catch(e => {
                    console.log(e)
                })
        } else {
            delete professor['editando']
            professor.id = new Date().getTime()
            firebase
                .database()
                .ref('professores')
                .child(professor.id)
                .set(professor)
                .then(d => {
                    console.log(d)
                })
                .catch(e => {
                    console.log(e)
                })
        }
        this.props.history.replace('/home')
    }

    onClickDelete = () => {
        let professor = this.state
        firebase
            .database()
            .ref('professores')
            .child(professor.id)
            .remove()
            .then(d => {
                console.log(d)
            })
            .catch(e => {
                console.log(e)
            })
        this.props.history.replace('/home')
    }

    verificaLogin = () => {
        if (localStorage.getItem(`ednv:login`) === null)
            this.props.history.replace('/login')
    }

    professor = () => {
        let professor = this.props.location.state
        if (professor === undefined) return
        if (!isEmptyObject(professor)) {
            professor.editando = true
            this.setState(professor)
        }
    }

    componentDidMount() {
        this.verificaLogin()
        this.professor()
    }

    render() {
        const {professor, email, nascimento, telefone, whatsapp, editando, dialogDeleteProfessor} = this.state
        return (
            <div id="cadastro">
                <AppBar position="static">
                    <Toolbar id="toolbar-cadastro" variant="dense">
                        <div className="div-toolbar-cadastro">
                            <IconButton edge="start" color="inherit" aria-label="menu" sx={{mr: 2}}
                                        onClick={() => this.props.history.goBack()}>
                                <ArrowBack/>
                            </IconButton>
                            <Typography variant="h6" color="inherit" component="div">
                                Cadastro Professores
                            </Typography>
                        </div>
                        <div className="div-toolbar-cadastro">
                            {
                                (editando) &&
                                <IconButton edge="start" color="inherit" aria-label="menu" sx={{mr: 2}}
                                            onClick={() => this.setState({dialogDeleteProfessor: true})}>
                                    <Delete/>
                                </IconButton>
                            }
                        </div>
                    </Toolbar>
                </AppBar>
                <div id="div-container-cadastro">
                    <div className="div-form-cadastro">
                        <div className="div-form-column">
                            <FormLabel className="label-form-titulo">Dados do professor</FormLabel>
                        </div>

                        <div className="div-form-column">
                            <TextField value={professor} fullWidth={true} variant="outlined" name="professor"
                                       label="Nome"
                                       placeholder="Nome completo aluno"
                                       onChange={this.handledInput}/>
                            <Box p={1}/>
                            <TextField value={email} fullWidth={true} variant="outlined" name="email" label="E-mail"
                                       placeholder="Nome mãe"
                                       onChange={this.handledInput}/>
                            <Box p={1}/>
                            <TextField type="date" value={nascimento} fullWidth={true} variant="outlined"
                                       name="nascimento"
                                       label="Data nascimento"
                                       placeholder="Data nascimento"
                                       onChange={this.handledInput}/>
                        </div>
                        <div className="div-form-column">
                            <div id="div-form-row">
                                <TextField value={telefone} fullWidth={true} variant="outlined"
                                           name="telefone"
                                           label="Telefone"
                                           placeholder="Telefone"
                                           onChange={this.handledInput}/>
                                <Box p={1}/>
                                <FormControl>
                                    <FormLabel>WhatsApp?</FormLabel>
                                    <RadioGroup>
                                        <FormControlLabel
                                            checked={whatsapp}
                                            name="whatsapp" control={<Radio/>}
                                            label="Sim"
                                            onChange={(e) => this.onRadioWhatsapp(e, true)}/>
                                        <FormControlLabel
                                            checked={!whatsapp}
                                            name="whatsapp" control={<Radio/>}
                                            label="Não"
                                            onChange={(e) => this.onRadioWhatsapp(e, false)}/>
                                    </RadioGroup>
                                </FormControl>
                            </div>
                        </div>

                        <div className="div-form-column">
                            <Button fullWidth={true} variant="outlined"
                                    onClick={this.onClickCadastro}>{editando ? 'Alterar' : 'Cadastrar'}</Button>
                        </div>

                    </div>
                </div>
                <Dialog open={dialogDeleteProfessor} onClose={() => this.setState({dialogDeleteProfessor: false})}>
                    <DialogTitle>Deletar</DialogTitle>
                    <DialogContent>
                        <DialogContentText>Deseja deletar esse professor?</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="outlined"
                                onClick={() => this.setState({dialogDeleteProfessor: false})}>Não</Button>
                        <Button variant="outlined"
                                onClick={this.onClickDelete}>Sim</Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

export default CadastroProfessores
