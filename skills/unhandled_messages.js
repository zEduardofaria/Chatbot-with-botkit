module.exports = function(controller) {

    controller.on('message_received', function(bot, message) {

        bot.reply(message, {
            text: 'Ainda não sei sobre isso. Defina novas habilidades na pasta `skills/`, ou escreva `ajuda` para que eu possa te ajudar como eu puder.',
            quick_replies: [
                {
                  title: 'Ajuda',
                  payload: 'ajuda',
                },
              ]
        });

    });

}