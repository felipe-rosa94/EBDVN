import React from 'react'
import {Box, Button, Card, CardContent, CardMedia, TextField} from '@mui/material'
import '../styles/login.css'
import firebase from '../firebase'
import logo from '../imagens/logo.png'

class Login extends React.Component {

    state = {
        email: '',
        senha: ''
    }

    handledInput = e => {
        if (e.target.name === 'email')
            this.setState({[e.target.name]: e.target.value.toLowerCase()})
        else
            this.setState({[e.target.name]: e.target.value})
    }

    onClickEntrar = () => {
        const {email, senha} = this.state
        firebase
            .auth()
            .signInWithEmailAndPassword(email, senha)
            .then((data) => {
                localStorage.setItem(`ednv:login`, 'ok')
                this.props.history.replace('/home')
            })
            .catch((e) => {
                alert('Usuário ou senha incorretos')
            })
    }

    verificaLogin = () => {
        if (localStorage.getItem(`ednv:login`) !== null)
            this.props.history.replace('/home')
    }

    componentDidMount() {
        this.verificaLogin()
    }

    render() {
        return (
            <div id="login">
                <Card id="card-login">
                    <CardContent id="card-content-login">
                        <CardMedia image={logo} id="logo-login"/>
                        <TextField fullWidth={true} variant="outlined" name="email" label="E-mail" placeholder="E-mail"
                                   onChange={this.handledInput}/>
                        <Box p={1}/>
                        <TextField fullWidth={true} variant="outlined" name="senha" label="Senha" placeholder="Senha"
                                   type="password" onChange={this.handledInput}/>
                        <Box p={1}/>
                        <Button fullWidth={true} variant="outlined" onClick={this.onClickEntrar}>Entrar</Button>
                    </CardContent>
                </Card>
            </div>
        )
    }
}

export default Login
