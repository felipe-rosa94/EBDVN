import React from 'react'
import {
    AppBar,
    Box,
    Button,
    CardMedia,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogContentText,
    FormLabel,
    IconButton,
    TextField,
    Toolbar,
    Typography,
    FormControlLabel,
    Radio,
    RadioGroup,
    FormControl,
    DialogTitle,
    DialogActions
} from '@mui/material'
import {ArrowBack, Delete, Print} from '@mui/icons-material'
import '../styles/cadastro_alunos.css'
import firebase from '../firebase'
import {isEmptyObject, mascaraTelefone} from '../Util'

class CadastroAlunos extends React.Component {

    state = {
        editando: false,
        aluno: '',
        mae: '',
        pai: '',
        nascimento: '',
        foto: '',
        rua: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        telefone_responsavel_1: '',
        whatsapp_responsavel_1: false,
        telefone_responsavel_2: '',
        whatsapp_responsavel_2: false,
        telefone_responsavel_3: '',
        whatsapp_responsavel_3: false,
        alergias: '',
        doencas: '',
        medicamentos: '',
        responsavel: '',
        parentesco: '',
        email: '',
        imprimir: false,
        dialogCarregando: false,
        mensagemCarregando: '',
        dialogDeleteAluno: false
    }

    handledFile = e => this.setState({[e.target.name]: e.target.files[0]})

    handledInput = e => {
        if (e.target.name.includes('telefone') || e.target.name.includes('whatsapp'))
            this.setState({[e.target.name]: mascaraTelefone(e.target.value)})
        else
            this.setState({[e.target.name]: e.target.value.toUpperCase()})
    }

    onRadioWhatsapp = (e, opcao) => this.setState({[e.target.name]: opcao})

    onClickCadastro = async () => {
        let aluno = this.state
        if (aluno.editando) {
            if (aluno.foto !== '')
                aluno.imagem = await this.uploadImagem(aluno.aluno, aluno.foto)
            delete aluno['editando']
            delete aluno['mensagemCarregando']
            delete aluno['imprimir']
            delete aluno['dialogDeleteAluno']
            delete aluno['dialogCarregando']
            delete aluno['foto']
            firebase
                .database()
                .ref('alunos')
                .child(aluno.id)
                .update(aluno)
                .then(d => {
                    console.log(d)
                })
                .catch(e => {
                    console.log(e)
                })
        } else {
            aluno.imagem = await this.uploadImagem(aluno.aluno, aluno.foto)
            aluno.id = new Date().getTime()
            delete aluno['editando']
            delete aluno['mensagemCarregando']
            delete aluno['imprimir']
            delete aluno['dialogDeleteAluno']
            delete aluno['dialogCarregando']
            delete aluno['foto']
            firebase
                .database()
                .ref('alunos')
                .child(aluno.id)
                .set(aluno)
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
        let aluno = this.state
        firebase
            .database()
            .ref('alunos')
            .child(aluno.id)
            .remove()
            .then(d => {
                console.log(d)
            })
            .catch(e => {
                console.log(e)
            })
        this.props.history.replace('/home')
    }

    onClickImprimir = () => {
        this.setState({imprimir: true})
        setTimeout(() => {
            window.print()
            this.setState({imprimir: false})
        }, 200)
    }

    uploadImagem = async (nome, image) => {
        if (image === '') return ''
        this.setState({dialogCarregando: true, mensagemCarregando: 'Aguarde, fazendo upload do arquivo...'})
        const {_delegate: {state}} = await firebase.storage().ref(`imagens/${nome}/`).put(image)
        this.setState({dialogCarregando: true, mensagemCarregando: 'Aguarde, obtendo URL...'})
        if (state === 'success') {
            this.setState({dialogCarregando: false})
            return await firebase.storage().ref(`imagens/${nome}/`).getDownloadURL()
        }
        return ''
    }

    verificaLogin = () => {
        if (localStorage.getItem(`ednv:login`) === null)
            this.props.history.replace('/login')
    }

    aluno = () => {
        let aluno = this.props.location.state
        if (aluno === undefined) return
        if (!isEmptyObject(aluno)) {
            aluno.editando = true
            this.setState(aluno)
        }
    }

    componentDidMount() {
        this.verificaLogin()
        this.aluno()
    }

    render() {
        const {
            editando,
            imagem,
            aluno,
            mae,
            pai,
            responsavel,
            parentesco,
            email,
            nascimento,
            rua,
            numero,
            complemento,
            bairro,
            cidade,
            telefone_responsavel_1,
            whatsapp_responsavel_1,
            telefone_responsavel_2,
            whatsapp_responsavel_2,
            telefone_responsavel_3,
            whatsapp_responsavel_3,
            alergias,
            doencas,
            medicamentos,
            observacoes,
            dialogCarregando,
            mensagemCarregando,
            imprimir,
            dialogDeleteAluno
        } = this.state
        return (
            <div id="cadastro">
                {
                    !imprimir &&
                    <AppBar position="static">
                        <Toolbar id="toolbar-cadastro" variant="dense">
                            <div className="div-toolbar-cadastro">
                                <IconButton edge="start" color="inherit" aria-label="menu" sx={{mr: 2}}
                                            onClick={() => this.props.history.goBack()}>
                                    <ArrowBack/>
                                </IconButton>
                                <Typography variant="h6" color="inherit" component="div">
                                    Cadastro Alunos
                                </Typography>
                            </div>
                            <div className="div-toolbar-cadastro">
                                <IconButton edge="start" color="inherit" aria-label="menu" sx={{mr: 2}}
                                            onClick={this.onClickImprimir}>
                                    <Print/>
                                </IconButton>
                                {
                                    (editando) &&
                                    <IconButton edge="start" color="inherit" aria-label="menu" sx={{mr: 2}}
                                                onClick={() => this.setState({dialogDeleteAluno: true})}>
                                        <Delete/>
                                    </IconButton>
                                }
                            </div>
                        </Toolbar>
                    </AppBar>
                }
                <div id="div-container-cadastro">
                    <div className="div-form-cadastro" style={imprimir ? {width: '90%'} : {}}>
                        {
                            (imagem && !imprimir) &&
                            <div id="div-imagem-form">
                                <CardMedia id="card-media-aluno" image={imagem}/>
                            </div>
                        }
                        <div className="div-form-column">
                            <FormLabel className="label-form-titulo">Dados do aluno</FormLabel>
                        </div>
                        <div className="div-form-column">
                            <TextField value={aluno} fullWidth={true} variant="outlined" name="aluno" label="Nome"
                                       placeholder="Nome completo aluno"
                                       onChange={this.handledInput}/>
                            <Box p={1}/>
                            <TextField value={mae} fullWidth={true} variant="outlined" name="mae" label="M??e"
                                       placeholder="Nome m??e"
                                       onChange={this.handledInput}/>
                            <Box p={1}/>
                            <TextField value={pai} fullWidth={true} variant="outlined" name="pai" label="Pai"
                                       placeholder="Nome pai"
                                       onChange={this.handledInput}/>
                            <Box p={1}/>
                            <div id="div-form-row">
                                <TextField value={responsavel} fullWidth={true} variant="outlined" name="responsavel"
                                           label="Respons??vel"
                                           placeholder="Respons??vel pela crian??a na igreja"
                                           onChange={this.handledInput}/>
                                <Box p={1}/>
                                <TextField value={parentesco} fullWidth={true} variant="outlined" name="parentesco"
                                           label="Grau de parentesco"
                                           placeholder="Grau de parentesco"
                                           onChange={this.handledInput}/>
                            </div>
                            <Box p={1}/>
                            <TextField value={email} fullWidth={true} variant="outlined" name="email"
                                       label="E-mail Respons??vel"
                                       placeholder="E-mail Respons??vel"
                                       onChange={this.handledInput}/>
                            <Box p={1}/>
                            <TextField type="date" value={nascimento} fullWidth={true} variant="outlined"
                                       name="nascimento"
                                       label="Data nascimento"
                                       placeholder="Data nascimento"
                                       onChange={this.handledInput}/>
                        </div>
                        {
                            !imprimir &&
                            <div className="div-form-column">
                                <FormLabel className="label-form-titulo">Foto aluno</FormLabel>
                            </div>
                        }
                        {
                            !imprimir &&
                            <div className="div-form-column">
                                <TextField fullWidth={true} variant="outlined" name="foto"
                                           placeholder="Foto" type="file"
                                           onChange={this.handledFile}/>
                            </div>
                        }
                        <div className="div-form-column">
                            <FormLabel className="label-form-titulo">Endere??o</FormLabel>
                        </div>
                        <div className="div-form-column">
                            <TextField value={rua} fullWidth={true} variant="outlined" name="rua" label="Rua"
                                       placeholder="Rua"
                                       onChange={this.handledInput}/>
                            <Box p={1}/>
                            <div id="div-form-row">
                                <TextField value={numero} fullWidth={true} variant="outlined" name="numero"
                                           label="N??mero"
                                           placeholder="N??mero"
                                           onChange={this.handledInput}/>
                                <Box p={1}/>
                                <TextField value={complemento} fullWidth={true} variant="outlined" name="complemento"
                                           label="Complemento"
                                           placeholder="Complemento"
                                           onChange={this.handledInput}/>
                            </div>
                            <Box p={1}/>
                            <TextField value={bairro} fullWidth={true} variant="outlined" name="bairro" label="Bairro"
                                       placeholder="Bairro"
                                       onChange={this.handledInput}/>
                            <Box p={1}/>
                            <TextField value={cidade} fullWidth={true} variant="outlined" name="cidade" label="Cidade"
                                       placeholder="Cidade"
                                       onChange={this.handledInput}/>
                        </div>
                        <div className="div-form-column">
                            <FormLabel className="label-form-titulo">Telefone respons??vel 1</FormLabel>
                        </div>
                        <div className="div-form-column">
                            <div id="div-form-row">
                                <TextField value={telefone_responsavel_1} fullWidth={true} variant="outlined"
                                           name="telefone_responsavel_1"
                                           label="Telefone"
                                           placeholder="Telefone"
                                           onChange={this.handledInput}/>
                                <Box p={1}/>
                                <FormControl>
                                    <FormLabel>WhatsApp?</FormLabel>
                                    <RadioGroup>
                                        <FormControlLabel checked={whatsapp_responsavel_1}
                                                          name="whatsapp_responsavel_1" control={<Radio/>}
                                                          label="Sim"
                                                          onChange={(e) => this.onRadioWhatsapp(e, true)}/>
                                        <FormControlLabel checked={!whatsapp_responsavel_1}
                                                          name="whatsapp_responsavel_1" control={<Radio/>}
                                                          label="N??o"
                                                          onChange={(e) => this.onRadioWhatsapp(e, false)}/>
                                    </RadioGroup>
                                </FormControl>
                            </div>
                        </div>
                        <div className="div-form-column">
                            <FormLabel className="label-form-titulo">Telefone respons??vel 2</FormLabel>
                        </div>
                        <div className="div-form-column">
                            <div id="div-form-row">
                                <TextField value={telefone_responsavel_2} fullWidth={true} variant="outlined"
                                           name="telefone_responsavel_2"
                                           label="Telefone"
                                           placeholder="Telefone"
                                           onChange={this.handledInput}/>
                                <Box p={1}/>
                                <FormControl>
                                    <FormLabel>WhatsApp?</FormLabel>
                                    <RadioGroup>
                                        <FormControlLabel
                                            checked={whatsapp_responsavel_2}
                                            name="whatsapp_responsavel_2" control={<Radio/>}
                                            label="Sim"
                                            onChange={(e) => this.onRadioWhatsapp(e, true)}/>
                                        <FormControlLabel
                                            checked={!whatsapp_responsavel_2}
                                            name="whatsapp_responsavel_2" control={<Radio/>}
                                            label="N??o"
                                            onChange={(e) => this.onRadioWhatsapp(e, false)}/>
                                    </RadioGroup>
                                </FormControl>
                            </div>
                        </div>
                        <div className="div-form-column">
                            <FormLabel className="label-form-titulo">Telefone respons??vel 3</FormLabel>
                        </div>
                        <div className="div-form-column">
                            <div id="div-form-row">
                                <TextField value={telefone_responsavel_3} fullWidth={true} variant="outlined"
                                           name="telefone_responsavel_3"
                                           label="Telefone"
                                           placeholder="Telefone"
                                           onChange={this.handledInput}/>
                                <Box p={1}/>
                                <FormControl>
                                    <FormLabel>WhatsApp?</FormLabel>
                                    <RadioGroup>
                                        <FormControlLabel
                                            checked={whatsapp_responsavel_3}
                                            name="whatsapp_responsavel_3" control={<Radio/>}
                                            label="Sim"
                                            onChange={(e) => this.onRadioWhatsapp(e, true)}/>
                                        <FormControlLabel
                                            checked={!whatsapp_responsavel_3}
                                            name="whatsapp_responsavel_3" control={<Radio/>}
                                            label="N??o"
                                            onChange={(e) => this.onRadioWhatsapp(e, false)}/>
                                    </RadioGroup>
                                </FormControl>
                            </div>
                        </div>
                        <div className="div-form-column">
                            <FormLabel className="label-form-titulo">Dados de sa??de</FormLabel>
                        </div>
                        <div className="div-form-column">
                            <TextField value={alergias} fullWidth={true} variant="outlined" name="alergias"
                                       label="Alergias"
                                       placeholder="Alergias" multiline={true}
                                       onChange={this.handledInput}/>
                            <Box p={1}/>
                            <TextField value={doencas} fullWidth={true} variant="outlined" name="doencas"
                                       label="Doen??as"
                                       placeholder="Doen??as"
                                       onChange={this.handledInput}/>
                            <Box p={1}/>
                            <TextField value={medicamentos} fullWidth={true} variant="outlined" name="medicamentos"
                                       label="Medicamentos"
                                       placeholder="Medicamentos"
                                       onChange={this.handledInput}/>
                            <Box p={1}/>
                        </div>
                        {/*<div className="div-form-column">*/}
                        {/*    <FormLabel className="label-form-titulo">Igreja</FormLabel>*/}
                        {/*</div>*/}
                        {/*<div className="div-form-column">*/}
                        {/*    <TextField value={responsavel} fullWidth={true} variant="outlined" name="responsavel"*/}
                        {/*               label="Respons??vel"*/}
                        {/*               placeholder="Respons??vel pela crian??a na igreja"*/}
                        {/*               onChange={this.handledInput}/>*/}
                        {/*    <Box p={1}/>*/}
                        {/*    <TextField value={parentesco} fullWidth={true} variant="outlined" name="parentesco"*/}
                        {/*               label="Grau de parentesco"*/}
                        {/*               placeholder="Grau de parentesco"*/}
                        {/*               onChange={this.handledInput}/>*/}
                        {/*    <Box p={1}/>*/}
                        {/*</div>*/}
                        <div className="div-form-column">
                            <FormLabel className="label-form-titulo">Mais informa????es</FormLabel>
                        </div>
                        <div className="div-form-column">
                            <TextField value={observacoes} fullWidth={true} variant="outlined" name="observacoes"
                                       label="Observa????es" multiline={true}
                                       placeholder="Observa????es"
                                       onChange={this.handledInput}/>
                        </div>
                        {
                            !imprimir &&
                            <div className="div-form-column">
                                <Button fullWidth={true} variant="outlined"
                                        onClick={this.onClickCadastro}>{editando ? 'Alterar' : 'Cadastrar'}</Button>
                            </div>
                        }
                    </div>
                </div>
                <Dialog open={dialogDeleteAluno} onClose={() => this.setState({dialogDeleteAluno: false})}>
                    <DialogTitle>Deletar</DialogTitle>
                    <DialogContent>
                        <DialogContentText>Deseja deletar esse aluno?</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="outlined"
                                onClick={() => this.setState({dialogDeleteAluno: false})}>N??o</Button>
                        <Button variant="outlined"
                                onClick={this.onClickDelete}>Sim</Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={dialogCarregando}>
                    <DialogContent>
                        <CircularProgress size={30}/>
                        <DialogContentText>{mensagemCarregando}</DialogContentText>
                    </DialogContent>
                </Dialog>
            </div>
        )
    }
}

export default CadastroAlunos
