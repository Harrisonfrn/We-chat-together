require('colors')
const express = require('express')
const pug = require('pug')
const path = require('path')
const http = require('http')
const Chat = require('./app/Chat')

const app = express() // Créer l'application Express
const server = http.Server(app) // Récupère l'objet Server de l'app Express
const io = require('socket.io')(server) // Créer une instance de socket.io sur ce serveur
const PORT = 9000

// Création d'un nouvel objet Chat, pour la gestion des sockets
const chat = new Chat(io)
io.on('connection', (socket) => {
    chat.onConnection(socket)
})

app.set('view engine', 'pug')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.render('index.pug')
})

server.listen(PORT, () => console.log(`✓ Server is listening on port ${PORT}`.green))
