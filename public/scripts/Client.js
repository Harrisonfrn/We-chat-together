class Client {
    constructor() {
        /*
            Initialisation de la connexion au serveur Websocket
            
            Note : Si le serveur web socket est accessible via la même adresse,
            on peut utiliser le raccourci vers le webroot : "/", qui équivaut 
            ici à : http://localhost:9000/
        */
        this.socket = io.connect('/'); // "socket" est un objet représentant ce socket client unique

        this.nickname = window.prompt('Choisissez un pseudonyme'); //'user_'+(Math.random().toString()).substring(2, 7);
        this._setNickname(this.nickname);
        
        /*
            La syntaxe ({nickname, message}) est appelée en ES6 "Object param destructuring"
            Elle permet de décomposer les propriétés de l'objet littéral en paramètre.
        
            En ES5, cela équivaudrait à écrire :
            (obj) => {
                let nickname = obj.nickname
                let message = obj.message
            }
        
            Avec ES6, on peut décomposer l'objet directement en paramètre pour créer les 2 variables :
            ({nickname, message}) => {
                ...
            }
        */
        this.socket.on('message:new', ({nickname, message}) => this.receiveMessage(nickname, message));
        this.socket.on('notify:typing', (nickname) => this.someoneIsTyping(nickname));
        this.socket.on('user:list', (usernamesList) => this.updateUsersList(usernamesList));

        this.typingNotificationTimer = 0;
    }

    /*
        Cette méthode :
        - met à jour le DOM de la navbar avec le nouveau nickname en paramètre
        - notifie le serveur du changement de nickname de ce client
    */
    _setNickname(nickname) {
        const $nicknameEl = $('#nickname');
        $nicknameEl.find('strong').text(nickname);
        $nicknameEl.hide().fadeIn();

        this.socket.emit('user:nickname', nickname);
    }

    // Émet un message vers le serveur
    sendMessage(message) {
        this.socket.emit('message:new', message);
    }

    // Reçoit un message de la part du serveur
    receiveMessage(nickname, message) {
        $('#typingNotification').empty();

        let template = `<li class="list-group-item">
            <strong>${nickname}</strong>
            ${message}
        </li>`;
    
        $('#messagesList').prepend(template);
    }

    notifyTyping() {
        this.socket.emit('notify:typing');
    }

    someoneIsTyping(nickname) {
        $('#typingNotification').text(nickname + ' est en train d\'écrire ...').wrapInner('<div class="badge badge-light">');

        clearTimeout(this.typingNotificationTimer);
        this.typingNotificationTimer = setTimeout(() => {
            $('#typingNotification').empty();
        }, 5000);
    }

    updateUsersList(usernamesList) {
        let template = '';
        usernamesList.forEach(username => {
            template += `<li class="nav-item">
                <a class="nav-link" href="#">
                    ${username === this.nickname
                        ? `<strong>${username}</strong>`
                        : username
                    }
                </a>
            </li>`;
        });
        $('#usersList').html(template);
    }
}
