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
    Radio, RadioGroup, FormControl
} from '@mui/material'
import {ArrowBack, Print} from '@mui/icons-material'
import '../styles/cadastro.css'
import firebase from '../firebase'

class Cadastro extends React.Component {

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
        imprimir: false,
        dialogCarregando: false,
        mensagemCarregando: ''
    }

    handledFile = e => this.setState({[e.target.name]: e.target.files[0]})

    handledInput = e => {
        if (e.target.name === 'nascimento')
            this.setState({[e.target.name]: this.mascaraData(e.target.value)})
        else if (e.target.name.includes('telefone') || e.target.name.includes('whatsapp'))
            this.setState({[e.target.name]: this.mascaraTelefone(e.target.value)})
        else
            this.setState({[e.target.name]: e.target.value.toUpperCase()})
    }

    mascaraData = data => {
        data = data.substring(0, 10)
        data = data.replace(/\D/g, '').slice(0, 10)
        if (data.length >= 5)
            return `${data.slice(0, 2)}/${data.slice(2, 4)}/${data.slice(4)}`
        else if (data.length >= 3)
            return `${data.slice(0, 2)}/${data.slice(2)}`
        return data
    }

    mascaraTelefone = telefone => {
        if (telefone !== '') {
            telefone = telefone.substring(0, 14)
            return telefone.replace(/\D/g, '').replace(/(\d{2})(\d)/, '($1) $2')
        }
    }

    onRadioWhatsapp = (e, opcao) => this.setState({[e.target.name]: opcao})

    onClickCadastro = async () => {
        let aluno = this.state
        if (aluno.editando) {
            delete aluno['editando']
            if (aluno.foto !== '')
                aluno.imagem = await this.uploadImagem(aluno.aluno, aluno.foto)
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
            delete aluno['editando']
            aluno.imagem = await this.uploadImagem(aluno.aluno, aluno.foto)
            aluno.id = new Date().getTime()
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
        if (!this.isEmptyObject(aluno)) {
            aluno.editando = true
            this.setState(aluno)
        }
    }

    isEmptyObject = objeto => {
        return (Object.keys(objeto).length === 0)
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
            imprimir
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
                                    Cadastro
                                </Typography>
                            </div>
                            <div className="div-toolbar-cadastro">
                                <IconButton edge="start" color="inherit" aria-label="menu" sx={{mr: 2}}
                                            onClick={this.onClickImprimir}>
                                    <Print/>
                                </IconButton>
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
                            <TextField value={mae} fullWidth={true} variant="outlined" name="mae" label="Mãe"
                                       placeholder="Nome mãe"
                                       onChange={this.handledInput}/>
                            <Box p={1}/>
                            <TextField value={pai} fullWidth={true} variant="outlined" name="pai" label="Pai"
                                       placeholder="Nome pai"
                                       onChange={this.handledInput}/>
                            <Box p={1}/>
                            <div id="div-form-row">
                                <TextField value={responsavel} fullWidth={true} variant="outlined" name="responsavel"
                                           label="Responsável"
                                           placeholder="Responsável pela criança na igreja"
                                           onChange={this.handledInput}/>
                                <Box p={1}/>
                                <TextField value={parentesco} fullWidth={true} variant="outlined" name="parentesco"
                                           label="Grau de parentesco"
                                           placeholder="Grau de parentesco"
                                           onChange={this.handledInput}/>
                            </div>
                            <Box p={1}/>
                            <TextField value={nascimento} fullWidth={true} variant="outlined" name="nascimento"
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
                            <FormLabel className="label-form-titulo">Endereço</FormLabel>
                        </div>
                        <div className="div-form-column">
                            <TextField value={rua} fullWidth={true} variant="outlined" name="rua" label="Rua"
                                       placeholder="Rua"
                                       onChange={this.handledInput}/>
                            <Box p={1}/>
                            <div id="div-form-row">
                                <TextField value={numero} fullWidth={true} variant="outlined" name="numero"
                                           label="Número"
                                           placeholder="Número"
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
                            <FormLabel className="label-form-titulo">Telefone responsável 1</FormLabel>
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
                                                          label="Não"
                                                          onChange={(e) => this.onRadioWhatsapp(e, false)}/>
                                    </RadioGroup>
                                </FormControl>
                            </div>
                        </div>
                        <div className="div-form-column">
                            <FormLabel className="label-form-titulo">Telefone responsável 2</FormLabel>
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
                                            label="Não"
                                            onChange={(e) => this.onRadioWhatsapp(e, false)}/>
                                    </RadioGroup>
                                </FormControl>
                            </div>
                        </div>
                        <div className="div-form-column">
                            <FormLabel className="label-form-titulo">Telefone responsável 3</FormLabel>
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
                                            label="Não"
                                            onChange={(e) => this.onRadioWhatsapp(e, false)}/>
                                    </RadioGroup>
                                </FormControl>
                            </div>
                        </div>
                        <div className="div-form-column">
                            <FormLabel className="label-form-titulo">Dados de saúde</FormLabel>
                        </div>
                        <div className="div-form-column">
                            <TextField value={alergias} fullWidth={true} variant="outlined" name="alergias"
                                       label="Alergias"
                                       placeholder="Alergias" multiline={true}
                                       onChange={this.handledInput}/>
                            <Box p={1}/>
                            <TextField value={doencas} fullWidth={true} variant="outlined" name="doencas"
                                       label="Doenças"
                                       placeholder="Doenças"
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
                        {/*               label="Responsável"*/}
                        {/*               placeholder="Responsável pela criança na igreja"*/}
                        {/*               onChange={this.handledInput}/>*/}
                        {/*    <Box p={1}/>*/}
                        {/*    <TextField value={parentesco} fullWidth={true} variant="outlined" name="parentesco"*/}
                        {/*               label="Grau de parentesco"*/}
                        {/*               placeholder="Grau de parentesco"*/}
                        {/*               onChange={this.handledInput}/>*/}
                        {/*    <Box p={1}/>*/}
                        {/*</div>*/}
                        <div className="div-form-column">
                            <FormLabel className="label-form-titulo">Mais informações</FormLabel>
                        </div>
                        <div className="div-form-column">
                            <TextField value={observacoes} fullWidth={true} variant="outlined" name="observacoes"
                                       label="Observações" multiline={true}
                                       placeholder="Observações"
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

export default Cadastro
