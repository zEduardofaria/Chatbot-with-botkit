const database = require('../data/database')

module.exports = function(controller) {

    // Lista todos os fatos
    controller.hears(['fatos', 'variaveis'], 'message_received', function(bot, message) {
        const fatos = database.fatos
        let resposta = ''

        if (fatos < 1) {
            return bot.reply(message, 'Ainda não temos fatos cadastrados no nosso sistema especialista. :(')
        }
        
        resposta = 'Estes são todos os fatos cadastrados no nosso sistema especialista: \n\n'

        for(fato of fatos) {
            resposta = resposta + `* ${fato.Nome} \n`
        }

        resposta = resposta + '\n Para detalhar um fato basta escrever `fato NomeDoFato`'

        bot.reply(message, resposta)
    });
}
