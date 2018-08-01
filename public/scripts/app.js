'use strict';

// Instanciation d'un nouvel objet Client
const client = new Client();

// Dom elements
const $inputMessage = $('#inputMessage');

// À la soumission du formulaire, on envoie le contenu du message au serveur
$('form#shoutbox').on('submit', (event) => {
    event.preventDefault();
    client.sendMessage($inputMessage.val());
    $inputMessage.val('');
});

$inputMessage.on('input', (event) => {
    if ($inputMessage.val().trim() !== '') {
        client.notifyTyping();
    }
});
