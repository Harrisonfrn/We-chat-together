const ent = require('ent')

const User = require('./User')

class Chat {
    constructor(io) {
        this.io = io
        this.users = [] // Le système de chat va gérer un Array d'utilisateurs
    }

    onConnection(socket) {
        console.info('[connection]'.cyan, 'New client has opened a websocket connection', socket.id.gray)

        socket.once('user:nickname', (nickname) => {
            console.info('[user:nickname]'.cyan, 'New user :', nickname.gray)
            
            // Sécurisation du pseudo
            nickname = ent.encode(nickname)

            // Création du nouvel utilisateur, et ajout à la liste
            let user = new User(nickname, socket)
            this.users.push(user)

            // Envoi de la nouvelle liste aux clients connectés (incluant le nouveau)
            this.io.sockets.emit('user:list', this.getUsernamesList());

            // Mise en place des écouteurs d'événement sur ce socket
            socket.on('disconnect', () => this._onUserDisconnect(socket, user));
            socket.on('message:new', (message) => this._onNewMessage(socket, nickname, message))
            socket.on('notify:typing', () => this._onNotifyTyping(socket, nickname))
        })
    }

    _onNewMessage(socket, nickname, message) {
        console.info('[message:new]'.cyan, 'New message from', nickname.gray, ':', (message.length > 20 ? message.substring(0, 20) + '...' : message).gray)
        
        // Sécurisation du message
        message = ent.encode(message)

        // Envoie à tous les clients, y compris l'émetteur
        this.io.sockets.emit('message:new', { nickname, message })
    }

    _onNotifyTyping(socket, nickname) {
        console.info('[notify:typing]'.cyan, 'Client', nickname.gray, 'is typing...')

        // Envoie à tous les clients, sauf l'émetteur
        socket.broadcast.emit('notify:typing', nickname)
    }

    _onUserDisconnect(socket, user) {
        let pos = this.users.indexOf(user);
        if (pos > -1 && user instanceof User) {
            this.users.splice(pos, 1);
            user.destroy();

            // Renvoi de la liste mise à jour
            this.io.sockets.emit('user:list', this.getUsernamesList());
        }
    }

    // Méthode qui retourne un tableau composé uniquement des noms des utilisateurs
    getUsernamesList() {
        return this.users.map(user => user.nickname);
    }
}

module.exports = Chat
