class Channel {
    constructor(io, title) {
        this.io    = io
        this.title = title // Nom du channel
        this.users = [] // Chaque channel va gÃ©rer sa propre liste d'utilisateurs
    }

    addMessage(user, room, message) {}

    pushUser(user) {}

    removeUser(user) {}
    
    getUsersList() {}

    destroy() {}
}

module.exports = Channel