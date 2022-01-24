const calculaIdade = (data) => {
    let nascimento = new Date(data)
    nascimento.setDate(nascimento.getDate() + 1)
    let hoje = new Date()
    return Math.floor(Math.ceil(Math.abs(nascimento.getTime() - hoje.getTime()) / (1000 * 3600 * 24)) / 365.25);
}

const mesAtual = () => {
    let data = new Date()
    switch (data.getMonth()) {
        case 0:
            return 'Janeiro'
        case 1:
            return 'Fevereiro'
        case 2:
            return 'Março'
        case 3:
            return 'Abril'
        case 4:
            return 'Maio'
        case 5:
            return 'Junho'
        case 6:
            return 'Julho'
        case 7:
            return 'Agosto'
        case 8:
            return 'Setembro'
        case 9:
            return 'Outubro'
        case 10:
            return 'Novembro'
        default :
            return 'Dezembro'
    }
}

const enviaEmail = async (email, assunto, texto) => {
    let response = await fetch(process.env.REACT_APP_URL_EMAIL, {
        method: 'post',
        body: JSON.stringify({
            to: email,
            subject: assunto,
            text: texto
        })
    })
        .then((data) => data.json())
        .catch((error) => (error))
    console.log(response)
}

const mascaraData = data => {
    data = data.substring(0, 10)
    data = data.replace(/\D/g, '').slice(0, 10)
    if (data.length >= 5)
        return `${data.slice(0, 2)}/${data.slice(2, 4)}/${data.slice(4)}`
    else if (data.length >= 3)
        return `${data.slice(0, 2)}/${data.slice(2)}`
    return data
}

const mascaraTelefone = telefone => {
    if (telefone !== '') {
        telefone = telefone.substring(0, 14)
        return telefone.replace(/\D/g, '').replace(/(\d{2})(\d)/, '($1) $2')
    }
}

const isEmptyObject = objeto => {
    return (Object.keys(objeto).length === 0)
}

export {calculaIdade, mesAtual, enviaEmail, mascaraData, mascaraTelefone, isEmptyObject}
