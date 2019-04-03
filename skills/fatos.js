module.exports = function(controller) {

    controller.hears(['fatos', 'variaveis'], 'message_received', function(bot, message) {
        bot.reply(message, 'Devo listar todos os fatos aqui.');
    });

}
