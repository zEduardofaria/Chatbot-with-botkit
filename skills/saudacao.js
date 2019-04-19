module.exports = function(controller) {

    controller.hears(['oi', 'olá', 'hey', 'ei'], 'message_received', function(bot, message) {
        bot.reply(message, 'Olá, humano! Você deve estar atoa para estar tentanddo conversar comigo né?');
    });

}
