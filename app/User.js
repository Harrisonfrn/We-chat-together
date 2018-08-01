class User {
    constructor(nickname, socket) {
        this.id       = socket.id
        this.nickname = nickname
        this.socket   = socket
    }

    destroy() {
        this.id = null;
        this.nickname = null;
        this.socket.disconnect();
    }
}

module.exports = User
