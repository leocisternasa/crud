const express = require('express')
const {v4:uuidv4} = require ('uuid')
const fs = require('fs')
const app = express()
const PORT = 3100
//midelware

app.use(express.json())
app.use(express.urlencoded({extended:true}))

//Endpoints

app.get('/', (req, res)=>{
    res.send('Bienvenido a mi API')
})

app.get('/usuarios', async(req, res)=>{
    try {
        let data = await fs.promises.readFile('usuarios.json', 'utf-8')
        let {usuarios} = JSON.parse(data)
        console.log(usuarios)
        res.status(200).json(usuarios)
        
    } catch (error) {
        console.log(error)
        
    }
})

app.get('/usuarios/:id', async(req, res)=>{
    try {
        let {id} = req.params
        let data = await fs.promises.readFile('usuarios.json', 'utf-8')
        let {usuarios} = JSON.parse(data)
        let usuario = usuarios.find(item=>item.id == id)
        if(!usuario){ throw new Error('Usuario no existe')}
        res.status(200).send(usuario)
        
    } catch (error) {
        res.status(404).send(error.message)
        
    }
})
app.post('/usuarios', async(req, res)=>{
    // console.log(req.body, 'body')
    try {
        let {nombre, apellido} = req.body
        let usuario = {id:uuidv4().slice(30), nombre, apellido}
        let data = await fs.promises.readFile('usuarios.json', 'utf-8')
        let {usuarios} = JSON.parse(data)
        console.log(usuarios)
        usuarios.push(usuario)
        console.log(usuarios)
        fs.writeFileSync('usuarios.json',JSON.stringify({usuarios}),'utf-8')
        res.status(201).send('usuario creado')

    } catch (error) {
        res.status(400).send(error.message)
    }
})
app.put('/usuarios/', async(req, res)=>{
    try {
        let  { nombre, apellido, id} = req.body
        console.log(req.body)
        let data = await fs.promises.readFile('usuarios.json','utf-8')
        let { usuarios } = JSON.parse(data)
        console.log(usuarios)
        let usuario = usuarios.find(item=> item.id == id)
        if(usuario){
            usuario.nombre = nombre
            usuario.apellido = apellido
            fs.writeFileSync('usuarios.json', JSON.stringify({usuarios}), 'utf-8')
        }else{
            throw new Error('El usuario que intentas actualizar no existe')
        }
    } catch (error) {
        res.status(400).send(error.message)
        
    }
})
app.delete('/usuarios', async(req, res)=>{
    try {
        let { id } = req.body
        let data = await fs.promises.readFile('usuarios.json', 'utf-8')
        let {usuarios} = JSON.parse(data)
        let usuario = usuarios.find(item => item.id == id)
        if(usuario){
            usuarios = usuarios.filter(item => item.id != id)
            fs.writeFileSync('usuarios.json', JSON.stringify({usuarios}), 'utf-8')
        }else{
            throw new Error('El usuario que quieres borrar no existe')
        }
        
    } catch (error) {
        res.status(400).send(error.message)
        
    }

})

app.listen(PORT, ()=> console.log(`Escuchando en el puerto ${PORT}`))