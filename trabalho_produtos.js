const express = require('express')
const { request, response } = require('express')
const app = express()
app.use(express.json())

const produtos = [
    {IDProduto: 87896, nomeProduto: "Teclado Mecânico X", quantidadeProduto: 109, valorUnitario: 195.00}
]
for(let i in produtos){
    produtos[i].precoTotal = produtos[i].quantidadeProduto * produtos[i].valorUnitario
    produtos[i].precoDeVenda = produtos[i].valorUnitario * 1.20
    produtos[i].lucro = produtos[i].precoDeVenda - produtos[i].valorUnitario
    if(produtos[i].quantidadeProduto < 50){
        produtos[i].situacao = "Estável"
    } else if(produtos[i].quantidadeProduto >= 50 && produtos[i].quantidadeProduto < 100) {
        produtos[i].situacao = "Boa"
    } else if(produtos[i].quantidadeProduto >= 100){
        produtos[i].situacao = "Excelente"
    }
}
app.use((request, response, next) => {
    console.log('Controle de Estoque da Empresa ABC.')
    return next()
})

const checkComplemento = (request, response, next) => {
    const {id, complemento} = request.params
    if(!complemento){
        return response.status(400)
                       .json({error: 'Não foi atribuido um complemento.'})
    }
    return next()
}
const checkAtributosProduto = (request, response, next) => {
    const {IDProduto, nomeProduto, quantidadeProduto, valorUnitario} = request.body
    if(!IDProduto || !nomeProduto || !quantidadeProduto || !valorUnitario){
        return response.status(400)
                       .json({error: 'Não foi atribuida um ID, ou um nome, ou uma quantidade, ou um valor unitário para o produto.'})
    }
    return next()
}

app.get('/produtos', (request, response) => {
    return response.json(produtos)
})
app.get('/produtos/:id', (request, response) => {
    const {id} = request.params
    let count = 0
    for(let i in produtos){
        if(id == produtos[i].IDProduto){
            return response.json(produtos[i])
        } else {
            count ++
        }
    }
    if(count == produtos.length){
        return response.status(400)
                       .json({error: 'Não existe nenhum produto cadastrado neste ID.'})
    }
    return next()
})
app.post('/produtos', checkAtributosProduto, (request, response) => {
    const {IDProduto, nomeProduto, quantidadeProduto, valorUnitario, complemento}= produto = request.body
    produtos.push(produto)
    produto.precoTotal = produto.quantidadeProduto * produto.valorUnitario
    produto.precoDeVenda = produto.valorUnitario * 1.20
    produto.lucro = produto.precoDeVenda - produto.valorUnitario
    if(produto.quantidadeProduto < 50){
        produto.situacao = "Estável"
    } else if(produto.quantidadeProduto >= 50 && produto.quantidadeProduto < 100) {
        produto.situacao = "Boa"
    } else if(produto.quantidadeProduto >= 100){
        produto.situacao = "Excelente"
    }
    return response.json(produto)
})
app.put('/produtos/:id', checkAtributosProduto, (request, response) => {
    const {IDProduto, nomeProduto, quantidadeProduto, valorUnitario} = request.body
    const {id} = request.params
    let count = 0
    for(let i in produtos){
        if(id == produtos[i].IDProduto){
            produtos[i] = request.body
            produtos[i].precoTotal = produtos[i].quantidadeProduto * produtos[i].valorUnitario
            produtos[i].precoDeVenda = produtos[i].valorUnitario * 1.20
            produtos[i].lucro = produtos[i].precoDeVenda - produtos[i].valorUnitario
            if(produtos[i].quantidadeProduto < 50){
                produtos[i].situacao = "Estável"
            } else if(produtos[i].quantidadeProduto >= 50 && produtos[i].quantidadeProduto < 100) {
                produtos[i].situacao = "Boa"
            } else if(produtos[i].quantidadeProduto >= 100){
                produtos[i].situacao = "Excelente"
            }
            return response.json(produtos)
        } else {
            count ++
        }
    }
    if(count == produtos.length){
        return response.status(400)
                       .json({error: 'Não existe nenhum produto cadastrado neste ID.'})
    }
    return next()
})
app.delete('/produtos/:id', (request, response, next) => {
    const {id} = request.params
    let count = 0
    for(let i in produtos){
        if(id == produtos[i].IDProduto){
            produtos.splice(i, 1)
            return response.json(produtos)
        } else {
            count ++
        }
    }
    if(count == produtos.length){
        return response.status(400)
                       .json({error: 'Não existe nenhum produto cadastrado neste ID.'})
    }
    return next()
})
app.put('/produtos/:id/:complemento', checkComplemento, (request, response) => {
    const {id, complemento} = request.params
    let count = 0
    for(let i in produtos){
        if(id == produtos[i].IDProduto){
            produtos[i].complemento.push(complemento)
            return response.json(produtos[i])
        } else {
            count ++
        }
    }
    if(count == produtos.length){
        return response.status(400)
                       .json({error: 'Não existe nenhum produto cadastrado neste ID.'})
    }
    return next()
})
app.listen(3333, () => {
    console.log("Servidor rodando.")
})