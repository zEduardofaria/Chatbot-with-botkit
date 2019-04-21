module.exports = function(controller) {

    controller.hears(['oi', 'olá', 'hey', 'ei'], 'message_received', function(bot, message) {
        bot.reply(message, 'Olá, humano! Você deve estar atoa para estar tentando conversar comigo né? Digite `ajuda` para aprender a usar o chat direito u.u');
    });

}
